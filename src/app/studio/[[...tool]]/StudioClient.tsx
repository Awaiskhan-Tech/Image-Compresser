'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export default function StudioClient() {
  return (
    <div className="h-dvh overflow-hidden">
      <NextStudio config={config} />
    </div>
  );
}