'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { formatPrice } from '@/lib/utils'
import type { TradeReport } from '@/types'

interface Props {
  trade: TradeReport
}

export default function PriceSummaryCard({ trade }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      className="rounded-xl border border-slate-100 bg-white overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 text-left focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">중위 매매가</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 text-sm"
          >
            ▾
          </motion.span>
        </div>
        <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
          {formatPrice(trade.medianPrice)}
        </p>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
              <div>
                <p className="text-xs text-slate-500">최고가 (75분위)</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(trade.priceRange.q3)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">최저가 (25분위)</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(trade.priceRange.q1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">최고 거래가</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(trade.priceRange.max)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">최저 거래가</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(trade.priceRange.min)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
