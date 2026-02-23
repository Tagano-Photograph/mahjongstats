import { GameLog, PlayerStats } from '../types';

// Helper to generate dates relative to now
const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const getRandomOpponents = () => {
  const names = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', 'CPU1', 'CPU2'];
  const shuffled = [...names].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

const getRandomNote = (rank: number, score: number) => {
  if (rank === 1 && score > 50000) return '絶好調！裏ドラ3枚乗ったのが大きかった。';
  if (rank === 4) return '放銃が多すぎた。押し引きを見直す必要あり。';
  if (score < 0) return '箱下...次は頑張る。';
  if (Math.random() > 0.7) return '楽しく打てた。';
  return '';
};

// Generate dynamic mock data for Current Month and Previous Month
const generateMockGames = (): GameLog[] => {
  const games: GameLog[] = [];
  const locations = ['東京都新宿区', 'オンライン (Mahjong Soul)', '自宅', '東京都渋谷区', '知人宅'];
  const winds = ['東', '南', '西', '北'];
  
  // Generate 15 games for this month
  for (let i = 0; i < 15; i++) {
    const rank = [1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2][i] as 1|2|3|4;
    const score = [45000, 32000, 24000, 15000, 55000, 31000, 38000, 18000, 29000, 8000, 42000, 33000, 25000, 60000, 30500][i];
    
    games.push({
      id: `curr-${i}`,
      date: getRelativeDate(i * 1.5), // Spread over last ~20 days
      rank: rank,
      score: score,
      location: locations[i % locations.length],
      position: winds[Math.floor(Math.random() * 4)],
      dealIns: Math.floor(Math.random() * 3), // 0-2 deal ins usually
      opponents: getRandomOpponents(),
      notes: getRandomNote(rank, score),
      rule: 'Mリーグルール'
    });
  }

  // Generate 20 games for last month
  for (let i = 0; i < 20; i++) {
    const rank = [2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 1, 1, 2, 3, 4, 1, 2, 3, 4, 2][i] as 1|2|3|4;
    const score = 25000; // Simplified for old data
    
    games.push({
      id: `prev-${i}`,
      date: getRelativeDate(35 + i * 1.5), // Spread over previous month
      rank: rank,
      score: score,
      location: locations[i % locations.length],
      position: winds[Math.floor(Math.random() * 4)],
      dealIns: Math.floor(Math.random() * 5),
      opponents: getRandomOpponents(),
      notes: '',
      rule: 'Mリーグルール'
    });
  }
  
  return games;
};

export const fetchRecentGames = async (): Promise<GameLog[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockGames();
};

export const calculateStats = (games: GameLog[]): PlayerStats => {
  const totalGames = games.length;
  if (totalGames === 0) {
    return {
      totalGames: 0,
      averageRank: 0,
      totalScore: 0,
      topRate: 0,
      lasRate: 0,
      rankDistribution: { rank1: 0, rank2: 0, rank3: 0, rank4: 0 }
    };
  }

  const totalScore = games.reduce((acc, game) => acc + game.score, 0);
  const totalRank = games.reduce((acc, game) => acc + game.rank, 0);
  
  const distribution = {
    rank1: games.filter(g => g.rank === 1).length,
    rank2: games.filter(g => g.rank === 2).length,
    rank3: games.filter(g => g.rank === 3).length,
    rank4: games.filter(g => g.rank === 4).length,
  };

  return {
    totalGames,
    averageRank: parseFloat((totalRank / totalGames).toFixed(2)),
    totalScore,
    topRate: parseFloat(((distribution.rank1 / totalGames) * 100).toFixed(1)),
    lasRate: parseFloat(((distribution.rank4 / totalGames) * 100).toFixed(1)),
    rankDistribution: distribution
  };
};