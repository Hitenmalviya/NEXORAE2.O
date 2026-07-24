import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach admin or student JWT tokens to requests
apiClient.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('nexorae-admin-token');
  const studentToken = sessionStorage.getItem('nexorae-student-token');
  const token = adminToken || studentToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
