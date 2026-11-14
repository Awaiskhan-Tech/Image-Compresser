import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

const imageBuilder = createImageUrlBuilder(sanityClient);
type ImageSource = Parameters<typeof imageBuilder.image>[0];

function hasAssetReference(
  source: ImageSource | null | undefined,
): source is ImageSource {
  if (!source || typeof source !== 'object' || !('asset' in source)) {
    return false;
  }

  const asset = source.asset;
  return (
    typeof asset === 'object' &&
    asset !== null &&
    '_ref' in asset &&
    typeof asset._ref === 'string' &&
    asset._ref.trim().length > 0
  );
}

interface ImageOptions {
  width: number;
  height?: number;
  fit?: 'crop' | 'max';
}

export function getSanityImageUrl(
  source: ImageSource | null | undefined,
  { width, height, fit = 'max' }: ImageOptions,
): string | undefined {
  if (!hasAssetReference(source)) return undefined;

  let builder = imageBuilder.image(source).width(width).fit(fit).auto('format');
  if (height) builder = builder.height(height);
  return builder.url();
}
