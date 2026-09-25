// apps/server/src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { rateLimit as rateLimit2 } from "express-rate-limit";
import morgan from "morgan";

// apps/server/src/config/env.ts
import "dotenv/config";
import { z } from "zod";
var mongoUriSchema = z.string().default("").refine(
  (value) => !value || value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
  "MONGODB_URI must start with mongodb:// or mongodb+srv://"
);
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5e3),
  MONGODB_URI: mongoUriSchema,
  CLIENT_URL: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32).default("development-only-secret-change-before-production-32-chars"),
  COOKIE_SECURE: z.string().default("false").transform((value) => value === "true"),
  ADMIN_NAME: z.string().default("Choyon Dhor"),
  ADMIN_EMAIL: z.string().email().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(8).default("ChangeMe123!")
});
var env = envSchema.parse(process.env);

// apps/server/src/middleware/error.ts
import { ZodError } from "zod";

// apps/server/src/utils/AppError.ts
var AppError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
  statusCode;
};

// apps/server/src/middleware/error.ts
function notFound(req, _res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}
function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
    });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (typeof error === "object" && error && "code" in error && error.code === 11e3) {
    res.status(409).json({ message: "A record with the same unique value already exists." });
    return;
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}

// apps/server/src/models/ContentItem.ts
import { Schema, model } from "mongoose";
var contentTypes = [
  "research",
  "project",
  "publication",
  "experience",
  "activity",
  "event",
  "achievement",
  "skill",
  "education",
  "blog",
  "timeline"
];
var metricSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);
var linkSchema = new Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false }
);
var mediaReferenceSchema = new Schema(
  {
    assetId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: void 0 },
    url: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    credit: { type: String, default: "" },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    focalX: { type: Number, default: 50 },
    focalY: { type: Number, default: 50 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);
var contentItemSchema = new Schema(
  {
    type: { type: String, enum: contentTypes, required: true, index: true },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, default: "" },
    slug: { type: String, required: true, trim: true, lowercase: true },
    eyebrow: { type: String, default: "" },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "General", index: true },
    status: { type: String, default: "Published" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
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
    coverImage: { type: String, default: "" },
    coverImageAlt: { type: String, default: "" },
    coverImageCaption: { type: String, default: "" },
    gallery: [{ type: String }],
    galleryItems: { type: [mediaReferenceSchema], default: [] },
    relatedContentIds: [{ type: Schema.Types.ObjectId, ref: "ContentItem" }],
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
);
contentItemSchema.index({ type: 1, slug: 1 }, { unique: true });
contentItemSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });
var ContentItem = model("ContentItem", contentItemSchema);

// apps/server/src/models/Page.ts
import { Schema as Schema2, model as model2 } from "mongoose";
var pageSchema = new Schema2(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    eyebrow: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    intro: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    sections: { type: [Schema2.Types.Mixed], default: [] }
  },
  { timestamps: true, minimize: false }
);
var Page = model2("Page", pageSchema);

// apps/server/src/routes/admin.ts
import fs from "node:fs/promises";
import path3 from "node:path";
import { Router } from "express";

// apps/server/src/utils/auth.ts
import jwt from "jsonwebtoken";
function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

// apps/server/src/middleware/auth.ts
function requireAuth(req, _res, next) {
  const token = req.cookies?.nexus_token;
  if (!token) return next(new AppError(401, "Authentication required"));
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, "Session expired or invalid"));
  }
}

// apps/server/src/middleware/upload.ts
import path2 from "node:path";
import crypto from "node:crypto";
import multer from "multer";

// apps/server/src/utils/paths.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
var currentDirectory = path.dirname(fileURLToPath(import.meta.url));
var serverRoot = path.resolve(currentDirectory, "..", "..");
var uploadsDirectory = path.join(serverRoot, "uploads");

