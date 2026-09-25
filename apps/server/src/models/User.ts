import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export interface UserDocument {
  _id: { toString(): string };
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  lastLoginAt?: Date;
  comparePassword(password: string): Promise<boolean>;
  save(): Promise<unknown>;
}

export const User = model<UserDocument>('User', userSchema);
