import type { H3Event } from 'h3'
import { createHash } from 'node:crypto'

export function hashPassword(password: string) {
  return createHash('sha512').update(password).digest('base64')
}

export function getUserFromEvent(event: H3Event): UserPayload {
  const user = event.context.user as UserPayload | undefined
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'User not found in context. Authentication required.',
    })
  }
  return user
}
