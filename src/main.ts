// main.ts
import '@/assets/main.css'
import '@/assets/custom.css'

// Initialize environment first
import { Environment } from './utils/enviroment/enviroment'
import { URLProvider } from './utils/http/url/url'

const envProv = new URLProvider()
const env = Environment.init(envProv)
env.initialize()

// Then import everything else
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@/icon'
import '/node_modules/flag-icons/css/flag-icons.min.css'
//locale
import en from '@/assets/locales/en/en.json'
import en_tour from '@/assets/locales/en/tour.json'
import es from '@/assets/locales/es/es.json'
import th from '@/assets/locales/th/th.json'
//extension
import '@/extension/string/string'
import '@/extension/date/date'

//components
import PrimeVue from 'primevue/config'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { KeycloakPlugin } from '@/plugins/security/init'
import { type KeycloakConfig } from '@/plugins/security/types'
/* import font awesome icon component */
import App from './App.vue'
import createAppRouter from './router'
import { extractRealmFromPath } from './plugins/security/utils'
import { WebsocketPlugin } from './plugins/websocket/application/init'
import logger, { LogLevel } from './utils/log/logger'

// Set to show only errors and warnings in production
if (env.environment == 'PROD') {
  logger.setLevel(LogLevel.WARN)
} else {
  logger.setLevel(LogLevel.INFO)
}

// Create router
logger.info('Init router')
const router = createAppRouter(env.webURLBase)

// Setup app
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Setup i18n
const i18n = createI18n({
  legacy: false,
  locale: 'en', // Set the default locale
  fallbackLocale: 'en', // Set the fallback locale
  messages: {
    en: { ...en, ...en_tour },
    es: { ...es },
    th: { ...th },
  },
})

// Configure Keycloak
const kcOptions = {
  url: env.issuer,
  realm: extractRealmFromPath(),
  clientId: env.clientID,
  initOptions: {
    checkLoginIframe: false,
    pkceMethod: 'S256',
    enableLogging: true,
    onLoad: 'check-sso',
    flow: 'standard',
    redirectUri: env.redirectURL,
  },
} as KeycloakConfig

// Apply plugins
app.use(i18n)
app.use(router)
app.component('GridLayout', GridLayout).component('GridItem', GridItem)
app.component('FIcon', FontAwesomeIcon)
app.use(PrimeVue)

// Setup WebsocketPlugin but don't initialize connection yet
// The connection will be initialized after authentication
app.use(WebsocketPlugin, {
  autoConnect: false, // Changed to false to only connect after auth
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
})

// Mount the app immediately
// This allows the app UI to be available while Keycloak initializes
logger.debug('Mounting app')
app.mount('#app')

// Initialize Keycloak after app is mounted
// This prevents the app from being blocked during Keycloak initialization
logger.debug('Initializing Keycloak')
app.use(KeycloakPlugin, kcOptions, router)
logger.debug('Init web app completed')
