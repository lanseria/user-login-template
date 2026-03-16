export default defineEventHandler((event) => {
  deleteCookie(event, 'auth-token', { path: '/' })
  deleteCookie(event, 'auth-refresh-token', { path: '/' })

  setResponseStatus(event, 204)
  return {}
})
