import apiClient from '../api/axiosClient'

export const authService = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data)
    return res.data
  },

  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password })
    return res.data
  },
}
