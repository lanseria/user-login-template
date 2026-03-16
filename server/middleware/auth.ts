import { decrypt } from 'paseto-ts/v4'

const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/api/dev/init-admin',
]

export default defineEventHandler(async (event) => {
  const path = event.path

  if (!path.startsWith('/api/') || PUBLIC_API_ROUTES.some(route => path.startsWith(route)))
    return

  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authorization token is missing from cookies',
    })
  }

  try {
    const localKey = await useStorage('redis').getItem<string>('localKey')
    if (!localKey)
      throw new Error('Server not initialized: localKey is missing.')

    const { payload } = await decrypt<UserPayload>(localKey, token)

    event.context.user = payload
  }
  catch (error: any) {
    deleteCookie(event, 'auth-token', { path: '/' })

    console.warn(`Token validation failed for path ${path}:`, error.message)

    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }
})
