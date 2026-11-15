'use client';

import { useRef } from 'react';
import { useCompressor } from '@/components/home/CompressorProvider';
import { Dropzone } from '@/components/upload/Dropzone';
import { TargetControls } from '@/components/controls/TargetControls';
import { ComparisonViewer } from '@/components/preview/ComparisonViewer';
import { BatchQueue } from '@/components/workspace/BatchQueue';
import { formatBytes } from '@/lib/compression/quality-optimizer';

export default function HomePage() {
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const {
    items,
    selectedItemId,
    selectedItem,
    targetValue,
    targetUnit,
    outputFormat,
    allowDownscale,
    isProcessing,
    setTargetValue,
    setTargetUnit,
    setOutputFormat,
    setAllowDownscale,
    setSelectedItemId,
    handleFilesSelected,
    handleRunAll,
    handleRemoveItem,
    handleClearAll,
  } = useCompressor();

  const targetDisplay = `${targetValue} ${targetUnit}`;

  return (
    <main className="flex-1">
      {items.length === 0 && (
        <section
          id="upload-section"
          ref={uploadSectionRef}
          className="pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E8DFC9] tracking-tight mb-3">
            Free Online Image Compressor
          </h1>

          <p className="text-sm sm:text-base text-[#E8DFC9]/75 max-w-xl mx-auto leading-relaxed mb-8">
            Compress JPG, PNG and WebP images to a chosen KB or MB size limit.
            Process multiple images in your browser and download your results.
          </p>

          <Dropzone
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
          />
        </section>
      )}

      {items.length > 0 && (
        <section
          id="workspace-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16"
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8DFC9]">
              Free Online Image Compressor
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E8DFC9] mt-2">
              Compress images
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,65fr)_minmax(320px,35fr)] gap-5 lg:gap-6 items-start">
            <div className="min-w-0">
              {selectedItem?.result ? (
                <ComparisonViewer
                  item={selectedItem}
                  targetDisplay={targetDisplay}
                />
              ) : selectedItem ? (
                <div className="rounded-2xl border border-[#E8DFC9]/15 bg-[#E8DFC9]/[0.03] overflow-hidden">
                  <div className="p-4 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-bold">Original image</h2>
                      <p className="text-xs text-[#E8DFC9]/55 mt-1 truncate">
                        {selectedItem.meta.name}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-semibold text-[#E8DFC9]/75">
                      {formatBytes(selectedItem.meta.originalSize)}
                    </span>
                  </div>

                  <div className="min-h-[300px] sm:min-h-[420px] p-4 flex items-center justify-center bg-black/10">
                    <img
                      src={selectedItem.originalUrl}
                      alt={`Original image: ${selectedItem.meta.name}`}
                      className="max-w-full max-h-[400px] object-contain rounded-lg"
                    />
                  </div>

                  <div className="p-4 border-t border-[#E8DFC9]/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#E8DFC9]/50 mb-1">
                        File size
                      </p>
                      <p className="text-sm font-semibold">
                        {formatBytes(selectedItem.meta.originalSize)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#E8DFC9]/50 mb-1">
                        Dimensions
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedItem.meta.width} × {selectedItem.meta.height} px
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#E8DFC9]/50 mb-1">
                        Format
                      </p>
                      <p className="text-sm font-semibold uppercase">
                        {selectedItem.meta.originalFormat.replace('image/', '')}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[#E8DFC9]/10 flex items-center gap-2">
                    {selectedItem.status === 'processing' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#E8DFC9]/30 border-t-[#2563FF] rounded-full animate-spin" />
                        <span className="text-xs text-[#E8DFC9]/70">
                          Compressing image...
                        </span>
                      </>
                    ) : (
                      <p className="text-xs text-[#E8DFC9]/60">
                        Your original image is ready. Adjust your settings and
                        click COMPRESS IMAGE when you're ready.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="min-w-0">
              <TargetControls
                targetValue={targetValue}
                targetUnit={targetUnit}
                outputFormat={outputFormat}
                allowDownscale={allowDownscale}
                isProcessing={isProcessing}
                totalFiles={items.length}
                onTargetChange={(value, unit) => {
                  setTargetValue(value);
                  setTargetUnit(unit);
                }}
                onFormatChange={setOutputFormat}
                onDownscaleToggle={setAllowDownscale}
                onRunCompression={handleRunAll}
              />
            </div>
          </div>

          <div className="mt-6">
            <BatchQueue
              items={items}
              selectedItemId={selectedItemId}
              isProcessing={isProcessing}
              onSelectItem={setSelectedItemId}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onUploadMore={() => {
                uploadSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
            />
          </div>

          <div
            id="upload-section"
            ref={uploadSectionRef}
            className="mt-6"
          >
            <Dropzone
              onFilesSelected={handleFilesSelected}
              isProcessing={isProcessing}
            />
          </div>
        </section>
      )}
    </main>
  );
}