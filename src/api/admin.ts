import apiClient from './client';

export const adminApi = {
  login: (username: string, password: string) =>
    apiClient.post('/admin/login', { username, password }),

  getDashboardStats: () =>
    apiClient.get('/admin/dashboard'),

  getStudents: (params?: { page?: number; limit?: number; search?: string; isIEEE?: string }) =>
    apiClient.get('/admin/students', { params }),

  getPayments: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get('/admin/payments', { params }),

  verifyPayment: (id: string) =>
    apiClient.put(`/admin/payments/${id}/verify`),

  rejectPayment: (id: string, adminNote: string) =>
    apiClient.put(`/admin/payments/${id}/reject`, { adminNote }),

  getEvents: () =>
    apiClient.get('/admin/events'),

  createEvent: (data: Record<string, unknown>) =>
    apiClient.post('/admin/events', data),

  updateEvent: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/admin/events/${id}`, data),

  deleteEvent: (id: string) =>
    apiClient.delete(`/admin/events/${id}`),

  getRegistrations: (params?: { eventId?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get('/admin/registrations', { params }),

  exportStudents: () =>
    apiClient.get('/admin/export/students', { responseType: 'blob' }),

  exportRegistrations: (eventId?: string) =>
    apiClient.get('/admin/export/registrations', {
      params: eventId ? { eventId } : undefined,
      responseType: 'blob',
    }),
};
