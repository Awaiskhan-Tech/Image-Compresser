import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '6yinrhqf',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-03-01',
  perspective: 'published',
  useCdn: true,
});
