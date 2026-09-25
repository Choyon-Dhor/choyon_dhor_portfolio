import { Schema, model } from 'mongoose';

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    intro: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    sections: { type: [Schema.Types.Mixed], default: [] }
  },
  { timestamps: true, minimize: false }
);

export const Page = model('Page', pageSchema);