// apps/server/src/middleware/upload.ts
var uploadDir = uploadsDirectory;
var storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const extension = path2.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${extension}`);
  }
});
var allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
  "video/mp4",
  "video/webm"
];
var upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError(400, "Only JPEG, PNG, WebP, GIF, AVIF, PDF, MP4 and WebM files are allowed"));
      return;
    }
    callback(null, true);
  }
});

// apps/server/src/models/ContactMessage.ts
import { Schema as Schema3, model as model3 } from "mongoose";
var contactMessageSchema = new Schema3(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    organization: { type: String, default: "", trim: true },
    inquiryType: { type: String, default: "General Message", trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true },
    ipHash: { type: String, default: "" }
  },
  { timestamps: true }
);
var ContactMessage = model3("ContactMessage", contactMessageSchema);

// apps/server/src/models/MediaAsset.ts
import { Schema as Schema4, model as model4 } from "mongoose";
var mediaAssetSchema = new Schema4(
  {
    filename: { type: String, required: true, unique: true, trim: true },
    originalName: { type: String, default: "" },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    fileType: { type: String, enum: ["image", "video", "gif", "pdf", "presentation", "external"], default: "image" },
    fileSize: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    credit: { type: String, default: "" },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    focalX: { type: Number, default: 50 },
    focalY: { type: Number, default: 50 },
    externalUrl: { type: String, default: "" },
    uploadedBy: { type: String, default: "" }
  },
  { timestamps: true }
);
mediaAssetSchema.index({ category: 1, fileType: 1, createdAt: -1 });
var MediaAsset = model4("MediaAsset", mediaAssetSchema);

// apps/server/src/models/SiteSettings.ts
import { Schema as Schema5, model as model5 } from "mongoose";
var mediaReferenceSchema2 = new Schema5(
  {
    assetId: { type: Schema5.Types.ObjectId, ref: "MediaAsset", default: void 0 },
    url: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    credit: { type: String, default: "" },
    date: { type: String, default: "" },
    location: { type: String, default: "" },
    focalX: { type: Number, default: 50 },
    focalY: { type: Number, default: 50 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);
var gameCollectibleSchema = new Schema5(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    sourceType: { type: String, default: "custom" },
    contentSlug: { type: String, default: "" },
    settingsKey: { type: String, default: "" },
    unlockMessage: { type: String, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);
var gameChapterSchema = new Schema5(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    sourceType: { type: String, default: "" },
    contentSlug: { type: String, default: "" },
    settingsKey: { type: String, default: "" },
    backgroundLabel: { type: String, default: "" },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);
var gameConfigSchema = new Schema5(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "Data Highway" },
    description: { type: String, default: "Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content." },
    vehicleLabel: { type: String, default: "Nexus Runner" },
    difficulty: { type: String, default: "normal" },
    speed: { type: Number, default: 4 },
    homepagePreviewEnabled: { type: Boolean, default: true },
    mobileSimplifiedMode: { type: Boolean, default: true },
    chapters: { type: [gameChapterSchema], default: [] },
    collectibles: { type: [gameCollectibleSchema], default: [] },
    missions: { type: [String], default: [] },
    obstacles: { type: [String], default: [] },
    rewards: { type: [String], default: [] }
  },
  { _id: false }
);
var siteSettingsSchema = new Schema5(
  {
    key: { type: String, unique: true, default: "primary" },
    siteName: { type: String, default: "CHOYON//NEXUS" },
    tagline: { type: String, default: "Researching Intelligence. Engineering Impact." },
    heroTitle: { type: String, default: "Choyon Dhor" },
    heroSubtitle: { type: String, default: "AI & Machine Learning Research Aspirant" },
    heroSecondaryTitle: { type: String, default: "Researcher \u2022 Developer \u2022 Community Builder" },
    heroDescription: { type: String, default: "" },
    currentFocus: { type: String, default: "" },
    availabilityStatus: { type: String, default: "Open to collaboration" },
    location: { type: String, default: "Sylhet, Bangladesh" },
    email: { type: String, default: "choyondhorshu@gmail.com" },
    availability: { type: String, default: "Open to research collaboration" },
    profileImage: { type: String, default: "" },
    profileImageAlt: { type: String, default: "" },
    profileImageCaption: { type: String, default: "" },
    profileImageFocalX: { type: Number, default: 50 },
    profileImageFocalY: { type: Number, default: 50 },
    alternateProfileImage: { type: String, default: "" },
    alternateProfileImageAlt: { type: String, default: "" },
    transparentProfileImage: { type: String, default: "" },
    transparentProfileImageAlt: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    heroPrimaryCtaLabel: { type: String, default: "Enter Research Lab" },
    heroPrimaryCtaUrl: { type: String, default: "/research" },
    heroSecondaryCtaLabel: { type: String, default: "Explore Projects" },
    heroSecondaryCtaUrl: { type: String, default: "/projects" },
    heroOrbitLabels: { type: [String], default: [] },
    stats: { type: [Schema5.Types.Mixed], default: [] },
    socials: { type: [Schema5.Types.Mixed], default: [] },
    terminalGreeting: { type: String, default: "Welcome to CHOYON//NEXUS." },
    aboutTitle: { type: String, default: "Behind the profile" },
    aboutStory: { type: String, default: "" },
    academicBackground: { type: String, default: "" },
    researchMotivation: { type: String, default: "" },
    developmentInterests: { type: String, default: "" },
    leadershipPhilosophy: { type: String, default: "" },
    communityVision: { type: String, default: "" },
    personalGoals: { type: String, default: "" },
    aboutGallery: { type: [mediaReferenceSchema2], default: [] },
    aboutMilestones: { type: [Schema5.Types.Mixed], default: [] },
    contactReasons: { type: [String], default: ["Research Collaboration", "Graduate Study Opportunity", "AI/ML Project", "Workshop or Speaking", "Community Initiative", "General Message"] },
    liveStatus: { type: Schema5.Types.Mixed, default: {} },
    gameConfig: { type: gameConfigSchema, default: {} },
    accent: { type: String, default: "#62f5d2" },
    secondaryAccent: { type: String, default: "#8f7cff" },
    footerText: { type: String, default: "Designed as an interactive research operating system." },
    seoTitle: { type: String, default: "Choyon Dhor" },
    seoDescription: { type: String, default: "Interactive portfolio of Choyon Dhor, an AI and machine learning research aspirant." }
  },
  { timestamps: true, minimize: false }
);
var SiteSettings = model5("SiteSettings", siteSettingsSchema);

// apps/server/src/utils/asyncHandler.ts
var asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// apps/server/src/utils/media.ts
function getFileTypeFromMimeType(mimeType) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "image/gif") return "gif";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  return "external";
}
async function findMediaUsages(url) {
  const usages = [];
  const settings = await SiteSettings.findOne(
    {
      $or: [
        { profileImage: url },
        { alternateProfileImage: url },
        { transparentProfileImage: url },
        { "aboutGallery.url": url }
      ]
    },
    "siteName"
  ).lean();
  if (settings) usages.push("site settings");
  const items = await ContentItem.find(
    {
      $or: [
        { coverImage: url },
        { gallery: url },
        { "galleryItems.url": url }
      ]
    },
    "title type"
  ).lean();
  items.forEach((item) => usages.push(`${item.type}: ${item.title}`));
  const pages2 = await Page.find({ sections: { $elemMatch: { url } } }, "title").lean();
  pages2.forEach((page) => usages.push(`page: ${page.title}`));
  return usages;
}

// apps/server/src/validators/schemas.ts
import { z as z2 } from "zod";
var optionalDate = z2.union([z2.string().datetime(), z2.string().date(), z2.literal(""), z2.null()]).optional();
var safeUrl = z2.union([z2.string().url(), z2.string().startsWith("/"), z2.literal("")]);
var gameSourceTypes = [...contentTypes, "settings-stat", "settings-live-status", "custom"];
var mediaReferenceSchema3 = z2.object({
  assetId: z2.string().optional(),
  url: safeUrl.optional().default(""),
  thumbnailUrl: safeUrl.optional().default(""),
  altText: z2.string().max(300).optional().default(""),
  caption: z2.string().max(400).optional().default(""),
  description: z2.string().max(2e3).optional().default(""),
  category: z2.string().max(120).optional().default(""),
  credit: z2.string().max(180).optional().default(""),
  date: z2.string().max(80).optional().default(""),
  location: z2.string().max(180).optional().default(""),
  focalX: z2.coerce.number().min(0).max(100).optional().default(50),
  focalY: z2.coerce.number().min(0).max(100).optional().default(50),
  featured: z2.boolean().optional().default(false),
  order: z2.coerce.number().int().min(-1e4).max(1e4).optional().default(0)
});
var gameCollectibleSchema2 = z2.object({
  id: z2.string().min(1).max(120),
  label: z2.string().min(1).max(120),
  sourceType: z2.enum(gameSourceTypes),
  contentSlug: z2.string().max(180).optional().default(""),
  settingsKey: z2.string().max(180).optional().default(""),
  unlockMessage: z2.string().max(400).optional().default(""),
  order: z2.coerce.number().int().min(-1e4).max(1e4).optional().default(0),
  enabled: z2.boolean().optional().default(true)
});
var gameChapterSchema2 = z2.object({
  id: z2.string().min(1).max(120),
  title: z2.string().min(1).max(180),
  description: z2.string().max(400).optional().default(""),
  sourceType: z2.enum(gameSourceTypes).optional(),
  contentSlug: z2.string().max(180).optional().default(""),
  settingsKey: z2.string().max(180).optional().default(""),
  backgroundLabel: z2.string().max(180).optional().default(""),
  order: z2.coerce.number().int().min(-1e4).max(1e4).optional().default(0),
  enabled: z2.boolean().optional().default(true)
});
var gameConfigSchema2 = z2.object({
  enabled: z2.boolean().optional().default(true),
  title: z2.string().min(2).max(180).optional().default("Data Highway"),
  description: z2.string().max(1200).optional().default("Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content."),
  vehicleLabel: z2.string().max(120).optional().default("Nexus Runner"),
  difficulty: z2.enum(["easy", "normal", "hard"]).optional().default("normal"),
  speed: z2.coerce.number().min(2).max(12).optional().default(4),
  homepagePreviewEnabled: z2.boolean().optional().default(true),
  mobileSimplifiedMode: z2.boolean().optional().default(true),
  chapters: z2.array(gameChapterSchema2).optional().default([]),
  collectibles: z2.array(gameCollectibleSchema2).optional().default([]),
  missions: z2.array(z2.string().max(220)).optional().default([]),
  obstacles: z2.array(z2.string().max(220)).optional().default([]),
  rewards: z2.array(z2.string().max(220)).optional().default([])
});
var loginSchema = z2.object({
  email: z2.string().email(),
  password: z2.string().min(8)
});
var contentSchema = z2.object({
  type: z2.enum(contentTypes),
  title: z2.string().min(2).max(180),
  shortTitle: z2.string().max(120).optional().default(""),
  slug: z2.string().min(2).max(180).regex(/^[a-z0-9-]+$/),
  eyebrow: z2.string().max(120).optional().default(""),
  summary: z2.string().max(2e3).optional().default(""),
  content: z2.string().max(5e4).optional().default(""),
  category: z2.string().max(120).optional().default("General"),
  status: z2.string().max(120).optional().default("Published"),
  organization: z2.string().max(180).optional().default(""),
  location: z2.string().max(180).optional().default(""),
  startDate: optionalDate,
  endDate: optionalDate,
  publishedAt: optionalDate,
  featured: z2.boolean().optional().default(false),
  visible: z2.boolean().optional().default(true),
  order: z2.coerce.number().int().min(-1e4).max(1e4).optional().default(0),
  tags: z2.array(z2.string().max(80)).optional().default([]),
  technologies: z2.array(z2.string().max(80)).optional().default([]),
  metrics: z2.array(z2.object({ label: z2.string().max(80), value: z2.string().max(120) })).optional().default([]),
  links: z2.array(z2.object({ label: z2.string().max(80), url: safeUrl })).optional().default([]),
  coverImage: safeUrl.optional().default(""),
  coverImageAlt: z2.string().max(300).optional().default(""),
  coverImageCaption: z2.string().max(400).optional().default(""),
  gallery: z2.array(safeUrl).optional().default([]),
  galleryItems: z2.array(mediaReferenceSchema3).optional().default([]),
  relatedContentIds: z2.array(z2.string()).optional().default([]),
  seoTitle: z2.string().max(180).optional().default(""),
  seoDescription: z2.string().max(320).optional().default(""),
  metadata: z2.record(z2.string(), z2.unknown()).optional().default({})
});
var pageSchema2 = z2.object({
  slug: z2.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z2.string().min(2).max(180),
  eyebrow: z2.string().max(120).optional().default(""),
  subtitle: z2.string().max(300).optional().default(""),
  intro: z2.string().max(2e3).optional().default(""),
  seoTitle: z2.string().max(180).optional().default(""),
  seoDescription: z2.string().max(320).optional().default(""),
  visible: z2.boolean().optional().default(true),
  order: z2.coerce.number().int().optional().default(0),
  sections: z2.array(z2.unknown()).optional().default([])
});
var siteSettingsSchema2 = z2.object({
  siteName: z2.string().min(2).max(100),
  tagline: z2.string().max(180),
  heroTitle: z2.string().min(2).max(120),
  heroSubtitle: z2.string().max(180),
  heroSecondaryTitle: z2.string().max(180).optional().default(""),
  heroDescription: z2.string().max(2200),
  currentFocus: z2.string().max(220).optional().default(""),
  availabilityStatus: z2.string().max(220).optional().default(""),
  location: z2.string().max(180),
  email: z2.string().email(),
  availability: z2.string().max(180),
  profileImage: safeUrl,
  profileImageAlt: z2.string().max(300).optional().default(""),
  profileImageCaption: z2.string().max(400).optional().default(""),
  profileImageFocalX: z2.coerce.number().min(0).max(100).optional().default(50),
  profileImageFocalY: z2.coerce.number().min(0).max(100).optional().default(50),
  alternateProfileImage: safeUrl.optional().default(""),
  alternateProfileImageAlt: z2.string().max(300).optional().default(""),
  transparentProfileImage: safeUrl.optional().default(""),
  transparentProfileImageAlt: z2.string().max(300).optional().default(""),
  resumeUrl: safeUrl,
  heroPrimaryCtaLabel: z2.string().max(120).optional().default("Enter Research Lab"),
  heroPrimaryCtaUrl: z2.string().max(200).optional().default("/research"),
  heroSecondaryCtaLabel: z2.string().max(120).optional().default("Explore Projects"),
  heroSecondaryCtaUrl: z2.string().max(200).optional().default("/projects"),
  heroOrbitLabels: z2.array(z2.string().max(80)).optional().default([]),
  stats: z2.array(z2.record(z2.string(), z2.unknown())),
  socials: z2.array(z2.record(z2.string(), z2.unknown())),
  terminalGreeting: z2.string().max(500),
  aboutTitle: z2.string().max(180).optional().default(""),
  aboutStory: z2.string().max(6e3).optional().default(""),
  academicBackground: z2.string().max(3e3).optional().default(""),
  researchMotivation: z2.string().max(3e3).optional().default(""),
  developmentInterests: z2.string().max(3e3).optional().default(""),
  leadershipPhilosophy: z2.string().max(3e3).optional().default(""),
  communityVision: z2.string().max(3e3).optional().default(""),
  personalGoals: z2.string().max(3e3).optional().default(""),
  aboutGallery: z2.array(mediaReferenceSchema3).optional().default([]),
  aboutMilestones: z2.array(z2.record(z2.string(), z2.unknown())).optional().default([]),
  contactReasons: z2.array(z2.string().max(120)).optional().default([]),
  liveStatus: z2.record(z2.string(), z2.unknown()).optional().default({}),
  gameConfig: gameConfigSchema2.optional().default(() => ({
    enabled: true,
    title: "Data Highway",
    description: "Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content.",
    vehicleLabel: "Nexus Runner",
    difficulty: "normal",
    speed: 4,
    homepagePreviewEnabled: true,
    mobileSimplifiedMode: true,
    chapters: [],
    collectibles: [],
    missions: [],
    obstacles: [],
    rewards: []
  })),
  accent: z2.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryAccent: z2.string().regex(/^#[0-9a-fA-F]{6}$/),
  footerText: z2.string().max(500),
  seoTitle: z2.string().max(180),
  seoDescription: z2.string().max(320)
});
var contactSchema = z2.object({
  name: z2.string().min(2).max(120),
  email: z2.string().email(),
  organization: z2.string().max(160).optional().default(""),
  inquiryType: z2.string().min(2).max(120).optional().default("General Message"),
  subject: z2.string().min(3).max(180),
  message: z2.string().min(10).max(5e3),
  website: z2.string().max(0).optional()
});
var mediaAssetUpdateSchema = z2.object({
  altText: z2.string().max(300).optional(),
  caption: z2.string().max(400).optional(),
  description: z2.string().max(2e3).optional(),
  category: z2.string().max(120).optional(),
  credit: z2.string().max(180).optional(),
  date: z2.string().max(80).optional(),
  location: z2.string().max(180).optional(),
  focalX: z2.coerce.number().min(0).max(100).optional(),
  focalY: z2.coerce.number().min(0).max(100).optional()
});

// apps/server/src/routes/admin.ts
var router = Router();
router.use(requireAuth);
router.get("/dashboard", asyncHandler(async (_req, res) => {
  const [contentCounts, unreadMessages, totalPages, recentMessages, mediaCount] = await Promise.all([
    ContentItem.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    ContactMessage.countDocuments({ status: "new" }),
    Page.countDocuments(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    MediaAsset.countDocuments()
  ]);
  res.json({ contentCounts, unreadMessages, totalPages, recentMessages, mediaCount });
}));
router.get("/content", asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const items = await ContentItem.find(filter).sort({ order: 1, updatedAt: -1 }).lean();
  res.json({ items });
}));
router.post("/content", asyncHandler(async (req, res) => {
  const data = contentSchema.parse(req.body);
  const item = await ContentItem.create(normalizeDates(data));
  res.status(201).json({ item });
}));
router.put("/content/:id", asyncHandler(async (req, res) => {
  const data = contentSchema.parse(req.body);
  const item = await ContentItem.findByIdAndUpdate(req.params.id, normalizeDates(data), { new: true, runValidators: true });
  if (!item) throw new AppError(404, "Content item not found");
  res.json({ item });
}));
router.delete("/content/:id", asyncHandler(async (req, res) => {
  const item = await ContentItem.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError(404, "Content item not found");
  res.status(204).send();
}));
router.get("/pages", asyncHandler(async (_req, res) => {
  const pages2 = await Page.find().sort({ order: 1 }).lean();
  res.json({ pages: pages2 });
}));
router.post("/pages", asyncHandler(async (req, res) => {
  const page = await Page.create(pageSchema2.parse(req.body));
  res.status(201).json({ page });
}));
router.put("/pages/:id", asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, pageSchema2.parse(req.body), { new: true, runValidators: true });
  if (!page) throw new AppError(404, "Page not found");
  res.json({ page });
}));
router.delete("/pages/:id", asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) throw new AppError(404, "Page not found");
  res.status(204).send();
}));
router.get("/settings", asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: "primary" }).lean();
  res.json({ settings });
}));
router.put("/settings", asyncHandler(async (req, res) => {
  const data = siteSettingsSchema2.parse(req.body);
  const settings = await SiteSettings.findOneAndUpdate(
    { key: "primary" },
    { ...data, key: "primary" },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ settings });
}));
router.get("/messages", asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ messages });
}));
router.patch("/messages/:id", asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!["new", "read", "archived"].includes(status)) throw new AppError(400, "Invalid message status");
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!message) throw new AppError(404, "Message not found");
  res.json({ message });
}));
router.delete("/messages/:id", asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new AppError(404, "Message not found");
  res.status(204).send();
}));
router.post("/media", upload.fields([{ name: "file", maxCount: 1 }, { name: "files", maxCount: 12 }]), asyncHandler(async (req, res) => {
  const fileMap = req.files;
  const files = [...fileMap?.file || [], ...fileMap?.files || []];
  if (!files.length) throw new AppError(400, "No file uploaded");
  const assets = await Promise.all(files.map(async (file) => MediaAsset.create({
    filename: file.filename,
    originalName: file.originalname,
    url: `/uploads/${file.filename}`,
    thumbnailUrl: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    fileType: getFileTypeFromMimeType(file.mimetype),
    fileSize: file.size,
    uploadedBy: req.auth?.userId || ""
  })));
  res.status(201).json({ assets });
}));
router.get("/media", asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.fileType) filters.fileType = String(req.query.fileType);
  if (req.query.category) filters.category = String(req.query.category);
  if (req.query.search) {
    const regex = new RegExp(String(req.query.search), "i");
    filters.$or = [{ originalName: regex }, { filename: regex }, { caption: regex }, { altText: regex }, { description: regex }];
  }
  const assets = await MediaAsset.find(filters).sort({ createdAt: -1 }).lean();
  const withUsage = await Promise.all(assets.map(async (asset) => ({
    ...asset,
    usedBy: await findMediaUsages(asset.url)
  })));
  res.json({ assets: withUsage });
}));
router.patch("/media/:id", asyncHandler(async (req, res) => {
  const data = mediaAssetUpdateSchema.parse(req.body);
  const asset = await MediaAsset.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).lean();
  if (!asset) throw new AppError(404, "Media asset not found");
  res.json({ asset });
}));
router.delete("/media/:id", asyncHandler(async (req, res) => {
  const asset = await MediaAsset.findById(req.params.id).lean();
  if (!asset) throw new AppError(404, "Media asset not found");
  const usedBy = await findMediaUsages(asset.url);
  if (usedBy.length) throw new AppError(400, `Media is still in use by: ${usedBy.join(", ")}`);
  await MediaAsset.findByIdAndDelete(req.params.id);
  await fs.unlink(path3.resolve(uploadsDirectory, path3.basename(asset.filename))).catch(() => void 0);
  res.status(204).send();
}));
function normalizeDates(data) {
  const next = { ...data };
  for (const key of ["startDate", "endDate", "publishedAt"]) {
    if (next[key] === "" || next[key] === null) next[key] = void 0;
  }
  return next;
}
var admin_default = router;

// apps/server/src/routes/auth.ts
import { Router as Router2 } from "express";

// apps/server/src/models/User.ts
import bcrypt from "bcryptjs";
import { Schema as Schema6, model as model6 } from "mongoose";
var userSchema = new Schema6(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: Date
  },
  { timestamps: true }
);
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};
var User = model6("User", userSchema);

// apps/server/src/routes/auth.ts
var router2 = Router2();
router2.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !await user.comparePassword(password)) throw new AppError(401, "Invalid email or password");
  user.lastLoginAt = /* @__PURE__ */ new Date();
  await user.save();
  const token = signToken({ userId: user._id.toString(), role: "admin" });
  res.cookie("nexus_token", token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1e3,
    path: "/"
  });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));
router2.post("/logout", (_req, res) => {
  res.clearCookie("nexus_token", { path: "/" });
  res.status(204).send();
});
router2.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.userId).lean();
  if (!user) throw new AppError(401, "User no longer exists");
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));
var auth_default = router2;

// apps/server/src/routes/public.ts
import crypto2 from "node:crypto";
import { Router as Router3 } from "express";
import { rateLimit } from "express-rate-limit";
import mongoose3 from "mongoose";

// apps/server/src/data/seed.ts
import bcrypt2 from "bcryptjs";
import { pathToFileURL } from "node:url";
import mongoose2 from "mongoose";

// apps/server/src/config/db.ts
import mongoose from "mongoose";
var memoryServer = null;
async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.set("strictQuery", true);
  if (env.MONGODB_URI && env.MONGODB_URI.trim() && !env.MONGODB_URI.includes("YOUR_DB_USER")) {
    try {
      console.log("Connecting to primary MongoDB URI...");
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5e3
      });
      console.log(`MongoDB connected: ${mongoose.connection.name}`);
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`
[WARN] Primary MongoDB connection failed: ${message}`);
      if (process.env.VERCEL) {
        console.warn("[INFO] Vercel environment active. Serving starter data gracefully.\n");
        return;
      }
    }
  }
  if (process.env.VERCEL) {
    console.warn("[INFO] No MONGODB_URI configured in Vercel. Operating with in-memory starter data.");
    return;
  }
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB connected (In-Memory Fallback): ${mongoose.connection.name}`);
  } catch (memErr) {
    console.warn("Failed to start in-memory MongoDB, operating in memory-only mode:", memErr);
  }
}
async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

