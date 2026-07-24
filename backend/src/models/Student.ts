import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  nexoraeId: string;
  fullName: string;
  enrollmentNumber: string;
  email: string;
  contactNumber: string;
  isIEEE: boolean;
  ieeeId?: string;
  branch: string;
  collegeName: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    nexoraeId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    enrollmentNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactNumber: { type: String, required: true },
    isIEEE: { type: Boolean, required: true, default: false },
    ieeeId: { type: String },
    branch: { type: String, required: true },
    collegeName: { type: String, required: true },
    year: {
      type: String,
      required: true,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'],
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);
