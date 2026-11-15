import type { Metadata } from 'next';
import PresetsGuideClient from './PresetsGuideClient';

export const metadata: Metadata = {
  title: 'Image Size Guide for Uploads',
  description:
    'Learn how to choose an image file-size target for online forms, job applications, websites and email. Understand upload limits and why results can vary.',
  alternates: { canonical: '/presets-guide' },
  openGraph: {
    type: 'website',
    url: '/presets-guide',
    siteName: 'Webistic Image Compressor',
    title: 'Image Size Guide for Uploads | Webistic Image Compressor',
    description:
      'Learn how to choose an image file-size target for online forms, job applications, websites and email. Understand upload limits and why results can vary.',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Image Size Guide for Uploads | Webistic Image Compressor',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Size Guide for Uploads | Webistic Image Compressor',
    description:
      'Learn how to choose an image file-size target for online forms, job applications, websites and email. Understand upload limits and why results can vary.',
    images: [{
      url: '/opengraph-image',
      alt: 'Image Compression Size Guide & Presets | Webistic Image Compressor',
    }],
  },
};

export default function Page() {
  return <PresetsGuideClient />;
}