import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  gatewayOrderId?: string;
  registrationId?: string;
  nexoraeId: string;
  eventId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  payerUpiId?: string;
  transactionId?: string;
  screenshotUrl?: string;
  screenshotPublicId?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  adminNote?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true },
    gatewayOrderId: { type: String },
    registrationId: { type: String },
    nexoraeId: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'UPI' },
    payerUpiId: { type: String },
    transactionId: { type: String, sparse: true, unique: true },
    screenshotUrl: { type: String },
    screenshotPublicId: { type: String },
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    adminNote: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
