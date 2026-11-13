
import React from 'react';
import { TargetSizeUnit } from '../../lib/compression/types';

interface PresetsGuideProps {
  onSelectPreset: (value: number, unit: TargetSizeUnit) => void;
}

export const PresetsGuide: React.FC<PresetsGuideProps> = ({
  onSelectPreset,
}) => {
  const portalPresets = [
    {
      title: 'Exam & Application Portals',
      range: '50 KB – 100 KB',
      recommendedValue: 100,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description:
        'Candidate photos, signature scans, and student forms with strict 100 KB ceilings.',
    },
    {
      title: 'Job Applicant Portals',
      range: '150 KB – 200 KB',
      recommendedValue: 200,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description:
        'Resume headshots and CV attachments. Balances facial clarity with ATS upload limits.',
    },
    {
      title: 'Web Graphics & Banners',
      range: '250 KB – 500 KB',
      recommendedValue: 500,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description:
        'Optimized for Google Core Web Vitals (LCP) and fast mobile page loads.',
    },
    {
      title: 'Email & Document Attachments',
      range: '1 MB – 2 MB',
      recommendedValue: 1,
      recommendedUnit: 'MB' as TargetSizeUnit,
      description:
        'Prevents email bounce-backs while safely maintaining high-resolution detail.',
    },
  ];

  return (
    <main className="flex-1 min-h-screen bg-[#25282B] text-[#E8DFC9]">
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563FF] mb-3">
              Image Compression Resources
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Portal Presets Guide
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Choose recommended image sizes for common application portals,
              job applications, websites, and document attachments.
            </p>
          </div>

          <h2 className="text-lg font-bold mb-4">
            Common Portal Size Targets
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portalPresets.map((preset) => (
              <div
                key={preset.title}
                className="p-5 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold">
                      {preset.title}
                    </h3>

                    <span className="text-xs font-mono font-bold text-[#E8DFC9]/80 px-2 py-1 bg-[#E8DFC9]/10 rounded whitespace-nowrap">
                      {preset.range}
                    </span>
                  </div>

                  <p className="text-xs text-[#E8DFC9]/65 leading-relaxed mb-5">
                    {preset.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSelectPreset(
                      preset.recommendedValue,
                      preset.recommendedUnit
                    )
                  }
                  className="self-start px-4 py-2 text-xs font-bold text-[#E8DFC9] bg-[#2563FF] hover:bg-[#2563FF]/90 rounded-lg transition-colors cursor-pointer"
                >
                  Use {preset.recommendedValue} {preset.recommendedUnit}
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#E8DFC9]/50 italic mt-6">
            Note: Portal specifications vary by institution. Always verify
            required KB limits before submission.
          </p>
        </div>
      </section>
    </main>
  );
};
