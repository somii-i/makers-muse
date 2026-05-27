import apiClient from '../api/axiosClient'

export const chatService = {
  async send(message, sessionId) {
    const res = await apiClient.post('/chat', {
      message,
      sessionId,
    })
    return res.data
  },
}
