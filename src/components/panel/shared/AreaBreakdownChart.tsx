'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatPrice } from '@/lib/utils';
import type { AreaBreakdownItem } from '@/types';

interface Props {
  data: AreaBreakdownItem[];
  label: string;
  color?: string;
}

export default function AreaBreakdownChart({ data, label, color = '#3b82f6' }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5">
      <p className="text-sm font-medium text-slate-500 mb-3">{label}</p>
      <ResponsiveContainer width="100%" height={data.length * 40 + 20}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
          <XAxis type="number" tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="areaLabel" width={50} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), '중위가']}
            labelFormatter={(label) =>
              `${label} (${data.find((d) => d.areaLabel === label)?.count ?? 0}건)`
            }
          />
          <Bar dataKey="medianValue" fill={color} radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
