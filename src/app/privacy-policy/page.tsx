import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Webistic Image Compressor processes images locally and uses third-party services to deliver website content.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    type: 'website',
    url: '/privacy-policy',
    siteName: 'Webistic Image Compressor',
    title: 'Privacy Policy | Webistic Image Compressor',
    description: 'Learn how Webistic Image Compressor processes images locally and uses third-party services to deliver website content.',
    images: [{
      url: '/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Privacy Policy | Webistic Image Compressor',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Webistic Image Compressor',
    description: 'Learn how Webistic Image Compressor processes images locally and uses third-party services to deliver website content.',
    images: [{
      url: '/opengraph-image',
      alt: 'Privacy Policy | Webistic Image Compressor',
    }],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <article className="space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-[#2563FF]">Legal</p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-white/60">Webistic Image Compressor</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Image Processing</h2>
          <p className="leading-7 text-white/75">
            Images selected for compression are processed locally in your browser.
            The image compression workflow does not upload your selected image files
            to a remote image-processing server operated by Webistic.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Temporary Browser Resources</h2>
          <p className="leading-7 text-white/75">
            The application uses temporary browser resources while loading and
            processing images. It revokes temporary image URLs when files are
            removed or the compressor provider is unmounted. The browser manages
            the release of associated memory.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Third-Party Services</h2>
          <p className="leading-7 text-white/75">
            The website uses Google Fonts to load typography and Sanity to retrieve
            published blog content. These services may receive technical information
            associated with requests made to their infrastructure. Their handling
            of information is governed by their respective privacy policies.
          </p>
          <ul className="list-disc space-y-2 pl-6 leading-7 text-white/75">
            <li>
              Google Fonts:{' '}
              <a className="text-[#60A5FA] underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
            </li>
            <li>
              Sanity:{' '}
              <a className="text-[#60A5FA] underline" href="https://www.sanity.io/legal/privacy" target="_blank" rel="noopener noreferrer">
                Sanity Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">4. Contact</h2>
          <p className="leading-7 text-white/75">
            For privacy-related questions, contact{' '}
            <a className="text-[#60A5FA] underline" href="mailto:info@webistic.co">
              info@webistic.co
            </a>.
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