import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent, hashPassword } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

const updateUserSchema = z.object({
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.enum(['admin', 'user']),
})

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = await updateUserSchema.parseAsync(body)
  const db = useDb()

  const updateData: any = { role: data.role }

  if (data.password) {
    updateData.password = hashPassword(data.password)
  }

  await db.update(users).set(updateData).where(eq(users.id, id))
  return { success: true }
})
