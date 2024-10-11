import { getKeycloakInstance, initKeycloak } from '@/store/keycloak'
import { defineStore } from 'pinia'

const keycloak = getKeycloakInstance()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    roles: [],
    authenticated: false,
  }),
  actions: {
    async initialize() {
      try {
        await initKeycloak()
        if (keycloak.authenticated) {
          this.token = keycloak.token
          this.roles = keycloak.tokenParsed.realm_access.roles
          this.authenticated = true
          localStorage.setItem('token', keycloak.token)
        } else {
          console.error('User authentication failed')
        }
      } catch (error) {
        console.error('Keycloak initialization failed:', error)
      }
    },
    logout() {
      keycloak.logout()
      this.token = null
      this.roles = []
      this.authenticated = false
      localStorage.removeItem('token')
    },
  },
})
