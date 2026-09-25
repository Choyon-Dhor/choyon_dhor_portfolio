import { z } from 'zod';
import { contentTypes } from '../models/ContentItem.js';

const optionalDate = z.union([z.string().datetime(), z.string().date(), z.literal(''), z.null()]).optional();
const safeUrl = z.union([z.string().url(), z.string().startsWith('/'), z.literal('')]);
const gameSourceTypes = [...contentTypes, 'settings-stat', 'settings-live-status', 'custom'] as const;

const mediaReferenceSchema = z.object({
  assetId: z.string().optional(),
  url: safeUrl.optional().default(''),
  thumbnailUrl: safeUrl.optional().default(''),
  altText: z.string().max(300).optional().default(''),
  caption: z.string().max(400).optional().default(''),
  description: z.string().max(2000).optional().default(''),
  category: z.string().max(120).optional().default(''),
  credit: z.string().max(180).optional().default(''),
  date: z.string().max(80).optional().default(''),
  location: z.string().max(180).optional().default(''),
  focalX: z.coerce.number().min(0).max(100).optional().default(50),
  focalY: z.coerce.number().min(0).max(100).optional().default(50),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().int().min(-10000).max(10000).optional().default(0)
});

export const gameCollectibleSchema = z.object({
  id: z.string().min(1).max(120),
  label: z.string().min(1).max(120),
  sourceType: z.enum(gameSourceTypes),
  contentSlug: z.string().max(180).optional().default(''),
  settingsKey: z.string().max(180).optional().default(''),
  unlockMessage: z.string().max(400).optional().default(''),
  order: z.coerce.number().int().min(-10000).max(10000).optional().default(0),
  enabled: z.boolean().optional().default(true)
});

export const gameChapterSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().min(1).max(180),
  description: z.string().max(400).optional().default(''),
  sourceType: z.enum(gameSourceTypes).optional(),
  contentSlug: z.string().max(180).optional().default(''),
  settingsKey: z.string().max(180).optional().default(''),
  backgroundLabel: z.string().max(180).optional().default(''),
  order: z.coerce.number().int().min(-10000).max(10000).optional().default(0),
  enabled: z.boolean().optional().default(true)
});

export const gameConfigSchema = z.object({
  enabled: z.boolean().optional().default(true),
  title: z.string().min(2).max(180).optional().default('Data Highway'),
  description: z.string().max(1200).optional().default('Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content.'),
  vehicleLabel: z.string().max(120).optional().default('Nexus Runner'),
  difficulty: z.enum(['easy', 'normal', 'hard']).optional().default('normal'),
  speed: z.coerce.number().min(2).max(12).optional().default(4),
  homepagePreviewEnabled: z.boolean().optional().default(true),
  mobileSimplifiedMode: z.boolean().optional().default(true),
  chapters: z.array(gameChapterSchema).optional().default([]),
  collectibles: z.array(gameCollectibleSchema).optional().default([]),
  missions: z.array(z.string().max(220)).optional().default([]),
  obstacles: z.array(z.string().max(220)).optional().default([]),
  rewards: z.array(z.string().max(220)).optional().default([])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const contentSchema = z.object({
  type: z.enum(contentTypes),
  title: z.string().min(2).max(180),
  shortTitle: z.string().max(120).optional().default(''),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9-]+$/),
  eyebrow: z.string().max(120).optional().default(''),
  summary: z.string().max(2000).optional().default(''),
  content: z.string().max(50000).optional().default(''),
  category: z.string().max(120).optional().default('General'),
  status: z.string().max(120).optional().default('Published'),
  organization: z.string().max(180).optional().default(''),
  location: z.string().max(180).optional().default(''),
  startDate: optionalDate,
  endDate: optionalDate,
  publishedAt: optionalDate,
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.coerce.number().int().min(-10000).max(10000).optional().default(0),
  tags: z.array(z.string().max(80)).optional().default([]),
  technologies: z.array(z.string().max(80)).optional().default([]),
  metrics: z.array(z.object({ label: z.string().max(80), value: z.string().max(120) })).optional().default([]),
  links: z.array(z.object({ label: z.string().max(80), url: safeUrl })).optional().default([]),
  coverImage: safeUrl.optional().default(''),
  coverImageAlt: z.string().max(300).optional().default(''),
  coverImageCaption: z.string().max(400).optional().default(''),
  gallery: z.array(safeUrl).optional().default([]),
  galleryItems: z.array(mediaReferenceSchema).optional().default([]),
  relatedContentIds: z.array(z.string()).optional().default([]),
  seoTitle: z.string().max(180).optional().default(''),
  seoDescription: z.string().max(320).optional().default(''),
  metadata: z.record(z.string(), z.unknown()).optional().default({})
});

