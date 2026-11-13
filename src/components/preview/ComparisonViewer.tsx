
import React, { useState, useRef, useEffect } from 'react';
import { FileItem } from '../../lib/compression/types';
import { formatBytes, calculateSavings } from '../../lib/compression/quality-optimizer';
import { downloadSingleFile } from '../../lib/compression/zip-exporter';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Columns,
  SplitSquareVertical,
} from 'lucide-react';

interface ComparisonViewerProps {
  item: FileItem;
  targetDisplay: string;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  item,
  targetDisplay,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>(
    'side-by-side'
  );
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const res = item.result;
  const originalMeta = item.meta;

  const savings = res
    ? calculateSavings(originalMeta.originalSize, res.bytes)
    : { percent: 0, savedBytes: 0 };

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    setIsDragging(true);
    updateSlider(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(event.clientX);
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPos(Math.round(percentage));
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => setIsDragging(false);

    window.addEventListener('pointerup', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, []);

  if (!res) return null;

  const outputFormat = res.format
    .replace('image/', '')
    .toUpperCase();

  const dimensions = `${res.width} × ${res.height} px`;

  return (
    <div className="space-y-5 text-[#E8DFC9]">
      {/* Comparison Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold">
            Image comparison
          </h2>

          <p className="text-xs text-[#E8DFC9]/55 mt-1 truncate">
            {originalMeta.name}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg border border-[#E8DFC9]/15 bg-[#E8DFC9]/5">
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            aria-pressed={viewMode === 'side-by-side'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-[#2563FF] text-white'
                : 'text-[#E8DFC9]/65 hover:text-[#E8DFC9]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side by side
          </button>

          <button
            type="button"
            onClick={() => setViewMode('slider')}
            aria-pressed={viewMode === 'slider'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'slider'
                ? 'bg-[#2563FF] text-white'
                : 'text-[#E8DFC9]/65 hover:text-[#E8DFC9]'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Split slider
          </button>
        </div>
      </div>

      {/* Image Comparison */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Original Image */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-[#E8DFC9]/15 bg-[#E8DFC9]/[0.03]">
            <div className="px-2.5 sm:px-3 py-3 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-bold">Original</span>

              <span className="text-[10px] sm:text-xs font-mono text-[#E8DFC9]/65">
                {formatBytes(originalMeta.originalSize)}
              </span>
            </div>

            <div className="h-[220px] sm:h-[340px] lg:h-[420px] p-2 flex items-center justify-center bg-black/10">
              <img
                src={item.originalUrl}
                alt="Original image"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="px-2.5 sm:px-3 py-2 border-t border-[#E8DFC9]/10">
              <p className="text-[10px] sm:text-xs text-[#E8DFC9]/55">
                {originalMeta.width} × {originalMeta.height} px
              </p>
            </div>
          </div>

          {/* Compressed Image */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-[#2563FF]/40 bg-[#E8DFC9]/[0.03]">
            <div className="px-2.5 sm:px-3 py-3 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#2563FF]">
                Compressed
              </span>

              <span className="text-[10px] sm:text-xs font-mono font-bold text-[#E8DFC9]">
                {formatBytes(res.bytes)}
              </span>
            </div>

            <div className="h-[220px] sm:h-[340px] lg:h-[420px] p-2 flex items-center justify-center bg-black/10">
              <img
                src={res.url}
                alt="Compressed image"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="px-2.5 sm:px-3 py-2 border-t border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-1">
              <p className="text-[10px] sm:text-xs text-[#E8DFC9]/55">
                {dimensions}
              </p>

              {res.scaleRatio < 1 && (
                <span className="text-[10px] font-semibold text-[#2563FF]">
                  Resized
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Split Slider */
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="relative select-none overflow-hidden rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] h-[300px] sm:h-[420px] cursor-ew-resize flex items-center justify-center touch-pan-y"
        >
          <img
            src={res.url}
            alt="Compressed image"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            }}
          >
            <img
              src={item.originalUrl}
              alt="Original image"
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#2563FF] pointer-events-none z-10"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#25282B] border-2 border-[#2563FF] flex items-center justify-center text-[#2563FF] shadow-lg">
              <SplitSquareVertical className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#25282B]/90 border border-[#E8DFC9]/20 rounded-md text-[10px] font-semibold">
            Original
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#25282B]/90 border border-[#2563FF]/50 rounded-md text-[10px] font-semibold">
            Compressed
          </div>
        </div>
      )}

      {/* Image Details */}
      <div className="rounded-xl border border-[#E8DFC9]/15 bg-[#E8DFC9]/[0.03] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E8DFC9]/10">
          <h3 className="text-sm font-bold">Image details</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-3 p-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Original size
            </p>
            <p className="text-sm font-bold font-mono tabular-nums">
              {formatBytes(originalMeta.originalSize)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Compressed size
            </p>
            <p className="text-sm font-bold font-mono tabular-nums text-[#2563FF]">
              {formatBytes(res.bytes)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Savings
            </p>
            <p className="text-sm font-bold font-mono tabular-nums text-[#2563FF]">
              {savings.percent}%
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Dimensions
            </p>
            <p className="text-sm font-bold tabular-nums">
              {dimensions}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Format
            </p>
            <p className="text-sm font-bold">
              {outputFormat}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#E8DFC9]/50 mb-1">
              Duration
            </p>
            <p className="text-sm font-bold font-mono tabular-nums">
              {res.durationMs} ms
            </p>
          </div>
        </div>

        {/* Compression Status */}
        <div className="px-4 py-3 border-t border-[#E8DFC9]/10 flex items-start gap-2">
          {res.targetMet ? (
            <CheckCircle2 className="w-4 h-4 text-[#2563FF] shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#E8DFC9]/60 shrink-0 mt-0.5" />
          )}

          <p className="text-xs text-[#E8DFC9]/70 leading-relaxed">
            {res.message ||
              (res.scaleRatio < 1
                ? 'Image successfully compressed with adjusted dimensions while maintaining its aspect ratio.'
                : 'Successfully compressed while preserving original dimensions.')}
          </p>
        </div>
      </div>

      
      {/* Separate Download Action */}
      <button
        type="button"
        onClick={() => downloadSingleFile(item)}
        className="w-full min-h-12 px-5 py-3 text-sm font-bold text-white bg-[#2563FF] hover:bg-[#2563FF]/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2563FF]/20 active:translate-y-0 active:bg-[#2563FF]/80 rounded-xl transition-all duration-300 ease-out flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <Download className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        DOWNLOAD IMAGE
      </button>


      {!res.targetMet && (
        <p className="text-xs text-[#E8DFC9]/55 text-center">
          The target size could not be reached with the current settings.
          You can adjust your settings and try again.
        </p>
      )}
    </div>
  );
};
