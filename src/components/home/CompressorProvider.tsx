'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FileItem,
  SupportedFormat,
  TargetSizeUnit,
  CompressionSettings,
} from '@/lib/compression/types';

import { loadAndInspectImage } from '@/lib/compression/image-loader';
import { compressImage } from '@/lib/compression/engine';
import { parseTargetSize } from '@/lib/compression/quality-optimizer';

interface CompressorContextValue {
  items: FileItem[];
  selectedItemId: string | null;
  selectedItem: FileItem | null;
  targetValue: number;
  targetUnit: TargetSizeUnit;
  outputFormat: SupportedFormat;
  allowDownscale: boolean;
  isProcessing: boolean;
  setTargetValue: (value: number) => void;
  setTargetUnit: (unit: TargetSizeUnit) => void;
  setOutputFormat: (format: SupportedFormat) => void;
  setAllowDownscale: (allow: boolean) => void;
  setSelectedItemId: (id: string | null) => void;
  handleFilesSelected: (files: File[]) => Promise<void>;
  handleRunAll: () => void;
  handleRemoveItem: (id: string) => void;
  handleClearAll: () => void;
}

const CompressorContext = createContext<CompressorContextValue | null>(null);

export function CompressorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [targetValue, setTargetValue] = useState(200);
  const [targetUnit, setTargetUnit] = useState<TargetSizeUnit>('KB');
  const [outputFormat, setOutputFormat] = useState<SupportedFormat>('original');
  const [allowDownscale, setAllowDownscale] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const itemsRef = useRef<FileItem[]>([]);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);

  const commitItems = useCallback(
    (update: (current: FileItem[]) => FileItem[]) => {
      if (!mountedRef.current) return;

      const nextItems = update(itemsRef.current);
      itemsRef.current = nextItems;
      setItems(nextItems);
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.originalUrl);

        if (item.result?.url) {
          URL.revokeObjectURL(item.result.url);
        }
      }

      itemsRef.current = [];
    };
  }, []);

  const selectedItem =
    items.find((item) => item.id === selectedItemId) || items[0] || null;

  const handleFilesSelected = useCallback(
    async (newFiles: File[]) => {
      const newItems: FileItem[] = [];

      for (const file of newFiles) {
        if (!mountedRef.current) {
          for (const pending of newItems) {
            URL.revokeObjectURL(pending.originalUrl);
          }
          return;
        }

        try {
          const loaded = await loadAndInspectImage(file);

          if (!mountedRef.current) {
            URL.revokeObjectURL(loaded.objectUrl);

            for (const pending of newItems) {
              URL.revokeObjectURL(pending.originalUrl);
            }

            return;
          }

          newItems.push({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            file,
            meta: loaded.meta,
            originalUrl: loaded.objectUrl,
            status: 'idle',
            progress: 0,
          });
        } catch (error) {
          console.error('File load failed:', error);
        }
      }

      if (newItems.length > 0 && mountedRef.current) {
        commitItems((previous) => [...previous, ...newItems]);

        setSelectedItemId((current) => current || newItems[0].id);
      }
    },
    [commitItems]
  );

  const handleRunAll = useCallback(async () => {
    const itemsToProcess = itemsRef.current;

    if (itemsToProcess.length === 0 || processingRef.current) return;

    processingRef.current = true;
    setIsProcessing(true);

    const settings: CompressionSettings = {
      targetBytes: parseTargetSize(targetValue, targetUnit),
      targetDisplay: `${targetValue} ${targetUnit}`,
      outputFormat,
      allowDownscale,
      minScaleFloor: 0.35,
    };

    try {
      for (const item of itemsToProcess) {
        if (!mountedRef.current) break;

        commitItems((previous) =>
          previous.map((current) =>
            current.id === item.id
              ? { ...current, status: 'processing', progress: 10 }
              : current
          )
        );

        try {
          const result = await compressImage(item.file, settings, (progress) => {
            commitItems((previous) =>
              previous.map((current) =>
                current.id === item.id
                  ? { ...current, progress }
                  : current
              )
            );
          });

          if (!mountedRef.current) {
            URL.revokeObjectURL(result.url);
            break;
          }

          const existingItem = itemsRef.current.find(
            (current) => current.id === item.id
          );

          if (
            existingItem?.result?.url &&
            existingItem.result.url !== result.url
          ) {
            URL.revokeObjectURL(existingItem.result.url);
          }

          commitItems((previous) =>
            previous.map((current) =>
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
        } catch (error) {
          if (!mountedRef.current) break;

          console.error(`Compression failed for ${item.meta.name}:`, error);

          commitItems((previous) =>
            previous.map((current) =>
              current.id === item.id
                ? {
                    ...current,
                    status: 'error',
                    progress: 0,
                    error:
                      error instanceof Error
                        ? error.message
                        : 'Compression failed',
                  }
                : current
            )
          );
        }
      }
    } finally {
      processingRef.current = false;

      if (mountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [
    targetValue,
    targetUnit,
    outputFormat,
    allowDownscale,
    commitItems,
  ]);

  const handleRemoveItem = useCallback(
    (id: string) => {
      if (processingRef.current) return;

      const item = itemsRef.current.find((entry) => entry.id === id);

      if (item) {
        URL.revokeObjectURL(item.originalUrl);

        if (item.result?.url) {
          URL.revokeObjectURL(item.result.url);
        }
      }

      commitItems((previous) =>
        previous.filter((entry) => entry.id !== id)
      );

      const remaining = itemsRef.current;

      setSelectedItemId((current) =>
        current === id ? remaining[0]?.id ?? null : current
      );
    },
    [commitItems]
  );

  const handleClearAll = useCallback(() => {
    if (processingRef.current) return;

    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.originalUrl);

      if (item.result?.url) {
        URL.revokeObjectURL(item.result.url);
      }
    }

    commitItems(() => []);
    setSelectedItemId(null);
  }, [commitItems]);

  const value: CompressorContextValue = {
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
  };

  return (
    <CompressorContext.Provider value={value}>
      {children}
    </CompressorContext.Provider>
  );
}

export function useCompressor() {
  const context = useContext(CompressorContext);

  if (!context) {
    throw new Error('useCompressor must be used inside CompressorProvider');
  }

  return context;
}