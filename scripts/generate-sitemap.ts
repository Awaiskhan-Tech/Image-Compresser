import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@sanity/client';

const siteUrl = (process.env.VITE_SITE_URL || '').replace(/\/+$/, '');
if (!siteUrl) {
  console.warn(
    'Skipping sitemap generation: set VITE_SITE_URL to the canonical website origin.',
  );
  process.exit(0);
}

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '6yinrhqf',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-03-01',
  perspective: 'published',
  useCdn: false,
});

const posts = await client.fetch<Array<{ slug: string; updatedAt: string }>>(`*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now())
] | order(publishedAt desc) {
  "slug": slug.current,
  "updatedAt": _updatedAt
}`);

const staticPaths = [
  '/',
  '/blog',
  '/presets-guide',
  '/privacy-architecture',
  '/how-it-works',
  '/faq',
];
const entries: Array<{ url: string; lastModified?: string }> = [
  ...staticPaths.map((path) => ({ url: new URL(path, `${siteUrl}/`).toString() })),
  ...posts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, `${siteUrl}/`).toString(),
    lastModified: post.updatedAt,
  })),
];
const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map(
    ({ url, lastModified }) =>
      `  <url><loc>${escapeXml(url)}</loc>${lastModified ? `<lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>` : ''}</url>`,
  )
  .join('\n')}\n</urlset>\n`;

const outputDirectory = join(process.cwd(), 'dist');
await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(
    join(outputDirectory, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /studio\nSitemap: ${siteUrl}/sitemap.xml\n`,
    'utf8',
  ),
]);
console.log(`Generated sitemap with ${entries.length} URLs.`);
