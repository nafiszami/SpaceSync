import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getResources = () => api.get('/resources');
export const createResource = (data) => api.post('/resources', data);

export const getBookings = () => api.get('/bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;
