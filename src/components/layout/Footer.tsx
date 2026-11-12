import React, { useState } from 'react';
import { Layers, ShieldCheck, Mail, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="border-t border-[#E8DFC9]/15 bg-[#25282B] py-8 text-[#E8DFC9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DFC9]/70 pb-6 border-b border-[#E8DFC9]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#2563FF] text-[#E8DFC9] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#E8DFC9]">Webistic Image Compressor</span>
            <span aria-hidden="true" className="text-[#E8DFC9]/30">·</span>
            <span>Powered by Webistic</span>
          </div>

          <div className="flex items-center gap-5 font-medium">
            <button
              type="button"
              onClick={() => setModalType('privacy')}
              className="hover:text-[#E8DFC9] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setModalType('terms')}
              className="hover:text-[#E8DFC9] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <a
              href="mailto:info@webistic.co"
              className="hover:text-[#E8DFC9] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#E8DFC9]/70" />
              <span>info@webistic.co</span>
            </a>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#E8DFC9]/50">
          <p>© {new Date().getFullYear()} Webistic. All processing runs 100% locally in your browser.</p>
          <p>Charcoal · Sand · Electric Blue</p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-[#25282B]/85 flex items-center justify-center p-4">
          <div className="bg-[#25282B] text-[#E8DFC9] border border-[#E8DFC9]/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-[#E8DFC9]/60 hover:text-[#E8DFC9] p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#2563FF]" />
              <h3 className="text-base font-bold text-[#E8DFC9]">Privacy Policy</h3>
            </div>
            <div className="space-y-3 text-xs text-[#E8DFC9]/80 leading-relaxed">
              <p>
                <strong className="text-[#E8DFC9]">1. Local In-Browser Processing:</strong> Webistic does not transmit your images to remote servers. All compression, scaling, and format conversion runs in your local browser memory.
              </p>
              <p>
                <strong className="text-[#E8DFC9]">2. Zero Retention:</strong> No image data, metadata, or personal files are logged or collected. Closing the tab immediately frees browser memory.
              </p>
              <p>
                <strong className="text-[#E8DFC9]">3. Inquiries:</strong> Contact <a href="mailto:info@webistic.co" className="underline text-[#E8DFC9]">info@webistic.co</a>.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8DFC9]/15 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#2563FF] text-[#E8DFC9] rounded-lg text-xs font-bold hover:bg-[#2563FF]/90 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 bg-[#25282B]/85 flex items-center justify-center p-4">
          <div className="bg-[#25282B] text-[#E8DFC9] border border-[#E8DFC9]/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-[#E8DFC9]/60 hover:text-[#E8DFC9] p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-[#2563FF]" />
              <h3 className="text-base font-bold text-[#E8DFC9]">Terms of Service</h3>
            </div>
            <div className="space-y-3 text-xs text-[#E8DFC9]/80 leading-relaxed">
              <p>
                <strong className="text-[#E8DFC9]">1. Terms of Use:</strong> Webistic Image Compressor provides browser-native compression tools as-is for personal and commercial usage.
              </p>
              <p>
                <strong className="text-[#E8DFC9]">2. Quality & Output:</strong> Output file size depends on source image complexity, formats, and codec constraints. Target sizes represent strict ceiling targets.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8DFC9]/15 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#2563FF] text-[#E8DFC9] rounded-lg text-xs font-bold hover:bg-[#2563FF]/90 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
