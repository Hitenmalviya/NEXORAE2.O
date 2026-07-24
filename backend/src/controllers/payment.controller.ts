import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { EventRegistration } from '../models/EventRegistration';
import { uploadPaymentScreenshot, deleteAsset } from '../services/cloudinary.service';

export const submitPaymentProof = async (req: Request, res: Response) => {
  try {
    const { paymentId, nexoraeId, upiId, transactionId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Screenshot file is required' });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.nexoraeId.toLowerCase() !== nexoraeId.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'NEXORAE ID mismatch' });
    }

    if (payment.status === 'VERIFIED') {
      return res.status(400).json({ success: false, message: 'Payment already verified' });
    }

    if (payment.status === 'PENDING' && payment.screenshotUrl) {
      return res.status(400).json({ success: false, message: 'Payment proof already submitted and awaiting verification' });
    }

    const trimmedUpiId = upiId?.trim();
    const trimmedTransactionId = transactionId?.trim();

    const existingTransaction = await Payment.findOne({ transactionId: trimmedTransactionId, _id: { $ne: payment._id } });
    if (existingTransaction) {
      return res.status(409).json({ success: false, message: 'Transaction ID already used by another payment' });
    }

    const uploadResult = await uploadPaymentScreenshot(file.buffer, file.mimetype, paymentId);

    payment.payerUpiId = trimmedUpiId;
    payment.transactionId = trimmedTransactionId;
    payment.screenshotUrl = uploadResult.url;
    payment.screenshotPublicId = uploadResult.publicId;
    payment.status = 'PENDING';
    await payment.save();

    await EventRegistration.updateOne(
      { paymentId: payment._id },
      { registrationStatus: 'PAYMENT_VERIFICATION_PENDING', paymentStatus: 'PENDING' }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment proof submitted successfully',
      data: { status: 'PENDING' },
    });
  } catch (error) {
    console.error('Submit payment proof error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const resubmitPaymentProof = async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.paymentId as string;
    const { nexoraeId, upiId, transactionId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Screenshot file is required' });
    }

    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Only rejected payments can be resubmitted' });
    }

    if (payment.nexoraeId.toLowerCase() !== nexoraeId.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'NEXORAE ID mismatch' });
    }

    const trimmedUpiId = upiId?.trim();
    const trimmedTransactionId = transactionId?.trim();

    const existingTransaction = await Payment.findOne({ transactionId: trimmedTransactionId, _id: { $ne: payment._id } });
    if (existingTransaction) {
      return res.status(409).json({ success: false, message: 'Transaction ID already used' });
    }

    if (payment.screenshotPublicId) {
      await deleteAsset(payment.screenshotPublicId);
    }

    const uploadResult = await uploadPaymentScreenshot(file.buffer, file.mimetype, paymentId);

    payment.payerUpiId = trimmedUpiId;
    payment.transactionId = trimmedTransactionId;
    payment.screenshotUrl = uploadResult.url;
    payment.screenshotPublicId = uploadResult.publicId;
    payment.status = 'PENDING';
    payment.adminNote = undefined;
    await payment.save();

    await EventRegistration.updateOne(
      { paymentId: payment._id },
      { registrationStatus: 'PAYMENT_VERIFICATION_PENDING', paymentStatus: 'PENDING' }
    );

    return res.status(200).json({ success: true, message: 'Payment proof resubmitted' });
  } catch (error) {
    console.error('Resubmit payment proof error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findOne({ paymentId }).populate('eventId');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const paymentObj = payment.toObject();
    delete paymentObj.screenshotPublicId;

    return res.status(200).json({ success: true, data: paymentObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
