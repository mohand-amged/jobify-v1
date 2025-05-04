import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// User endpoints
export const users = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getApplications: () => api.get('/user/applications'),
  getSavedJobs: () => api.get('/user/saved-jobs'),
  updateNotificationPreferences: (preferences) => 
    api.put('/user/notifications/preferences', preferences),
  getNotifications: () => api.get('/user/notifications'),
  markNotificationAsRead: (notificationId) => 
    api.put(`/user/notifications/${notificationId}/read`),
  uploadResume: (formData) => 
    api.post('/user/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteResume: () => api.delete('/user/resume'),
};

// Jobs endpoints
export const jobs = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (jobId, applicationData) => 
    api.post(`/jobs/${jobId}/apply`, applicationData),
  search: (params) => api.get('/jobs/search', { params }),
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
};

// Company API endpoints
export const companies = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getCompanyJobs: (params) => api.get('/companies/jobs', { params }),
  getCompanyStats: () => api.get('/companies/stats'),
};

export default api; 