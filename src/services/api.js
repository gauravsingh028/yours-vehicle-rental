import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const access = localStorage.getItem('yours_access_token')
  if (access) config.headers.Authorization = `Bearer ${access}`
  return config
})

export async function apiRequest(request) {
  try {
    const response = await request()
    return response.data
  } catch (error) {
    const data = error.response?.data
    const detail = data?.detail || Object.values(data || {}).flat().join(' ') || 'Something went wrong. Please try again.'
    throw new Error(detail)
  }
}

export const apiService = {
  login: (payload) => apiRequest(() => api.post('/accounts/login/', payload)),
  register: (payload) => apiRequest(() => api.post('/accounts/register/', payload)),
  profile: () => apiRequest(() => api.get('/accounts/profile/')),
  vehicles: (params = {}) => apiRequest(() => api.get('/vehicles/', { params })),
  createBooking: (payload) => apiRequest(() => api.post('/bookings/create/', payload)),
  myBookings: () => apiRequest(() => api.get('/bookings/my-bookings/')),
  createOrder: (bookingId) => apiRequest(() => api.post('/payments/create-order/', { booking_id: bookingId })),
  verifyPayment: (payload) => apiRequest(() => api.post('/payments/verify/', payload)),
  adminDashboard: () => apiRequest(() => api.get('/admin/dashboard/')),
  adminVehicles: () => apiRequest(() => api.get('/admin/vehicles/')),
  adminCreateVehicle: (formData) => apiRequest(() => api.post('/admin/vehicles/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
  adminUpdateVehicle: (id, formData) => apiRequest(() => api.patch(`/admin/vehicles/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
  adminBookings: () => apiRequest(() => api.get('/admin/bookings/')),
  adminUpdateBooking: (id, payload) => apiRequest(() => api.patch(`/admin/bookings/${id}/`, payload)),
  adminUsers: () => apiRequest(() => api.get('/admin/users/')),
  adminUpdateUser: (id, payload) => apiRequest(() => api.patch(`/admin/users/${id}/`, payload)),
  adminPayments: () => apiRequest(() => api.get('/admin/payments/')),
}
