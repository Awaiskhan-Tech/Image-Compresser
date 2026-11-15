import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { getPostCanonicalUrl, absoluteSiteUrl } from '@/components/blog/blogUtils';

export const revalidate = 300;

interface SitemapPost {
  slug: string;
  _updatedAt?: string;
  publishedAt: string;
  canonicalUrl?: string;
}

const PUBLISHED_POSTS_QUERY = `*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now())
] {
  "slug": slug.current,
  _updatedAt,
  publishedAt,
  canonicalUrl
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteSiteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteSiteUrl('/faq'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteSiteUrl('/how-it-works'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteSiteUrl('/presets-guide'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteSiteUrl('/privacy-architecture'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteSiteUrl('/privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteSiteUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteSiteUrl('/blog'), changeFrequency: 'daily', priority: 0.8 },
  ];

  const posts = await sanityClient.fetch<SitemapPost[]>(PUBLISHED_POSTS_QUERY);

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: getPostCanonicalUrl(post.slug, post.canonicalUrl),
    lastModified: post._updatedAt || post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}