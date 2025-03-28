import type { IEnvironmentProvider } from '@/utils/enviroment/enviroment'

export class URLProvider implements IEnvironmentProvider {
  getCurrentEnvironment(): string {
    return 'LOCAL'
    const loc = window.location.href
    if (loc.includes('staging')) {
      return 'STAGING'
    } else if (loc.includes('localhost')) {
      return 'OTHER'
    } else if (loc.includes('dev')) {
      return 'DEV'
    }
    return 'PROD'
  }
}

export function getBaseDomain() {
  const hostname = new URL(window.location.href).hostname
  return hostname.split('.').slice(-2).join('.')
}