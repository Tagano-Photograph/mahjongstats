import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { PlayerStats } from '../types';

interface RankChartProps {
  stats: PlayerStats;
  prevStats: PlayerStats | null;
}

export const RankChart: React.FC<RankChartProps> = ({ stats, prevStats }) => {
  const data = [
    { 
      name: '1着', 
      current: stats.rankDistribution?.rank1 ?? 0, 
      prev: prevStats?.rankDistribution?.rank1 ?? 0,
      color: '#10b981' 
    }, // Emerald 500
    { 
      name: '2着', 
      current: stats.rankDistribution?.rank2 ?? 0, 
      prev: prevStats?.rankDistribution?.rank2 ?? 0,
      color: '#3b82f6' 
    }, // Blue 500
    { 
      name: '3着', 
      current: stats.rankDistribution?.rank3 ?? 0, 
      prev: prevStats?.rankDistribution?.rank3 ?? 0,
      color: '#f59e0b' 
    }, // Amber 500
    { 
      name: '4着', 
      current: stats.rankDistribution?.rank4 ?? 0, 
      prev: prevStats?.rankDistribution?.rank4 ?? 0,
      color: '#ef4444' 
    }, // Red 500
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-64 w-full">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">順位分布 (今月 vs 前月)</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }} barGap={2}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} 
              interval={0}
            />
            <YAxis 
              hide 
            />
            <Bar dataKey="current" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-curr-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="current" position="top" fill="#64748b" fontSize={12} fontWeight="bold" formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
            <Bar dataKey="prev" radius={[4, 4, 0, 0]} barSize={20} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-prev-${index}`} fill={entry.color} fillOpacity={0.3} />
              ))}
              <LabelList dataKey="prev" position="top" fill="#94a3b8" fontSize={12} fontWeight="bold" formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};