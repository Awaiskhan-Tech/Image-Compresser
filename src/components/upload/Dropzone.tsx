import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { createSampleFile, SAMPLE_PRESETS, SampleImageMeta } from '../../lib/compression/sample-images';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setErrorMessage(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    processFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length === 0) return;
    setErrorMessage(null);
    processFiles(selectedFiles);
    e.target.value = '';
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const invalidNames: string[] = [];

    const allowedMimes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isAllowedExt = ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp';
      const isAllowedMime = allowedMimes.has(file.type.toLowerCase()) || isAllowedExt;

      if (!isAllowedMime) {
        invalidNames.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (invalidNames.length > 0) {
      setErrorMessage(
        `Skipped unsupported file(s): ${invalidNames.slice(0, 3).join(', ')}${
          invalidNames.length > 3 ? '...' : ''
        }. Please upload JPG, PNG, or WebP.`
      );
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleLoadSample = async (sample: SampleImageMeta) => {
    try {
      setLoadingSample(true);
      setErrorMessage(null);
      const file = await createSampleFile(sample);
      onFilesSelected([file]);
    } catch {
      setErrorMessage('Could not initialize sample image. Please select a local file.');
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Surface: Secondary Sand panel on Charcoal background */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all bg-[#E8DFC9] text-[#25282B] ${
          isDragOver
            ? 'border-[#2563FF] ring-2 ring-[#2563FF]/30'
            : 'border-[#25282B]/25 hover:border-[#25282B]/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
          aria-label="Upload images"
        />

        <div className="flex flex-col items-center justify-center max-w-lg mx-auto pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-[#25282B]/10 text-[#25282B] flex items-center justify-center mb-4">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#25282B] tracking-tight mb-1.5">
            Drag and drop images, or{' '}
            <span className="text-[#2563FF] underline underline-offset-4">browse files</span>
          </h3>

          <p className="text-sm text-[#25282B]/75 mb-4 max-w-md">
            JPG, PNG, and WebP up to 50 MB each. Batch upload supported.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#25282B]/60 font-medium">
            <span>Client-side compression</span>
            <span aria-hidden="true">·</span>
            <span>Zero server uploads</span>
            <span aria-hidden="true">·</span>
            <span>Lossless dimension option</span>
          </div>
        </div>
      </div>

      {/* Error alert toast */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-[#25282B] border border-[#E8DFC9]/20 rounded-xl flex items-center justify-between text-xs text-[#E8DFC9]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#2563FF] shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[#E8DFC9]/70 hover:text-[#E8DFC9] font-medium px-2 py-0.5 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Instant Sample Presets */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-[#E8DFC9]/70">
        <span className="font-medium">Try instant sample:</span>
        {SAMPLE_PRESETS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loadingSample || isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              handleLoadSample(sample);
            }}
            className="px-2.5 py-1 bg-[#E8DFC9]/10 hover:bg-[#E8DFC9]/20 border border-[#E8DFC9]/20 text-[#E8DFC9] rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {sample.title} ({sample.width}×{sample.height})
          </button>
        ))}
      </div>
    </div>
  );
};
