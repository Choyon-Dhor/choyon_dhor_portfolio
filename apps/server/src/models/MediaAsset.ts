import { Schema, model } from 'mongoose';

const mediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    originalName: { type: String, default: '' },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    fileType: { type: String, enum: ['image', 'video', 'gif', 'pdf', 'presentation', 'external'], default: 'image' },
    fileSize: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    credit: { type: String, default: '' },
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    focalX: { type: Number, default: 50 },
    focalY: { type: Number, default: 50 },
    externalUrl: { type: String, default: '' },
    uploadedBy: { type: String, default: '' }
  },
  { timestamps: true }
);

mediaAssetSchema.index({ category: 1, fileType: 1, createdAt: -1 });

export const MediaAsset = model('MediaAsset', mediaAssetSchema);
