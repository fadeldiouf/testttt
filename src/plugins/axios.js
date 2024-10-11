import { getKeycloakInstance } from '@/store/keycloak'

import axios from 'axios'


const baseURL = import.meta.env.VITE_BASE_URL
const keycloak = getKeycloakInstance()

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  function (config) {
    if (keycloak.authenticated) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }

    return config
  },
  function (error) {

    return Promise.reject(error)
  },

)

export default axiosInstance
