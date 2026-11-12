import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTargetSize,
  formatBytes,
  calculateSavings,
  getBinarySearchQuality,
  estimateScaleFactor,
  resolveTargetMime,
} from './quality-optimizer';

test('parseTargetSize converts KB and MB properly with binary base 1024', () => {
  assert.equal(parseTargetSize(200, 'KB'), 200 * 1024);
  assert.equal(parseTargetSize(1, 'MB'), 1024 * 1024);
  assert.equal(parseTargetSize(50, 'KB'), 51200);
  assert.equal(parseTargetSize(1.5, 'MB'), Math.round(1.5 * 1024 * 1024));
  // Fallback for invalid numbers
  assert.equal(parseTargetSize(0, 'KB'), 200 * 1024);
  assert.equal(parseTargetSize(-5, 'KB'), 200 * 1024);
});

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(204800, 1), '200 KB');
  assert.equal(formatBytes(1048576, 1), '1 MB');
  assert.equal(formatBytes(1572864, 2), '1.5 MB');
});

test('calculateSavings computes accurate percentage and saved bytes', () => {
  const original = 1000000; // 1 MB approx
  const compressed = 200000; // 200 KB approx
  const savings = calculateSavings(original, compressed);
  assert.equal(savings.savedBytes, 800000);
  assert.equal(savings.percent, 80);

  // When compressed is larger or equal (edge cases)
  const noSavings = calculateSavings(1000, 1200);
  assert.equal(noSavings.savedBytes, 0);
  assert.equal(noSavings.percent, 0);
});

test('getBinarySearchQuality calculates accurate rounded midpoint', () => {
  assert.equal(getBinarySearchQuality(0.0, 1.0), 0.5);
  assert.equal(getBinarySearchQuality(0.5, 1.0), 0.75);
  assert.equal(getBinarySearchQuality(0.5, 0.75), 0.625);
  assert.equal(getBinarySearchQuality(0.12, 0.28), 0.2);
});

test('estimateScaleFactor scales proportionally under target with floor protection', () => {
  // If already under target, ratio should be 1.0
  assert.equal(estimateScaleFactor(1000, 2000), 1.0);

  // If current is 4x target, ideal sqrt ratio is 0.5, with 0.94 safety factor = ~0.47
  const ratio = estimateScaleFactor(400000, 100000, 0.35);
  assert.ok(ratio < 0.5 && ratio >= 0.35);

  // Floor protection prevents extreme pixel destruction
  const flooredRatio = estimateScaleFactor(10000000, 10000, 0.35);
  assert.equal(flooredRatio, 0.35);
});

test('resolveTargetMime provides correct formats and warnings for transparency', () => {
  const jpegWithAlpha = resolveTargetMime('image/png', 'image/jpeg', true);
  assert.equal(jpegWithAlpha.mime, 'image/jpeg');
  assert.equal(jpegWithAlpha.extension, 'jpg');
  assert.ok(jpegWithAlpha.note && jpegWithAlpha.note.includes('replaces transparency'));

  const webpWithAlpha = resolveTargetMime('image/png', 'image/webp', true);
  assert.equal(webpWithAlpha.mime, 'image/webp');
  assert.equal(webpWithAlpha.extension, 'webp');
  assert.ok(webpWithAlpha.note && webpWithAlpha.note.includes('preserves transparency'));

  const originalPng = resolveTargetMime('image/png', 'original', false);
  assert.equal(originalPng.mime, 'image/png');
  assert.equal(originalPng.extension, 'png');
});
