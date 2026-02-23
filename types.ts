export interface GameLog {
  id: string;
  date: string; // ISO string
  rank: 1 | 2 | 3 | 4;
  score: number; // e.g. 35000 or -12000
  location?: string;
  notes?: string;
  // Extended fields for details
  rule?: string;
  position?: string; // '東' | '南' | '西' | '北'
  dealIns?: number;
  opponents?: string[]; // Array of opponent names
  isYakitori?: boolean;
}

export interface PlayerStats {
  totalGames: number;
  averageRank: number;
  totalScore: number;
  topRate: number; // Percentage of 1st place
  lasRate: number; // Percentage of 4th place
  rankDistribution: {
    rank1: number;
    rank2: number;
    rank3: number;
    rank4: number;
  };
}

export enum Tab {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  ADD = 'ADD',
  ANALYSIS = 'ANALYSIS',
  SETTINGS = 'SETTINGS'
}

// ---- User Profile Types ----

export const MLEAGUE_TEAMS = [
  'EARTH JETS',
  '赤坂ドリブンズ',
  'EX風林火山',
  'KADOKAWAサクラナイツ',
  'KONAMI麻雀格闘倶楽部',
  '渋谷ABEMAS',
  'セガサミーフェニックス',
  'TEAM RAIDEN / 雷電',
  'BEAST X',
  'U-NEXT Pirates'
];

export const PLAY_STYLE_A = [
  { id: 'ATTACK', label: '攻撃型（高打点押し麻雀）' },
  { id: 'BALANCE', label: 'バランス型（場況変化麻雀）' },
  { id: 'DEFENSE', label: '守備型（堅守ブロック麻雀）' },
];

export const PLAY_STYLE_B = [
  { id: 'NAKI', label: '鳴き型（あがり重視）' },
  { id: 'MENZEN', label: '面前型（面前重視）' },
];

export interface UserProfile {
  username: string;
  email: string;
  iconUrl?: string; // DataURL or generic avatar ID
  favoritePro?: string;
  favoriteTeam?: string;
  styleA?: string; // ID from PLAY_STYLE_A
  styleB?: string; // ID from PLAY_STYLE_B
}