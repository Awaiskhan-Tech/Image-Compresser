import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '@/components/blog/BlogArticlePage';
import { getPostCanonicalUrl } from '@/components/blog/blogUtils';
import { getSanityImageUrl } from '@/lib/sanity/images';
import { sanityClient } from '@/lib/sanity/client';
import { POST_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import type { BlogPost } from '@/lib/sanity/types';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  return sanityClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug });
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Article not found | Webistic Blog',
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = getPostCanonicalUrl(post.slug, post.canonicalUrl);
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription ||
    post.excerpt ||
    'Read the latest image optimization insights from Webistic.';
  const socialImage = getSanityImageUrl(
    post.openGraphImage || post.coverImage,
    { width: 1200, height: 630, fit: 'crop' },
  );
  const imageAlt =
    post.openGraphImage?.alt || post.coverImage?.alt || post.title;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      images: socialImage ? [{ url: socialImage, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default async function BlogArticleRoute({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const canonicalUrl = getPostCanonicalUrl(post.slug, post.canonicalUrl);
  const socialImage = getSanityImageUrl(
    post.openGraphImage || post.coverImage,
    { width: 1200, height: 630, fit: 'crop' },
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: socialImage ? [socialImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: post.authorName
      ? {
          '@type': 'Person',
          name: post.authorName,
        }
      : {
          '@type': 'Organization',
          name: 'Webistic',
          url: 'https://www.webistic.co',
        },
    publisher: {
      '@type': 'Organization',
      name: 'Webistic',
      url: 'https://www.webistic.co',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <BlogArticlePage post={post} />
    </>
  );
}
