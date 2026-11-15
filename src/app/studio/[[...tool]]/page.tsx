import type { Metadata } from 'next';
import StudioClient from './StudioClient';

export const metadata: Metadata = {
  title: 'Sanity Studio',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function StudioPage() {
  return <StudioClient />;
}