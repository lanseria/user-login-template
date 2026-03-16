import { eq } from 'drizzle-orm'
import { users } from '~~/server/database/schemas'
import { getUserFromEvent } from '~~/server/utils/auth'
import { useDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const currentUser = getUserFromEvent(event)
  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = Number(getRouterParam(event, 'id'))

  if (id === currentUser.id) {
    throw createError({ statusCode: 400, message: '无法删除当前登录的管理员账户' })
  }

  const db = useDb()
  await db.delete(users).where(eq(users.id, id))
  return { success: true }
})
