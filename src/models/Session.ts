import { Schema, model, Document, Types } from 'mongoose';

export type SessionStatus = 'AVAILABLE' | 'BOOKED' | 'COMPLETED';

export interface ISession extends Document {
  teacherId: Types.ObjectId;
  userId: Types.ObjectId | null;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  completedAt: Date | null;
}

const sessionSchema = new Schema<ISession>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['AVAILABLE', 'BOOKED', 'COMPLETED'],
      default: 'AVAILABLE',
    },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<ISession>('Session', sessionSchema);
