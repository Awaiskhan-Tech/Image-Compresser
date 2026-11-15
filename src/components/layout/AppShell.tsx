'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CompressorProvider } from '@/components/home/CompressorProvider';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isStudioRoute = pathname.startsWith('/studio');

  const handleUploadClick = useCallback(() => {
    if (pathname !== '/') {
      router.push('/');
    }

    window.setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, pathname === '/' ? 0 : 200);
  }, [pathname, router]);

  return (
    <div className={`min-h-screen bg-[#25282B] text-[#E8DFC9] flex flex-col font-sans ${isStudioRoute ? 'h-dvh overflow-hidden' : ''}`}>
      {!isStudioRoute && <Navbar onUploadClick={handleUploadClick} />}
      <CompressorProvider>{children}</CompressorProvider>
      {!isStudioRoute && <Footer />}
    </div>
  );
}