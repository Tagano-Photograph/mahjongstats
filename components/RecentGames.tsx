import React from 'react';
import { GameLog } from '../types';
import { Trophy, Minus, ChevronsDown, ChevronsUp } from 'lucide-react';

interface RecentGamesProps {
  games: GameLog[];
}

export const RecentGames: React.FC<RecentGamesProps> = ({ games }) => {
  
  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <Trophy size={16} /> };
      case 2: return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: <ChevronsUp size={16} /> };
      case 3: return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: <Minus size={16} /> };
      case 4: return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: <ChevronsDown size={16} /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: <Minus size={16} /> };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-semibold text-slate-700">最近の対局</h3>
        <button className="text-xs text-mahjong-green font-medium hover:text-mahjong-dark transition-colors">すべて見る</button>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-200">
          対局データがありません
        </div>
      ) : (
        <div className="space-y-2">
          {games.map((game) => {
            const style = getRankStyle(game.rank);
            const isPositive = game.score >= 30000;
            return (
              <div key={game.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${style.bg} ${style.border} ${style.text} font-bold text-lg`}>
                    {game.rank}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{formatDate(game.date)}</div>
                    <div className="text-sm font-medium text-slate-700">{game.location || '不明'}</div>
                  </div>
                </div>
                <div className={`text-right font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {game.score.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">点</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};