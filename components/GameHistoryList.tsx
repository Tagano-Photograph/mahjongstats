import React, { useState } from 'react';
import { GameLog } from '../types';
import { AlertTriangle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface GameHistoryListProps {
  games: GameLog[];
}

export const GameHistoryList: React.FC<GameHistoryListProps> = ({ games }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      case 2: return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 3: return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
      case 4: return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3 pb-8">
      {games.map((game) => {
        const isExpanded = expandedId === game.id;
        const style = getRankStyle(game.rank);
        const isPositive = game.score >= 30000;
        
        // Reconstruct seat configuration
        // Assuming game.opponents is ordered: [Right(Shimobure), Across(Toimen), Left(Kamicha)] relative to Self?
        // OR simply ordered list. Let's assume standard wind order rotation for visualization based on `AddGameForm` logic
        // AddGameForm logic: actualWindIndex = (myIndex + 1 + opponentIndex) % 4
        // So opponents[0] is at (myIndex+1), opponents[1] at (myIndex+2), etc.
        
        const winds = ['東', '南', '西', '北'];
        const myIndex = winds.indexOf(game.position || '東');
        
        const seats = Array(4).fill(null).map((_, i) => {
            const wind = winds[i];
            
            if (i === myIndex) {
                return { wind, name: '自分', isMe: true };
            }
            
            // Reverse mapping: find which opponent corresponds to this seat index i
            // Logic: seatIndex = (myIndex + 1 + opIndex) % 4
            // Therefore: opIndex = (seatIndex - myIndex - 1) (+4 to handle negatives) % 4
            const opIdx = (i - myIndex - 1 + 4) % 4;
            
            if (game.opponents && opIdx >= 0 && opIdx < game.opponents.length) {
                return { wind, name: game.opponents[opIdx], isMe: false };
            }
            return { wind, name: 'ー', isMe: false };
        });

        return (
          <div 
            key={game.id} 
            className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
          >
            {/* Header (Always Visible) - Acts as Trigger */}
            <div 
              onClick={() => setExpandedId(isExpanded ? null : game.id)}
              className="p-3 flex items-center justify-between cursor-pointer active:bg-slate-50 touch-manipulation select-none"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${style.bg} ${style.border} ${style.text} font-bold text-lg shrink-0`}>
                  {game.rank}
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium mb-0.5">{formatDate(game.date)}</div>
                  <div className="text-sm font-medium text-slate-700 truncate max-w-[140px]">{game.location || '不明'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className={`text-right font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {game.score.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-0.5">点</span>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300" />}
              </div>
            </div>

            {/* Details (Collapsible) */}
            {isExpanded && (
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
                
                {/* Seats Table */}
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">対局者・座順</label>
                   <div className="grid grid-cols-4 gap-2">
                     {seats.map((seat) => (
                       <div key={seat.wind} className={`flex flex-col items-center p-2 rounded-lg border ${seat.isMe ? 'bg-white border-mahjong-green/30 shadow-sm' : 'bg-white border-slate-100'}`}>
                         <span className={`text-[10px] font-bold mb-1 ${seat.isMe ? 'text-mahjong-green' : 'text-slate-400'}`}>{seat.wind}</span>
                         <span className={`text-xs truncate w-full text-center font-medium ${seat.isMe ? 'text-slate-800' : 'text-slate-600'}`}>
                            {seat.name}
                         </span>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Deal Ins */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                            <AlertTriangle size={12} /> 放銃回数
                        </label>
                        <div className="text-sm font-bold text-slate-800">
                            {game.dealIns !== undefined ? `${game.dealIns}回` : '--'}
                        </div>
                    </div>

                    {/* Memo */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100 col-span-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                            <MessageSquare size={12} /> メモ
                        </label>
                        <div className="text-sm text-slate-600 leading-relaxed">
                            {game.notes ? game.notes : <span className="text-slate-400 italic text-xs">メモなし</span>}
                        </div>
                    </div>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};