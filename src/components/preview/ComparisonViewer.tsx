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

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ item, targetDisplay }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const res = item.result;
  const originalMeta = item.meta;

  const savings = res ? calculateSavings(originalMeta.originalSize, res.bytes) : { percent: 0, savedBytes: 0 };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(pct));
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  return (
    <div className="bg-[#25282B] text-[#E8DFC9] rounded-2xl border border-[#E8DFC9]/15 overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#E8DFC9] truncate max-w-[200px] sm:max-w-md">
              {originalMeta.name}
            </span>
            {res && (
              <span className="text-xs font-semibold text-[#E8DFC9]/80 flex items-center gap-1">
                {res.targetMet ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563FF]" />
                    <span>Target Met</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#E8DFC9]/60" />
                    <span>Floor Reached</span>
                  </>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#E8DFC9]/60 mt-0.5">
            <span>Original: {formatBytes(originalMeta.originalSize)}</span>
            <span aria-hidden="true">·</span>
            <span>{originalMeta.width}×{originalMeta.height} px</span>
            <span aria-hidden="true">·</span>
            <span>{originalMeta.originalFormat.replace('image/', '').toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center p-0.5 bg-[#25282B] border border-[#E8DFC9]/20 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-[#2563FF] text-[#E8DFC9] font-semibold'
                  : 'text-[#E8DFC9]/65 hover:text-[#E8DFC9]'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-[#2563FF] text-[#E8DFC9] font-semibold'
                  : 'text-[#E8DFC9]/65 hover:text-[#E8DFC9]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side by Side</span>
            </button>
          </div>

          {/* Download button */}
          {res && (
            <button
              onClick={() => downloadSingleFile(item)}
              className="px-3.5 py-1.5 text-xs font-bold text-[#E8DFC9] bg-[#2563FF] hover:bg-[#2563FF]/90 active:bg-[#2563FF]/80 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Surface */}
      <div className="p-4 sm:p-5">
        {viewMode === 'slider' ? (
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            className="relative select-none overflow-hidden rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] h-[340px] sm:h-[420px] cursor-ew-resize flex items-center justify-center"
          >
            {/* Background image (Compressed) */}
            <img
              src={res?.url || item.originalUrl}
              alt="Compressed output"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Foreground image (Original) clipped by sliderPos */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={item.originalUrl}
                alt="Original source"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#2563FF] pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#25282B] border border-[#2563FF] flex items-center justify-center text-[#2563FF] pointer-events-auto shadow-sm">
                <SplitSquareVertical className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Labels overlay */}
            <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#25282B]/90 border border-[#E8DFC9]/20 rounded text-[10px] font-semibold text-[#E8DFC9] uppercase pointer-events-none z-20">
              Original: {formatBytes(originalMeta.originalSize)}
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#25282B]/90 border border-[#2563FF]/50 rounded text-[10px] font-semibold text-[#E8DFC9] uppercase pointer-events-none z-20">
              Compressed: {res ? formatBytes(res.bytes) : 'Processing...'}
            </div>
          </div>
        ) : (
          /* Side by Side View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] overflow-hidden">
              <div className="px-3 py-2 border-b border-[#E8DFC9]/10 flex items-center justify-between text-xs font-semibold text-[#E8DFC9]">
                <span>Original</span>
                <span className="font-mono tabular-nums text-[#E8DFC9]/70">
                  {formatBytes(originalMeta.originalSize)}
                </span>
              </div>
              <div className="h-[260px] flex items-center justify-center p-2">
                <img
                  src={item.originalUrl}
                  alt="Original source"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="px-3 py-1.5 text-[11px] text-[#E8DFC9]/60 border-t border-[#E8DFC9]/10">
                {originalMeta.width} × {originalMeta.height} px
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-[#E8DFC9]/15 bg-[#25282B] overflow-hidden">
              <div className="px-3 py-2 border-b border-[#E8DFC9]/10 flex items-center justify-between text-xs font-semibold text-[#E8DFC9]">
                <span>Compressed</span>
                <span className="font-mono tabular-nums text-[#E8DFC9] font-bold">
                  {res ? formatBytes(res.bytes) : 'Calculating...'}
                </span>
              </div>
              <div className="h-[260px] flex items-center justify-center p-2">
                <img
                  src={res?.url || item.originalUrl}
                  alt="Compressed output"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="px-3 py-1.5 text-[11px] text-[#E8DFC9]/60 border-t border-[#E8DFC9]/10 flex items-center justify-between">
                <span>
                  {res ? `${res.width} × ${res.height} px` : '...'}
                  {res && res.scaleRatio < 1.0 && (
                    <span className="text-[#2563FF] ml-1">
                      (Resized {Math.round(res.scaleRatio * 100)}%)
                    </span>
                  )}
                </span>
                {res && (
                  <span className="font-semibold text-[#2563FF]">
                    -{savings.percent}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row: Clean unboxed layout */}
      {res && (
        <div className="px-5 py-3.5 border-t border-[#E8DFC9]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#E8DFC9]/50 block text-[10px] uppercase font-semibold">Output Size</span>
            <span className="font-mono text-sm font-bold text-[#E8DFC9] tabular-nums">
              {formatBytes(res.bytes)}
            </span>
          </div>
          <div>
            <span className="text-[#E8DFC9]/50 block text-[10px] uppercase font-semibold">Savings</span>
            <span className="font-mono text-sm font-bold text-[#2563FF] tabular-nums">
              -{savings.percent}% ({formatBytes(savings.savedBytes)})
            </span>
          </div>
          <div>
            <span className="text-[#E8DFC9]/50 block text-[10px] uppercase font-semibold">Dimensions</span>
            <span className="font-mono text-sm font-bold text-[#E8DFC9] tabular-nums">
              {res.width}×{res.height}
              {res.scaleRatio < 1 && ` (${Math.round(res.scaleRatio * 100)}%)`}
            </span>
          </div>
          <div>
            <span className="text-[#E8DFC9]/50 block text-[10px] uppercase font-semibold">Format & Duration</span>
            <span className="font-mono text-sm font-bold text-[#E8DFC9] uppercase tabular-nums">
              {res.format.replace('image/', '')} · {res.durationMs}ms
            </span>
          </div>
        </div>
      )}

      {/* Message Note */}
      {res?.message && (
        <div className="px-5 py-2 border-t border-[#E8DFC9]/10 text-xs text-[#E8DFC9]/70">
          <span className="font-semibold text-[#E8DFC9] mr-1">Note:</span>
          {res.message}
        </div>
      )}
    </div>
  );
};
