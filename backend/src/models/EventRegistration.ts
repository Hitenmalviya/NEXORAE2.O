import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRegistration extends Document {
  registrationId?: string;
  studentId: mongoose.Types.ObjectId;
  nexoraeId: string;
  eventId: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  registrationStatus: 'PAYMENT_VERIFICATION_PENDING' | 'CONFIRMED' | 'PAYMENT_REJECTED' | 'CANCELLED';
  paymentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    registrationId: { type: String, sparse: true, unique: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    nexoraeId: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    registrationStatus: {
      type: String,
      enum: ['PAYMENT_VERIFICATION_PENDING', 'CONFIRMED', 'PAYMENT_REJECTED', 'CANCELLED'],
      default: 'PAYMENT_VERIFICATION_PENDING',
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

export const EventRegistration = mongoose.model<IEventRegistration>('EventRegistration', eventRegistrationSchema);
