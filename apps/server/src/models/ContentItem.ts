import { Schema, model } from 'mongoose';

export const contentTypes = [
  'research',
  'project',
  'publication',
  'experience',
  'activity',
  'event',
  'achievement',
  'skill',
  'education',
  'blog',
  'timeline'
] as const;

const metricSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const linkSchema = new Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false }
);

const mediaReferenceSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: 'MediaAsset', default: undefined },
    url: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    credit: { type: String, default: '' },
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    focalX: { type: Number, default: 50 },
    focalY: { type: Number, default: 50 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const contentItemSchema = new Schema(
  {
    type: { type: String, enum: contentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, default: '' },
    slug: { type: String, required: true, trim: true, lowercase: true },
    eyebrow: { type: String, default: '' },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: 'General', index: true },
    status: { type: String, default: 'Published' },
    organization: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: Date,
    endDate: Date,
    publishedAt: Date,
    featured: { type: Boolean, default: false, index: true },
    visible: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
    tags: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    metrics: [metricSchema],
    links: [linkSchema],
    coverImage: { type: String, default: '' },
    coverImageAlt: { type: String, default: '' },
    coverImageCaption: { type: String, default: '' },
    gallery: [{ type: String }],
    galleryItems: { type: [mediaReferenceSchema], default: [] },
    relatedContentIds: [{ type: Schema.Types.ObjectId, ref: 'ContentItem' }],
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
);

contentItemSchema.index({ type: 1, slug: 1 }, { unique: true });
contentItemSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

export const ContentItem = model('ContentItem', contentItemSchema);
