import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Student } from '../models/Student';
import { EventRegistration } from '../models/EventRegistration';
import { Payment } from '../models/Payment';
import { generatePaymentId } from '../services/idGenerator';
import { generateUpiQR } from '../utils/qrcode';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ isActive: true });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const event = await Event.findOne({ slug });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { nexoraeId, email } = req.body;

    if (!nexoraeId || !email) {
      return res.status(400).json({ success: false, message: 'NEXORAE ID and registered email are required' });
    }

    const event = await Event.findOne({ $or: [{ _id: eventId }, { slug: eventId }] });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (!event.isActive) {
      return res.status(400).json({ success: false, message: 'Event is not active' });
    }

    if (event.currentRegistrations >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const student = await Student.findOne({ nexoraeId: new RegExp(`^${nexoraeId}$`, 'i') });
    if (!student || student.email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid NEXORAE ID or registered email. Please check your details and try again.' });
    }

    const existingRegistration = await EventRegistration.findOne({
      studentId: student._id,
      eventId: event._id,
    });

    if (existingRegistration) {
      return res.status(409).json({ success: false, message: 'Already registered for this event' });
    }

    const amount = student.isIEEE ? event.feeIEEE : event.feeNonIEEE;
    const paymentId = await generatePaymentId();

    const payment = new Payment({
      paymentId,
      nexoraeId: student.nexoraeId,
      eventId: event._id,
      amount,
      status: 'PENDING',
    });
    await payment.save();

    const registration = new EventRegistration({
      studentId: student._id,
      nexoraeId: student.nexoraeId,
      eventId: event._id,
      amount,
      paymentStatus: 'PENDING',
      registrationStatus: 'PAYMENT_VERIFICATION_PENDING',
      paymentId: payment._id,
    });
    await registration.save();

    await Event.findByIdAndUpdate(event._id, { $inc: { currentRegistrations: 1 } });

    const qrCodeDataUrl = await generateUpiQR(amount, student.nexoraeId);
    
    const merchantUpiId = process.env.MERCHANT_UPI_ID;
    const merchantName = process.env.MERCHANT_NAME;
    const upiIntentLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName || '')}&am=${amount}&cu=INR&tn=NEXORAE-${student.nexoraeId}`;

    return res.status(201).json({
      success: true,
      data: {
        registration,
        payment,
        qrCodeDataUrl,
        upiIntentLink,
        amount,
        studentName: student.fullName,
        eventName: event.name,
        isIEEE: student.isIEEE,
      },
    });
  } catch (error: any) {
    console.error('Register for event error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
