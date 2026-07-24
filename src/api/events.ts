import apiClient from './client';

export interface EventData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: 'tech' | 'design' | 'fun';
  difficulty: 'easy' | 'medium' | 'hard';
  prize: string;
  date?: string;
  time?: string;
  venue?: string;
  feeIEEE: number;
  feeNonIEEE: number;
  maxParticipants: number;
  currentRegistrations: number;
  isActive: boolean;
  team: { min: number; max: number };
}

export interface RegisterForEventResponse {
  registration: { _id: string; nexoraeId: string; amount: number };
  payment: { paymentId: string; amount: number; status: string };
  qrCodeDataUrl: string;
  upiIntentLink: string;
  amount: number;
  studentName: string;
  eventName: string;
  isIEEE: boolean;
}

export const eventsApi = {
  getAll: () => apiClient.get('/events'),
  getBySlug: (slug: string) => apiClient.get(`/events/${slug}`),
  registerForEvent: (eventId: string, nexoraeId: string, email: string) =>
    apiClient.post(`/events/${eventId}/register`, { nexoraeId, email }),
};
