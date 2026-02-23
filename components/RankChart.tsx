import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { PlayerStats } from '../types';

interface RankChartProps {
  stats: PlayerStats;
}

export const RankChart: React.FC<RankChartProps> = ({ stats }) => {
  const data = [
    { name: '1着', count: stats.rankDistribution.rank1, color: '#10b981' }, // Emerald 500
    { name: '2着', count: stats.rankDistribution.rank2, color: '#3b82f6' }, // Blue 500
    { name: '3着', count: stats.rankDistribution.rank3, color: '#f59e0b' }, // Amber 500
    { name: '4着', count: stats.rankDistribution.rank4, color: '#ef4444' }, // Red 500
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-64 w-full">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">順位分布</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 40, right: 0, bottom: 0, left: 0 }}>
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
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="top" fill="#64748b" fontSize={14} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};