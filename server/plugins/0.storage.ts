import redisDriver from 'unstorage/drivers/redis'

export default defineNitroPlugin(() => {
  const storage = useStorage()
  const config = useRuntimeConfig()

  const driver = redisDriver({
    base: 'redis',
    host: config.redis.host,
    port: 6379,
    password: config.redis.password,
    db: 1,
  })

  storage.mount('redis', driver)
})
