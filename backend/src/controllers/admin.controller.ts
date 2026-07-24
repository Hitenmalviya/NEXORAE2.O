import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { Student } from '../models/Student';
import { EventRegistration } from '../models/EventRegistration';
import { Payment } from '../models/Payment';
import { Event } from '../models/Event';
import jwt from 'jsonwebtoken';
import { generateRegistrationId } from '../services/idGenerator';
import { sendPaymentConfirmedEmail, sendPaymentRejectedEmail } from '../services/email.service';
import { deleteAsset } from '../services/cloudinary.service';
import { stringify } from 'csv-stringify/sync';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select('+passwordHash');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        admin: { username: admin.username, email: admin.email, role: admin.role },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [
      totalStudents,
      totalRegistrations,
      registrationsByStatus,
      paymentsByStatus,
      verifiedPayments,
      registrationsPerEvent,
      ieeeStats
    ] = await Promise.all([
      Student.countDocuments(),
      EventRegistration.countDocuments(),
      EventRegistration.aggregate([{ $group: { _id: '$registrationStatus', count: { $sum: 1 } } }]),
      Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Payment.aggregate([{ $match: { status: 'VERIFIED' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      EventRegistration.aggregate([{ $group: { _id: '$eventId', count: { $sum: 1 } } }]),
      Student.aggregate([{ $group: { _id: '$isIEEE', count: { $sum: 1 } } }]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRegistrations,
        registrationsByStatus,
        paymentsByStatus,
        totalRevenue: verifiedPayments[0]?.total || 0,
        registrationsPerEvent,
        ieeeStats
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const isIEEE = req.query.isIEEE as string;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { nexoraeId: new RegExp(search, 'i') },
        { enrollmentNumber: new RegExp(search, 'i') },
      ];
    }
    if (isIEEE !== undefined) query.isIEEE = isIEEE === 'true';

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Student.countDocuments(query);

    return res.status(200).json({ success: true, data: { students, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const query: any = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('eventId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    // Populate student data manually via nexoraeId
    const populatedPayments = await Promise.all(
      payments.map(async (payment) => {
        const student = await Student.findOne({ nexoraeId: payment.nexoraeId });
        return { ...payment.toObject(), student };
      })
    );

    return res.status(200).json({ success: true, data: { payments: populatedPayments, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Payment is not PENDING' });

    const registrationId = await generateRegistrationId();

    payment.status = 'VERIFIED';
    payment.verifiedBy = req.admin.adminId;
    payment.verifiedAt = new Date();
    payment.registrationId = registrationId;
    await payment.save();

    const registration = await EventRegistration.findOne({ paymentId: payment._id });
    if (registration) {
      registration.registrationStatus = 'CONFIRMED';
      registration.paymentStatus = 'VERIFIED';
      registration.registrationId = registrationId;
      await registration.save();
    }

    const student = await Student.findOne({ nexoraeId: payment.nexoraeId });
    const event = await Event.findById(payment.eventId);

    if (student && event) {
      try {
        await sendPaymentConfirmedEmail(student.email, {
          fullName: student.fullName,
          nexoraeId: student.nexoraeId,
          registrationId,
          eventName: event.name,
          eventDate: event.date || 'TBA',
          venue: event.venue,
          amount: payment.amount,
          transactionId: payment.transactionId || 'N/A',
        });
      } catch (e) {
        console.error('Failed to send verification email', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Payment verified', data: { registrationId } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Payment is not PENDING' });

    payment.status = 'REJECTED';
    payment.adminNote = adminNote;
    payment.verifiedBy = req.admin.adminId;
    payment.verifiedAt = new Date();
    await payment.save();

    const registration = await EventRegistration.findOne({ paymentId: payment._id });
    if (registration) {
      registration.registrationStatus = 'PAYMENT_REJECTED';
      registration.paymentStatus = 'REJECTED';
      await registration.save();
    }

    const student = await Student.findOne({ nexoraeId: payment.nexoraeId });
    const event = await Event.findById(payment.eventId);

    if (student && event) {
      try {
        await sendPaymentRejectedEmail(student.email, {
          fullName: student.fullName,
          nexoraeId: student.nexoraeId,
          eventName: event.name,
          amount: payment.amount,
          adminNote,
        });
      } catch (e) {
        console.error('Failed to send rejection email', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Payment rejected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getRegistrations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const eventId = req.query.eventId as string;
    const status = req.query.status as string;

    const query: any = {};
    if (eventId) query.eventId = eventId;
    if (status) query.registrationStatus = status;

    const registrations = await EventRegistration.find(query)
      .populate('eventId')
      .populate('studentId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EventRegistration.countDocuments(query);

    return res.status(200).json({ success: true, data: { registrations, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, description, category, difficulty, team } = req.body;
    if (!name || !description || !category || !difficulty || !team) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newEvent = new Event({ ...req.body, slug });
    await newEvent.save();

    return res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const count = await EventRegistration.countDocuments({ eventId: id, registrationStatus: 'CONFIRMED' });
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete event with confirmed registrations' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.cloudinaryPublicId) {
      await deleteAsset(event.cloudinaryPublicId);
    }

    await Event.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAdminEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const exportStudentsCSV = async (req: Request, res: Response) => {
  try {
    const students = await Student.find().lean();
    const csvData = stringify(students, {
      header: true,
      columns: ['nexoraeId', 'fullName', 'enrollmentNumber', 'email', 'contactNumber', 'isIEEE', 'ieeeId', 'branch', 'collegeName', 'year', 'createdAt'],
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students-export.csv');
    res.status(200).send(csvData);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const exportRegistrationsCSV = async (req: Request, res: Response) => {
  try {
    const eventId = req.query.eventId as string;
    const query: any = {};
    if (eventId) query.eventId = eventId;

    const registrations = await EventRegistration.find(query).populate('studentId').populate('eventId').lean();
    
    const flatData = registrations.map((r: any) => ({
      registrationId: r.registrationId,
      nexoraeId: r.nexoraeId,
      studentName: r.studentId?.fullName,
      studentEmail: r.studentId?.email,
      eventName: r.eventId?.name,
      amount: r.amount,
      paymentStatus: r.paymentStatus,
      registrationStatus: r.registrationStatus,
      date: r.createdAt,
    }));

    const csvData = stringify(flatData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=registrations-export.csv');
    res.status(200).send(csvData);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
