import { Schema, model } from 'mongoose';

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    organization: { type: String, default: '', trim: true },
    inquiryType: { type: String, default: 'General Message', trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new', index: true },
    ipHash: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ContactMessage = model('ContactMessage', contactMessageSchema);
