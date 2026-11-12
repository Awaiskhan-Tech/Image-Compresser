import { CompressionResult, CompressionSettings } from './types';
import { loadAndInspectImage, LoadedImageSource } from './image-loader';
import {
  estimateScaleFactor,
  formatBytes,
  getBinarySearchQuality,
  resolveTargetMime,
} from './quality-optimizer';

/**
 * Renders an image onto an HTMLCanvasElement with requested dimensions.
 * For JPEG, paints a clean white background first to avoid black transparency artifacts.
 */
function drawToCanvas(
  source: HTMLImageElement,
  width: number,
  height: number,
  targetMime: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext('2d', { alpha: targetMime !== 'image/jpeg' });
  if (!ctx) {
    throw new Error('Canvas 2D context creation failed.');
  }

  // Smooth bilinear interpolation for downscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (targetMime === 'image/jpeg') {
    // Fill Sand (#E8DFC9) background for JPEG to handle alpha channels gracefully
    ctx.fillStyle = '#E8DFC9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * Wraps canvas.toBlob in a Promise.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

/**
 * Main compression orchestrator.
 * Implements binary search over quality factors with fallback dimension downscaling.
 */
export async function compressImage(
  file: File,
  settings: CompressionSettings,
  onProgress?: (progressPct: number) => void
): Promise<CompressionResult> {
  const startTime = performance.now();

  // 1. Decode and inspect source
  onProgress?.(10);
  const loaded: LoadedImageSource = await loadAndInspectImage(file);
  const { img, meta } = loaded;

  const targetBytes = settings.targetBytes;
  const { mime: targetMime, note: formatNote } = resolveTargetMime(
    meta.originalFormat,
    settings.outputFormat,
    meta.hasAlpha
  );

  let iterationsCount = 0;
  const maxSearchSteps = settings.maxIterations || 7;

  // Special Case: PNG target size handling
  // Browser Canvas 'image/png' ignores quality parameter completely (lossless).
  if (targetMime === 'image/png') {
    onProgress?.(40);
    // Render at 100% dimensions
    let currentCanvas = drawToCanvas(img, meta.width, meta.height, targetMime);
    let blob = await canvasToBlob(currentCanvas, targetMime, 1.0);
    iterationsCount++;

    if (!blob) {
      throw new Error('Failed to encode PNG image blob.');
    }

    let finalWidth = meta.width;
    let finalHeight = meta.height;
    let scaleRatio = 1.0;

    // If already under target, return immediately
    if (blob.size <= targetBytes) {
      onProgress?.(100);
      const url = URL.createObjectURL(blob);
      return {
        blob,
        url,
        bytes: blob.size,
        width: finalWidth,
        height: finalHeight,
        format: targetMime,
        quality: 1.0,
        scaleRatio: 1.0,
        iterations: iterationsCount,
        durationMs: Math.round(performance.now() - startTime),
        targetMet: true,
        message: 'Preserved lossless PNG within target size.',
      };
    }

    // If larger and downscaling allowed, calculate needed downscale
    if (settings.allowDownscale) {
      scaleRatio = estimateScaleFactor(blob.size, targetBytes, settings.minScaleFloor || 0.35);
      finalWidth = Math.max(1, Math.round(meta.width * scaleRatio));
      finalHeight = Math.max(1, Math.round(meta.height * scaleRatio));

      currentCanvas = drawToCanvas(img, finalWidth, finalHeight, targetMime);
      blob = await canvasToBlob(currentCanvas, targetMime, 1.0);
      iterationsCount++;

      onProgress?.(100);
      const url = URL.createObjectURL(blob!);
      const targetMet = (blob?.size || 0) <= targetBytes;

      return {
        blob: blob!,
        url,
        bytes: blob!.size,
        width: finalWidth,
        height: finalHeight,
        format: targetMime,
        quality: 1.0,
        scaleRatio,
        iterations: iterationsCount,
        durationMs: Math.round(performance.now() - startTime),
        targetMet,
        message: targetMet
          ? `Downscaled dimensions to ${finalWidth}×${finalHeight} to meet PNG target.`
          : `PNG is lossless; reached ${formatBytes(blob!.size)}. Switch to WebP to preserve transparency at smaller file sizes.`,
      };
    } else {
      // Downscale not allowed
      onProgress?.(100);
      const url = URL.createObjectURL(blob);
      return {
        blob,
        url,
        bytes: blob.size,
        width: meta.width,
        height: meta.height,
        format: targetMime,
        quality: 1.0,
        scaleRatio: 1.0,
        iterations: iterationsCount,
        durationMs: Math.round(performance.now() - startTime),
        targetMet: false,
        message: `PNG is lossless and produced ${formatBytes(blob.size)}. Enable auto-downscaling or choose WebP to reach ${formatBytes(targetBytes)}.`,
      };
    }
  }

  // Standard Lossy Flow (JPEG & WebP)
  // Step 2: Binary Search on Quality at native dimensions
  let currentWidth = meta.width;
  let currentHeight = meta.height;
  let scaleRatio = 1.0;
  let canvas = drawToCanvas(img, currentWidth, currentHeight, targetMime);

  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let smallestBlobOverTarget: Blob | null = null;
  let smallestBlobOverTargetQuality = 0.05;

  let lowQuality = 0.05;
  let highQuality = 0.98;

  // Run binary search
  for (let i = 0; i < maxSearchSteps; i++) {
    iterationsCount++;
    const testQuality = getBinarySearchQuality(lowQuality, highQuality);
    const progress = 20 + Math.round((i / maxSearchSteps) * 50);
    onProgress?.(progress);

    const testBlob = await canvasToBlob(canvas, targetMime, testQuality);
    if (!testBlob) continue;

    if (testBlob.size <= targetBytes) {
      // Valid candidate under limit! Save it and try higher quality to maximize visual fidelity.
      bestBlob = testBlob;
      bestQuality = testQuality;
      lowQuality = testQuality; // Try pushing quality higher
    } else {
      // Over target. Save as smallest over target reference.
      if (!smallestBlobOverTarget || testBlob.size < smallestBlobOverTarget.size) {
        smallestBlobOverTarget = testBlob;
        smallestBlobOverTargetQuality = testQuality;
      }
      highQuality = testQuality; // Decrease quality
    }

    // Stop if search window has converged closely
    if (Math.abs(highQuality - lowQuality) < 0.03) {
      break;
    }
  }

  // Step 3: Evaluate if native quality search met target
  if (bestBlob) {
    onProgress?.(100);
    const url = URL.createObjectURL(bestBlob);
    return {
      blob: bestBlob,
      url,
      bytes: bestBlob.size,
      width: currentWidth,
      height: currentHeight,
      format: targetMime,
      quality: bestQuality,
      scaleRatio: 1.0,
      iterations: iterationsCount,
      durationMs: Math.round(performance.now() - startTime),
      targetMet: true,
      message: formatNote || 'Successfully compressed while preserving original dimensions.',
    };
  }

  // Target was not met at lowest acceptable quality
  // Step 4: Dimension Resizing Fallback if allowed
  if (settings.allowDownscale && smallestBlobOverTarget) {
    onProgress?.(75);
    const minFloor = settings.minScaleFloor || 0.35;
    scaleRatio = estimateScaleFactor(smallestBlobOverTarget.size, targetBytes, minFloor);
    currentWidth = Math.max(1, Math.round(meta.width * scaleRatio));
    currentHeight = Math.max(1, Math.round(meta.height * scaleRatio));

    // Create downscaled canvas
    canvas = drawToCanvas(img, currentWidth, currentHeight, targetMime);

    // Re-run a fast 4-step binary search on the scaled canvas
    lowQuality = 0.2;
    highQuality = 0.92;
    bestBlob = null;
    bestQuality = 0.75;

    for (let j = 0; j < 5; j++) {
      iterationsCount++;
      const testQuality = getBinarySearchQuality(lowQuality, highQuality);
      onProgress?.(80 + j * 3);

      const testBlob = await canvasToBlob(canvas, targetMime, testQuality);
      if (!testBlob) continue;

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        bestQuality = testQuality;
        lowQuality = testQuality;
      } else {
        highQuality = testQuality;
      }

      if (Math.abs(highQuality - lowQuality) < 0.04) break;
    }

    if (bestBlob) {
      onProgress?.(100);
      const url = URL.createObjectURL(bestBlob);
      return {
        blob: bestBlob,
        url,
        bytes: bestBlob.size,
        width: currentWidth,
        height: currentHeight,
        format: targetMime,
        quality: bestQuality,
        scaleRatio,
        iterations: iterationsCount,
        durationMs: Math.round(performance.now() - startTime),
        targetMet: true,
        message: `Achieved ${formatBytes(bestBlob.size)} by downscaling to ${currentWidth}×${currentHeight}px.`,
      };
    }
  }

  // If still over target or downscaling was disabled:
  const fallbackBlob = smallestBlobOverTarget || (await canvasToBlob(canvas, targetMime, 0.05))!;
  onProgress?.(100);
  const url = URL.createObjectURL(fallbackBlob);
  const isMet = fallbackBlob.size <= targetBytes;

  return {
    blob: fallbackBlob,
    url,
    bytes: fallbackBlob.size,
    width: currentWidth,
    height: currentHeight,
    format: targetMime,
    quality: smallestBlobOverTargetQuality || 0.05,
    scaleRatio,
    iterations: iterationsCount,
    durationMs: Math.round(performance.now() - startTime),
    targetMet: isMet,
    message: isMet
      ? 'Target met.'
      : `Lowest achievable size at this configuration is ${formatBytes(fallbackBlob.size)}. ${
          !settings.allowDownscale
            ? 'Enable auto-downscaling to allow resolution resizing.'
            : 'Target size is extremely small for this image.'
        }`,
  };
}
