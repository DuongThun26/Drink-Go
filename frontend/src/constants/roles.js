export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
}

export function hasRole(user, role) {
  return user?.roles?.includes(role) ?? false
}

export function isAdmin(user) {
  return hasRole(user, ROLES.ADMIN)
}
