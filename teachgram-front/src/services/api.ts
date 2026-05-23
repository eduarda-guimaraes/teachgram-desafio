import axios from 'axios'

const TOKEN_KEY = 'teachgram.authToken'

export const getStoredToken = () => window.localStorage.getItem(TOKEN_KEY)

export const setStoredToken = (token: string | null) => {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
    return
  }

  window.localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Basic ${token}`
  }

  return config
})

export default api
