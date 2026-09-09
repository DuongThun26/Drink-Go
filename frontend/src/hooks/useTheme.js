import { useEffect } from 'react'

const THEME_KEY = 'drinkgo-theme'

export function useTheme() {
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = stored || (prefersDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}