// apps/server/src/data/seed.ts
var pages = [
  { slug: "home", title: "Identity Core", eyebrow: "SYSTEM ONLINE", subtitle: "Researching intelligence. Engineering impact.", intro: "A professional interactive portfolio balancing research, engineering, leadership, writing and community contribution.", order: 0 },
  { slug: "about", title: "About the Researcher", eyebrow: "PERSONAL STORY", subtitle: "The person behind the portfolio.", intro: "Academic motivation, development interests, leadership philosophy and long-term goals.", order: 1 },
  { slug: "research", title: "Research Hub", eyebrow: "ACTIVE RESEARCH", subtitle: "Multiple research directions, current work and future ideas.", intro: "A growing research archive covering energy informatics, explainable AI, trustworthy systems and future graduate research directions.", order: 2 },
  { slug: "projects", title: "Project Garage", eyebrow: "BUILT SYSTEMS", subtitle: "Ideas engineered into useful products.", intro: "A portfolio of research-driven systems, prototypes and product experiments.", order: 3 },
  { slug: "publications", title: "Publication Archive", eyebrow: "RESEARCH OUTPUT", subtitle: "Manuscripts, presentations and academic communication.", intro: "Conference presentations, under-review manuscripts and future scholarly output.", order: 4 },
  { slug: "leadership", title: "Leadership Command", eyebrow: "MISSION CONTROL", subtitle: "People, programs and impact at scale.", intro: "Leadership roles, event case studies and community-building work.", order: 5 },
  { slug: "activities", title: "Activities and Involvement", eyebrow: "FIELD NOTES", subtitle: "Workshops, volunteer work, presentations and university activity.", intro: "A broader record of technical sessions, community initiatives, volunteering and campus programs.", order: 6 },
  { slug: "events", title: "Event Arena", eyebrow: "EVENT STORIES", subtitle: "Programs, festivals and collaborative efforts.", intro: "Event stories, roles, outcomes and behind-the-scenes work.", order: 7 },
  { slug: "awards", title: "Achievement Vault", eyebrow: "CREDENTIALS", subtitle: "Academic milestones, scholarships and recognition.", intro: "Evidence of academic consistency, leadership and contribution.", order: 8 },
  { slug: "blog", title: "Research Logs", eyebrow: "KNOWLEDGE STREAM", subtitle: "Writing on research, engineering and leadership.", intro: "Research notes, leadership lessons and thoughtful writing.", order: 9 },
  { slug: "contact", title: "Communication Portal", eyebrow: "OPEN CHANNEL", subtitle: "Start a meaningful collaboration.", intro: "For research collaboration, graduate study opportunities, AI/ML work and community initiatives.", order: 10 }
];
var content = [
  {
    type: "research",
    slug: "context-aware-stlf",
    title: "Context-Aware and Disturbance-Informed Short-Term Load Forecasting",
    shortTitle: "Context-Aware STLF",
    eyebrow: "CURRENT RESEARCH",
    summary: "A major research project studying how contextual and disturbance-aware features improve short-term load forecasting for Bangladesh power demand.",
    content: "Electricity demand changes with weather, holidays, Ramadan, load shedding, recovery behavior and social disruption. This research investigates how forecasting models can use contextual information more responsibly and remain useful across changing operating conditions.",
    category: "Energy Informatics",
    status: "Conference Presented",
    featured: true,
    order: 1,
    tags: ["Time Series", "Load Forecasting", "Context-Aware AI", "Energy Systems"],
    technologies: ["Python", "XGBoost", "LightGBM", "CatBoost", "GRU"],
    metrics: [
      { label: "Focus", value: "1-hour forecasting" },
      { label: "Model families", value: "Boosting + hybrid" },
      { label: "Manuscript", value: "Under Review" }
    ],
    links: [
      { label: "Research Hub", url: "/research/context-aware-stlf" }
    ],
    metadata: {
      problem: "Electricity demand is influenced by contextual factors such as holidays, weather, Ramadan, disturbances and recovery patterns.",
      objectives: [
        "Improve forecasting reliability with contextual features.",
        "Compare boosting and hybrid approaches under changing conditions.",
        "Support interpretable future extensions for energy systems."
      ],
      researchQuestions: [
        "Which contextual signals matter most for short-term load forecasting?",
        "How do disturbance-aware features change model behavior?",
        "Which model family balances accuracy and robustness best?"
      ],
      methodology: "Chronological validation, contextual feature engineering, comparative experimentation and reproducible evaluation.",
      datasets: ["Utility load data", "Calendar signals", "Weather features", "Disturbance annotations"],
      models: ["Naive persistence", "XGBoost", "Hour-specific XGBoost", "CatBoost", "GRU-LightGBM fusion"],
      progressSteps: [
        { label: "Literature Review", status: "Completed" },
        { label: "Data Preparation", status: "Completed" },
        { label: "Method Development", status: "Completed" },
        { label: "Experiments", status: "Completed" },
        { label: "Evaluation", status: "Completed" },
        { label: "Writing", status: "Completed" },
        { label: "Submission", status: "Completed" },
        { label: "Review", status: "Under Review" }
      ],
      publicationStatus: "Manuscript Under Review",
      conferenceStatus: "Conference Presented",
      resultsNote: "Results will be added as the research progresses and as public sharing becomes appropriate.",
      futureWork: ["Explainability", "Regime-aware models", "Transformer-based extensions"]
    }
  },
  {
    type: "research",
    slug: "explainable-energy-ai",
    title: "Explainable AI for Energy System Forecasting",
    shortTitle: "Explainable Energy AI",
    eyebrow: "FUTURE RESEARCH",
    summary: "A planned research direction focused on understanding why forecasting models shift their predictions under unusual operating conditions.",
    content: "This line of work explores how SHAP, attribution methods and interpretable modeling can make forecasting systems more transparent to researchers and operators.",
    category: "Explainable AI",
    status: "Planning",
    order: 2,
    tags: ["XAI", "SHAP", "Interpretability"],
    technologies: ["Python", "SHAP", "Feature Attribution"],
    metadata: {
      objectives: ["Interpret model behavior across contexts.", "Support trustworthy deployment."],
      futureWork: ["SHAP integration", "Local explanations", "Regime-aware attribution"]
    }
  },
  {
    type: "research",
    slug: "trustworthy-ai-for-resilient-energy-systems",
    title: "Trustworthy AI for Resilient Energy Systems",
    shortTitle: "Trustworthy Energy AI",
    eyebrow: "RESEARCH IDEA",
    summary: "A future direction on robustness, trust and decision support in intelligent energy systems.",
    content: "This idea explores reliability, transparency and human-centered decision support in energy-focused machine learning systems.",
    category: "Trustworthy AI",
    status: "Idea",
    order: 3,
    tags: ["Trustworthy AI", "Energy", "Future Work"]
  },
  {
    type: "publication",
    slug: "context-aware-stlf-manuscript",
    title: "Context-Aware and Disturbance-Informed Short-Term Load Forecasting: Comparative Study Manuscript",
    shortTitle: "STLF Manuscript",
    eyebrow: "MANUSCRIPT",
    summary: "The manuscript version of the short-term load forecasting study is currently under review.",
    content: "This manuscript extends the presented work into a fuller academic article. Public-facing claims should remain conservative until the review process is complete.",
    category: "Manuscript",
    status: "Under Review",
    featured: true,
    order: 1,
    tags: ["Under Review", "Load Forecasting", "Research Manuscript"],
    metrics: [
      { label: "Status", value: "Under Review" },
      { label: "Type", value: "Manuscript" }
    ],
    metadata: {
      authors: ["Choyon Dhor"],
      venue: "",
      doi: "",
      note: "Do not show this as published until the admin updates the status."
    }
  },
  {
    type: "publication",
    slug: "context-aware-stlf-conference-presentation",
    title: "Conference Presentation: Context-Aware and Disturbance-Informed Short-Term Load Forecasting",
    shortTitle: "STLF Presentation",
    eyebrow: "CONFERENCE PRESENTATION",
    summary: "The work was presented at a conference and is represented separately from the manuscript status.",
    content: "This entry documents the presentation version of the research, distinct from any manuscript or future publication status.",
    category: "Conference Presentation",
    status: "Conference Presented",
    order: 2,
    tags: ["Conference Presented", "Presentation"],
    metrics: [
      { label: "Status", value: "Conference Presented" },
      { label: "Format", value: "Presentation" }
    ]
  },
  {
    type: "project",
    slug: "stlf-forecasting-system",
    title: "Short-Term Load Forecasting System",
    eyebrow: "RESEARCH VEHICLE",
    summary: "A reproducible machine-learning pipeline for contextual load forecasting experiments.",
    content: "The system prepares time-series data, engineers contextual and disturbance features, trains multiple model families and compares them with chronological validation.",
    category: "Research Project",
    status: "Functional",
    featured: true,
    order: 1,
    technologies: ["Python", "Pandas", "XGBoost", "CatBoost", "LightGBM", "GRU"],
    tags: ["AI", "Energy", "Forecasting"],
    metrics: [
      { label: "Models", value: "5" },
      { label: "Validation", value: "Time-series CV" },
      { label: "Output", value: "1-hour forecast" }
    ]
  },
  {
    type: "project",
    slug: "findora",
    title: "Findora",
    eyebrow: "CAMPUS SYSTEM",
    summary: "A campus lost-and-found system focused on reporting, matching and recovery workflows.",
    content: "Findora replaces scattered social media posts with a structured reporting and management flow.",
    category: "Web Application",
    status: "In Development",
    featured: true,
    order: 2,
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    tags: ["Campus", "DBMS", "Community"]
  },
  {
    type: "project",
    slug: "mentor-ai",
    title: "Mentor.ai",
    eyebrow: "EDUCATION SYSTEM",
    summary: "An AI-assisted concept for student mentoring, guidance and academic support.",
    content: "A concept focused on reducing the gap between motivated students and reliable guidance.",
    category: "AI Product",
    status: "Planning",
    order: 3,
    technologies: ["Node.js", "MongoDB", "AI APIs"],
    tags: ["Education", "Mentorship", "AI"]
  },
  {
    type: "experience",
    slug: "cultural-secretary-mu-cse-society",
    title: "Cultural Secretary",
    eyebrow: "LEADERSHIP ROLE",
    summary: "Led volunteers and coordinated major university programs including MU CSE Fest 2025.",
    content: "Planned and executed university-wide programs, coordinated multiple organizing teams and helped deliver a large flagship event.",
    category: "Leadership",
    organization: "Metropolitan University CSE Society",
    status: "Completed",
    featured: true,
    order: 1,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    metrics: [
      { label: "Volunteers led", value: "70+" },
      { label: "Flagship event", value: "5 days" },
      { label: "Participants", value: "3,000+" }
    ]
  },
  {
    type: "experience",
    slug: "yunet-campus-coordinator",
    title: "Campus Coordinator",
    eyebrow: "COMMUNITY ROLE",
    summary: "Coordinates outreach, student engagement and skill-development initiatives.",
    category: "Community",
    organization: "Youth Upskill Network (YUNet)",
    status: "Active",
    order: 2,
    startDate: "2026-01-01"
  },
  {
    type: "activity",
    slug: "conference-presentation-session",
    title: "Research Conference Presentation Session",
    eyebrow: "ACADEMIC ACTIVITY",
    summary: "Presented current forecasting work in a conference setting and communicated methodology and findings.",
    content: "This activity captures the presentation aspect of the research journey and the broader experience of academic communication.",
    category: "Conference",
    organization: "Research Conference",
    status: "Completed",
    featured: true,
    order: 1,
    tags: ["Presentation", "Research", "Academic Communication"]
  },
  {
    type: "activity",
    slug: "flood-response-volunteering",
    title: "Flood Response Volunteering",
    eyebrow: "COMMUNITY SERVICE",
    summary: "Supported relief coordination and affected communities during major flooding in Sylhet.",
    content: "A record of disaster response support and field-level community engagement.",
    category: "Volunteer",
    organization: "Metropolitan University Disaster Response Unit",
    location: "Sylhet, Bangladesh",
    status: "Completed",
    order: 2,
    tags: ["Relief", "Volunteer", "Community"]
  },
  {
    type: "activity",
    slug: "bdapps-campus-ambassador-activities",
    title: "bdapps Campus Ambassador Activities",
    eyebrow: "CAMPUS ACTIVITY",
    summary: "Organized awareness, outreach and technical engagement activities for innovation programs.",
    content: "A cluster of activities connecting students with digital innovation opportunities and programs.",
    category: "Workshop",
    organization: "bdapps",
    status: "Active",
    order: 3,
    tags: ["Campus Ambassador", "Outreach", "Innovation"]
  },
  {
    type: "event",
    slug: "mu-cse-fest-2025",
    title: "MU CSE Fest 2025",
    eyebrow: "FLAGSHIP EVENT",
    summary: "A five-day national technology festival with broad participation and multiple technical tracks.",
    content: "The festival included programming contests, project showcases, technical sessions, workshops and cultural segments.",
    category: "Technology Festival",
    organization: "MU CSE Society",
    location: "Sylhet, Bangladesh",
    status: "Completed",
    featured: true,
    order: 1,
    startDate: "2025-01-01",
    metrics: [
      { label: "Duration", value: "5 days" },
      { label: "Participants", value: "3,000+" },
      { label: "Volunteer team", value: "70+" }
    ],
    tags: ["Programming Contest", "Workshops", "Technical Sessions", "Culture"]
  },
  {
    type: "achievement",
    slug: "cgpa-399",
    title: "CGPA 3.99 / 4.00",
    eyebrow: "ACADEMIC SIGNAL",
    summary: "Sustained academic excellence in the B.Sc. in Computer Science and Engineering program.",
    category: "Academic",
    status: "Current",
    featured: true,
    order: 1,
    metrics: [{ label: "CGPA", value: "3.99/4.00" }, { label: "Program", value: "CSE" }]
  },
  { type: "achievement", slug: "vice-chancellor-scholarship-second-year", title: "Vice Chancellor Scholarship", eyebrow: "MERIT AWARD", summary: "Awarded for outstanding academic performance in the second year.", category: "Scholarship", status: "Awarded", order: 2 },
  { type: "achievement", slug: "chairman-scholarship-third-year", title: "Chairman Scholarship", eyebrow: "MERIT AWARD", summary: "Awarded for sustained academic excellence in the third year.", category: "Scholarship", status: "Awarded", order: 3 },
  { type: "education", slug: "bsc-cse-metropolitan-university", title: "B.Sc. in Computer Science and Engineering", eyebrow: "ACADEMIC CORE", summary: "Final-year undergraduate with interests in AI, machine learning and energy informatics.", category: "Degree", organization: "Metropolitan University, Bangladesh", location: "Sylhet, Bangladesh", status: "In Progress", order: 1, metrics: [{ label: "CGPA", value: "3.99/4.00" }, { label: "Expected graduation", value: "2026-2027" }] },
  { type: "skill", slug: "machine-learning", title: "Machine Learning", eyebrow: "CAPABILITY", summary: "Evidence-backed experience in feature engineering, model evaluation and forecasting workflows.", category: "AI and Data", status: "Used in Research", order: 1, technologies: ["Scikit-learn", "XGBoost", "LightGBM", "CatBoost"] },
  { type: "skill", slug: "programming", title: "Programming", eyebrow: "CAPABILITY", summary: "Problem solving and software development across multiple paradigms.", category: "Engineering", status: "Academic Experience", order: 2, technologies: ["Python", "C", "C++", "Java", "SQL"] },
  {
    type: "blog",
    slug: "why-context-matters-in-load-forecasting",
    title: "Why Context Matters in Load Forecasting",
    eyebrow: "RESEARCH LOG 001",
    summary: "Weather alone does not explain electricity demand; context and recovery behavior matter too.",
    content: "A useful forecasting system must understand not only the recent load curve but also the context around it. Holidays change routines, storms affect demand and generation, load shedding creates artificial dips, and recovery periods can produce rebounds. Context-aware feature design helps a model distinguish these regimes instead of treating every hour as statistically identical.",
    category: "AI Research",
    status: "Published",
    featured: true,
    order: 1,
    publishedAt: "2026-06-01",
    tags: ["STLF", "Context-Aware AI", "Energy"]
  },
  {
    type: "blog",
    slug: "lessons-from-leading-seventy-volunteers",
    title: "Lessons from Leading 70+ Volunteers",
    eyebrow: "LEADERSHIP LOG 002",
    summary: "Large events succeed when responsibilities are visible, communication is structured and people feel ownership.",
    content: "Leading a large volunteer team is less about giving orders and more about designing a clear operating system. Every team needs a mission, an owner, a deadline and a communication channel. When those elements are visible, people can solve problems without waiting for constant approval.",
    category: "Leadership",
    status: "Published",
    order: 2,
    publishedAt: "2026-05-10",
    tags: ["Leadership", "Events", "Teamwork"]
  },
  { type: "timeline", slug: "complete-undergraduate-thesis", title: "Complete Undergraduate Thesis", eyebrow: "2026 MISSION", summary: "Finish the current thesis work with reproducible experiments and strong documentation.", category: "Short Term", status: "Active", order: 1, startDate: "2026-01-01" },
  { type: "timeline", slug: "journal-submission", title: "Future Journal Submission", eyebrow: "NEXT RESEARCH STEP", summary: "Extend current work into a stronger submission when the research is ready.", category: "Short Term", status: "Planned", order: 2, startDate: "2026-07-01" },
  { type: "timeline", slug: "fully-funded-european-masters", title: "Fully Funded European Masters", eyebrow: "FUTURE HORIZON", summary: "Pursue advanced study in AI, machine learning or intelligent systems.", category: "Medium Term", status: "Planned", order: 3, startDate: "2027-01-01" }
];
var initialSiteSettings = {
  key: "primary",
  siteName: "CHOYON//NEXUS",
  tagline: "Researching Intelligence. Engineering Impact.",
  heroTitle: "Choyon Dhor",
  heroSubtitle: "AI and Machine Learning Research Aspirant",
  heroSecondaryTitle: "Researcher \uFFFD Developer \uFFFD Community Builder",
  heroDescription: "Final-year CSE undergraduate building research-driven systems across AI, energy, software and community impact.",
  currentFocus: "Balancing research, project development, academic excellence and community contribution.",
  availabilityStatus: "Open to research collaboration and graduate opportunities",
  location: "Sylhet, Bangladesh",
  email: "choyondhorshu@gmail.com",
  availability: "Available for meaningful collaboration",
  profileImage: "",
  profileImageAlt: "",
  profileImageCaption: "",
  profileImageFocalX: 50,
  profileImageFocalY: 30,
  alternateProfileImage: "",
  alternateProfileImageAlt: "",
  transparentProfileImage: "",
  transparentProfileImageAlt: "",
  resumeUrl: "",
  heroPrimaryCtaLabel: "Enter Research Lab",
  heroPrimaryCtaUrl: "/research",
  heroSecondaryCtaLabel: "Explore Projects",
  heroSecondaryCtaUrl: "/projects",
  heroOrbitLabels: ["Time-Series Forecasting", "Explainable AI", "Energy Informatics", "Machine Learning", "Leadership", "Product Building"],
  stats: [
    { label: "CGPA", value: "3.99/4.00" },
    { label: "Merit Scholarships", value: "3" },
    { label: "Conference Presentation", value: "1" },
    { label: "Volunteers Led", value: "70+" }
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/Choyon-Dhor" },
    { label: "LinkedIn", url: "https://linkedin.com/in/choyondhor" },
    { label: "Email", url: "mailto:choyondhorshu@gmail.com" },
    { label: "Google Scholar", url: "" },
    { label: "ResearchGate", url: "" }
  ],
  terminalGreeting: "Welcome, explorer. You are connected to Choyon Dhor's interactive researcher operating system.",
  aboutTitle: "Behind the profile",
  aboutStory: "I am a final-year Computer Science and Engineering undergraduate who cares deeply about research, useful software, disciplined execution and human impact. I enjoy building systems that connect technical rigor with real people and real problems.",
  academicBackground: "My academic foundation is rooted in computer science fundamentals, machine learning, problem solving and research-oriented learning.",
  researchMotivation: "I am especially motivated by research that makes intelligent systems more context-aware, practical and trustworthy.",
  developmentInterests: "I enjoy turning ideas into working systems, from research prototypes to product concepts and interactive experiences.",
  leadershipPhilosophy: "Leadership means creating clarity, ownership and momentum so that people can do their best work together.",
  communityVision: "I want technology, research and student leadership to create opportunity, confidence and long-term impact for others.",
  personalGoals: "My long-term goal is to grow into a strong AI systems researcher while continuing to build products and communities that matter.",
  aboutGallery: [],
  aboutMilestones: [
    { title: "Academic Excellence", detail: "Maintained a 3.99/4.00 CGPA in CSE." },
    { title: "Research Communication", detail: "Presented current research work in a conference setting." },
    { title: "Leadership Impact", detail: "Contributed to a large university technology festival." }
  ],
  contactReasons: ["Research Collaboration", "Graduate Study Opportunity", "AI/ML Project", "Workshop or Speaking", "Community Initiative", "General Message"],
  liveStatus: {
    currentResearch: "Context-aware forecasting and future explainable AI extensions",
    currentProject: "Portfolio reconstruction and research-driven system building",
    currentLearningGoal: "Trustworthy AI and stronger research communication",
    currentResponsibility: "Academic work, leadership and community contribution"
  },
  accent: "#8f7cff",
  secondaryAccent: "#65d9ff",
  footerText: "Designed as an interactive researcher operating system.",
  seoTitle: "Choyon Dhor",
  seoDescription: "Interactive portfolio of Choyon Dhor: research, projects, leadership, activities, achievements and future goals."
};
async function seed() {
  await connectDatabase();
  await Promise.all([
    User.deleteMany({}),
    Page.deleteMany({}),
    SiteSettings.deleteMany({}),
    ContentItem.deleteMany({}),
    ContactMessage.deleteMany({}),
    MediaAsset.deleteMany({})
  ]);
  const passwordHash = await bcrypt2.hash(env.ADMIN_PASSWORD, 12);
  await User.create({ name: env.ADMIN_NAME, email: env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: "admin" });
  await SiteSettings.create(initialSiteSettings);
  await Page.insertMany(pages);
  await ContentItem.insertMany(content);
  console.log(`Seeded ${pages.length} pages and ${content.length} content records.`);
  console.log(`Admin login: ${env.ADMIN_EMAIL}`);
  await disconnectDatabase();
}
async function ensureInitialData() {
  if (mongoose2.connection.readyState < 1) {
    return;
  }
  const passwordHash = await bcrypt2.hash(env.ADMIN_PASSWORD, 12);
  if (await User.countDocuments() === 0) {
    await User.create({ name: env.ADMIN_NAME, email: env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: "admin" });
  }
  if (await SiteSettings.countDocuments() === 0) {
    await SiteSettings.create(initialSiteSettings);
  } else {
    await SiteSettings.updateOne({ key: "primary" }, { $set: { seoTitle: "Choyon Dhor" } });
  }
  if (await Page.countDocuments() === 0) await Page.insertMany(pages);
  if (await ContentItem.countDocuments() === 0) await ContentItem.insertMany(content);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(async (error) => {
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
}

// apps/server/src/routes/public.ts
var router3 = Router3();
router3.get("/bootstrap", asyncHandler(async (_req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const [settings, pages2, items] = await Promise.all([
        SiteSettings.findOne({ key: "primary" }).lean(),
        Page.find({ visible: true }).sort({ order: 1, title: 1 }).lean(),
        ContentItem.find({ visible: true }).sort({ order: 1, startDate: -1, createdAt: -1 }).lean()
      ]);
      if (settings && pages2.length > 0) {
        return res.json({ settings, pages: pages2, items });
      }
    }
  } catch (err) {
    console.warn("MongoDB query failed during bootstrap, serving starter data:", err);
  }
  return res.json({
    settings: initialSiteSettings,
    pages,
    items: content
  });
}));
router3.get("/content", asyncHandler(async (req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const filter = { visible: true };
      if (req.query.type) filter.type = req.query.type;
      if (req.query.featured === "true") filter.featured = true;
      const items2 = await ContentItem.find(filter).sort({ order: 1, startDate: -1, createdAt: -1 }).lean();
      return res.json({ items: items2 });
    }
  } catch (err) {
    console.warn("MongoDB query failed during content list, serving fallback:", err);
  }
  let items = content;
  if (req.query.type) items = items.filter((item) => item.type === req.query.type);
  if (req.query.featured === "true") items = items.filter((item) => item.featured);
  return res.json({ items });
}));
router3.get("/content/:type/:slug", asyncHandler(async (req, res) => {
  try {
    if (mongoose3.connection.readyState >= 1) {
      const item = await ContentItem.findOne({ type: req.params.type, slug: req.params.slug, visible: true }).lean();
      if (item) return res.json({ item });
    }
  } catch (err) {
    console.warn("MongoDB query failed during item fetch, searching fallback:", err);
  }
  const fallback = content.find((item) => item.type === req.params.type && item.slug === req.params.slug);
  if (!fallback) throw new AppError(404, "Content not found");
  return res.json({ item: fallback });
}));
var contactLimiter = rateLimit({ windowMs: 15 * 60 * 1e3, limit: 5, standardHeaders: "draft-8", legacyHeaders: false });
router3.post("/contact", contactLimiter, asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const ipHash = crypto2.createHash("sha256").update(req.ip ?? "unknown").digest("hex").slice(0, 20);
  try {
    if (mongoose3.connection.readyState >= 1) {
      const message = await ContactMessage.create({ ...data, ipHash });
      return res.status(201).json({ id: message._id, message: "Transmission received successfully." });
    }
  } catch (err) {
    console.warn("Contact message could not be saved to DB:", err);
  }
  return res.status(201).json({ id: "local-" + Date.now(), message: "Transmission received successfully." });
}));
var public_default = router3;

