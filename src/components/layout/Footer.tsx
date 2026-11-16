'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-black/70 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2563FF] text-white">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-black">Webistic Image Compressor</span>
            <span aria-hidden="true" className="text-black/30">·</span>
            <a
  href="https://webistic.co"
  target="_blank"
  rel="noopener noreferrer"
  className="text-black/60 transition-colors hover:text-[#2563FF]"
>
  Powered by Webistic
</a>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-5 font-medium">
            <Link href="/blog" className="transition-colors hover:text-[#2563FF]">Blog</Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-[#2563FF]">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#2563FF]">Terms of Service</Link>
            <a href="mailto:info@webistic.co" className="flex items-center gap-1.5 transition-colors hover:text-[#2563FF]">
              <Mail className="h-3.5 w-3.5 text-[#2563FF]" />
              <span>info@webistic.co</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};