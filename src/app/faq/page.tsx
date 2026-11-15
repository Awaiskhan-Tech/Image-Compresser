import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Image Compressor FAQs',
  description:
    'Get product-specific answers about image quality, PNG compression, size limits, image dimensions, privacy, and batch downloads.',
  alternates: { canonical: '/faq' },
  openGraph: {
    type: 'website',
    url: '/faq',
    siteName: 'Webistic Image Compressor',
    title: 'Image Compressor FAQs | Webistic Image Compressor',
    description:
      'Get product-specific answers about image quality, PNG compression, size limits, image dimensions, privacy, and batch downloads.',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Image Compressor FAQs | Webistic Image Compressor',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor FAQs | Webistic Image Compressor',
    description:
      'Get product-specific answers about image quality, PNG compression, size limits, image dimensions, privacy, and batch downloads.',
    images: [{
      url: '/opengraph-image',
      alt: 'Image Compressor FAQs | Webistic Image Compressor',
    }],
  },
};

export default function Page() {
  return <FAQClient />;
}