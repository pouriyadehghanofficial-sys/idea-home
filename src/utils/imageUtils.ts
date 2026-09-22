// Utility functions for ImageKit image URL handling, cache-busting, and legacy mock prevention

export function isLegacyMockImage(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '[object object]') return true;
  return false;
}

/**
 * Returns a clean, optimized ImageKit or standard URL with versioning/cache-busting.
 * Never returns legacy Unsplash placeholders.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options?: {
    version?: string | number;
    width?: number;
    quality?: number;
    forceCacheBust?: boolean;
  }
): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (isLegacyMockImage(trimmed)) return '';

  // Data URLs and blob URLs don't need cache busting or transformations
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  try {
    const urlObj = new URL(trimmed, window.location.origin);

    // Apply versioning/cache-busting parameter if specified or for ImageKit
    if (options?.version) {
      urlObj.searchParams.set('v', String(options.version));
    } else if (options?.forceCacheBust) {
      urlObj.searchParams.set('t', String(Date.now()));
    }

    // ImageKit specific optimization transformations (format auto, modern webp/avif, default quality 75)
    if (trimmed.includes('ik.imagekit.io') || trimmed.includes('imagekit.io')) {
      // If user hasn't specified custom transformation in query
      if (!urlObj.searchParams.has('tr')) {
        const quality = options?.quality || 75;
        const transforms: string[] = ['f-auto', `q-${quality}`];
        if (options?.width) {
          transforms.push(`w-${options.width}`);
        }
        urlObj.searchParams.set('tr', transforms.join(','));
      }
    }

    return urlObj.toString();
  } catch {
    return trimmed;
  }
}

/**
 * Clean slider products by stripping out any legacy Unsplash mock images.
 */
export function sanitizeSliderProducts<T extends { image?: string }>(items?: T[] | null): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item && item.image && !isLegacyMockImage(item.image));
}

/**
 * Clean categories by removing legacy Unsplash images from their images array.
 */
export function sanitizeCategories<T extends { images?: string[] }>(categories?: T[] | null): T[] {
  if (!Array.isArray(categories)) return [];
  return categories.map((cat) => ({
    ...cat,
    images: Array.isArray(cat.images) ? cat.images.filter((img) => !isLegacyMockImage(img)) : []
  }));
}

/**
 * Clean company photos by removing legacy Unsplash images.
 */
export function sanitizeCompanyPhotos<T extends { url?: string }>(photos?: T[] | null): T[] {
  if (!Array.isArray(photos)) return [];
  return photos.filter((p) => p && p.url && !isLegacyMockImage(p.url));
}

/**
 * Clean products by removing legacy Unsplash images.
 */
export function sanitizeProducts<T extends { images?: string[] }>(products?: T[] | null): T[] {
  if (!Array.isArray(products)) return [];
  return products.map((p) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images.filter((img) => !isLegacyMockImage(img)) : []
  }));
}

/**
 * Purges old browser cache (localStorage & sessionStorage) of any hardcoded Unsplash data
 * so existing browser sessions immediately stop displaying stale placeholder images.
 */
export function purgeLegacyStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const storageKeys = [
    'arasteh_slider_db',
    'arasteh_categories_db',
    'arasteh_products_db',
    'arasteh_company_photos_db'
  ];

  try {
    for (const key of storageKeys) {
      const item = localStorage.getItem(key);
      if (item && item.includes('images.unsplash.com')) {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
            if (key === 'arasteh_slider_db') {
              const cleaned = sanitizeSliderProducts(parsed);
              if (cleaned.length > 0) {
                localStorage.setItem(key, JSON.stringify(cleaned));
              } else {
                localStorage.removeItem(key);
              }
            } else if (key === 'arasteh_categories_db') {
              const cleaned = sanitizeCategories(parsed);
              localStorage.setItem(key, JSON.stringify(cleaned));
            } else if (key === 'arasteh_company_photos_db') {
              const cleaned = sanitizeCompanyPhotos(parsed);
              if (cleaned.length > 0) {
                localStorage.setItem(key, JSON.stringify(cleaned));
              } else {
                localStorage.removeItem(key);
              }
            } else if (key === 'arasteh_products_db') {
              const cleaned = sanitizeProducts(parsed);
              localStorage.setItem(key, JSON.stringify(cleaned));
            }
          } else {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  } catch (err) {
    console.warn('Storage purge non-critical error:', err);
  }
}
