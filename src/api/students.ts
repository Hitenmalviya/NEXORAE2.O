import apiClient from './client';

export interface Student {
  nexoraeId: string;
  fullName: string;
  enrollmentNumber: string;
  email: string;
  contactNumber: string;
  isIEEE: boolean;
  ieeeId?: string;
  branch: string;
  collegeName: string;
  year: string;
  createdAt: string;
}

export interface StudentRegistration {
  _id: string;
  registrationId?: string;
  nexoraeId: string;
  eventId: { name: string; slug: string; date?: string; venue?: string; icon: string };
  amount: number;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  registrationStatus: 'PAYMENT_VERIFICATION_PENDING' | 'CONFIRMED' | 'PAYMENT_REJECTED' | 'CANCELLED';
  paymentId?: { paymentId: string; status: string; adminNote?: string; screenshotUrl?: string };
  createdAt: string;
}

export const studentsApi = {
  register: (data: Omit<Student, 'nexoraeId' | 'createdAt'>) =>
    apiClient.post('/students/register', data),
  verify: (data: { nexoraeId: string; email: string }) =>
    apiClient.post('/students/verify', data),
  getMe: () =>
    apiClient.get('/students/me'),
};
