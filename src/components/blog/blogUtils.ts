const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, '');

export function absoluteSiteUrl(path: string): string {
  const baseUrl =
    configuredSiteUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://webistic.co');
  return new URL(path.replace(/^\/+/, ''), `${baseUrl}/`).toString();
}

export function formatPublicationDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function getPostCanonicalUrl(slug: string, canonicalUrl?: string): string {
  if (canonicalUrl) {
    try {
      const parsed = new URL(canonicalUrl);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return parsed.toString();
      }
    } catch {
      // Fall back to the generated article URL for invalid CMS values.
    }
  }
  return absoluteSiteUrl(`/blog/${slug}`);
}
