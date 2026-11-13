
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Webistic achieve an exact KB or MB target?',
      a: 'Unlike generic compressors that use arbitrary quality sliders (leaving you to guess the output size), Webistic runs a fast binary search algorithm in browser memory, evaluating actual Blob byte sizes to find the highest possible fidelity under your ceiling.',
    },
    {
      q: 'Will my image dimensions (resolution) change?',
      a: 'By default, the engine prioritizes 100% native resolution by adjusting compression quality alone. If a target is mathematically too low to achieve through quality reduction without severe distortion, the optional auto-downscale feature will proportionally adjust dimensions.',
    },
    {
      q: 'Why does PNG compression behave differently?',
      a: 'PNG is a lossless format without standard lossy quality controls. When compressing PNG, we optimize palette data and pixel dimensions. For aggressive compression with transparency, WebP output is recommended.',
    },
    {
      q: 'Are my private documents, IDs, or photos uploaded anywhere?',
      a: 'No. All processing is 100% local. Your files never touch a server.',
    },
    {
      q: 'Can I batch compress multiple images?',
      a: 'Yes. You can upload multiple images simultaneously. Each file is processed independently, and you can download them individually or as a single ZIP archive.',
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
              Frequently Asked Questions
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
