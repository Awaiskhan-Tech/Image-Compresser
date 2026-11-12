import React, { useState, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Dropzone } from './components/upload/Dropzone';
import { TargetControls } from './components/controls/TargetControls';
import { ComparisonViewer } from './components/preview/ComparisonViewer';
import { BatchQueue } from './components/workspace/BatchQueue';
import { ReferenceSection } from './components/sections/ReferenceSection';
import { Footer } from './components/layout/Footer';
import {
  FileItem,
  SupportedFormat,
  TargetSizeUnit,
  CompressionSettings,
} from './lib/compression/types';
import { loadAndInspectImage } from './lib/compression/image-loader';
import { compressImage } from './lib/compression/engine';
import { parseTargetSize } from './lib/compression/quality-optimizer';

export default function App() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [targetValue, setTargetValue] = useState<number>(200); // 200 KB default
  const [targetUnit, setTargetUnit] = useState<TargetSizeUnit>('KB');
  const [outputFormat, setOutputFormat] = useState<SupportedFormat>('original');
  const [allowDownscale, setAllowDownscale] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0] || null;
  const targetDisplay = `${targetValue} ${targetUnit}`;

  // Ingest newly added files
  const handleFilesSelected = async (newFiles: File[]) => {
    const newItems: FileItem[] = [];

    for (const file of newFiles) {
      try {
        const loaded = await loadAndInspectImage(file);
        const item: FileItem = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          meta: loaded.meta,
          originalUrl: loaded.objectUrl,
          status: 'idle',
          progress: 0,
        };
        newItems.push(item);
      } catch (err: any) {
        console.error('File load failed:', err);
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => {
        const updated = [...prev, ...newItems];
        if (!selectedItemId) {
          setSelectedItemId(newItems[0].id);
        }
        return updated;
      });

      // Scroll smoothly to workspace
      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);

      // Automatically run initial compression pass for immediate user feedback
      runCompressionForItems(newItems);
    }
  };

  // Run compression on specified items
  const runCompressionForItems = async (
    itemsToProcess: FileItem[],
    overrideTargetValue?: number,
    overrideTargetUnit?: TargetSizeUnit,
    overrideFormat?: SupportedFormat,
    overrideDownscale?: boolean
  ) => {
    if (itemsToProcess.length === 0) return;
    setIsProcessing(true);

    const activeTargetVal = overrideTargetValue !== undefined ? overrideTargetValue : targetValue;
    const activeTargetUnit = overrideTargetUnit !== undefined ? overrideTargetUnit : targetUnit;
    const activeFormat = overrideFormat !== undefined ? overrideFormat : outputFormat;
    const activeDownscale = overrideDownscale !== undefined ? overrideDownscale : allowDownscale;

    const activeTargetBytes = parseTargetSize(activeTargetVal, activeTargetUnit);
    const activeTargetDisplay = `${activeTargetVal} ${activeTargetUnit}`;

    const settings: CompressionSettings = {
      targetBytes: activeTargetBytes,
      targetDisplay: activeTargetDisplay,
      outputFormat: activeFormat,
      allowDownscale: activeDownscale,
      minScaleFloor: 0.35,
    };

    for (const item of itemsToProcess) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i
        )
      );

      try {
        const result = await compressImage(item.file, settings, (progressPct) => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, progress: progressPct } : i
            )
          );
        });

        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'done', progress: 100, result, error: undefined }
              : i
          )
        );
      } catch (err: any) {
        console.error(`Compression failed for ${item.meta.name}:`, err);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'error',
                  progress: 0,
                  error: err?.message || 'Compression failed',
                }
              : i
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const handleRunAll = () => {
    if (items.length === 0) return;
    runCompressionForItems(items);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (selectedItemId === id) {
        setSelectedItemId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
      if (item.result?.url) URL.revokeObjectURL(item.result.url);
    });
    setItems([]);
    setSelectedItemId(null);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPreset = (val: number, unit: TargetSizeUnit) => {
    setTargetValue(val);
    setTargetUnit(unit);
    if (items.length > 0) {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
      runCompressionForItems(items, val, unit);
    } else {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#25282B] text-[#E8DFC9] flex flex-col font-sans">
      {/* Minimal Top Navigation */}
      <Navbar
        onScrollToSection={handleScrollToSection}
        onUploadClick={() => uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      <main className="flex-1">
        {/* Focused Hero & Upload Section */}
        <section
          ref={uploadSectionRef}
          className="pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E8DFC9] tracking-tight mb-3">
            Exact file-size image compression
          </h1>
          <p className="text-sm sm:text-base text-[#E8DFC9]/75 max-w-xl mx-auto leading-relaxed mb-8">
            Compress JPG, PNG, and WebP images to strict KB or MB limits for portal uploads and web performance—with maximum fidelity and zero server uploads.
          </p>

          {/* Primary Upload Dropzone (Sand surface on Charcoal) */}
          <Dropzone
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
          />
        </section>

        {/* Compression Workspace (Focus when items exist) */}
        {items.length > 0 && (
          <section
            id="workspace-section"
            ref={workspaceRef}
            className="pb-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-5"
          >
            {/* Target Settings */}
            <TargetControls
              targetValue={targetValue}
              targetUnit={targetUnit}
              outputFormat={outputFormat}
              allowDownscale={allowDownscale}
              isProcessing={isProcessing}
              totalFiles={items.length}
              onTargetChange={(val, unit) => {
                setTargetValue(val);
                setTargetUnit(unit);
                runCompressionForItems(items, val, unit);
              }}
              onFormatChange={(fmt) => {
                setOutputFormat(fmt);
                runCompressionForItems(items, undefined, undefined, fmt);
              }}
              onDownscaleToggle={(allow) => {
                setAllowDownscale(allow);
                runCompressionForItems(items, undefined, undefined, undefined, allow);
              }}
              onRunCompression={handleRunAll}
            />

            {/* Interactive Before & After Visual Comparison */}
            {selectedItem && (
              <ComparisonViewer
                item={selectedItem}
                targetDisplay={targetDisplay}
              />
            )}

            {/* Batch Queue & Summary */}
            <BatchQueue
              items={items}
              selectedItemId={selectedItemId}
              isProcessing={isProcessing}
              onSelectItem={(id) => setSelectedItemId(id)}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
              onUploadMore={() => uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />
          </section>
        )}

        {/* Unified Reference & Guidelines Section */}
        <div id="presets-reference">
          <div id="privacy-reference">
            <div id="faq-reference">
              <ReferenceSection onSelectPreset={handleSelectPreset} />
            </div>
          </div>
        </div>
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
