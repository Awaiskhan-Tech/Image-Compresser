import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const imageBuilder = imageUrlBuilder(sanityClient);
type ImageSource = Parameters<typeof imageBuilder.image>[0];

interface ImageOptions {
  width: number;
  height?: number;
  fit?: 'crop' | 'max';
}

export function getSanityImageUrl(
  source: ImageSource | null | undefined,
  { width, height, fit = 'max' }: ImageOptions,
): string | undefined {
  if (!source) return undefined;

  let builder = imageBuilder.image(source).width(width).fit(fit).auto('format');
  if (height) builder = builder.height(height);
  return builder.url();
}
