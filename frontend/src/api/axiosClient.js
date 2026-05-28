import axios from 'axios'

// Get the backend base URL from environment variable
// In Vercel: set VITE_API_BASE_URL = https://makers-muse.onrender.com
// (WITHOUT /api at the end - we add /api to each request path instead)
const BACKEND = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
  : ''

// All API calls go to /api/* on the backend
const apiClient = axios.create({
  baseURL: BACKEND + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: Attach JWT ───────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mm_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: Handle 401 ─────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mm_token')
      localStorage.removeItem('mm_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
