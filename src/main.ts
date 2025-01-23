// css
import '@/assets/main.css'
import '@/assets/custom.css'
//icon
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@/icon'
import '/node_modules/flag-icons/css/flag-icons.min.css'
//locale
import en from '@/assets/locales/en.json'
import es from '@/assets/locales/es.json'
import th from '@/assets/locales/th.json'
//extension
import '@/extension/string/string'
//components
import PrimeVue from 'primevue/config'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { WebsocketPlugin } from '@/plugins/websocket/init'
import { type IWebsocketOption } from '@/plugins/websocket/model'
import { KeycloakPlugin } from '@/plugins/security/init'
import { type KeycloakConfig } from '@/plugins/security/types'
/* import font awesome icon component */
import App from './App.vue'
import router from './router'
import { extractRealmFromPath } from './plugins/security/utils'

const app = createApp(App)
app.use(createPinia())

const wsOptions = {} as IWebsocketOption
const kcOptions = {
  url: 'http://localhost:7080/auth',
  realm: extractRealmFromPath(),
  clientId: 'vue-client',
  initOptions: {
    checkLoginIframe: false,
    pkceMethod: 'S256',
    enableLogging: true,
    onLoad: 'check-sso',
    flow: 'standard',
    redirectUri: window.location.href,
  },
} as KeycloakConfig

const i18n = createI18n({
  locale: 'en', // Set the default locale
  fallbackLocale: 'en', // Set the fallback locale
  messages: {
    en,
    es,
    th,
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
