import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const tokenUser = getUserFromEvent(event)

  const db = useDb()
  const user = await db.query.users.findFirst({
    where: eq(users.id, tokenUser.id),
  })

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found.' })
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  }
})
