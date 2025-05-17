import axios from 'axios'
import type { ThemeColors } from './model'
import logger from '../log/logger'

export async function loadTheme(url: string, tenant: string | undefined) {
  if (tenant == undefined) return
  try {
    const response = await axios.get(`${url}/assets/${tenant}/color.json`)
    const colors: ThemeColors = response.data.theme.colors
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(`--bs-${key}`, value)
        document.documentElement.style.setProperty(
          `--bs-${key}-rgb`,
          hexToRgb(value)
        )
      }
    })
  } catch (error: any) {
    logger.error('Failed to load theme:', error?.response?.statusText)
  }
}

const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '')

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `${r},${g},${b}`
}
