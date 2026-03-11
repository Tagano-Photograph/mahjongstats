import { GameLog } from '../types';

export interface AnalysisMetrics {
  attack: number;    // 攻撃力
  defense: number;   // 守備力
  stability: number; // 安定感
  efficiency: number;// 収支効率
  luck: number;      // 運要素/粘り
}

export interface RadarDataPoint {
  subject: string;
  A: number; // User
  B: number; // Benchmark
  fullMark: number;
}

// Helper to normalize scores to a 0-100 scale (approximate deviation score logic)
// val: actual value, avg: benchmark average, isReverse: true if lower is better (e.g. deal-in rate)
const normalize = (val: number, target: number, isReverse: boolean = false): number => {
  // Simplified logic for demo: Map comparison to a 0-100 scale centered at 50
  // In a real app, this would use Standard Deviation.
  let diff = isReverse ? target - val : val - target;
  
  // Scale factor (arbitrary for demo feel)
  const scale = 2; 
  
  let score = 50 + (diff * scale);
  return Math.min(100, Math.max(0, score));
};

export const calculateAnalysisStats = (games: GameLog[]) => {
  const totalGames = games.length;
  if (totalGames === 0) return null;

  // 1. Calculate Raw Stats
  const totalScore = games.reduce((acc, g) => acc + g.score, 0);
  const avgScore = totalScore / totalGames;
  
  const rank1 = games.filter(g => g.rank === 1).length;
  const rank2 = games.filter(g => g.rank === 2).length;
  const rank4 = games.filter(g => g.rank === 4).length;
  
  const top2Rate = ((rank1 + rank2) / totalGames) * 100;
  const lasRate = (rank4 / totalGames) * 100;
  const avoidLasRate = 100 - lasRate;
  
  // Use dealIns from data, default to mock if 0/undefined for demo
  const totalDealIns = games.reduce((acc, g) => acc + (g.dealIns || 0), 0);
  const avgDealIns = totalDealIns / totalGames; 
  
  const yakitoriCount = games.filter(g => g.isYakitori).length;
  const yakitoriRate = (yakitoriCount / totalGames) * 100;

  // 2. Generate "Five Forces" Scores (0-100) based on arbitrary standards
  // In a real app, these would be calculated against a database distribution.
  
  // Attack: Based on Avg Score (Target: 25000) + Top Rate (Target: 25%)
  // Simple heuristic for demo
  const attackScore = Math.min(100, 50 + ((avgScore - 25000) / 1000) * 2);

  // Defense: Based on Avg Deal Ins (Target: 2.5 per game)
  // Lower is better
  const defenseScore = Math.min(100, 50 + ((2.5 - avgDealIns) * 10));

  // Stability: Based on Top 2 Rate (Target: 50%) and Avoid Las (Target: 75%)
  const stabilityScore = Math.min(100, 50 + (top2Rate - 50) + (avoidLasRate - 75));

  // Efficiency: Based on Total Score / Games (Target: +5.0 equivalent to +5000 score per game? lets say +5 pt)
  // Let's use Avg Score directly again but strictly for value
  const efficiencyScore = Math.min(100, 50 + (avgScore - 25000) / 500);

  // Luck/Tenacity: High Score Count (>= 40000)
  // New Logic: Based solely on games with score >= 40000
  
  // High Score Count: Games with score >= 40000
  const highScoreCount = games.filter(g => g.score >= 40000).length;
  const highScoreRate = (highScoreCount / totalGames) * 100;
  // Target: 30% of games -> 100pts.
  const luckScore = Math.min(100, highScoreRate * 3.33);

  return {
    raw: {
      avgScore,
      avgDealIns,
      top2Rate,
      avoidLasRate,
      yakitoriRate,
      highScoreCount
    },
    scores: {
      attack: Math.round(attackScore),
      defense: Math.round(defenseScore),
      stability: Math.round(stabilityScore),
      efficiency: Math.round(efficiencyScore),
      luck: Math.round(luckScore)
    }
  };
};

export const getBenchmarkData = (type: 'AMATEUR' | 'PAST'): AnalysisMetrics => {
  switch (type) {
    case 'AMATEUR':
      return {
        attack: 50,
        defense: 50,
        stability: 50,
        efficiency: 50,
        luck: 50
      };
    case 'PAST':
      return {
        attack: 55,
        defense: 45,
        stability: 48,
        efficiency: 52,
        luck: 55
      };
  }
};