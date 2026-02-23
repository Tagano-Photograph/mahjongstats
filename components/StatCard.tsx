import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'red' | 'green' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, color = 'default' }) => {
  
  const getColorClass = () => {
    switch (color) {
      case 'red': return 'text-red-600 bg-red-50';
      case 'green': return 'text-emerald-600 bg-emerald-50';
      case 'blue': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <div className={`p-1.5 rounded-lg ${getColorClass()}`}>{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {subValue && <div className="text-xs text-slate-400 mt-1">{subValue}</div>}
      </div>
    </div>
  );
};