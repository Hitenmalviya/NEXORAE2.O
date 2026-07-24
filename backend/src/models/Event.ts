import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: 'tech' | 'design' | 'fun';
  difficulty: 'easy' | 'medium' | 'hard';
  prize?: string;
  date?: string;
  time?: string;
  venue: string;
  feeIEEE: number;
  feeNonIEEE: number;
  maxParticipants: number;
  currentRegistrations: number;
  isActive: boolean;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  team: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    icon: { type: String, default: '✦' },
    category: { type: String, enum: ['tech', 'design', 'fun'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    prize: { type: String },
    date: { type: String },
    time: { type: String },
    venue: { type: String, default: 'GCET, Vallabh Vidyanagar' },
    feeIEEE: { type: Number, default: 150 },
    feeNonIEEE: { type: Number, default: 250 },
    maxParticipants: { type: Number, default: 100 },
    currentRegistrations: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    cloudinaryPublicId: { type: String },
    team: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
