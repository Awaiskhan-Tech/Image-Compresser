import JSZip from 'jszip';
import { FileItem } from './types';
import { formatBytes } from './quality-optimizer';

/**
 * Packs all completed compressed files into a single ZIP archive and triggers browser download.
 */
export async function downloadAllAsZip(
  items: FileItem[],
  zipFilename: string = 'webistic-compressed-images.zip',
  onProgress?: (progressPct: number) => void
): Promise<void> {
  const completed = items.filter((item) => item.status === 'done' && item.result);
  if (completed.length === 0) {
    throw new Error('No completed compressed images to download.');
  }

  const zip = new JSZip();
  const usedNames = new Set<string>();

  completed.forEach((item, index) => {
    const res = item.result!;
    const originalName = item.meta.name;
    const dotIndex = originalName.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;
    const ext = res.format === 'image/webp' ? 'webp' : res.format === 'image/png' ? 'png' : 'jpg';

    let fileName = `${baseName}-${formatBytes(res.bytes).replace(/\s+/g, '')}.${ext}`;

    // Ensure unique file names in the zip archive
    if (usedNames.has(fileName)) {
      fileName = `${baseName}-${index + 1}-${formatBytes(res.bytes).replace(/\s+/g, '')}.${ext}`;
    }
    usedNames.add(fileName);

    zip.file(fileName, res.blob);
  });

  onProgress?.(30);

  const zipContent = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(Math.round(metadata.percent));
    }
  );

  onProgress?.(100);

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(zipContent);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}

/**
 * Downloads a single compressed result.
 */
export function downloadSingleFile(item: FileItem): void {
  if (!item.result) return;
  const res = item.result;
  const originalName = item.meta.name;
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;
  const ext = res.format === 'image/webp' ? 'webp' : res.format === 'image/png' ? 'png' : 'jpg';

  const fileName = `${baseName}-${formatBytes(res.bytes).replace(/\s+/g, '')}.${ext}`;

  const link = document.createElement('a');
  link.href = res.url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
