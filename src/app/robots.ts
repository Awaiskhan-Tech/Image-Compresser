import type { MetadataRoute } from 'next';
import { absoluteSiteUrl } from '@/components/blog/blogUtils';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio',
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
  };
}