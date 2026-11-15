import type { Metadata } from 'next';
import { PrivacyArchitecture } from '@/components/pages/PrivacyArchitecture';

const title = 'Image Compressor Privacy | Webistic Image Compressor';
const description =
  'Learn how Webistic processes selected images in your browser, whether files are sent to a remote compression service, and how temporary image resources are cleaned up.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/privacy-architecture' },
  openGraph: {
    type: 'website',
    url: '/privacy-architecture',
    siteName: 'Webistic Image Compressor',
    title,
    description,
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: title,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{
      url: '/opengraph-image',
      alt: title,
    }],
  },
};

export default function Page() {
  return <PrivacyArchitecture />;
}