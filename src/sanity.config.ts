import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'webistic-image-compressor',
  title: 'Webistic Image Compressor',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6yinrhqf',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
