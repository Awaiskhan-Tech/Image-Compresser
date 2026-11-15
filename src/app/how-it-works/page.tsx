import type { Metadata } from 'next';
import { HowItWorks } from '@/components/pages/HowItWorks';

export const metadata: Metadata = {
  title: 'How Image Compression Works',
  description:
    "Learn how JPG, PNG and WebP compression works, how quality and dimensions affect file size, and what happens when a KB or MB limit isn't met.",
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    type: 'website',
    url: '/how-it-works',
    siteName: 'Webistic Image Compressor',
    title: 'How Image Compression Works | Webistic Image Compressor',
    description:
      "Learn how JPG, PNG and WebP compression works, how quality and dimensions affect file size, and what happens when a KB or MB limit isn't met.",
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'How Online Image Compression Works | Webistic Image Compressor',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Image Compression Works | Webistic Image Compressor',
    description:
      "Learn how JPG, PNG and WebP compression works, how quality and dimensions affect file size, and what happens when a KB or MB limit isn't met.",
    images: [{
      url: '/opengraph-image',
      alt: 'How Online Image Compression Works | Webistic Image Compressor',
    }],
  },
};

export default function Page() {
  return <HowItWorks />;
}