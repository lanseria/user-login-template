import { relations } from 'drizzle-orm'
import { bigserial, pgSchema, text, timestamp } from 'drizzle-orm/pg-core'

export const userSchema = pgSchema('user_auth_app')
export const userRoleEnum = userSchema.enum('user_role', ['admin', 'user'])

export const users = userSchema.table('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const usersRelations = relations(users, () => ({}))
