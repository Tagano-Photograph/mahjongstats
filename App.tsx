import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StatCard } from './components/StatCard';
import { RecentGames } from './components/RecentGames';
import { RankChart } from './components/RankChart';
import { AddGameForm } from './components/AddGameForm';
import { ShareModal } from './components/ShareModal';
import { GameHistoryList } from './components/GameHistoryList';
import { Settings } from './components/Settings';
import { Analysis } from './components/Analysis';
import { fetchRecentGames, calculateStats } from './services/gameService';
import { GameLog, PlayerStats, Tab, UserProfile, MLEAGUE_TEAMS, PLAY_STYLE_A, PLAY_STYLE_B } from './types';
import { TrendingUp, TrendingDown, LayoutGrid, Target, Award, Edit2, History, Filter, X, Calendar, MapPin, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [games, setGames] = useState<GameLog[]>([]);
  
  // Dashboard State
  const [currentStats, setCurrentStats] = useState<PlayerStats | null>(null);
  const [prevStats, setPrevStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subtitle, setSubtitle] = useState<string>("今日も一日、ご安全に！");
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [lastSubmittedGame, setLastSubmittedGame] = useState<any>(null);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allGames = await fetchRecentGames();
        setGames(allGames);
        
        // Filter Games by Month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(now.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth();
        const lastMonthYear = lastMonthDate.getFullYear();

        const currentMonthGames = allGames.filter(g => {
          const d = new Date(g.date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const prevMonthGames = allGames.filter(g => {
          const d = new Date(g.date);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        });

        setCurrentStats(calculateStats(currentMonthGames));
        setPrevStats(calculateStats(prevMonthGames));

      } catch (error) {
        console.error("Failed to load game data", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Check local storage or init with null for "Unlogged" state simulation
    // For demo purposes, we can start logged out or with a demo user.
    // Let's start with a demo user to show the dashboard properly initially,
    // or strictly follow "Unlogged" flow if requested.
    // Given the prompt asks for "Unlogged" UI in settings, let's default to a Demo User
    // but allow logging out to see the unlogged state.
    setUserProfile({
        username: 'ゲスト雀士',
        email: 'guest@example.com',
        favoritePro: '多井隆晴',
        favoriteTeam: '渋谷ABEMAS',
        styleA: 'BALANCE',
        styleB: 'NAKI'
    });

    loadData();
  }, []);

  const handleGameSubmit = (data: any, isFinished: boolean) => {
    console.log("Game submitted:", data);
    
    // In real app, you would save to database here and reload data
    
    if (isFinished) {
      setLastSubmittedGame(data);
      setShareModalOpen(true);
    } else {
      alert("記録を保存しました。続けて次の半荘を入力してください。");
      // Don't change tab, allow user to input next game
    }
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setActiveTab(Tab.HOME);
    
    // Scroll the main container to top
    // Since Layout uses a specific ID for the scrollable container
    setTimeout(() => {
      const mainContainer = document.getElementById('main-scroll-container');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100); // Small delay to ensure tab switch rendering is done
  };

  // Auth Handlers
  const handleLogin = () => {
      // Mock Login
      setUserProfile({
        username: '麻雀太郎',
        email: 'taro@example.com',
        favoritePro: '佐々木寿人',
        favoriteTeam: 'KONAMI麻雀格闘倶楽部',
        styleA: 'ATTACK',
        styleB: 'MENZEN'
      });
  };

  const handleLogout = () => {
      setUserProfile(null);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
      setUserProfile(newProfile);
  };

  // Helper to format comparisons
  const getComparison = (current: number, prev: number, type: 'rank' | 'score' | 'count' | 'percent') => {
    if (!prev) return '前月データなし';
    
    let diff = current - prev;
    // For rank, lower is better (negative diff is good)
    if (type === 'rank') diff = -diff; 
    
    const sign = diff > 0 ? '+' : '';
    let diffStr = '';

    if (type === 'percent') diffStr = `${sign}${diff.toFixed(1)}%`;
    else if (type === 'rank') diffStr = `${sign}${(-diff).toFixed(2)}`; // Restore sign for display
    else if (type === 'count') diffStr = `${sign}${diff}`;
    else diffStr = `${sign}${Math.round(diff).toLocaleString()}`;

    return `前月比 ${diffStr}`;
  };

  const getTrend = (current: number, prev: number, type: 'rank' | 'score' | 'count' | 'percent'): 'up' | 'down' | 'neutral' => {
    if (!prev) return 'neutral';
    if (current === prev) return 'neutral';
    
    // For Rank: Lower is better. If Current < Prev, it's good (Up)
    if (type === 'rank') return current < prev ? 'up' : 'down';
    
    // For others: Higher is better
    return current > prev ? 'up' : 'down';
  };

  const renderHome = () => {
    if (loading || !currentStats || !prevStats) {
      return (
        <div className="flex items-center justify-center h-full pt-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mahjong-green"></div>
        </div>
      );
    }

    // Specific calculations for dashboard requirements
    const currentAvgScore = currentStats.totalGames > 0 ? currentStats.totalScore / currentStats.totalGames : 0;
    const prevAvgScore = prevStats.totalGames > 0 ? prevStats.totalScore / prevStats.totalGames : 0;
    
    const currentAvoidLastRate = 100 - currentStats.lasRate;
    const prevAvoidLastRate = 100 - prevStats.lasRate;

    return (
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-2">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 break-words">
              {userProfile ? `${userProfile.username} 麻雀成績ダッシュボード` : '麻雀成績ダッシュボード'}
            </h1>
            <div className="mt-1 flex items-center gap-2 group">
              {isEditingSubtitle ? (
                <input 
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  onBlur={() => setIsEditingSubtitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingSubtitle(false)}
                  autoFocus
                  className="text-sm text-slate-600 w-full bg-slate-100 border-b border-slate-300 focus:outline-none py-1"
                />
              ) : (
                <p 
                  onClick={() => setIsEditingSubtitle(true)}
                  className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 hover:underline decoration-slate-300 underline-offset-2 flex items-center gap-1"
                >
                  {subtitle}
                  <Edit2 size={12} className="opacity-0 group-hover:opacity-50" />
                </p>
              )}
            </div>
          </div>
          <div className="h-14 w-14 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 ml-3 mr-8 flex items-center justify-center">
            {userProfile?.iconUrl ? (
              <img src={userProfile.iconUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl leading-none select-none filter drop-shadow-sm" role="img" aria-label="Guest Avatar">🀄</span>
            )}
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            label="今月の平均着順" 
            value={currentStats.averageRank.toFixed(2)} 
            subValue={getComparison(currentStats.averageRank, prevStats.averageRank, 'rank')}
            trend={getTrend(currentStats.averageRank, prevStats.averageRank, 'rank')}
            icon={<Target size={18} />}
            color="blue"
          />
          <StatCard 
            label="今月の半荘数" 
            value={currentStats.totalGames} 
            subValue={getComparison(currentStats.totalGames, prevStats.totalGames, 'count')}
            icon={<LayoutGrid size={18} />}
          />
          <StatCard 
            label="今月の平均持ち点" 
            value={Math.floor(currentAvgScore).toLocaleString()} 
            subValue={getComparison(currentAvgScore, prevAvgScore, 'score')}
            trend={getTrend(currentAvgScore, prevAvgScore, 'score')}
            icon={<TrendingUp size={18} />}
            color={currentAvgScore >= 30000 ? 'green' : 'red'}
          />
          <StatCard 
            label="今月のラス回避率" 
            value={`${currentAvoidLastRate.toFixed(1)}%`} 
            subValue={getComparison(currentAvoidLastRate, prevAvoidLastRate, 'percent')}
            trend={getTrend(currentAvoidLastRate, prevAvoidLastRate, 'percent')}
            icon={<Award size={18} />}
            color={currentAvoidLastRate >= 75 ? 'green' : 'default'}
          />
        </div>

        {/* Chart */}
        <RankChart stats={currentStats} prevStats={prevStats} />

        {/* Recent History */}
        <RecentGames games={games.slice(0, 5)} />
        
        {/* Spacer for bottom nav */}
        <div className="h-4"></div>
      </div>
    );
  };

  const renderHistory = () => {
    // Get Unique Locations for Dropdown
    const uniqueLocations = Array.from(new Set(games.map(g => g.location).filter((l): l is string => !!l)));

    // Filtering Logic
    const filteredGames = games.filter(game => {
      const gameDate = new Date(game.date);
      // Strip time from game date for accurate date comparison if needed, 
      // but here we are comparing against start of day and end of day of filter inputs.
      
      let matchesStart = true;
      if (filterStartDate) {
        const start = new Date(filterStartDate);
        // Compare with start of that day in local time
        matchesStart = gameDate >= start;
      }

      let matchesEnd = true;
      if (filterEndDate) {
        const end = new Date(filterEndDate);
        end.setHours(23, 59, 59, 999);
        matchesEnd = gameDate <= end;
      }

      let matchesLocation = true;
      if (filterLocation) {
        matchesLocation = game.location === filterLocation;
      }

      return matchesStart && matchesEnd && matchesLocation;
    });

    const hasActiveFilters = filterStartDate || filterEndDate || filterLocation;

    const clearFilters = () => {
      setFilterStartDate('');
      setFilterEndDate('');
      setFilterLocation('');
    };

    return (
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <History className="text-mahjong-green" />
             <h1 className="text-xl font-bold text-slate-800">対局履歴</h1>
           </div>
           <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg transition-colors relative ${isFilterOpen || hasActiveFilters ? 'bg-mahjong-green text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
           >
             <Filter size={20} />
             {hasActiveFilters && !isFilterOpen && (
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
             )}
           </button>
         </div>

         {/* Filter Panel */}
         {isFilterOpen && (
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700">絞り込み条件</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-slate-400 flex items-center gap-1 hover:text-red-500">
                    <RefreshCw size={12} /> リセット
                  </button>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-[10px] font-bold text-slate-400 mb-1 block">開始日</label>
                   <input 
                    type="date" 
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:border-mahjong-green focus:outline-none"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 mb-1 block">終了日</label>
                   <input 
                    type="date" 
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:border-mahjong-green focus:outline-none"
                   />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">場所</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:border-mahjong-green focus:outline-none"
                >
                  <option value="">全ての場所</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
           </div>
         )}

         {/* Active Filters Summary (if closed but active) */}
         {hasActiveFilters && !isFilterOpen && (
           <div className="flex flex-wrap gap-2">
             {filterStartDate && (
                <span className="text-xs bg-mahjong-green/10 text-mahjong-green px-2 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={10} /> {filterStartDate.replace(/-/g, '/')} ~
                </span>
             )}
             {filterEndDate && (
                <span className="text-xs bg-mahjong-green/10 text-mahjong-green px-2 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={10} /> ~ {filterEndDate.replace(/-/g, '/')}
                </span>
             )}
             {filterLocation && (
                <span className="text-xs bg-mahjong-green/10 text-mahjong-green px-2 py-1 rounded-full flex items-center gap-1">
                  <MapPin size={10} /> {filterLocation}
                </span>
             )}
           </div>
         )}

         {/* Results */}
         {filteredGames.length > 0 ? (
            <GameHistoryList games={filteredGames} />
         ) : (
            <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
               <Filter size={32} className="mx-auto mb-2 opacity-20" />
               <p className="text-sm">条件に一致する対局が見つかりません</p>
               <button onClick={clearFilters} className="mt-2 text-mahjong-green text-sm font-bold">条件をクリア</button>
            </div>
         )}
      </div>
    );
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === Tab.HOME && renderHome()}
        {activeTab === Tab.HISTORY && renderHistory()}
        {activeTab === Tab.ADD && <AddGameForm onSubmit={handleGameSubmit} />}
        {activeTab === Tab.ANALYSIS && <Analysis games={games} />}
        {activeTab === Tab.SETTINGS && (
          <Settings 
            userProfile={userProfile} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </Layout>
      
      {/* Share Modal Overlay */}
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={handleCloseShareModal} 
        data={lastSubmittedGame}
      />
    </>
  );
};

export default App;