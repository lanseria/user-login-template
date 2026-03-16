import { desc } from 'drizzle-orm'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden: Admin access required' })
  }

  const db = useDb()
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  return allUsers
})