export const pageSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(180),
  eyebrow: z.string().max(120).optional().default(''),
  subtitle: z.string().max(300).optional().default(''),
  intro: z.string().max(2000).optional().default(''),
  seoTitle: z.string().max(180).optional().default(''),
  seoDescription: z.string().max(320).optional().default(''),
  visible: z.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),
  sections: z.array(z.unknown()).optional().default([])
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2).max(100),
  tagline: z.string().max(180),
  heroTitle: z.string().min(2).max(120),
  heroSubtitle: z.string().max(180),
  heroSecondaryTitle: z.string().max(180).optional().default(''),
  heroDescription: z.string().max(2200),
  currentFocus: z.string().max(220).optional().default(''),
  availabilityStatus: z.string().max(220).optional().default(''),
  location: z.string().max(180),
  email: z.string().email(),
  availability: z.string().max(180),
  profileImage: safeUrl,
  profileImageAlt: z.string().max(300).optional().default(''),
  profileImageCaption: z.string().max(400).optional().default(''),
  profileImageFocalX: z.coerce.number().min(0).max(100).optional().default(50),
  profileImageFocalY: z.coerce.number().min(0).max(100).optional().default(50),
  alternateProfileImage: safeUrl.optional().default(''),
  alternateProfileImageAlt: z.string().max(300).optional().default(''),
  transparentProfileImage: safeUrl.optional().default(''),
  transparentProfileImageAlt: z.string().max(300).optional().default(''),
  resumeUrl: safeUrl,
  heroPrimaryCtaLabel: z.string().max(120).optional().default('Enter Research Lab'),
  heroPrimaryCtaUrl: z.string().max(200).optional().default('/research'),
  heroSecondaryCtaLabel: z.string().max(120).optional().default('Explore Projects'),
  heroSecondaryCtaUrl: z.string().max(200).optional().default('/projects'),
  heroOrbitLabels: z.array(z.string().max(80)).optional().default([]),
  stats: z.array(z.record(z.string(), z.unknown())),
  socials: z.array(z.record(z.string(), z.unknown())),
  terminalGreeting: z.string().max(500),
  aboutTitle: z.string().max(180).optional().default(''),
  aboutStory: z.string().max(6000).optional().default(''),
  academicBackground: z.string().max(3000).optional().default(''),
  researchMotivation: z.string().max(3000).optional().default(''),
  developmentInterests: z.string().max(3000).optional().default(''),
  leadershipPhilosophy: z.string().max(3000).optional().default(''),
  communityVision: z.string().max(3000).optional().default(''),
  personalGoals: z.string().max(3000).optional().default(''),
  aboutGallery: z.array(mediaReferenceSchema).optional().default([]),
  aboutMilestones: z.array(z.record(z.string(), z.unknown())).optional().default([]),
  contactReasons: z.array(z.string().max(120)).optional().default([]),
  liveStatus: z.record(z.string(), z.unknown()).optional().default({}),
  gameConfig: gameConfigSchema.optional().default(() => ({
    enabled: true,
    title: 'Data Highway',
    description: 'Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content.',
    vehicleLabel: 'Nexus Runner',
    difficulty: 'normal' as const,
    speed: 4,
    homepagePreviewEnabled: true,
    mobileSimplifiedMode: true,
    chapters: [],
    collectibles: [],
    missions: [],
    obstacles: [],
    rewards: []
  })),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryAccent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  footerText: z.string().max(500),
  seoTitle: z.string().max(180),
  seoDescription: z.string().max(320)
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  organization: z.string().max(160).optional().default(''),
  inquiryType: z.string().min(2).max(120).optional().default('General Message'),
  subject: z.string().min(3).max(180),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional()
});

export const mediaAssetUpdateSchema = z.object({
  altText: z.string().max(300).optional(),
  caption: z.string().max(400).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().max(120).optional(),
  credit: z.string().max(180).optional(),
  date: z.string().max(80).optional(),
  location: z.string().max(180).optional(),
  focalX: z.coerce.number().min(0).max(100).optional(),
  focalY: z.coerce.number().min(0).max(100).optional()
});

