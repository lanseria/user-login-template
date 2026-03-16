import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent, hashPassword } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, '请输入当前密码'),
  newPassword: z.string().min(6, '新密码至少6个字符'),
})

export default defineEventHandler(async (event) => {
  const userPayload = getUserFromEvent(event)
  const body = await readBody(event)
  const { oldPassword, newPassword } = await passwordChangeSchema.parseAsync(body)
  const db = useDb()

  const user = await db.query.users.findFirst({
    where: eq(users.id, userPayload.id),
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  if (user.password !== hashPassword(oldPassword)) {
    throw createError({ statusCode: 400, message: '当前密码错误，请重试' })
  }

  await db.update(users)
    .set({ password: hashPassword(newPassword) })
    .where(eq(users.id, user.id))

  return { success: true }
})
