import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const PrivacyArchitecture: React.FC = () => (
  <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2563FF]">
            Privacy &amp; File Handling
          </p>

          <h1 className="mb-4 flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <ShieldCheck className="h-8 w-8 shrink-0 text-[#2563FF]" />
            Image Compressor Privacy
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-[#E8DFC9]/70 sm:text-base">
            This page explains how the inspected image-compression workflow
            processes selected files in your browser and handles temporary
            image resources.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold">
            How your images are processed
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2563FF]" />
                <h3 className="text-sm font-bold">
                  Image processing happens in your browser
                </h3>
              </div>

              <p className="pl-7 text-xs leading-relaxed text-[#E8DFC9]/65">
                When you select a supported image, the browser loads it through
                an image element and reads its dimensions. The compression code
                draws the image to an HTML canvas and uses the Canvas API to
                encode the output.
              </p>
            </article>

            <article className="rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2563FF]" />
                <h3 className="text-sm font-bold">
                  Selected files and temporary image resources
                </h3>
              </div>

              <p className="pl-7 text-xs leading-relaxed text-[#E8DFC9]/65">
                The image loader and compressor use temporary object URLs while
                decoding files and displaying original or compressed previews.
                The decoder URL is revoked after compression finishes and when
                decoding fails; preview URLs remain active while their file is
                in the queue.
              </p>
            </article>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold">
            Are your images sent to a remote compression service?
          </h2>

          <p className="text-sm leading-relaxed text-[#E8DFC9]/70">
            Your selected image files are processed in your browser. The
            inspected compression workflow does not send those files to
            Webistic&apos;s remote image-compression service.
          </p>
        </section>

        <section className="mb-8 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold">
            What happens when you remove your images?
          </h2>

          <p className="text-sm leading-relaxed text-[#E8DFC9]/70">
            Removing an image or clearing the queue revokes the object URLs for
            its original preview and any compressed result. The application
            also revokes those URLs when the compressor provider is unmounted.
            The browser controls when memory associated with revoked URLs is
            reclaimed, so cleanup does not guarantee immediate memory release.
          </p>
        </section>

        <nav
          aria-label="Related information"
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-[#7FA2FF]"
        >
          <Link href="/" className="hover:text-white">
            Use the image compressor
          </Link>
          <Link href="/how-it-works" className="hover:text-white">
            Learn how image compression works
          </Link>
          <Link href="/faq" className="hover:text-white">
            Read the image compressor FAQs
          </Link>
        </nav>
      </div>
    </section>
  </main>
);
