import { Schema, model } from 'mongoose';

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

const gameCollectibleSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    sourceType: { type: String, default: 'custom' },
    contentSlug: { type: String, default: '' },
    settingsKey: { type: String, default: '' },
    unlockMessage: { type: String, default: '' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const gameChapterSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    sourceType: { type: String, default: '' },
    contentSlug: { type: String, default: '' },
    settingsKey: { type: String, default: '' },
    backgroundLabel: { type: String, default: '' },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const gameConfigSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: 'Data Highway' },
    description: { type: String, default: 'Drive through the portfolio journey and collect verified signals connected to real MongoDB-backed content.' },
    vehicleLabel: { type: String, default: 'Nexus Runner' },
    difficulty: { type: String, default: 'normal' },
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

const siteSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: 'primary' },
    siteName: { type: String, default: 'CHOYON//NEXUS' },
    tagline: { type: String, default: 'Researching Intelligence. Engineering Impact.' },
    heroTitle: { type: String, default: 'Choyon Dhor' },
    heroSubtitle: { type: String, default: 'AI & Machine Learning Research Aspirant' },
    heroSecondaryTitle: { type: String, default: 'Researcher • Developer • Community Builder' },
    heroDescription: { type: String, default: '' },
    currentFocus: { type: String, default: '' },
    availabilityStatus: { type: String, default: 'Open to collaboration' },
    location: { type: String, default: 'Sylhet, Bangladesh' },
    email: { type: String, default: 'choyondhorshu@gmail.com' },
    availability: { type: String, default: 'Open to research collaboration' },
    profileImage: { type: String, default: '' },
    profileImageAlt: { type: String, default: '' },
    profileImageCaption: { type: String, default: '' },
    profileImageFocalX: { type: Number, default: 50 },
    profileImageFocalY: { type: Number, default: 50 },
    alternateProfileImage: { type: String, default: '' },
    alternateProfileImageAlt: { type: String, default: '' },
    transparentProfileImage: { type: String, default: '' },
    transparentProfileImageAlt: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    heroPrimaryCtaLabel: { type: String, default: 'Enter Research Lab' },
    heroPrimaryCtaUrl: { type: String, default: '/research' },
    heroSecondaryCtaLabel: { type: String, default: 'Explore Projects' },
    heroSecondaryCtaUrl: { type: String, default: '/projects' },
    heroOrbitLabels: { type: [String], default: [] },
    stats: { type: [Schema.Types.Mixed], default: [] },
    socials: { type: [Schema.Types.Mixed], default: [] },
    terminalGreeting: { type: String, default: 'Welcome to CHOYON//NEXUS.' },
    aboutTitle: { type: String, default: 'Behind the profile' },
    aboutStory: { type: String, default: '' },
    academicBackground: { type: String, default: '' },
    researchMotivation: { type: String, default: '' },
    developmentInterests: { type: String, default: '' },
    leadershipPhilosophy: { type: String, default: '' },
    communityVision: { type: String, default: '' },
    personalGoals: { type: String, default: '' },
    aboutGallery: { type: [mediaReferenceSchema], default: [] },
    aboutMilestones: { type: [Schema.Types.Mixed], default: [] },
    contactReasons: { type: [String], default: ['Research Collaboration', 'Graduate Study Opportunity', 'AI/ML Project', 'Workshop or Speaking', 'Community Initiative', 'General Message'] },
    liveStatus: { type: Schema.Types.Mixed, default: {} },
    gameConfig: { type: gameConfigSchema, default: {} },
    accent: { type: String, default: '#62f5d2' },
    secondaryAccent: { type: String, default: '#8f7cff' },
    footerText: { type: String, default: 'Designed as an interactive research operating system.' },
    seoTitle: { type: String, default: 'Choyon Dhor' },
    seoDescription: { type: String, default: 'Interactive portfolio of Choyon Dhor, an AI and machine learning research aspirant.' }
  },
  { timestamps: true, minimize: false }
);

export const SiteSettings = model('SiteSettings', siteSettingsSchema);
