import { createPinia, type Pinia } from 'pinia'
import { type App, type Plugin } from 'vue'
import { useKeycloakStore } from './store'
import Keycloak from 'keycloak-js'
import { type ISecurityOption } from './model'

export const KeycloakPlugin: Plugin = {
  install(app: App, options: ISecurityOption) {
    let pinia: Pinia | null = app.config.globalProperties.$pinia
    if (!pinia) {
      pinia = createPinia()
      app.use(pinia)
    }

    const kc = useKeycloakStore()
    const keycloak = new Keycloak({
      url:options.kcURI,
      clientId: options.clientID,
      realm: options.realm,
    })
    keycloak
      .init({
        checkLoginIframe: false,
        redirectUri: options.baseURI,
      })
      .then(() => {
        kc.set(keycloak, options)
      })
      .catch((err: Error) => {
        kc.set(new Keycloak(), options)
      })
  },
}
