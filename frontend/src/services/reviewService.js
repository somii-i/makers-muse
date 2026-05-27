import apiClient from '../api/axiosClient'

export const reviewService = {
  async getReviews(artworkId, page = 0, size = 10) {
    const res = await apiClient.get(`/artworks/${artworkId}/reviews`, {
      params: { page, size },
    })
    return res.data
  },

  async addReview(artworkId, rating, comment) {
    const res = await apiClient.post(`/artworks/${artworkId}/reviews`, {
      rating,
      comment,
    })
    return res.data
  },
}
