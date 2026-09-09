const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'drinkgo_token'
const REFRESH_TOKEN_KEY = 'drinkgo_refresh_token'
const REMEMBER_KEY = 'drinkgo_remember'

function getStorage(remember) {
  return remember ? localStorage : sessionStorage
}

function getActiveStorage() {
  if (localStorage.getItem(TOKEN_KEY)) return localStorage
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage
  return localStorage.getItem(REMEMBER_KEY) === 'true' ? localStorage : sessionStorage
}

export const tokenManager = {
  setRememberMe: (remember) => {
    localStorage.setItem(REMEMBER_KEY, String(remember))
  },

  isRememberMe: () => localStorage.getItem(REMEMBER_KEY) === 'true',

  setAccessToken: (token, remember = tokenManager.isRememberMe()) => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    getStorage(remember).setItem(TOKEN_KEY, token)
    tokenManager.setRememberMe(remember)
  },

  getAccessToken: () => {
    return getActiveStorage().getItem(TOKEN_KEY)
  },

  setRefreshToken: (token, remember = tokenManager.isRememberMe()) => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    getStorage(remember).setItem(REFRESH_TOKEN_KEY, token)
  },

  getRefreshToken: () => {
    return getActiveStorage().getItem(REFRESH_TOKEN_KEY)
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
