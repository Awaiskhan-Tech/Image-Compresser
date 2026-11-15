
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const FAQ: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the compressor try to meet a KB or MB size limit?',
      a: (
        <>
          Set a maximum file size. The compressor checks the encoded output and
          adjusts quality where the format supports it. If needed and enabled,
          it can also resize the image. It tries to meet the limit, but some
          images may remain above it; the result indicates whether the limit was
          met. For a fuller explanation, see{' '}
          <Link href="/how-it-works" className="text-[#7FA2FF] underline underline-offset-2 hover:text-white">
            How It Works
          </Link>
          .
        </>
      ),
    },
    {
      q: 'Will compression change image quality or dimensions?',
      a: 'It can. JPG and WebP compression may reduce image detail. The compressor first tries to keep the original dimensions; if auto-downscaling is enabled and needed, it may resize the image. Compare the result before downloading. Resizing changes dimensions.',
    },
    {
      q: 'Why can a PNG remain above my file-size limit?',
      a: (
        <>
          PNG uses lossless encoding, so it does not use a JPG/WebP-style
          quality setting. If the PNG is still too large, resizing may help;
          the target may still not be met. WebP is another option when
          appropriate, but its compression may reduce image detail. Try the{' '}
          <Link href="/" className="text-[#7FA2FF] underline underline-offset-2 hover:text-white">
            compressor on the homepage
          </Link>
          .
        </>
      ),
    },
    {
      q: 'Are my images uploaded when I use the compressor?',
      a: (
        <>
          Image compression is performed in your browser. Your selected image
          files are not sent to Webistic’s remote image-compression service.
          For more detail, see our{' '}
          <Link href="/privacy-architecture" className="text-[#7FA2FF] underline underline-offset-2 hover:text-white">
            Privacy Architecture
          </Link>
          .
        </>
      ),
    },
    {
      q: 'Can I compress multiple images and download them together?',
      a: (
        <>
          Yes. Select multiple images and compress them in one session. Each
          image is processed as its own file. Download results individually or,
          when multiple results are ready, collect them in a ZIP file. Use the{' '}
          <Link href="/" className="text-[#7FA2FF] underline underline-offset-2 hover:text-white">
            homepage image compressor
          </Link>{' '}
          to compress a batch.
        </>
      ),
    },
  ];

  return (
    <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-3">
              Help & Support
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Image Compressor FAQs
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Find answers to common questions about image compression,
              supported formats, file sizes, and privacy.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] overflow-hidden"
                >
                  <h2 className="m-0">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : idx)
                      }
                      aria-expanded={isOpen}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-[#E8DFC9] cursor-pointer"
                    >
                      <span>{faq.q}</span>

                      <ChevronDown
                        className={`w-4 h-4 text-[#E8DFC9]/60 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#2563FF]' : ''
                        }`}
                      />
                    </button>
                  </h2>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-sm text-[#E8DFC9]/75 border-t border-[#E8DFC9]/10 pt-4 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
