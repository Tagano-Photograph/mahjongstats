import React from 'react';
import { Home, History, PlusCircle, PieChart, Settings } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  
  const navItems = [
    { id: Tab.HOME, icon: <Home size={22} />, label: 'ホーム' },
    { id: Tab.HISTORY, icon: <History size={22} />, label: '履歴' },
    { id: Tab.ADD, icon: <PlusCircle size={32} className="text-mahjong-green" />, label: '', isSpecial: true },
    { id: Tab.ANALYSIS, icon: <PieChart size={22} />, label: '分析' },
    { id: Tab.SETTINGS, icon: <Settings size={22} />, label: '設定' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Safe area top padding handled by content */}
      <main id="main-scroll-container" className="pb-24 overflow-y-auto h-screen no-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
        <div className="flex justify-around items-end h-16 max-w-md mx-auto relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            if (item.isSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative -top-5 bg-white p-1.5 rounded-full shadow-lg border border-slate-100 hover:scale-105 transition-transform"
                >
                  <div className="bg-slate-50 rounded-full p-1">
                   {item.icon}
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full pb-1 pt-2 transition-colors duration-200 ${
                  isActive ? 'text-mahjong-green' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {item.icon}
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};