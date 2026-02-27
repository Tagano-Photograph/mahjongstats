import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GameLog } from '../types';
import { calculateAnalysisStats, getBenchmarkData, RadarDataPoint } from '../services/analysisService';
import { Info, Shield, Swords, Activity, Zap, Clover } from 'lucide-react';

interface AnalysisProps {
  games: GameLog[];
}

type BenchmarkType = 'AMATEUR' | 'PAST';

export const Analysis: React.FC<AnalysisProps> = ({ games }) => {
  const [benchmark, setBenchmark] = useState<BenchmarkType>('AMATEUR');

  // Calculate User Stats
  const userStats = useMemo(() => calculateAnalysisStats(games), [games]);
  
  // Get Benchmark Stats
  const benchmarkStats = useMemo(() => getBenchmarkData(benchmark), [benchmark]);

  if (!userStats) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
            <Info size={48} className="mb-4 opacity-50" />
            <p>データが不足しています。<br/>対局結果を入力してください。</p>
        </div>
    );
  }

  // Prepare Data for Radar Chart
  const radarData: RadarDataPoint[] = [
    { subject: '攻撃力', A: userStats.scores.attack, B: benchmarkStats.attack, fullMark: 100 },
    { subject: '守備力', A: userStats.scores.defense, B: benchmarkStats.defense, fullMark: 100 },
    { subject: '安定感', A: userStats.scores.stability, B: benchmarkStats.stability, fullMark: 100 },
    { subject: '収支効率', A: userStats.scores.efficiency, B: benchmarkStats.efficiency, fullMark: 100 },
    { subject: '運/粘り', A: userStats.scores.luck, B: benchmarkStats.luck, fullMark: 100 },
  ];

  const getBenchmarkLabel = () => {
    switch(benchmark) {
      case 'PRO': return 'プロ平均';
      case 'AMATEUR': return 'ユーザー平均';
      case 'PAST': return '過去の自分';
    }
  };

  const getDeviationColor = (score: number) => {
    if (score >= 60) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 40) return 'text-slate-700 bg-slate-50 border-slate-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const StatBox = ({ label, score, icon, desc }: { label: string, score: number, icon: React.ReactNode, desc: string }) => (
    <div className={`p-3 rounded-xl border ${getDeviationColor(score)} flex flex-col items-center justify-center text-center shadow-sm`}>
      <div className="mb-1 opacity-80 scale-90">{icon}</div>
      <div className="text-[10px] font-bold uppercase opacity-60 mb-1">{label}</div>
      <div className="text-2xl font-black mb-1">{score}</div>
      <div className="text-[10px] opacity-70 truncate w-full">{desc}</div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-20 space-y-6">
      <div className="flex items-center gap-2 mb-2">
         <Activity className="text-mahjong-green" />
         <h1 className="text-xl font-bold text-slate-800">実力分析</h1>
      </div>

      {/* Benchmark Toggle */}
      <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
        {(['AMATEUR', 'PAST'] as BenchmarkType[]).map((type) => (
          <button
            key={type}
            onClick={() => setBenchmark(type)}
            className={`flex-1 py-2 rounded-md transition-all ${
              benchmark === type 
                ? 'bg-white text-mahjong-green shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {type === 'AMATEUR' && 'VS ユーザー平均'}
            {type === 'PAST' && 'VS 過去の自分'}
          </button>
        ))}
      </div>

      {/* Radar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 relative">
         <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-mahjong-green"></span> あなた
            <span className="w-2 h-2 rounded-full bg-slate-400 ml-2"></span> {getBenchmarkLabel()}
         </h3>
         <div className="h-[300px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="あなた"
                  dataKey="A"
                  stroke="#1a472a"
                  strokeWidth={3}
                  fill="#1a472a"
                  fillOpacity={0.4}
                />
                <Radar
                  name={getBenchmarkLabel()}
                  dataKey="B"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="#94a3b8"
                  fillOpacity={0.1}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
         </div>
         <p className="text-[10px] text-center text-slate-400 -mt-4 mb-2">
            ※外側に広がるほど優秀な成績です（偏差値換算）
         </p>
      </div>

      {/* Deviation Scores Grid */}
      <div>
         <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            項目別偏差値 (詳細)
         </h3>
         <div className="grid grid-cols-3 gap-3">
             <StatBox 
                label="攻撃力" 
                score={userStats.scores.attack} 
                icon={<Swords size={20} />}
                desc={`平均: ${Math.round(userStats.raw.avgScore).toLocaleString()}点`}
             />
             <StatBox 
                label="守備力" 
                score={userStats.scores.defense} 
                icon={<Shield size={20} />}
                desc={`平均放銃: ${userStats.raw.avgDealIns.toFixed(1)}回`}
             />
             <StatBox 
                label="安定感" 
                score={userStats.scores.stability} 
                icon={<Activity size={20} />}
                desc={`連対率: ${userStats.raw.top2Rate.toFixed(1)}%`}
             />
             <StatBox 
                label="収支効率" 
                score={userStats.scores.efficiency} 
                icon={<Zap size={20} />}
                desc="期待値・素点合計"
             />
             <StatBox 
                label="運/粘り" 
                score={userStats.scores.luck} 
                icon={<Clover size={20} />}
                desc={`4万点超: ${userStats.raw.highScoreCount}回`}
             />
             <div className="p-3 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center bg-slate-50/50">
                 <div className="text-xs text-slate-400 font-bold">総合評価</div>
                 <div className="text-xl font-bold text-slate-600 mt-1">B+</div>
             </div>
         </div>
      </div>
      
      {/* Advice Section */}
      <div className="bg-slate-800 text-white p-5 rounded-xl shadow-lg">
        <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
            <Info size={16} /> 分析コメント
        </h3>
        <p className="text-sm leading-relaxed text-slate-200">
            {userStats.scores.defense < 50 
                ? '守備力が課題です。放銃率を下げるために、押し引きの基準を見直しましょう。' 
                : userStats.scores.attack > 60 
                ? '攻撃力は素晴らしい水準です！この調子で加点を目指しましょう。'
                : '全体的にバランスの取れた成績です。さらなる高みを目指して、特定の武器を磨きましょう。'
            }
        </p>
      </div>
    </div>
  );
};