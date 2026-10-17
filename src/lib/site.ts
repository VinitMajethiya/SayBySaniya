/**
 * Retrieves the base website URL from VITE_SITE_URL environment variable,
 * with a fallback default for local/staging deployments.
 */
export const getSiteUrl = (): string => {
  const url = import.meta.env.VITE_SITE_URL || 'https://saylipss.co';
  return url.replace(/\/+$/, '');
};

/**
 * Returns an absolute URL for a given path.
 */
export const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
