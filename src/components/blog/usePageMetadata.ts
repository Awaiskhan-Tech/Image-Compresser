import { useEffect } from 'react';

export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  robots?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

const defaultTitle =
  'Webistic Image Compressor — Exact KB/MB Target File Size Optimizer';
const defaultDescription =
  'Fast, privacy-first image compressor to reach exact target KB or MB limits with maximum visual quality. Powered by Webistic.';

function setMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string | undefined,
) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function resetMetadata() {
  document.title = defaultTitle;
  setMeta('name', 'description', defaultDescription);
  setMeta('name', 'robots', undefined);
  setMeta('property', 'og:title', 'Webistic Image Compressor');
  setMeta('property', 'og:description', defaultDescription);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', undefined);
  setMeta('property', 'og:image', undefined);
  setMeta('property', 'og:image:alt', undefined);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', undefined);
  setMeta('name', 'twitter:description', undefined);
  setMeta('name', 'twitter:image', undefined);
  setMeta('name', 'twitter:image:alt', undefined);
  document.head.querySelector('link[rel="canonical"]')?.remove();
  document.getElementById('blog-jsonld')?.remove();
}

export function usePageMetadata(metadata: PageMetadata) {
  const {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageAlt,
    robots,
    type,
  } = metadata;
  const jsonLd = metadata.jsonLd ? JSON.stringify(metadata.jsonLd) : undefined;

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type || 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);
    setMeta('name', 'twitter:image:alt', imageAlt);

    document.head.querySelector('link[rel="canonical"]')?.remove();
    if (canonicalUrl) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    document.getElementById('blog-jsonld')?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'blog-jsonld';
      script.type = 'application/ld+json';
      script.textContent = jsonLd;
      document.head.appendChild(script);
    }

    return resetMetadata;
  }, [canonicalUrl, description, imageAlt, imageUrl, jsonLd, robots, title, type]);
}
