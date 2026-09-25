export type ContentType = 'research' | 'project' | 'publication' | 'experience' | 'activity' | 'event' | 'achievement' | 'skill' | 'education' | 'blog' | 'timeline';

export interface Metric { label: string; value: string }
export interface ItemLink { label: string; url: string }
export type GameSourceType = ContentType | 'settings-stat' | 'settings-live-status' | 'custom';

export interface MediaAsset {
  _id?: string;
  assetId?: string;
  filename?: string;
  originalName?: string;
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  fileType?: 'image' | 'video' | 'gif' | 'pdf' | 'presentation' | 'external';
  fileSize?: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
  description?: string;
  category?: string;
  credit?: string;
  date?: string;
  location?: string;
  focalX?: number;
  focalY?: number;
  externalUrl?: string;
  featured?: boolean;
  order?: number;
  usedBy?: string[];
}

export interface GameCollectibleConfig {
  id: string;
  label: string;
  sourceType: GameSourceType;
  contentSlug?: string;
  settingsKey?: string;
  unlockMessage: string;
  order: number;
  enabled: boolean;
}

export interface GameChapterConfig {
  id: string;
  title: string;
  description: string;
  sourceType?: GameSourceType;
  contentSlug?: string;
  settingsKey?: string;
  backgroundLabel?: string;
  order: number;
  enabled: boolean;
}

export interface GameConfig {
  enabled: boolean;
  title: string;
  description: string;
  vehicleLabel: string;
  difficulty: 'easy' | 'normal' | 'hard';
  speed: number;
  homepagePreviewEnabled: boolean;
  mobileSimplifiedMode: boolean;
  chapters: GameChapterConfig[];
  collectibles: GameCollectibleConfig[];
  missions: string[];
  obstacles: string[];
  rewards: string[];
}

export interface ContentItem {
  _id: string;
  type: ContentType;
  title: string;
  shortTitle?: string;
  slug: string;
  eyebrow?: string;
  summary?: string;
  content?: string;
  category?: string;
  status?: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  publishedAt?: string;
  featured?: boolean;
  visible?: boolean;
  order?: number;
  tags?: string[];
  technologies?: string[];
  metrics?: Metric[];
  links?: ItemLink[];
  coverImage?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  gallery?: string[];
  galleryItems?: MediaAsset[];
  relatedContentIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageData {
  _id: string;
  slug: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  intro?: string;
  seoTitle?: string;
  seoDescription?: string;
  visible?: boolean;
  order?: number;
  sections?: unknown[];
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSecondaryTitle: string;
  heroDescription: string;
  currentFocus: string;
  availabilityStatus: string;
  location: string;
  email: string;
  availability: string;
  profileImage: string;
  profileImageAlt: string;
  profileImageCaption: string;
  profileImageFocalX: number;
  profileImageFocalY: number;
  alternateProfileImage: string;
  alternateProfileImageAlt: string;
  transparentProfileImage: string;
  transparentProfileImageAlt: string;
  resumeUrl: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaUrl: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaUrl: string;
  heroOrbitLabels: string[];
  stats: Array<Record<string, unknown>>;
  socials: Array<Record<string, unknown>>;
  terminalGreeting: string;
  aboutTitle: string;
  aboutStory: string;
  academicBackground: string;
  researchMotivation: string;
  developmentInterests: string;
  leadershipPhilosophy: string;
  communityVision: string;
  personalGoals: string;
  aboutGallery: MediaAsset[];
  aboutMilestones: Array<Record<string, unknown>>;
  contactReasons: string[];
  liveStatus: Record<string, unknown>;
  gameConfig: GameConfig;
  accent: string;
  secondaryAccent: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BootstrapData {
  settings: SiteSettings;
  pages: PageData[];
  items: ContentItem[];
}

export interface User { id: string; name: string; email: string; role: 'admin' }
export interface ContactMessage { _id: string; name: string; email: string; organization?: string; inquiryType?: string; subject: string; message: string; status: 'new' | 'read' | 'archived'; createdAt: string }
