import logger from '../log/logger'

export interface IEnvironmentProvider {
  getCurrentEnvironment(): string
}

// Environment configuration interface
interface IEnvironmentConfig {
  webURLBase: string
  //Keycloak
  issuer: string
  clientID: string
  allowRedirectURL: string[]
  //API
  APIURL: string
  APITimeOut: number
  //ASSETS
  storageURL: string
  //AXIOS
}

export class Environment {
  private static instance: Environment
  environment: string
  private config: IEnvironmentConfig
  private environmentProvider: IEnvironmentProvider
  redirectURL: string

  private constructor(environmentProvider: IEnvironmentProvider) {
    this.environmentProvider = environmentProvider
    this.environment = this.environmentProvider.getCurrentEnvironment()
    this.config = {
      webURLBase: '',
      issuer: '',
      clientID: '',
      allowRedirectURL: [],
      APIURL: '',
      APITimeOut: 0,
      storageURL: '',
    }
    this.redirectURL = ''
  }

  public static init(environmentProvider: IEnvironmentProvider): Environment {
    if (Environment.instance) {
      throw new Error('Environment already initialized')
    }
    Environment.instance = new Environment(environmentProvider)
    Environment.instance.initialize()
    return Environment.instance
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      throw new Error('Environment not initialized. Call init() first')
    }
    return Environment.instance
  }

  initialize(): void {
    logger.debug('In', this.environment, 'environment')
    this.loadEnvironmentConfig()
    this.setRedirectURL()
  }

  private loadEnvironmentConfig(): void {
    const envPrefix = `VITE_${this.environment.toUpperCase()}_`

    this.config = {
      webURLBase: import.meta.env[`${envPrefix}WEB_URL_BASE`],
      issuer: import.meta.env[`${envPrefix}KC_ISSUER`],
      clientID: import.meta.env[`${envPrefix}KC_CLIENT_ID`],
      allowRedirectURL:
        import.meta.env[`${envPrefix}REDIRECT`]?.split(',') || [],
      APIURL: import.meta.env[`${envPrefix}API_URL`],
      APITimeOut: import.meta.env[`${envPrefix}API_TIMEOUT`],
      storageURL: import.meta.env[`${envPrefix}STORAGE_URL`],
    }
  }

  private setRedirectURL(): void {
    const currentUrl = window.location.href
    const index = this.config.allowRedirectURL?.findIndex((url: string) =>
      currentUrl.includes(url)
    )

    if (index >= 0) {
      this.redirectURL = this.config.allowRedirectURL[index]
    } else {
      logger.error('no redirect set')
    }
  }

  apiURL(
    service: string,
    orgID: string = '',
    apiID: string = '',
    model: string = ''
  ): string {
    const baseURL = (
      this.environment.toLowerCase() === 'other'
        ? this.config.APIURL
        : this.redirectURL
    ).replace(/\/?$/, '/')

    return baseURL + service + (orgID ? `/${orgID}/${apiID}${model}` : '')
  }

  // Getters for config values
  get webURLBase(): string {
    return this.config.webURLBase
  }
  get issuer(): string {
    return this.config.issuer
  }
  get clientID(): string {
    return this.config.clientID
  }
  get allowRedirectURL(): string[] {
    return this.config.allowRedirectURL
  }
  get APIURL(): string {
    return this.config.APIURL
  }
  get APITimeOut(): number {
    return this.config.APITimeOut
  }
  get storageURL(): string {
    return this.config.storageURL
  }
}