// apps/server/src/app.ts
var app = express();
var clientOrigins = env.CLIENT_URL.split(",").map((value) => value.trim()).filter(Boolean);
var publicOrigin = clientOrigins[0] || "http://localhost:5173";
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(rateLimit2({ windowMs: 15 * 60 * 1e3, limit: 500, standardHeaders: "draft-8", legacyHeaders: false }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(uploadsDirectory, { maxAge: "7d", immutable: true }));
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *
Allow: /
Sitemap: ${publicOrigin.replace(/\/$/, "")}/sitemap.xml
`);
});
app.get("/sitemap.xml", asyncHandler(async (_req, res) => {
  const [pages2, items] = await Promise.all([
    Page.find({ visible: true }).sort({ order: 1, title: 1 }).lean(),
    ContentItem.find({ visible: true }).sort({ order: 1, updatedAt: -1 }).lean()
  ]);
  const routes = [
    { path: "/", updatedAt: (/* @__PURE__ */ new Date()).toISOString() },
    ...pages2.map((page) => ({
      path: page.slug === "home" ? "/" : `/${page.slug}`,
      updatedAt: page.updatedAt instanceof Date ? page.updatedAt.toISOString() : new Date(page.updatedAt || Date.now()).toISOString()
    })),
    ...items.map((item) => {
      const section = getContentPath(item.type, item.slug);
      if (!section) return null;
      return {
        path: section,
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : new Date(item.updatedAt || Date.now()).toISOString()
      };
    }).filter((entry) => Boolean(entry))
  ];
  const uniqueRoutes = Array.from(new Map(routes.map((route) => [route.path, route])).values());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map((route) => `  <url>
    <loc>${escapeXml(`${publicOrigin.replace(/\/$/, "")}${route.path}`)}</loc>
    <lastmod>${route.updatedAt}</lastmod>
  </url>`).join("\n")}
</urlset>`;
  res.type("application/xml").send(xml);
}));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "choyon-nexus-api", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
app.use("/api/auth", auth_default);
app.use("/api/public", public_default);
app.use("/api/admin", admin_default);
app.use(notFound);
app.use(errorHandler);
function getContentPath(type, slug) {
  switch (type) {
    case "research":
      return `/research/${slug}`;
    case "project":
      return `/projects/${slug}`;
    case "publication":
      return `/publications/${slug}`;
    case "experience":
      return `/leadership/${slug}`;
    case "activity":
      return `/activities/${slug}`;
    case "event":
      return `/events/${slug}`;
    case "achievement":
      return `/awards/${slug}`;
    case "skill":
      return `/skills/${slug}`;
    case "education":
      return `/education/${slug}`;
    case "blog":
      return `/blog/${slug}`;
    default:
      return null;
  }
}
function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// api/serverless.ts
import mongoose4 from "mongoose";
var initPromise = null;
async function init() {
  await connectDatabase();
  if (mongoose4.connection.readyState >= 1) {
    await ensureInitialData();
  }
}
async function handler(req, res) {
  const matchedPath = req.headers && (req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"]);
  if (matchedPath && typeof matchedPath === "string") {
    if (matchedPath.startsWith("/public") || matchedPath.startsWith("/auth") || matchedPath.startsWith("/admin") || matchedPath.startsWith("/health")) {
      req.url = "/api" + matchedPath;
    } else if (matchedPath.startsWith("/api")) {
      req.url = matchedPath;
    }
  } else if (req.url && typeof req.url === "string") {
    if (req.url.startsWith("/public") || req.url.startsWith("/auth") || req.url.startsWith("/admin") || req.url.startsWith("/health")) {
      req.url = "/api" + req.url;
    }
  }
  if (!initPromise) {
    initPromise = init().catch((err) => {
      console.warn("Database initialization warning:", err);
      initPromise = null;
    });
  }
  try {
    await Promise.race([
      initPromise,
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);
  } catch {
  }
  return app(req, res);
}
export {
  handler as default
};
