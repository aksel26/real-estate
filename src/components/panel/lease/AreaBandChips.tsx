'use client';

import { LayoutGroup } from 'motion/react';
import { Chip } from '@/components/ui';
import { AREA_BANDS } from '@/constants/ranking';
import { useFilterStore } from '@/stores';

export default function AreaBandChips() {
  const areaBand = useFilterStore((s) => s.areaBand);
  const setAreaBand = useFilterStore((s) => s.setAreaBand);

  return (
    <LayoutGroup id="area-band-chip">
      <div className="flex flex-wrap gap-2">
        {AREA_BANDS.map((band) => (
          <Chip
            key={band.id}
            label={band.label}
            selected={areaBand === band.id}
            onClick={() => setAreaBand(band.id)}
            layoutGroup="area-band-chip"
          />
        ))}
      </div>
    </LayoutGroup>
  );
}
