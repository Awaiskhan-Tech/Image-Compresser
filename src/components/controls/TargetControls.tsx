import React from 'react';
import { TargetSizeUnit, SupportedFormat } from '../../lib/compression/types';
import { Sliders, Maximize2, Zap } from 'lucide-react';

export interface TargetPreset {
  value: number;
  unit: TargetSizeUnit;
  label: string;
  tag?: string;
}

export const PRESET_OPTIONS: TargetPreset[] = [
  { value: 50, unit: 'KB', label: '50 KB', tag: 'Portals' },
  { value: 100, unit: 'KB', label: '100 KB', tag: 'Passports' },
  { value: 150, unit: 'KB', label: '150 KB' },
  { value: 200, unit: 'KB', label: '200 KB', tag: 'Standard' },
  { value: 250, unit: 'KB', label: '250 KB' },
  { value: 500, unit: 'KB', label: '500 KB', tag: 'Web' },
  { value: 1, unit: 'MB', label: '1 MB', tag: 'Email' },
  { value: 2, unit: 'MB', label: '2 MB' },
];

interface TargetControlsProps {
  targetValue: number;
  targetUnit: TargetSizeUnit;
  outputFormat: SupportedFormat;
  allowDownscale: boolean;
  isProcessing: boolean;
  totalFiles: number;
  onTargetChange: (value: number, unit: TargetSizeUnit) => void;
  onFormatChange: (format: SupportedFormat) => void;
  onDownscaleToggle: (allow: boolean) => void;
  onRunCompression: () => void;
}

export const TargetControls: React.FC<TargetControlsProps> = ({
  targetValue,
  targetUnit,
  outputFormat,
  allowDownscale,
  isProcessing,
  totalFiles,
  onTargetChange,
  onFormatChange,
  onDownscaleToggle,
  onRunCompression,
}) => {
  const isCustom = !PRESET_OPTIONS.some(
    (p) => p.value === targetValue && p.unit === targetUnit
  );

  return (
    <div className="bg-[#25282B] text-[#E8DFC9] rounded-2xl border border-[#E8DFC9]/15 p-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC9]/10 mb-5">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-[#E8DFC9]/70" />
          <h4 className="text-sm font-bold tracking-tight text-[#E8DFC9]">
            Compression Settings
          </h4>
        </div>
        <div className="text-xs text-[#E8DFC9]/60 font-medium tabular-nums">
          Ceiling: <span className="text-[#E8DFC9] font-bold">{targetValue} {targetUnit}</span>
          {isCustom && ' (Custom)'}
        </div>
      </div>

      {/* Preset Chips */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#E8DFC9]/75 uppercase tracking-wider">
            Target Size Presets
          </label>
          <span className="text-[11px] text-[#E8DFC9]/50">Default: 200 KB</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {PRESET_OPTIONS.map((preset) => {
            const isSelected =
              targetValue === preset.value && targetUnit === preset.unit;
            return (
              <button
                key={`${preset.value}-${preset.unit}`}
                type="button"
                onClick={() => onTargetChange(preset.value, preset.unit)}
                className={`py-2 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#2563FF] border-[#2563FF] text-[#E8DFC9] shadow-xs'
                    : 'bg-[#E8DFC9]/5 border-[#E8DFC9]/15 text-[#E8DFC9]/80 hover:border-[#E8DFC9]/40 hover:text-[#E8DFC9]'
                }`}
              >
                <span>{preset.label}</span>
                {preset.tag && (
                  <span
                    className={`text-[9px] font-normal mt-0.5 ${
                      isSelected ? 'text-[#E8DFC9]' : 'text-[#E8DFC9]/50'
                    }`}
                  >
                    {preset.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Row: Custom size & Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 pt-4 border-t border-[#E8DFC9]/10">
        {/* Custom Target Input */}
        <div>
          <label
            htmlFor="custom-target-input"
            className="block text-xs font-semibold text-[#E8DFC9]/75 uppercase tracking-wider mb-2"
          >
            Custom Target
          </label>
          <div className="flex rounded-lg border border-[#E8DFC9]/20 focus-within:border-[#2563FF] overflow-hidden bg-[#25282B]">
            <input
              id="custom-target-input"
              type="number"
              min="5"
              max="50000"
              step="1"
              value={targetValue || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onTargetChange(isNaN(val) ? 0 : val, targetUnit);
              }}
              className="w-full px-3 py-1.5 text-sm font-semibold text-[#E8DFC9] bg-transparent focus:outline-none tabular-nums placeholder-[#E8DFC9]/40"
              placeholder="e.g. 200"
            />
            <div className="flex border-l border-[#E8DFC9]/15 bg-[#25282B]">
              <button
                type="button"
                onClick={() => onTargetChange(targetValue, 'KB')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  targetUnit === 'KB'
                    ? 'bg-[#2563FF] text-[#E8DFC9]'
                    : 'text-[#E8DFC9]/60 hover:text-[#E8DFC9]'
                }`}
              >
                KB
              </button>
              <button
                type="button"
                onClick={() => onTargetChange(targetValue, 'MB')}
                className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer border-l border-[#E8DFC9]/15 ${
                  targetUnit === 'MB'
                    ? 'bg-[#2563FF] text-[#E8DFC9]'
                    : 'text-[#E8DFC9]/60 hover:text-[#E8DFC9]'
                }`}
              >
                MB
              </button>
            </div>
          </div>
        </div>

        {/* Output Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#E8DFC9]/75 uppercase tracking-wider mb-2">
            Output Format
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#25282B] border border-[#E8DFC9]/20 rounded-lg">
            {(
              [
                { id: 'original', label: 'Original' },
                { id: 'image/jpeg', label: 'JPG' },
                { id: 'image/webp', label: 'WebP' },
                { id: 'image/png', label: 'PNG' },
              ] as const
            ).map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onFormatChange(fmt.id)}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  outputFormat === fmt.id
                    ? 'bg-[#2563FF] text-[#E8DFC9] font-bold'
                    : 'text-[#E8DFC9]/65 hover:text-[#E8DFC9]'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-Downscale Switch & Compress Action */}
      <div className="pt-4 border-t border-[#E8DFC9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <label
          htmlFor="downscale-toggle"
          className="flex items-start gap-2.5 cursor-pointer"
        >
          <input
            id="downscale-toggle"
            type="checkbox"
            checked={allowDownscale}
            onChange={(e) => onDownscaleToggle(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-[#E8DFC9]/30 bg-[#25282B] accent-[#2563FF] cursor-pointer"
          />
          <div>
            <span className="text-xs font-semibold text-[#E8DFC9] flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-[#E8DFC9]/70" />
              Allow auto-downscaling if quality reduction alone cannot reach target
            </span>
            <p className="text-[11px] text-[#E8DFC9]/55 max-w-lg">
              Maintains aspect ratio and downscales dimensions only when necessary to meet your strict KB limit.
            </p>
          </div>
        </label>

        {/* Primary Action Button */}
        <button
          type="button"
          disabled={isProcessing || totalFiles === 0}
          onClick={onRunCompression}
          className="px-5 py-2 text-xs font-bold text-[#E8DFC9] bg-[#2563FF] hover:bg-[#2563FF]/90 active:bg-[#2563FF]/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          {isProcessing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-[#E8DFC9]/30 border-t-[#E8DFC9] rounded-full animate-spin" />
              <span>Optimizing {totalFiles} File(s)...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-[#E8DFC9]" />
              <span>
                Compress {totalFiles > 1 ? `All ${totalFiles} Images` : 'Image'} to {targetValue} {targetUnit}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
