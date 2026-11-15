
import React from 'react';
import Link from 'next/link';

export const HowItWorks: React.FC = () => {
  return (
    <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-3">
              Compression Technology
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How Image Compression Works
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Image compression changes how image data is encoded to reduce
              file size. The selected KB or MB value is a maximum the compressor
              tries to meet, not a guaranteed output size. The method depends
              on the output format: JPG and WebP use quality settings, while
              PNG does not use the same quality control.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              What happens when you compress an image?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]"
              >
                <h3 className="text-sm font-bold mb-2">
                  The browser loads and inspects the image
                </h3>
                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  When you select an image, the browser reads its dimensions.
                  For PNG and WebP, it also samples pixels for transparency.
                  Learn more about{' '}
                  <Link
                    href="/privacy-architecture"
                    className="text-[#7FA2FF] underline underline-offset-2 hover:text-white"
                  >
                    browser-based image processing
                  </Link>
                  .
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]">
                <h3 className="text-sm font-bold mb-2">
                  The compressor checks encoded output against a maximum
                </h3>
                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  For JPG and WebP output, the compressor tests a limited
                  number of quality settings and checks the encoded sizes.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]">
                <h3 className="text-sm font-bold mb-2">
                  Resizing may help when a target is not met
                </h3>
                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  If none fit and auto-downscaling is enabled, it can resize
                  the image and try again. Resizing changes image dimensions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              How JPG, WebP and PNG compression differ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]">
                <h3 className="text-sm font-bold mb-2">
                  JPG and WebP quality settings
                </h3>
                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  These formats support adjustable quality settings in this
                  compressor. Reducing quality can reduce file size but may
                  also reduce image detail.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]">
                <h3 className="text-sm font-bold mb-2">
                  PNG encoding and resizing
                </h3>
                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  PNG output does not use the JPG/WebP quality setting. If it
                  remains above the selected maximum, resizing may help when
                  enabled, but the limit may still not be reached.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5 sm:p-6">
            <h2 className="text-xl font-bold mb-3">
              What if the result is still above the limit?
            </h2>
            <p className="text-sm text-[#E8DFC9]/70 leading-relaxed">
              The compressor attempts to meet the selected maximum, but some
              images cannot reach it with the available settings. Resizing may
              help if auto-downscaling is enabled. The result indicates whether
              the target was met, so compare the compressed image before
              downloading. For concise product answers,{' '}
              <Link
                href="/faq"
                className="text-[#7FA2FF] underline underline-offset-2 hover:text-white"
              >
                read the image compressor FAQs
              </Link>
              .
            </p>
          </section>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2563FF] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2563FF]/90"
            >
              Try the image compressor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
