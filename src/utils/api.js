import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
}

export const tracks = {
  getAll: () => api.get('/tracks'),
  getById: (id) => api.get(`/tracks/${id}`),
  upload: (formData) => api.post('/tracks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addUrl: (data) => api.post('/tracks/url', data),
  delete: (id) => api.delete(`/tracks/${id}`),
  getFavorites: () => api.get('/tracks/favorites/list'),
  addFavorite: (id) => api.post(`/tracks/${id}/favorite`),
  removeFavorite: (id) => api.delete(`/tracks/${id}/favorite`),
}

export const playlists = {
  getAll: () => api.get('/playlists'),
  getById: (id) => api.get(`/playlists/${id}`),
  create: (data) => api.post('/playlists', data),
  update: (id, data) => api.put(`/playlists/${id}`, data),
  delete: (id) => api.delete(`/playlists/${id}`),
  addTrack: (playlistId, trackId) => api.post(`/playlists/${playlistId}/tracks`, { track_id: trackId }),
  removeTrack: (playlistId, trackId) => api.delete(`/playlists/${playlistId}/tracks/${trackId}`),
}

export const users = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
}

export const search = {
  query: (q) => api.get(`/search?q=${encodeURIComponent(q)}`),
}

export const getTrackUrl = (track) => {
  if (!track) return ''
  
  if (track.source === 'url' && track.file_path) {
    return track.file_path
  }
  
  if (track.file_path && !track.file_path.startsWith('http')) {
    return `http://localhost:3001/uploads/${track.file_path}`
  }
  
  return track.file_path || ''
}

export const getCoverUrl = (track) => {
  if (track.cover_url && !track.cover_url.startsWith('http')) {
    return `http://localhost:3001/uploads/${track.cover_url}`
  }
  return track.cover_url || '/default-cover.png'
}

export default api
