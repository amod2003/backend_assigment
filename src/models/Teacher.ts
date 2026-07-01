import { Schema, model, Document } from 'mongoose';

export interface ITeacher extends Document {
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
}

const teacherSchema = new Schema<ITeacher>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<ITeacher>('Teacher', teacherSchema);
