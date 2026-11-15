import type { Metadata, Viewport } from 'next';
import '../index.css';
import AppShell from '@/components/layout/AppShell';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webisticimagecompressor.online').replace(/\/+$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Online Image Compressor | Exact KB & MB - Webistic',
    template: '%s | Webistic Image Compressor',
  },
  description:
    'Compress JPG, PNG and WebP images online for free. Reduce image file sizes to your target KB or MB directly in your browser. Fast, private and easy.',
  applicationName: 'Webistic Image Compressor',
  authors: [{ name: 'Webistic' }],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Webistic Image Compressor',
    url: siteUrl,
    title: 'Free Online Image Compressor | Exact KB & MB - Webistic',
    description:
      'Compress JPG, PNG and WebP images online for free. Reduce image file sizes to your target KB or MB directly in your browser. Fast, private and easy.',
  },
  twitter: {
    card: 'summary_large_image',
    images: [{
      url: '/opengraph-image',
      alt: 'Webistic Image Compressor — exact KB and MB image compression',
    }],
    title: 'Free Online Image Compressor | Exact KB & MB - Webistic',
    description:
      'Compress JPG, PNG and WebP images online for free. Reduce image file sizes to your target KB or MB directly in your browser. Fast, private and easy.',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#25282B',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Webistic Image Compressor',
  url: `${siteUrl}/`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  );
}