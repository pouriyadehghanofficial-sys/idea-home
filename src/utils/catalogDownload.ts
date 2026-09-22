// src/utils/catalogDownload.ts
//
// Given a catalog file URL (which might be a local static path like
// "/ideahome-catalog.pdf" or an external ImageKit URL), returns the URL
// that should actually be used for downloading.
//
// External ImageKit URLs get routed through our own /api/catalog/download
// proxy, ensuring maximum reliability across diverse networks. Local paths
// are already same-origin and safe to use directly.

export function getSafeDownloadUrl(fileUrl: string, type: 'catalog' | 'pricelist' = 'catalog'): string {
  if (!fileUrl) return '';

  const isExternal = /^https?:\/\//i.test(fileUrl);
  const isImageKit = /imagekit\.io/i.test(fileUrl);

  if (isExternal && isImageKit) {
    const isPrice = type === 'pricelist' || /price/i.test(fileUrl);
    const endpoint = isPrice ? '/api/price-list/download' : '/api/catalog/download';
    return `${endpoint}?url=${encodeURIComponent(fileUrl)}`;
  }

  // Local path or some other trusted same-origin URL — use as-is.
  return fileUrl;
}
