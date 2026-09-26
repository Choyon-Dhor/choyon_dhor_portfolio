import { initialSiteSettings, pages as defaultPages, content as defaultContent } from './starter-data.js';

let siteSettings = { ...initialSiteSettings };
let sitePages = defaultPages.map((p, i) => ({
  _id: p._id || p.slug || `page-${i + 1}`,
  ...p,
  _id: p._id || p.slug || `page-${i + 1}`
}));
let siteContent = defaultContent.map((c, i) => ({
  _id: c._id || c.slug || `item-${i + 1}`,
  ...c,
  _id: c._id || c.slug || `item-${i + 1}`
}));

let siteMessages = [
  {
    _id: 'msg-seed-1',
    name: 'Dr. Sarah Mitchell',
    email: 's.mitchell@research-lab.org',
    subject: 'Collaboration inquiry on Time-Series AI',
    organization: 'Neural Systems Lab',
    inquiryType: 'Research Collaboration',
    message: 'Hello Choyon, I reviewed your work on time-series forecasting and explainable AI models. We would love to discuss a potential joint research initiative.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: 'msg-seed-2',
    name: 'Alexandre Chen',
    email: 'alex.chen@techventures.io',
    subject: 'Consulting and Engineering Project',
    organization: 'Horizon Robotics',
    inquiryType: 'Project Inquiry',
    message: 'Hi Choyon, your portfolio projects show impressive depth in robotics and machine learning. Are you available for a remote consultancy or internship?',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let siteMedia = [
  {
    _id: 'media-avatar-1',
    filename: 'avatar.jpg',
    url: '/avatar.jpg',
    thumbnailUrl: '/avatar.jpg',
    altText: 'Choyon Dhor profile photo',
    caption: 'Choyon Dhor – Lead Researcher & Developer',
    category: 'Profile',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'media-project-1',
    filename: 'project-cover.jpg',
    url: '/project-cover.jpg',
    thumbnailUrl: '/project-cover.jpg',
    altText: 'Research and project banner',
    caption: 'AI and Robotics System Interface',
    category: 'Projects',
    createdAt: new Date().toISOString()
  }
];

export const store = {
  getSettings: () => siteSettings,
  updateSettings: (newSettings) => {
    siteSettings = { ...siteSettings, ...newSettings, key: 'primary' };
    return siteSettings;
  },
  getPages: () => sitePages,
  setPages: (pages) => {
    sitePages = pages;
    return sitePages;
  },
  getContent: () => siteContent,
  setContent: (content) => {
    siteContent = content;
    return siteContent;
  },
  getMessages: () => siteMessages,
  setMessages: (messages) => {
    siteMessages = messages;
    return siteMessages;
  },
  getMedia: () => siteMedia,
  setMedia: (media) => {
    siteMedia = media;
    return siteMedia;
  }
};
