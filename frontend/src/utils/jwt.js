export function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function getUserFromToken(token) {
  const payload = decodeJwt(token)
  if (!payload) return null

  return {
    username: payload.sub,
    roles: payload.roles || [],
    exp: payload.exp,
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwt(token)
  if (!payload?.exp) return true
  return payload.exp * 1000 < Date.now()
}
