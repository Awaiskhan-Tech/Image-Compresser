import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you requested could not be found. Explore Webistic Image Compressor or browse our image optimization guides.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] flex-1 items-center justify-center px-4 py-20">
      <section className="mx-auto w-full max-w-xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Error 404
        </p>

        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-[#E8DFC9] sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mb-9 max-w-md text-base leading-7 text-[#E8DFC9]/70">
          The page you are looking for may have moved, been removed, or is
          temporarily unavailable.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Go to homepage
          </Link>

          <Link
            href="/blog"
            className="rounded-xl border border-[#E8DFC9]/20 px-6 py-3 text-sm font-semibold text-[#E8DFC9] transition hover:bg-[#E8DFC9]/10"
          >
            Explore our blog
          </Link>
        </div>
      </section>
    </main>
  );
}