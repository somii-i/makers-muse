import apiClient from '../api/axiosClient'

export const artworkService = {
  async search(params) {
    const cleanParams = {}
    if (params.keyword)            cleanParams.keyword  = params.keyword
    if (params.category)           cleanParams.category = params.category
    if (params.minPrice !== '' && params.minPrice != null) cleanParams.minPrice = params.minPrice
    if (params.maxPrice !== '' && params.maxPrice != null) cleanParams.maxPrice = params.maxPrice
    cleanParams.page = params.page ?? 0
    cleanParams.size = params.size ?? 12
    cleanParams.sort = params.sort ?? 'newest'

    const res = await apiClient.get('/artworks', { params: cleanParams })
    return res.data
  },

  async getById(id) {
    const res = await apiClient.get(`/artworks/${id}`)
    return res.data
  },

  async getMyArtworks(page = 0, size = 12) {
    const res = await apiClient.get('/artworks/my', {
      params: { page, size },
    })
    return res.data
  },

  async upload(formData) {
    const res = await apiClient.post('/artworks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async deleteArtwork(id) {
    await apiClient.delete(`/artworks/${id}`)
  },
}
