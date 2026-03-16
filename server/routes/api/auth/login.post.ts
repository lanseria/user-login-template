import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { encrypt, sign } from 'paseto-ts/v4'
import { z } from 'zod'
import { users } from '~~/server/database/schemas'
import { hashPassword } from '~~/server/utils/auth'

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = await loginSchema.parseAsync(body)

  const db = useDb()
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (!user || user.password !== hashPassword(password)) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误。',
    })
  }

  const fullUserPayload: UserPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
  }

  const slimTokenPayload: UserPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
  }

  const [localKey, refreshPrivateKey] = await Promise.all([
    useStorage('redis').getItem<string>('localKey'),
    useStorage('redis').getItem<string>('refreshPrivateKey'),
  ])

  if (!localKey || !refreshPrivateKey)
    throw new Error('Server not initialized: keys are missing.')

  const accessTokenExp = dayjs().add(15, 'd').toDate()
  const refreshTokenExp = dayjs().add(1, 'month').toDate()

  const accessTokenPayload = { ...slimTokenPayload, exp: accessTokenExp.toISOString() }
  const accessToken = await encrypt(localKey, accessTokenPayload)

  const refreshTokenPayload = { sub: String(user.id), exp: refreshTokenExp.toISOString() }
  const refreshToken = await sign(refreshPrivateKey, refreshTokenPayload)

  setCookie(event, 'auth-token', accessToken, {
    httpOnly: true,
    expires: accessTokenExp,
    path: '/',
    sameSite: 'lax',
  })

  setCookie(event, 'auth-refresh-token', refreshToken, {
    httpOnly: true,
    expires: refreshTokenExp,
    path: '/',
    sameSite: 'lax',
  })

  return { user: fullUserPayload }
})
