import React, { useState } from 'react';
import { TargetSizeUnit } from '../../lib/compression/types';
import { ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';

interface ReferenceSectionProps {
  onSelectPreset: (value: number, unit: TargetSizeUnit) => void;
}

type TabKey = 'presets' | 'privacy' | 'how-it-works' | 'faq';

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ onSelectPreset }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('presets');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const portalPresets = [
    {
      title: 'Exam & Application Portals',
      range: '50 KB – 100 KB',
      recommendedValue: 100,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description: 'Candidate photos, signature scans, and student forms with strict 100 KB ceilings.',
    },
    {
      title: 'Job Applicant Portals',
      range: '150 KB – 200 KB',
      recommendedValue: 200,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description: 'Resume headshots and CV attachments. Balances facial clarity with ATS upload limits.',
    },
    {
      title: 'Web Graphics & Banners',
      range: '250 KB – 500 KB',
      recommendedValue: 500,
      recommendedUnit: 'KB' as TargetSizeUnit,
      description: 'Optimized for Google Core Web Vitals (LCP) and fast mobile page loads.',
    },
    {
      title: 'Email & Document Attachments',
      range: '1 MB – 2 MB',
      recommendedValue: 1,
      recommendedUnit: 'MB' as TargetSizeUnit,
      description: 'Prevents email bounce-backs while safely maintaining high-resolution detail.',
    },
  ];

  const privacyPoints = [
    {
      title: 'Zero Server Uploads',
      detail: 'Your images are never transmitted over the internet to remote servers or cloud storage.',
    },
    {
      title: '100% In-Browser Execution',
      detail: 'Calculations occur entirely on your device CPU using Canvas and ImageBitmap APIs.',
    },
    {
      title: 'Ephemeral Memory Lifecycle',
      detail: 'Memory buffers are automatically garbage-collected when files are cleared or the tab closes.',
    },
    {
      title: 'Offline Capable',
      detail: 'Once loaded, Webistic works seamlessly even with your network disconnected.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Set Target Ceiling',
      detail: 'Select a standard preset (e.g. 50 KB, 100 KB, 200 KB) or specify any custom size.',
    },
    {
      step: '02',
      title: 'Canvas Decode',
      detail: 'Images are decoded in browser memory with resolution and alpha channels analyzed.',
    },
    {
      step: '03',
      title: 'Iterative Binary Search',
      detail: 'The engine tests quality factors against actual Blob byte sizes to maximize fidelity.',
    },
    {
      step: '04',
      title: 'Inspect & Export',
      detail: 'Compare results with the split slider and export single files or a complete ZIP.',
    },
  ];

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
    <section id="reference-section" className="py-12 border-t border-[#E8DFC9]/10 bg-[#25282B] text-[#E8DFC9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#25282B] border border-[#E8DFC9]/20 rounded-xl mb-8 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#2563FF] text-[#E8DFC9]'
                : 'text-[#E8DFC9]/70 hover:text-[#E8DFC9]'
            }`}
          >
            Portal Presets Guide
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#2563FF] text-[#E8DFC9]'
                : 'text-[#E8DFC9]/70 hover:text-[#E8DFC9]'
            }`}
          >
            Privacy Architecture
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'how-it-works'
                ? 'bg-[#2563FF] text-[#E8DFC9]'
                : 'text-[#E8DFC9]/70 hover:text-[#E8DFC9]'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#2563FF] text-[#E8DFC9]'
                : 'text-[#E8DFC9]/70 hover:text-[#E8DFC9]'
            }`}
          >
            FAQ
          </button>
        </div>

        {/* Tab 1: Portal Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#E8DFC9] tracking-tight">
                Common Portal Size Targets
              </h3>
              <p className="text-xs text-[#E8DFC9]/70 mt-0.5">
                Quick-select a preset to instantly configure your target compression ceiling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portalPresets.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-[#E8DFC9]">{p.title}</h4>
                      <span className="text-xs font-mono font-bold text-[#E8DFC9]/80 px-2 py-0.5 bg-[#E8DFC9]/10 rounded">
                        {p.range}
                      </span>
                    </div>
                    <p className="text-xs text-[#E8DFC9]/65 mb-3">{p.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPreset(p.recommendedValue, p.recommendedUnit)}
                    className="self-start px-3 py-1 text-xs font-bold text-[#E8DFC9] bg-[#2563FF] hover:bg-[#2563FF]/90 rounded-md transition-colors cursor-pointer"
                  >
                    Use {p.recommendedValue} {p.recommendedUnit}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#E8DFC9]/50 italic pt-2">
              Note: Portal specifications vary by institution. Always verify required KB limits before submission.
            </p>
          </div>
        )}

        {/* Tab 2: Privacy Architecture */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#E8DFC9] tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2563FF]" />
                <span>Client-Side Privacy Architecture</span>
              </h3>
              <p className="text-xs text-[#E8DFC9]/70 mt-0.5">
                Webistic is engineered for complete data isolation. Confidential documents and private photographs remain entirely on your device.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {privacyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E8DFC9]/15 bg-[#25282B]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#2563FF] shrink-0" />
                    <h4 className="text-sm font-bold text-[#E8DFC9]">{point.title}</h4>
                  </div>
                  <p className="text-xs text-[#E8DFC9]/65 leading-relaxed pl-6">
                    {point.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: How It Works */}
        {activeTab === 'how-it-works' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#E8DFC9] tracking-tight">
                Iterative Binary Optimization Engine
              </h3>
              <p className="text-xs text-[#E8DFC9]/70 mt-0.5">
                How Webistic reliably achieves exact target sizes without arbitrary quality guesses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workflowSteps.map((s) => (
                <div
                  key={s.step}
                  className="p-4 rounded-xl border border-[#E8DFC9]/15 bg-[#25282B]"
                >
                  <span className="text-xs font-mono font-bold text-[#2563FF] block mb-1">
                    Step {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-[#E8DFC9] mb-1">{s.title}</h4>
                  <p className="text-xs text-[#E8DFC9]/65 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#E8DFC9] tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-[#E8DFC9]/70 mt-0.5">
                Key questions on compression mechanics, format behavior, and browser limits.
              </p>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-[#E8DFC9] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#E8DFC9]/60 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#2563FF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-[#E8DFC9]/75 border-t border-[#E8DFC9]/10 pt-2 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
