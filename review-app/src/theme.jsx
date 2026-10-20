import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Light / dark mode.
// Why a context: the toggle button lives in the top bar, but other parts may want to know the theme.
// The actual colours switch through CSS variables (see index.css), so no component needs to re-style itself.
const ThemeContext = createContext({ theme: 'light', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function initialTheme() {
  try {
    const saved = localStorage.getItem('bog-theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch (_) {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('bog-theme', theme)
    } catch (_) {}
  }, [theme])

  // A printed / PDF report should always be light, whatever the screen theme is.
  useEffect(() => {
    let wasDark = false
    const before = () => {
      wasDark = document.documentElement.classList.contains('dark')
      document.documentElement.classList.remove('dark')
    }
    const after = () => {
      if (wasDark) document.documentElement.classList.add('dark')
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}
