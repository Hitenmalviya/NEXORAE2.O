import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student';
import { EventRegistration } from '../models/EventRegistration';
import { Payment } from '../models/Payment';
import { generateNexoraeId } from '../services/idGenerator';
import { sendWelcomeEmail } from '../services/email.service';

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { fullName, enrollmentNumber, email, contactNumber, isIEEE, ieeeId, branch, collegeName, year } = req.body;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const existingEnrollment = await Student.findOne({ enrollmentNumber });
    if (existingEnrollment) {
      return res.status(409).json({ success: false, message: 'Enrollment number already registered' });
    }

    const nexoraeId = await generateNexoraeId();

    const student = new Student({
      nexoraeId,
      fullName,
      enrollmentNumber,
      email,
      contactNumber,
      isIEEE,
      ieeeId,
      branch,
      collegeName,
      year,
    });

    await student.save();

    try {
      await sendWelcomeEmail(email, {
        fullName,
        nexoraeId,
        enrollmentNumber,
        email,
        contactNumber,
        collegeName,
        branch,
        year,
        isIEEE,
        ieeeId,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error: any) {
    console.error('Register student error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Use /students/verify with NEXORAE ID and registered email to access your profile.',
  });
};

export const verifyStudent = async (req: Request, res: Response) => {
  try {
    const { nexoraeId, email } = req.body;
    const student = await Student.findOne({ nexoraeId: new RegExp(`^${nexoraeId}$`, 'i') });

    if (!student || student.email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid NEXORAE ID or registered email. Please check your details and try again.',
      });
    }

    const token = jwt.sign(
      { studentId: student._id, nexoraeId: student.nexoraeId, email: student.email },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.STUDENT_JWT_EXPIRES_IN || '2h') as any }
    );

    const registrations = await EventRegistration.find({ studentId: student._id })
      .populate('eventId')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        token,
        student,
        registrations,
      },
    });
  } catch (error: any) {
    console.error('Verify student error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getStudentMe = async (req: Request, res: Response) => {
  try {
    const studentId = req.student?.studentId;
    if (!studentId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const registrations = await EventRegistration.find({ studentId: student._id })
      .populate('eventId')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: { student, registrations } });
  } catch (error: any) {
    console.error('Get student me error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
