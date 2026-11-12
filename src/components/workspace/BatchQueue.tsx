import React, { useState } from 'react';
import { FileItem } from '../../lib/compression/types';
import { formatBytes, calculateSavings } from '../../lib/compression/quality-optimizer';
import { downloadSingleFile, downloadAllAsZip } from '../../lib/compression/zip-exporter';
import {
  Archive,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';

interface BatchQueueProps {
  items: FileItem[];
  selectedItemId: string | null;
  isProcessing: boolean;
  onSelectItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onUploadMore: () => void;
}

export const BatchQueue: React.FC<BatchQueueProps> = ({
  items,
  selectedItemId,
  isProcessing,
  onSelectItem,
  onRemoveItem,
  onClearAll,
  onUploadMore,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const completedCount = items.filter((i) => i.status === 'done').length;
  const totalOriginalBytes = items.reduce((acc, i) => acc + i.meta.originalSize, 0);
  const totalCompressedBytes = items.reduce((acc, i) => acc + (i.result?.bytes || i.meta.originalSize), 0);
  const totalSavings = calculateSavings(totalOriginalBytes, totalCompressedBytes);

  const handleZipDownload = async () => {
    try {
      setIsZipping(true);
      setZipProgress(10);
      await downloadAllAsZip(items, 'webistic-compressed-images.zip', (pct) => {
        setZipProgress(pct);
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="bg-[#25282B] text-[#E8DFC9] rounded-2xl border border-[#E8DFC9]/15 overflow-hidden shadow-sm">
      {/* Batch Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8DFC9]/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#E8DFC9] tracking-tight">
            Queue ({items.length} {items.length === 1 ? 'file' : 'files'})
          </h4>
          <p className="text-xs text-[#E8DFC9]/60 font-medium">
            {completedCount} of {items.length} ready
            {completedCount > 0 && ` · Saved ${formatBytes(totalSavings.savedBytes)} (-${totalSavings.percent}%)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUploadMore}
            disabled={isProcessing}
            className="px-3 py-1.5 text-xs font-semibold text-[#E8DFC9] bg-[#E8DFC9]/10 hover:bg-[#E8DFC9]/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            + Add More
          </button>

          {completedCount > 1 && (
            <button
              type="button"
              disabled={isZipping || isProcessing}
              onClick={handleZipDownload}
              className="px-3.5 py-1.5 text-xs font-bold text-[#E8DFC9] bg-[#2563FF] hover:bg-[#2563FF]/90 active:bg-[#2563FF]/80 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? `Archiving (${zipProgress}%)...` : `Download All (ZIP)`}</span>
            </button>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClearAll}
            className="p-1.5 text-[#E8DFC9]/50 hover:text-[#E8DFC9] rounded-lg hover:bg-[#E8DFC9]/10 transition-colors cursor-pointer"
            title="Clear queue"
            aria-label="Clear queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className="divide-y divide-[#E8DFC9]/10 max-h-[340px] overflow-y-auto">
        {items.map((item) => {
          const isSelected = item.id === selectedItemId;
          const res = item.result;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`p-3 sm:p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#E8DFC9]/10'
                  : 'hover:bg-[#E8DFC9]/5'
              }`}
            >
              {/* Left thumbnail and details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#25282B] overflow-hidden shrink-0 border border-[#E8DFC9]/20 flex items-center justify-center">
                  <img
                    src={res?.url || item.originalUrl}
                    alt={item.meta.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#E8DFC9] truncate max-w-[150px] sm:max-w-xs">
                      {item.meta.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#2563FF]">
                        (Viewing)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#E8DFC9]/60 font-medium">
                    <span>{formatBytes(item.meta.originalSize)}</span>
                    {res && (
                      <>
                        <span aria-hidden="true">→</span>
                        <span className="font-bold text-[#E8DFC9] tabular-nums">
                          {formatBytes(res.bytes)}
                        </span>
                        <span className="text-[#2563FF] font-semibold tabular-nums">
                          (-{calculateSavings(item.meta.originalSize, res.bytes).percent}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right status and actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'processing' && (
                  <div className="flex items-center gap-1.5 text-xs text-[#2563FF] font-semibold tabular-nums">
                    <div className="w-3 h-3 border-2 border-[#2563FF] border-t-transparent rounded-full animate-spin" />
                    <span>{item.progress}%</span>
                  </div>
                )}

                {item.status === 'idle' && (
                  <span className="text-xs text-[#E8DFC9]/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Queued</span>
                  </span>
                )}

                {item.status === 'done' && res && (
                  <span className="text-xs font-semibold text-[#E8DFC9]/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563FF]" />
                    <span className="hidden sm:inline">Ready</span>
                  </span>
                )}

                {item.status === 'error' && (
                  <span className="text-xs font-semibold text-[#E8DFC9] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[#2563FF]" />
                    <span>Error</span>
                  </span>
                )}

                {/* Single file download */}
                {res && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSingleFile(item);
                    }}
                    className="p-1.5 text-[#E8DFC9]/70 hover:text-[#E8DFC9] rounded-md hover:bg-[#E8DFC9]/10 transition-colors"
                    title="Download this file"
                    aria-label={`Download ${item.meta.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Inspect button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item.id);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'text-[#2563FF] bg-[#2563FF]/20'
                      : 'text-[#E8DFC9]/60 hover:text-[#E8DFC9] hover:bg-[#E8DFC9]/10'
                  }`}
                  title="Inspect"
                  aria-label={`Inspect ${item.meta.name}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="p-1.5 text-[#E8DFC9]/50 hover:text-[#E8DFC9] rounded-md hover:bg-[#E8DFC9]/10 transition-colors"
                  title="Remove"
                  aria-label={`Remove ${item.meta.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
