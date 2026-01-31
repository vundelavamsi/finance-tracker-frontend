import axios from 'axios'

// In production (e.g. Vercel), set VITE_API_URL to your backend base + /api
// e.g. https://finance-tracker-backend-2n5w.onrender.com/api
// In dev, /api is proxied to the backend by Vite.
const baseURL = import.meta.env.VITE_API_URL ?? '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const AUTH_TOKEN_KEY = 'finance_tracker_access_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: on 401 clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setStoredToken(null)
      const path = window.location.pathname
      if (!path.startsWith('/login') && !path.startsWith('/register') && path !== '/auth/verify') {
        window.location.href = '/login'
      }
    }
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api
