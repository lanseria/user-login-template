import { z } from 'zod'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent, hashPassword } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

const createUserSchema = z.object({
  username: z.string().min(2, '用户名至少2个字符'),
  password: z.string().min(6, '密码至少6个字符'),
  role: z.enum(['admin', 'user']),
})

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)
  const data = await createUserSchema.parseAsync(body)
  const db = useDb()

  try {
    await db.insert(users).values({
      username: data.username,
      password: hashPassword(data.password),
      role: data.role,
    })
    return { success: true }
  }
  catch (e: any) {
    if (e.code === '23505') {
      throw createError({ statusCode: 409, message: '用户名已存在' })
    }
    throw e
  }
})
