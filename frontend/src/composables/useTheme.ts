import { ref, watch, readonly, inject, type InjectionKey } from 'vue'

export type Theme = 'light' | 'dark'

export const ThemeKey: InjectionKey<{
  theme: Readonly<import('vue').Ref<Theme>>
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}> = Symbol('Theme')

// Global theme state
const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')

// Apply theme to document
const applyTheme = (newTheme: Theme) => {
  const root = document.documentElement
  if (newTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Initialize theme
applyTheme(theme.value)

// Watch for theme changes and persist to localStorage
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
})

export const useTheme = () => {
  // Try to inject global theme, fallback to local
  const injected = inject(ThemeKey)
  if (injected) {
    return injected
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme
  }
}

// Provider function for global theme
export const provideTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme
  }
}
