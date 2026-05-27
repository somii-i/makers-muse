import apiClient from '../api/axiosClient'

export const orderService = {
  async checkout(items) {
    const res = await apiClient.post('/orders/checkout', { items })
    return res.data
  },

  async getMyOrders(page = 0, size = 10) {
    const res = await apiClient.get('/orders/my', {
      params: { page, size },
    })
    return res.data
  },

  async getDownloadUrl(orderId, itemId) {
    const res = await apiClient.get(
      `/orders/${orderId}/download/${itemId}`
    )
    return res.data
  },
}
