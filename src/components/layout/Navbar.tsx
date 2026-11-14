
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Layers, Menu, X } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onUploadClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { label: 'Home', path: '/' },
    { label: 'Presets Guide', path: '/presets-guide' },
    { label: 'Privacy Architecture', path: '/privacy-architecture' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Blog', path: '/blog' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors whitespace-nowrap ${
      isActive
        ? 'text-black font-bold'
        : 'text-black/70 hover:text-[#2563FF]'
    }`;

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileUpload = () => {
    setMobileMenuOpen(false);
    onUploadClick();
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-black border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Brand Wordmark */}
        <Link
          to="/"
          onClick={handleNavigation}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563FF] text-white flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold tracking-tight text-black whitespace-nowrap">
              Webistic <span className="hidden sm:inline">Image </span>Compressor
            </span>

            <span className="text-[9px] sm:text-[10px] font-medium tracking-wide text-black/50 uppercase">
              Powered by Webistic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-medium">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Upload Button - Unchanged */}
        <div className="hidden sm:flex items-center shrink-0">
          <button
            type="button"
            onClick={onUploadClick}
            className="px-3 sm:px-4 py-2 text-xs font-semibold text-[#E8DFC9] bg-[#2563FF] rounded-lg hover:bg-[#2563FF]/90 active:bg-[#2563FF]/80 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            Upload Images
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={handleMobileUpload}
            className="sm:hidden px-3 py-2 text-xs font-semibold text-[#E8DFC9] bg-[#2563FF] rounded-lg hover:bg-[#2563FF]/90 transition-colors"
          >
            Upload
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-black hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#2563FF]/10 text-black font-bold'
                      : 'text-black/70 hover:bg-gray-100 hover:text-[#2563FF]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleMobileUpload}
              className="sm:hidden mt-2 w-full px-3 py-3 text-sm font-semibold text-[#E8DFC9] bg-[#2563FF] rounded-lg hover:bg-[#2563FF]/90 transition-colors"
            >
              Upload Images
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
