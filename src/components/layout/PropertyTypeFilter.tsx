'use client';

import { Chip } from '@/components/ui';
import { useFilterStore } from '@/stores';
import { PROPERTY_TYPES } from '@/constants';
import type { PropertyType } from '@/types/filter';

/**
 * PropertyTypeFilter — chip group for 아파트 / 오피스텔 / 연립다세대.
 * Uses Chip with layoutId-based selection animation.
 */
export default function PropertyTypeFilter() {
  const propertyType = useFilterStore((s) => s.propertyType);
  const setPropertyType = useFilterStore((s) => s.setPropertyType);

  return (
    <div
      role="group"
      aria-label="매물 유형 필터"
      className="flex items-center gap-1.5"
    >
      {PROPERTY_TYPES.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={propertyType === option.value}
          onClick={() => setPropertyType(option.value as PropertyType)}
        />
      ))}
    </div>
  );
}
