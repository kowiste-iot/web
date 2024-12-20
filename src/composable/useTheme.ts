import { ref, watch } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-bs-theme', newTheme)
    },
    { immediate: true }
  )

  return {
    theme,
    toggleTheme,
  }
}
