import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { encrypt, verify } from 'paseto-ts/v4'
import { users } from '~~/server/database/schemas'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'auth-refresh-token')

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'Refresh token is missing.' })
  }

  const refreshPublicKey = await useStorage('redis').getItem<string>('refreshPublicKey')
  if (!refreshPublicKey)
    throw new Error('Server not initialized: public key is missing.')

  let payload: any
  try {
    const result = await verify(refreshPublicKey, refreshToken)
    payload = result.payload
  }
  catch (error) {
    console.error(error)
    deleteCookie(event, 'auth-token', { path: '/' })
    deleteCookie(event, 'auth-refresh-token', { path: '/' })
    throw createError({ statusCode: 401, message: 'Invalid or expired refresh token.' })
  }

  const userId = payload.sub

  const db = useDb()
  const user = await db.query.users.findFirst({ where: eq(users.id, Number(userId)) })
  if (!user)
    throw createError({ statusCode: 401, message: 'Invalid refresh token: user not found.' })

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

  const localKey = await useStorage('redis').getItem<string>('localKey')
  if (!localKey)
    throw new Error('Server not initialized: localKey is missing.')

  const accessTokenExp = dayjs().add(1, 'day').toDate()
  const newAccessTokenPayload = { ...slimTokenPayload, exp: accessTokenExp.toISOString() }
  const newAccessToken = await encrypt(localKey, newAccessTokenPayload)

  setCookie(event, 'auth-token', newAccessToken, {
    httpOnly: true,
    expires: accessTokenExp,
    path: '/',
    sameSite: 'lax',
  })

  return { user: fullUserPayload }
})
