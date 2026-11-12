import { SupportedFormat, TargetSizeUnit } from './types';

/**
 * Converts a size in KB or MB to exact bytes.
 * Uses 1024 binary multiplier standard for web file upload limits.
 */
export function parseTargetSize(value: number, unit: TargetSizeUnit): number {
  if (value <= 0 || isNaN(value)) {
    return 200 * 1024; // fallback safe default: 200 KB
  }
  const multiplier = unit === 'MB' ? 1024 * 1024 : 1024;
  return Math.round(value * multiplier);
}

/**
 * Format bytes into human-readable string with units (e.g. 198.4 KB or 1.24 MB).
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

/**
 * Computes percentage reduction and saved byte count.
 */
export function calculateSavings(
  originalBytes: number,
  compressedBytes: number
): { percent: number; savedBytes: number } {
  if (originalBytes <= 0) return { percent: 0, savedBytes: 0 };
  const savedBytes = Math.max(0, originalBytes - compressedBytes);
  const percent = Math.round((savedBytes / originalBytes) * 100);
  return { percent, savedBytes };
}

/**
 * Binary search next midpoint for compression quality.
 */
export function getBinarySearchQuality(low: number, high: number): number {
  const midpoint = (low + high) / 2;
  // Round to 3 decimal places to prevent infinite microscopic precision adjustments
  return Math.round(midpoint * 1000) / 1000;
}

/**
 * Estimates optimal scale factor when quality alone cannot achieve target size.
 * Uses square-root area scaling formula with safety buffer.
 */
export function estimateScaleFactor(
  currentBytes: number,
  targetBytes: number,
  floor: number = 0.35
): number {
  if (currentBytes <= targetBytes || currentBytes <= 0) {
    return 1.0;
  }
  // Because image byte size scales approximately with pixel count (width * height),
  // linear dimension ratio scales with sqrt(target / current).
  // Apply a 0.94 safety factor so the first rescaled iteration falls slightly under the ceiling.
  const idealRatio = Math.sqrt(targetBytes / currentBytes) * 0.94;
  return Math.max(floor, Math.min(0.98, Math.round(idealRatio * 100) / 100));
}

/**
 * Determine the target MIME type and extension based on user selection,
 * source format, and alpha transparency presence.
 */
export function resolveTargetMime(
  inputMime: string,
  requestedFormat: SupportedFormat,
  hasAlpha: boolean = false
): { mime: string; extension: string; note?: string } {
  if (requestedFormat !== 'original') {
    switch (requestedFormat) {
      case 'image/jpeg':
        return {
          mime: 'image/jpeg',
          extension: 'jpg',
          note: hasAlpha ? 'Converting transparent PNG to JPEG replaces transparency with solid background.' : undefined,
        };
      case 'image/webp':
        return {
          mime: 'image/webp',
          extension: 'webp',
          note: hasAlpha ? 'WebP preserves transparency with lossy compression.' : undefined,
        };
      case 'image/png':
        return {
          mime: 'image/png',
          extension: 'png',
          note: 'PNG uses lossless compression; for aggressive target sizes, consider WebP.',
        };
    }
  }

  // If format is 'original'
  if (inputMime === 'image/png') {
    return { mime: 'image/png', extension: 'png' };
  }
  if (inputMime === 'image/webp') {
    return { mime: 'image/webp', extension: 'webp' };
  }
  return { mime: 'image/jpeg', extension: 'jpg' };
}
