
import React from 'react';
import Link from 'next/link';
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
        'Illustrative starting range for candidate photos, signature scans or student forms. Check the destination’s file-size and image-dimension instructions.',
    },
    {
      title: 'Job Applicant Portals',
      range: '150 KB – 200 KB',
      recommendedValue: 200,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description:
        'Illustrative starting range for resume headshots or CV attachments. Upload limits vary by portal, so check its specific instructions.',
    },
    {
      title: 'Web Graphics & Banners',
      range: '250 KB – 500 KB',
      recommendedValue: 500,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description:
        'Illustrative starting range for web graphics and banners. A suitable size depends on image dimensions, format and the page’s needs.',
    },
    {
      title: 'Email & Document Attachments',
      range: '1 MB – 2 MB',
      recommendedValue: 1,
      recommendedUnit: 'MB' as TargetSizeUnit,
      description:
        'Illustrative starting range for email or document attachments. Check the provider’s attachment limit and any recipient requirements.',
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
              Choosing an Image Size for an Upload
            </h1>

            <p className="text-sm sm:text-base text-[#E8DFC9]/70 max-w-2xl leading-relaxed">
              Different websites, application forms and email providers can
              have different image file-size limits. The right target depends
              on the instructions for the destination you're using. This guide
              provides illustrative starting points to help you choose a
              target before compressing an image.
            </p>
          </div>

          <section className="mb-8 rounded-xl border border-[#E8DFC9]/15 bg-[#2D3033] p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-3">
              How to Choose an Image File-Size Target
            </h2>
            <p className="text-sm text-[#E8DFC9]/70 leading-relaxed">
              Start by checking the maximum file size stated by the website,
              form or service where you plan to upload your image. Choose a
              target at or below that limit, leaving a little room if the
              instructions allow it. Image dimensions and file format also
              affect the final size. A compressor can attempt to meet your
              selected maximum, but some images may remain above it.{' '}
              <Link
                href="/how-it-works"
                className="text-[#7FA2FF] underline underline-offset-2 hover:text-white"
              >
                Learn how image compression works
              </Link>
              .
            </p>
          </section>

          <h2 className="text-lg font-bold mb-2">
            Illustrative Starting Ranges by Use Case
          </h2>
          <p className="text-xs text-[#E8DFC9]/50 italic mb-4">
            These ranges are examples, not universal requirements. Always
            check the file-size and image-dimension instructions for your
            specific destination.
          </p>

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

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2563FF] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2563FF]/90"
            >
              Go to the image compressor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
