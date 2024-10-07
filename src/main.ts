import '@/assets/main.css'
import '@fortawesome/fontawesome-free'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { ThemeBsPlugin } from '@/plugins/theme/init'
import type { IThemeOption } from '@/plugins/theme/model'
import { WebsocketPlugin } from '@/plugins/websocket/init'
import { type IWebsocketOption } from '@/plugins/websocket/model'
import { KeycloakPlugin } from '@/plugins/security/init'
import { type ISecurityOption } from '@/plugins/security/model'
import PrimeVue from 'primevue/config'
import { GridLayout, GridItem } from 'grid-layout-plus'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import '@/icon'
import en from '@/assets/locales/en.json'
import es from '@/assets/locales/es.json'
import th from '@/assets/locales/th.json'

const app = createApp(App)
const themeOption = {} as IThemeOption
const wsOptions = {} as IWebsocketOption
const kcOptions = {} as ISecurityOption

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
app.use(createPinia())
app.use(router)
//plugins
app.use(ThemeBsPlugin, themeOption)
app.component('GridLayout', GridLayout).component('GridItem', GridItem)
app.component('FIcon', FontAwesomeIcon)
app.use(PrimeVue)
// .use(WebsocketPlugin, wsOptions)
// .use(KeycloakPlugin, kcOptions)
app.mount('#app')
