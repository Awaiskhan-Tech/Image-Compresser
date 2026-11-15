import type { Metadata } from 'next';
import { BlogListingPage } from '@/components/blog/BlogListingPage';
import { sanityClient } from '@/lib/sanity/client';
import {
  CATEGORIES_QUERY,
  POST_COUNT_QUERY,
  POSTS_QUERY,
} from '@/lib/sanity/queries';
import type { BlogPost } from '@/lib/sanity/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Image Optimization Insights & Guides',
  description:
    'Practical image optimization guides, product insights, and privacy-first workflows from the Webistic team.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Image Optimization Insights & Guides',
    description:
      'Practical image optimization guides, product insights, and privacy-first workflows from the Webistic team.',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Webistic Image Compressor — image optimization insights and guides',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Optimization Insights & Guides | Webistic Image Compressor',
    description: 'Practical image optimization guides, product insights, and privacy-first workflows from the Webistic team.',
    images: [{
      url: '/opengraph-image',
      alt: 'Webistic Image Compressor — image optimization insights and guides',
    }],
  },};

export default async function BlogPage() {
  let initialPosts: BlogPost[] = [];
  let initialTotal = 0;
  let initialCategories: string[] = [];
  let initialError: string | null = null;

  try {
    [initialPosts, initialTotal, initialCategories] = await Promise.all([
      sanityClient.fetch<BlogPost[]>(POSTS_QUERY, {
        offset: 0,
        limit: 9,
        category: 'all',
      }),
      sanityClient.fetch<number>(POST_COUNT_QUERY, { category: 'all' }),
      sanityClient.fetch<string[]>(CATEGORIES_QUERY),
    ]);

    initialCategories = initialCategories
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error('Unable to render the blog listing from Sanity:', error);
    initialError =
      'We couldn’t load the articles right now. Please try again in a moment.';
  }

  return (
    <BlogListingPage
      initialPosts={initialPosts}
      initialTotal={initialTotal}
      initialCategories={initialCategories}
      initialError={initialError}
    />
  );
}