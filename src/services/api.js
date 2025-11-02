import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 500 error from auth endpoint or 401/403, clear invalid token
    if (error.response?.status === 500 && error.config?.url?.includes('/auth/me')) {
      console.warn('Invalid token detected, clearing localStorage');
      localStorage.removeItem('token');
      window.location.reload();
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication failed, clearing localStorage');
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Calendars API
export const calendarsAPI = {
  getAll: () => api.get('/calendars'),
  create: (data) => api.post('/calendars', data),
  update: (id, data) => api.put(`/calendars/${id}`, data),
  delete: (id) => api.delete(`/calendars/${id}`),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  addReminder: (eventId, data) => api.post(`/events/${eventId}/reminders`, data),
  deleteReminder: (eventId, reminderId) => api.delete(`/events/${eventId}/reminders/${reminderId}`),
};

export default api;
