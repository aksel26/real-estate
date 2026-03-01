'use client';

import { motion } from 'motion/react';
import { useUIStore } from '@/stores';
import type { ReportTab } from '@/stores';

const TABS: { id: ReportTab; label: string }[] = [
  { id: 'overview', label: '요약' },
  { id: 'lease', label: '전월세' },
  { id: 'trade', label: '매매' },
];

export default function TabNavigation() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <div className="flex border-b border-slate-100 px-3">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 py-3.5 text-[15px] font-medium transition-colors focus:outline-none ${
              isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
