import Keycloak from 'keycloak-js'

const keycloakConfig = {
  // Configurations spécifiques à Keycloak (URL, realm, clientId, etc.)
  url: 'http://localhost:8080',
  realm: 'demande-diplome',
  clientId: 'demande-diplome-client',
}

const keycloak = new Keycloak(keycloakConfig)

// Fonction pour initialiser Keycloak
export function initKeycloak() {
  return new Promise((resolve, reject) => {
    keycloak.init({ onLoad: 'login-required' })
      .then(authenticated => {
        if (authenticated) {
          console.log("User is authenticated")
          resolve()
        } else {
          console.log("Authentication failed")
          reject()
        }
      })
      .catch(err => {
        console.error('Keycloak initialization error:', err)
        reject(err)
      })
  })
}

// Fonction pour récupérer l'instance de Keycloak
export function getKeycloakInstance() {
  return keycloak
}
export default keycloak
