import { mediaUrl } from './api';
import type { MediaAsset } from '../types';

export function normalizeMediaCollection(source?: Array<string | MediaAsset>): MediaAsset[] {
  if (!source?.length) return [];
  return source
    .map((entry, index) => {
      if (typeof entry === 'string') {
        return {
          url: entry,
          altText: `Gallery image ${index + 1}`,
          order: index
        } satisfies MediaAsset;
      }

      return {
        ...entry,
        url: entry.url || '',
        thumbnailUrl: entry.thumbnailUrl || entry.url || '',
        altText: entry.altText || entry.caption || `Gallery image ${index + 1}`,
        order: entry.order ?? index
      } satisfies MediaAsset;
    })
    .filter((item) => item.url)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

export function resolveMediaUrl(item: MediaAsset) {
  return mediaUrl(item.url || item.externalUrl || '');
}
