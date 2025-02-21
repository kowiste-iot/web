// css
import '@/assets/main.css'
import '@/assets/custom.css'

const envProv = new URLProvider()
const env = Environment.init(envProv)
env.initialize()

//icon
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
//components
import PrimeVue from 'primevue/config'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { type IWebsocketOption } from '@/plugins/websocket/model'
import { KeycloakPlugin } from '@/plugins/security/init'
import { type KeycloakConfig } from '@/plugins/security/types'
/* import font awesome icon component */
import App from './App.vue'
import createAppRouter from './router'
import { extractRealmFromPath } from './plugins/security/utils'
import { Environment } from './utils/enviroment/enviroment'
import { URLProvider } from './utils/http/url/url'

const router = createAppRouter(env.webURLBase)

const app = createApp(App)
app.use(createPinia())

const wsOptions = {} as IWebsocketOption
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
app.use(i18n)
app.use(router)
//plugins
app.component('GridLayout', GridLayout).component('GridItem', GridItem)
app.component('FIcon', FontAwesomeIcon)
app.use(PrimeVue)

// .use(WebsocketPlugin, wsOptions)
app.use(KeycloakPlugin, kcOptions)

app.mount('#app')
