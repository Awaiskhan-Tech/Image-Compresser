import React from 'react';
import { Layers } from 'lucide-react';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  onUploadClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection, onUploadClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#25282B] text-[#E8DFC9] border-b border-[#E8DFC9]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2563FF] text-[#E8DFC9] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-[#E8DFC9] whitespace-nowrap">
              Webistic <span className="hidden xs:inline sm:inline">Image </span>Compressor
            </span>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-wide text-[#E8DFC9]/60 uppercase">
              Powered by Webistic
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#E8DFC9]/75">
          <button
            onClick={() => onScrollToSection('workspace-section')}
            className="hover:text-[#E8DFC9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Workspace
          </button>
          <button
            onClick={() => onScrollToSection('presets-reference')}
            className="hover:text-[#E8DFC9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Presets Guide
          </button>
          <button
            onClick={() => onScrollToSection('privacy-reference')}
            className="hover:text-[#E8DFC9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Privacy Architecture
          </button>
          <button
            onClick={() => onScrollToSection('faq-reference')}
            className="hover:text-[#E8DFC9] transition-colors whitespace-nowrap cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onUploadClick}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#E8DFC9] bg-[#2563FF] rounded-lg hover:bg-[#2563FF]/90 active:bg-[#2563FF]/80 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span className="sm:hidden">Upload</span>
            <span className="hidden sm:inline">Upload Images</span>
          </button>
        </div>
      </div>
    </header>
  );
};
