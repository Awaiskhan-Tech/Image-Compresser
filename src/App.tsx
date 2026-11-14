
import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { PresetsGuide } from './components/pages/PresetsGuide';
import { PrivacyArchitecture } from './components/pages/PrivacyArchitecture';
import { HowItWorks } from './components/pages/HowItWorks';
import { FAQ } from './components/pages/FAQ';

import { Navbar } from './components/layout/Navbar';
import { Dropzone } from './components/upload/Dropzone';
import { TargetControls } from './components/controls/TargetControls';
import { ComparisonViewer } from './components/preview/ComparisonViewer';
import { BatchQueue } from './components/workspace/BatchQueue';
import { Footer } from './components/layout/Footer';
import { BlogArticlePage } from './components/blog/BlogArticlePage';
import { BlogListingPage } from './components/blog/BlogListingPage';
import { StudioPage } from './components/studio/StudioPage';

import {
  FileItem,
  SupportedFormat,
  TargetSizeUnit,
  CompressionSettings,
} from './lib/compression/types';

import { loadAndInspectImage } from './lib/compression/image-loader';
import { compressImage } from './lib/compression/engine';
import { parseTargetSize, formatBytes } from './lib/compression/quality-optimizer';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [targetValue, setTargetValue] = useState<number>(200);
  const [targetUnit, setTargetUnit] = useState<TargetSizeUnit>('KB');
  const [outputFormat, setOutputFormat] = useState<SupportedFormat>('original');
  const [allowDownscale, setAllowDownscale] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const selectedItem =
    items.find((item) => item.id === selectedItemId) || items[0] || null;

  const targetDisplay = `${targetValue} ${targetUnit}`;
  const isStudioRoute = location.pathname.startsWith('/studio');

  // Load images and immediately make them available for preview.
  const handleFilesSelected = async (newFiles: File[]) => {
    const newItems: FileItem[] = [];

    for (const file of newFiles) {
      try {
        const loaded = await loadAndInspectImage(file);

        const item: FileItem = {
          id: `${file.name}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)}`,
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
      // Select the first newly uploaded image immediately.
      setSelectedItemId((currentId) => currentId || newItems[0].id);

      setItems((prev) => [...prev, ...newItems]);

      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  // Compress images only after the user clicks COMPRESS IMAGE.
  const runCompressionForItems = async (
    itemsToProcess: FileItem[],
    overrideTargetValue?: number,
    overrideTargetUnit?: TargetSizeUnit,
    overrideFormat?: SupportedFormat,
    overrideDownscale?: boolean
  ) => {
    if (itemsToProcess.length === 0 || isProcessing) return;

    setIsProcessing(true);

    const activeTargetVal =
      overrideTargetValue !== undefined ? overrideTargetValue : targetValue;

    const activeTargetUnit =
      overrideTargetUnit !== undefined ? overrideTargetUnit : targetUnit;

    const activeFormat =
      overrideFormat !== undefined ? overrideFormat : outputFormat;

    const activeDownscale =
      overrideDownscale !== undefined ? overrideDownscale : allowDownscale;

    const activeTargetBytes = parseTargetSize(
      activeTargetVal,
      activeTargetUnit
    );

    const settings: CompressionSettings = {
      targetBytes: activeTargetBytes,
      targetDisplay: `${activeTargetVal} ${activeTargetUnit}`,
      outputFormat: activeFormat,
      allowDownscale: activeDownscale,
      minScaleFloor: 0.35,
    };

    try {
      for (const item of itemsToProcess) {
        setItems((prev) =>
          prev.map((current) =>
            current.id === item.id
              ? {
                  ...current,
                  status: 'processing',
                  progress: 10,
                }
              : current
          )
        );

        try {
          const result = await compressImage(
            item.file,
            settings,
            (progressPct) => {
              setItems((prev) =>
                prev.map((current) =>
                  current.id === item.id
                    ? { ...current, progress: progressPct }
                    : current
                )
              );
            }
          );

          setItems((prev) =>
            prev.map((current) =>
              current.id === item.id
                ? {
                    ...current,
                    status: 'done',
                    progress: 100,
                    result,
                    error: undefined,
                  }
                : current
            )
          );
        } catch (err: any) {
          console.error(`Compression failed for ${item.meta.name}:`, err);

          setItems((prev) =>
            prev.map((current) =>
              current.id === item.id
                ? {
                    ...current,
                    status: 'error',
                    progress: 0,
                    error: err?.message || 'Compression failed',
                  }
                : current
            )
          );
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunAll = () => {
    if (items.length === 0 || isProcessing) return;

    runCompressionForItems(items);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);

      if (itemToRemove?.originalUrl) {
        URL.revokeObjectURL(itemToRemove.originalUrl);
      }

      if (itemToRemove?.result?.url) {
        URL.revokeObjectURL(itemToRemove.result.url);
      }

      const filtered = prev.filter((item) => item.id !== id);

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

  const handleUploadClick = () => {
    const isHomePage = location.pathname === '/';

    navigate('/');

    setTimeout(() => {
      uploadSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, isHomePage ? 0 : 150);
  };

  const handleSelectPreset = (value: number, unit: TargetSizeUnit) => {
    const isHomePage = location.pathname === '/';

    setTargetValue(value);
    setTargetUnit(unit);

    navigate('/');

    setTimeout(() => {
      if (items.length > 0) {
        workspaceRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        uploadSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, isHomePage ? 0 : 150);
  };

  return (
    <div
      className={`min-h-screen bg-[#25282B] text-[#E8DFC9] flex flex-col font-sans ${
        isStudioRoute ? 'h-dvh overflow-hidden' : ''
      }`}
    >
      {!isStudioRoute && <Navbar onUploadClick={handleUploadClick} />}

      <Routes>
        <Route path="/studio/*" element={<StudioPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />

        <Route
          path="/"
          element={
            <main className="flex-1">
              {/* Initial Upload Screen */}
              {items.length === 0 && (
                <section
                  ref={uploadSectionRef}
                  className="pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#E8DFC9] tracking-tight mb-3">
                    Exact file-size image compression
                  </h1>

                  <p className="text-sm sm:text-base text-[#E8DFC9]/75 max-w-xl mx-auto leading-relaxed mb-8">
                    Compress JPG, PNG, and WebP images to strict KB or MB
                    limits for portal uploads and web performance—with
                    maximum fidelity and zero server uploads.
                  </p>

                  <Dropzone
                    onFilesSelected={handleFilesSelected}
                    isProcessing={isProcessing}
                  />
                </section>
              )}

              {/* Compression Workspace */}
              {items.length > 0 && (
                <section
                  id="workspace-section"
                  ref={workspaceRef}
                  className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16"
                >
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8DFC9]">
                      Compress images
                    </h1>

                    <p className="text-sm text-[#E8DFC9]/65 mt-2">
                      All images will be compressed with the best quality and
                      filesize ratio.
                    </p>
                  </div>

                  {/* Main 65 / 35 Workspace */}
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,65fr)_minmax(320px,35fr)] gap-5 lg:gap-6 items-start">

                    {/* Left: Original Preview or Compression Results */}
                    <div className="min-w-0">
                      {selectedItem?.result ? (
                        <ComparisonViewer
                          item={selectedItem}
                          targetDisplay={targetDisplay}
                        />
                      ) : selectedItem ? (
                        <div className="rounded-2xl border border-[#E8DFC9]/15 bg-[#E8DFC9]/[0.03] overflow-hidden">

                          {/* Original Image Header */}
                          <div className="p-4 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="text-base font-bold">
                                Original image
                              </h2>

                              <p className="text-xs text-[#E8DFC9]/55 mt-1 truncate">
                                {selectedItem.meta.name}
                              </p>
                            </div>

                            <span className="text-xs font-mono font-semibold text-[#E8DFC9]/75">
                              {formatBytes(selectedItem.meta.originalSize)}
                            </span>
                          </div>

                          {/* Original Image Preview */}
                          <div className="min-h-[300px] sm:min-h-[420px] p-4 flex items-center justify-center bg-black/10">
                            <img
                              src={selectedItem.originalUrl}
                              alt={`Original image: ${selectedItem.meta.name}`}
                              className="max-w-full max-h-[400px] object-contain rounded-lg"
                            />
                          </div>

                          {/* Original Image Information */}
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

                          {/* Upload / Compression Status */}
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
                                Your original image is ready. Adjust your
                                settings and click COMPRESS IMAGE when you're ready.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Right: Compression Settings */}
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
                        onFormatChange={(format) => {
                          setOutputFormat(format);
                        }}
                        onDownscaleToggle={(allow) => {
                          setAllowDownscale(allow);
                        }}
                        onRunCompression={handleRunAll}
                      />
                    </div>
                  </div>

                  {/* Batch Queue */}
                  <div className="mt-6">
                    <BatchQueue
                      items={items}
                      selectedItemId={selectedItemId}
                      isProcessing={isProcessing}
                      onSelectItem={(id) => setSelectedItemId(id)}
                      onRemoveItem={handleRemoveItem}
                      onClearAll={handleClearAll}
                      onUploadMore={() => {
                        uploadSectionRef.current?.scrollIntoView({
                          behavior: 'smooth',
                        });
                      }}
                    />
                  </div>

                  {/* Upload More Images */}
                  <div
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
          }
        />

        <Route
          path="/presets-guide"
          element={<PresetsGuide onSelectPreset={handleSelectPreset} />}
        />

        <Route
          path="/privacy-architecture"
          element={<PrivacyArchitecture />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />
      </Routes>

      {!isStudioRoute && <Footer />}
    </div>
  );
}
