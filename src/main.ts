import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n  } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import 'bootstrap'
import en from './assets/locales/en.json';
import es from './assets/locales/es.json';
import th from './assets/locales/th.json';
const app = createApp(App)

const i18n = createI18n({
    locale: 'en', // Set the default locale
    fallbackLocale: 'en', // Set the fallback locale
    messages: {
      en,
      es,
      th,
    },
  });
app.use(i18n);
app.use(createPinia())
app.use(router)


app.mount('#app')

