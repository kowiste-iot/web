// keycloakStore.js

import { defineStore } from 'pinia'
import Keycloak from 'keycloak-js'
import type { ISecurityOption } from './model'

interface State {
  Keycloak: Keycloak | undefined
  Options: ISecurityOption
}

export const useKeycloakStore = defineStore('keycloak', {
  state: (): State => ({
    Keycloak: undefined,
    Options: {
      kcURI:'',
      realm:'',
      clientID:'',
      baseURI: '',
      log: false,
      redirecURI: '',
      refreshToken: 900000, //refresh every 15 min
      redirectLogoutURI: '',
      updateToken: 300,
    },
  }),
  getters: {
    token(): string | undefined {
      return this.Keycloak?.token
    },
    authenticated(): boolean {
      if (!this.Keycloak) return false
      return this.Keycloak?.authenticated ? this.Keycloak?.authenticated : false
    },
    init(): Promise<boolean | undefined> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!this.Keycloak) reject('Keycloak instance is not set.')
          else resolve(true)
        }, 1000)
      })
    },
  },
  actions: {
    set(instance: Keycloak, opt: ISecurityOption) {
      if (this.Keycloak) return //already setted
      this.Keycloak = instance
      this.Options = opt
      setInterval(() => this.update(), this.Options?.refreshToken)
    },
    login(data?: string) {
      if (this.Keycloak?.authenticated) return
      this.Keycloak?.login({
        redirectUri: data ? data : this.Options?.redirecURI,
      })
    },
    update() {
      if (!this.Keycloak) return
      this.Keycloak?.updateToken(this.Options.updateToken)
        .then((refreshed) => {
          if (refreshed) {
            if (this.Options.log) console.log('Token refreshed')
          } else {
            if (this.Options.log) console.log('Token not refreshed ')
          }
        })
        .catch(() => {
          if (this.Options.log) console.log('Failed to refresh token')
        })
    },
    logout() {
      if (!this.Keycloak) return
      this.Keycloak.logout({ redirectUri: this.Options?.redirectLogoutURI })
    },
    setOptions(data: ISecurityOption) {
      this.Options = data
    },
  },
})
