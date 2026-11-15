'use client';

import { useRouter } from 'next/navigation';
import { PresetsGuide } from '@/components/pages/PresetsGuide';
import { useCompressor } from '@/components/home/CompressorProvider';
import type { TargetSizeUnit } from '@/lib/compression/types';

export default function PresetsGuideClient() {
  const router = useRouter();
  const { setTargetValue, setTargetUnit } = useCompressor();

  const handleSelectPreset = (value: number, unit: TargetSizeUnit) => {
    setTargetValue(value);
    setTargetUnit(unit);
    router.push('/');
  };

  return <PresetsGuide onSelectPreset={handleSelectPreset} />;
}