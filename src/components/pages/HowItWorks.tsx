
import React from 'react';

export const HowItWorks: React.FC = () => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Set Target Ceiling',
      detail:
        'Select a standard preset (e.g. 50 KB, 100 KB, 200 KB) or specify any custom size.',
    },
    {
      step: '02',
      title: 'Canvas Decode',
      detail:
        'Images are decoded in browser memory with resolution and alpha channels analyzed.',
    },
    {
      step: '03',
      title: 'Iterative Binary Search',
      detail:
        'The engine tests quality factors against actual Blob byte sizes to maximize fidelity.',
    },
    {
      step: '04',
      title: 'Inspect & Export',
      detail:
        'Compare results with the split slider and export single files or a complete ZIP.',
    },
  ];

  return (
    <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-3">
              Compression Technology
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How It Works
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Discover how Webistic's image compression engine finds the
              highest possible image quality within your target file size.
            </p>
          </div>

          <h2 className="text-lg font-bold mb-4">
            Iterative Binary Optimization Engine
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033]"
              >
                <span className="text-xs font-mono font-bold text-[#2563FF] block mb-2">
                  STEP {item.step}
                </span>

                <h3 className="text-sm font-bold mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
