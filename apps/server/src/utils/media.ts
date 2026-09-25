import { ContentItem } from '../models/ContentItem.js';
import { Page } from '../models/Page.js';
import { SiteSettings } from '../models/SiteSettings.js';

export function getFileTypeFromMimeType(mimeType: string): 'image' | 'video' | 'gif' | 'pdf' | 'presentation' | 'external' {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'image/gif') return 'gif';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  return 'external';
}

export async function findMediaUsages(url: string): Promise<string[]> {
  const usages: string[] = [];

  const settings = await SiteSettings.findOne(
    {
      $or: [
        { profileImage: url },
        { alternateProfileImage: url },
        { transparentProfileImage: url },
        { 'aboutGallery.url': url }
      ]
    },
    'siteName'
  ).lean();
  if (settings) usages.push('site settings');

  const items = await ContentItem.find(
    {
      $or: [
        { coverImage: url },
        { gallery: url },
        { 'galleryItems.url': url }
      ]
    },
    'title type'
  ).lean();
  items.forEach((item) => usages.push(`${item.type}: ${item.title}`));

  const pages = await Page.find({ sections: { $elemMatch: { url } } }, 'title').lean();
  pages.forEach((page) => usages.push(`page: ${page.title}`));

  return usages;
}
