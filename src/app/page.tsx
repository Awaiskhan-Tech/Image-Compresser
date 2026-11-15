import type { Metadata } from 'next';
import HomePage from '@/components/home/HomePage';
import { absoluteSiteUrl } from '@/components/blog/blogUtils';

export const metadata: Metadata = {
  title: 'Free Online Image Compressor | Custom KB & MB Targets',
  description:
    'Compress JPG, PNG and WebP images in your browser. Set a KB or MB size limit, process multiple images, and download results individually or as a ZIP.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Free Online Image Compressor | Custom KB & MB Targets',
    description:
      'Compress JPG, PNG and WebP images in your browser. Set a KB or MB size limit, process multiple images, and download results individually or as a ZIP.',
  },
  twitter: {
    card: 'summary_large_image',
    images: [{
      url: '/opengraph-image',
      alt: 'Webistic Image Compressor — custom KB and MB size limits',
    }],
    title: 'Free Online Image Compressor | Custom KB & MB Targets',
    description:
      'Compress JPG, PNG and WebP images in your browser. Set a KB or MB size limit, process multiple images, and download results individually or as a ZIP.',
  },
};

const applicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Webistic Image Compressor',
  url: absoluteSiteUrl('/'),
  description:
    'Free browser-based image compressor for reducing JPG, PNG and WebP images to target file sizes in KB or MB.',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
  },
  featureList: [
    'Image compression to target KB or MB file sizes',
    'JPG, PNG and WebP image support',
    'Browser-based image processing',
    'Batch image compression',
    'Adjustable output format',
    'Optional image downscaling',
    "Image files processed in the browser without being sent to Webistic's remote image-compression service",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationSchema).replace(/</g, '\\u003c'),
        }}
      />
      <HomePage />
    </>
  );
}