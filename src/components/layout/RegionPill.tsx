'use client';

import { AnimatePresence } from 'motion/react';
import { Pill } from '@/components/ui';
import { useSelectionStore } from '@/stores';
import { useUIStore } from '@/stores';

/**
 * RegionPill — shows the selected region as a removable pill.
 * Animates in/out via AnimatePresence (Pill already handles its own motion).
 */
export default function RegionPill() {
  const selectedRegionName = useSelectionStore((s) => s.selectedRegionName);
  const clearSelection = useSelectionStore((s) => s.clearSelection);
  const closePanel = useUIStore((s) => s.closePanel);

  function handleRemove() {
    clearSelection();
    closePanel();
  }

  return (
    <AnimatePresence>
      {selectedRegionName && (
        <Pill label={selectedRegionName} onRemove={handleRemove} />
      )}
    </AnimatePresence>
  );
}
