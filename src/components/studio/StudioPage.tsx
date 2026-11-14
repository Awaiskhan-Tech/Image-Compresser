import { Studio } from 'sanity';
import config from '../../sanity.config';
import { usePageMetadata } from '../blog/usePageMetadata';

export function StudioPage() {
  usePageMetadata({
    title: 'Sanity Studio | Webistic Image Compressor',
    description: 'Content management for the Webistic Image Compressor blog.',
    robots: 'noindex, nofollow',
  });

  return (
    <main className="studio-route h-full min-h-0 flex-1 overflow-auto bg-white text-black">
      <Studio config={config} />
    </main>
  );
}
