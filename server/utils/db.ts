import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { env } from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client, Pool } from 'pg'
import * as schema from '~~/server/database/schemas'

let _db: NodePgDatabase<typeof schema> | null = null

export function useDb() {
  if (_db)
    return _db

  const config = useRuntimeConfig()
  if (!config.dbUrl)
    throw new Error('DATABASE_URL is not defined in runtime config.')

  let driver: Pool | Client
  if (env.NODE_ENV === 'production') {
    console.log('Database: Initializing with pg.Pool for production.')
    driver = new Pool({
      connectionString: config.dbUrl,
    })
  }
  else {
    console.log('Database: Initializing with pg.Client for development.')
    driver = new Client({
      connectionString: config.dbUrl,
    })
    driver.connect()
  }

  _db = drizzle(driver, { schema, logger: false })

  return _db
}
