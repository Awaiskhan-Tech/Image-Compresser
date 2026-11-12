/**
 * Type contracts for Webistic Image Compressor
 */

export type SupportedFormat = 'original' | 'image/jpeg' | 'image/webp' | 'image/png';

export type TargetSizeUnit = 'KB' | 'MB';

export interface CompressionSettings {
  targetBytes: number;
  targetDisplay: string;
  outputFormat: SupportedFormat;
  allowDownscale: boolean;
  minScaleFloor?: number; // e.g. 0.35 (don't downscale smaller than 35% original size)
  maxIterations?: number; // default 8
}

export interface ImageMeta {
  name: string;
  originalSize: number;
  originalFormat: string;
  width: number;
  height: number;
  aspectRatio: number;
  hasAlpha: boolean;
}

export interface CompressionResult {
  blob: Blob;
  url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  quality: number;
  scaleRatio: number;
  iterations: number;
  durationMs: number;
  targetMet: boolean;
  message?: string;
}

export interface FileItem {
  id: string;
  file: File;
  meta: ImageMeta;
  originalUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  result?: CompressionResult;
  error?: string;
}

export interface PresetOption {
  label: string;
  value: number;
  unit: TargetSizeUnit;
  description: string;
  isPopular?: boolean;
}
