import axios from 'axios'

// VITE_API_BASE_URL should be: https://makers-muse.onrender.com/api
// Axios requires a trailing slash on the baseURL so it doesn't drop the /api segment
// when paths like /auth/login are appended
const raw = import.meta.env.VITE_API_BASE_URL || '/api'
const BASE = raw.endsWith('/') ? raw : raw + '/'

const apiClient = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: Attach JWT ───────────────────────────────────────────
// Strip the leading slash from all paths so Axios properly appends to baseURL
// e.g.  BASE="https://render.com/api/"  +  "auth/login"  → correct full URL
apiClient.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.slice(1)
    }
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
