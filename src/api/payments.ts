import apiClient from './client';

export const paymentsApi = {
  submitProof: (formData: FormData) =>
    apiClient.post('/payments/submit-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  resubmitProof: (paymentId: string, formData: FormData) =>
    apiClient.post(`/payments/resubmit/${paymentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStatus: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}`),
};
