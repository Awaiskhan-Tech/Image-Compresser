import { ImageMeta } from './types';

const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB ceiling

export interface LoadedImageSource {
  img: HTMLImageElement;
  meta: ImageMeta;
  objectUrl: string;
}

/**
 * Validates file type and size.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const hasSupportedExt =
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp');

  if (!SUPPORTED_MIME_TYPES.has(type) && !hasSupportedExt) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload JPG, PNG, or WebP images.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 50 MB browser safety limit. Please upload a smaller image.`,
    };
  }

  return { valid: true };
}

/**
 * Checks if an image has alpha transparency by scanning sampled pixel data.
 */
function detectAlphaTransparency(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement('canvas');
    // Sample a downscaled version (up to 64x64) to be fast
    const sampleWidth = Math.min(img.naturalWidth, 64);
    const sampleHeight = Math.min(img.naturalHeight, 64);
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
    const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imageData.data;

    // Check alpha channel (4th byte of RGBA)
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) {
        return true; // Found translucent or transparent pixel
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Loads an image file, decodes natural dimensions, and extracts metadata.
 */
export function loadAndInspectImage(file: File): Promise<LoadedImageSource> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error));
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      if (!width || !height) {
        URL.revokeObjectURL(objectUrl);
        return reject(new Error('Failed to read image dimensions. The image file may be corrupted.'));
      }

      const hasAlpha = file.type === 'image/png' || file.type === 'image/webp'
        ? detectAlphaTransparency(img)
        : false;

      const meta: ImageMeta = {
        name: file.name,
        originalSize: file.size,
        originalFormat: file.type || 'image/jpeg',
        width,
        height,
        aspectRatio: width / height,
        hasAlpha,
      };

      resolve({
        img,
        meta,
        objectUrl,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image file. Please verify it is a valid JPG, PNG, or WebP.'));
    };

    img.src = objectUrl;
  });
}
