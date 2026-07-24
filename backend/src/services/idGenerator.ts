import crypto from 'crypto';
import { Student } from '../models/Student';
import { Payment } from '../models/Payment';
import { EventRegistration } from '../models/EventRegistration';

const generateRandomBase36 = (length: number) => {
  const bytes = crypto.randomBytes(Math.ceil(length * 0.75));
  return bytes.toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, length).toUpperCase();
};

export const generateNexoraeId = async (): Promise<string> => {
  let id = '';
  let isUnique = false;
  let retries = 0;

  while (!isUnique && retries < 10) {
    id = `NEX-${generateRandomBase36(6)}`;
    const existing = await Student.findOne({ nexoraeId: id });
    if (!existing) isUnique = true;
    retries++;
  }

  if (!isUnique) throw new Error('Failed to generate unique NEXORAE ID');
  return id;
};

export const generatePaymentId = async (): Promise<string> => {
  let id = '';
  let isUnique = false;
  let retries = 0;

  while (!isUnique && retries < 10) {
    const timestamp = Date.now().toString().slice(-10);
    id = `PAY-${timestamp}`;
    const existing = await Payment.findOne({ paymentId: id });
    if (!existing) isUnique = true;
    retries++;
  }

  if (!isUnique) throw new Error('Failed to generate unique Payment ID');
  return id;
};

export const generateRegistrationId = async (): Promise<string> => {
  let id = '';
  let isUnique = false;
  let retries = 0;

  while (!isUnique && retries < 10) {
    id = `NEX-EVT-${generateRandomBase36(6)}`;
    const existing = await EventRegistration.findOne({ registrationId: id });
    if (!existing) isUnique = true;
    retries++;
  }

  if (!isUnique) throw new Error('Failed to generate unique Registration ID');
  return id;
};
