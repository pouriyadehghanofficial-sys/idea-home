// src/utils/catalogDownload.ts
//
// Given a catalog file URL (which might be a local static path like
// "/ideahome-catalog.pdf" or an external ImageKit URL), returns the URL
// that should actually be used for downloading.
//
// External ImageKit URLs get routed through our own /api/catalog/download
// proxy, ensuring maximum reliability across diverse networks. Local paths
// are already same-origin and safe to use directly.

export function getSafeDownloadUrl(catalogUrl: string): string {
  const isExternal = /^https?:\/\//i.test(catalogUrl);
  const isImageKit = /imagekit\.io/i.test(catalogUrl);

  if (isExternal && isImageKit) {
    return `/api/catalog/download?url=${encodeURIComponent(catalogUrl)}`;
  }

  // Local path or some other trusted same-origin URL — use as-is.
  return catalogUrl;
}
