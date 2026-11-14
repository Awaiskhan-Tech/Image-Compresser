
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Mail, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black/70">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#2563FF] text-white flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>

            <span className="font-bold text-black">
              Webistic Image Compressor
            </span>

            <span aria-hidden="true" className="text-black/30">·</span>

            <span className="text-black/60">Powered by Webistic</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <Link to="/blog" className="hover:text-[#2563FF] transition-colors">
              Blog
            </Link>

            <button
              type="button"
              onClick={() => setModalType('privacy')}
              className="hover:text-[#2563FF] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              onClick={() => setModalType('terms')}
              className="hover:text-[#2563FF] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>

            <a
              href="mailto:info@webistic.co"
              className="hover:text-[#2563FF] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563FF]" />
              <span>info@webistic.co</span>
            </a>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {modalType === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-black border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-black/50 hover:text-[#2563FF] p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#2563FF]" />
              <h3 className="text-base font-bold text-black">Privacy Policy</h3>
            </div>

            <div className="space-y-3 text-xs text-black/75 leading-relaxed">
              <p>
                <strong className="text-black">1. Local In-Browser Processing:</strong>{' '}
                Webistic does not transmit your images to remote servers. All compression, scaling, and format conversion runs in your local browser memory.
              </p>

              <p>
                <strong className="text-black">2. Zero Retention:</strong>{' '}
                No image data, metadata, or personal files are logged or collected. Closing the tab immediately frees browser memory.
              </p>

              <p>
                <strong className="text-black">3. Inquiries:</strong>{' '}
                Contact{' '}
                <a href="mailto:info@webistic.co" className="underline text-[#2563FF]">
                  info@webistic.co
                </a>.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#2563FF] text-white rounded-lg text-xs font-bold hover:bg-[#2563FF]/90 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {modalType === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white text-black border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 text-black/50 hover:text-[#2563FF] p-1 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-[#2563FF]" />
              <h3 className="text-base font-bold text-black">Terms of Service</h3>
            </div>

            <div className="space-y-3 text-xs text-black/75 leading-relaxed">
              <p>
                <strong className="text-black">1. Terms of Use:</strong>{' '}
                Webistic Image Compressor provides browser-native compression tools as-is for personal and commercial usage.
              </p>

              <p>
                <strong className="text-black">2. Quality & Output:</strong>{' '}
                Output file size depends on source image complexity, formats, and codec constraints. Target sizes represent strict ceiling targets.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-1.5 bg-[#2563FF] text-white rounded-lg text-xs font-bold hover:bg-[#2563FF]/90 transition-colors cursor-pointer"
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
