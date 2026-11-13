
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
    (preset) =>
      preset.value === targetValue && preset.unit === targetUnit
  );

  return (
    <div className="bg-[#25282B] text-[#E8DFC9] rounded-2xl border border-[#E8DFC9]/15 p-4 sm:p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2563FF]/50 hover:shadow-xl hover:shadow-[#2563FF]/10">
      {/* Heading */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8DFC9]/10 mb-5">
        <Sliders className="w-4 h-4 text-[#2563FF]" />
        <h2 className="text-base font-bold tracking-tight">
          Compression Settings
        </h2>
      </div>

      {/* Target Size */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-[#E8DFC9]/75">
            Target size
          </label>

          <span className="text-lg font-bold text-[#E8DFC9] tabular-nums">
            {targetValue || 0} {targetUnit}
          </span>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#E8DFC9]/70 mb-2">
            Presets
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_OPTIONS.map((preset) => {
              const isSelected =
                targetValue === preset.value &&
                targetUnit === preset.unit;

              return (
                <button
                  key={`${preset.value}-${preset.unit}`}
                  type="button"
                  onClick={() =>
                    onTargetChange(preset.value, preset.unit)
                  }
                  className={`min-h-10 px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563FF] border-[#2563FF] text-white shadow-sm'
                      : 'bg-[#E8DFC9]/5 border-[#E8DFC9]/15 text-[#E8DFC9]/80 hover:border-[#2563FF]/60 hover:bg-[#2563FF]/10'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Target */}
        <div>
          <label
            htmlFor="custom-target-input"
            className="block text-xs font-semibold text-[#E8DFC9]/70 mb-2"
          >
            Custom target
          </label>

          <div className="flex rounded-lg border border-[#E8DFC9]/20 focus-within:border-[#2563FF] overflow-hidden bg-[#25282B] transition-colors duration-200">
            <input
              id="custom-target-input"
              type="number"
              min="0"
              max="50000"
              step="1"
              value={targetValue || ''}
              onChange={(event) => {
                const value = parseFloat(event.target.value);

                onTargetChange(
                  Number.isNaN(value) ? 0 : value,
                  targetUnit
                );
              }}
              className="w-full min-w-0 px-3 py-2.5 text-sm font-semibold text-[#E8DFC9] bg-transparent focus:outline-none tabular-nums"
              placeholder="200"
            />

            <div className="flex border-l border-[#E8DFC9]/15">
              <button
                type="button"
                onClick={() => onTargetChange(targetValue, 'KB')}
                className={`px-3 text-xs font-bold transition-colors cursor-pointer ${
                  targetUnit === 'KB'
                    ? 'bg-[#2563FF] text-white'
                    : 'text-[#E8DFC9]/60 hover:text-[#E8DFC9]'
                }`}
              >
                KB
              </button>

              <button
                type="button"
                onClick={() => onTargetChange(targetValue, 'MB')}
                className={`px-3 text-xs font-bold border-l border-[#E8DFC9]/15 transition-colors cursor-pointer ${
                  targetUnit === 'MB'
                    ? 'bg-[#2563FF] text-white'
                    : 'text-[#E8DFC9]/60 hover:text-[#E8DFC9]'
                }`}
              >
                MB
              </button>
            </div>
          </div>

          {isCustom && (
            <p className="text-[10px] text-[#2563FF] mt-1.5">
              Custom target selected
            </p>
          )}
        </div>
      </div>

      {/* Output Format */}
      <div className="pt-4 border-t border-[#E8DFC9]/10 mb-5">
        <label className="block text-xs font-semibold text-[#E8DFC9]/75 mb-3">
          Output format
        </label>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'original', label: 'Original' },
              { id: 'image/jpeg', label: 'JPG' },
              { id: 'image/webp', label: 'WebP' },
              { id: 'image/png', label: 'PNG' },
            ] as const
          ).map((format) => {
            const isSelected = outputFormat === format.id;

            return (
              <button
                key={format.id}
                type="button"
                onClick={() => onFormatChange(format.id)}
                className={`py-2.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563FF] border-[#2563FF] text-white'
                    : 'bg-[#E8DFC9]/5 border-[#E8DFC9]/15 text-[#E8DFC9]/75 hover:border-[#2563FF]/60'
                }`}
              >
                {format.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto Downscaling */}
      <div className="pt-4 border-t border-[#E8DFC9]/10 mb-5">
        <label
          htmlFor="downscale-toggle"
          className="flex items-start gap-3 cursor-pointer"
        >
          <input
            id="downscale-toggle"
            type="checkbox"
            checked={allowDownscale}
            onChange={(event) =>
              onDownscaleToggle(event.target.checked)
            }
            className="w-4 h-4 mt-0.5 shrink-0 rounded accent-[#2563FF] cursor-pointer"
          />

          <div>
            <span className="text-xs font-semibold text-[#E8DFC9] flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#2563FF]" />
              Auto-downscaling
            </span>

            <p className="text-[11px] text-[#E8DFC9]/55 leading-relaxed mt-1">
              Maintain aspect ratio and reduce dimensions only when
              necessary to reach the target.
            </p>
          </div>
        </label>
      </div>

      {/* Compress Button */}
      <button
        type="button"
        disabled={isProcessing || totalFiles === 0 || targetValue <= 0}
        onClick={onRunCompression}
        className="w-full min-h-11 px-4 py-3 text-xs font-bold text-white bg-[#2563FF] hover:bg-[#2563FF]/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2563FF]/20 active:translate-y-0 active:bg-[#2563FF]/80 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Compressing {totalFiles} Image(s)...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-white" />
            <span>COMPRESS IMAGE</span>
          </>
        )}
      </button>
    </div>
  );
};
