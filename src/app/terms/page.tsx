import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms governing personal and commercial use of Webistic Image Compressor.',
  alternates: { canonical: '/terms' },
  openGraph: {
    type: 'website',
    url: '/terms',
    siteName: 'Webistic Image Compressor',
    title: 'Terms of Service | Webistic Image Compressor',
    description: 'Read the terms governing personal and commercial use of Webistic Image Compressor.',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Terms of Service | Webistic Image Compressor',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Webistic Image Compressor',
    description: 'Read the terms governing personal and commercial use of Webistic Image Compressor.',
    images: [{
      url: '/opengraph-image',
      alt: 'Terms of Service | Webistic Image Compressor',
    }],
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <article className="space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-[#2563FF]">Legal</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-white/60">Webistic Image Compressor</p>
        </header>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Terms of Use</h2>
          <p className="leading-7 text-white/75">
            Webistic Image Compressor provides browser-native compression tools
            as-is for personal and commercial usage.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Quality and Output</h2>
          <p className="leading-7 text-white/75">
            Output file size depends on source image complexity, formats, and codec
            constraints. Target sizes represent strict ceiling targets.
          </p>
        </section>
        <div className="border-t border-white/10 pt-6">
          <Link href="/" className="text-sm font-medium text-[#60A5FA] hover:underline">
            Return to Image Compressor
          </Link>
        </div>
      </article>
    </main>
  );
}