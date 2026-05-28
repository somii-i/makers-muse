import axios from 'axios'

// Ensure the base URL ends with /api, and clean up any trailing slashes
let rawBase = import.meta.env.VITE_API_BASE_URL || ''
// If they accidentally included .api instead of /api, fix it on the fly
rawBase = rawBase.replace('.api', '/api')
if (!rawBase.endsWith('/api')) {
    rawBase = rawBase.replace(/\/+$/, '') + '/api'
}

const apiClient = axios.create({
  baseURL: rawBase,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: Attach JWT and Fix Paths ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Prevent Axios from overwriting the /api baseURL by stripping leading slashes
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1)
    }
    // Also ensure baseURL has a trailing slash to append safely
    if (config.baseURL && !config.baseURL.endsWith('/')) {
      config.baseURL += '/'
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
      // Token expired or invalid — clear local auth state and redirect
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
