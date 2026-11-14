import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'webistic-image-compressor',
  title: 'Webistic Image Compressor',
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '6yinrhqf',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
