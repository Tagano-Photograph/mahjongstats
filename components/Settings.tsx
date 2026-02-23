import React, { useState, useRef } from 'react';
import { UserProfile, MLEAGUE_TEAMS, PLAY_STYLE_A, PLAY_STYLE_B } from '../types';
import { User, Mail, Star, Award, Zap, Shield, LogOut, Camera, ChevronRight, Check, X } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onLogin, onLogout, onUpdateProfile }) => {
  const [view, setView] = useState<'MAIN' | 'REGISTER'>('MAIN');
  
  // Registration State
  const [regData, setRegData] = useState<UserProfile>({
    username: '',
    email: '',
    iconUrl: '',
    favoritePro: '',
    favoriteTeam: MLEAGUE_TEAMS[0],
    styleA: PLAY_STYLE_A[1].id,
    styleB: PLAY_STYLE_B[1].id,
  });

  // Editing State (Logged In)
  const [editingField, setEditingField] = useState<keyof UserProfile | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Handlers for Registration ----

  const handleRegister = () => {
    // Basic validation could go here
    if (!regData.username || !regData.email) {
      alert('ユーザー名とメールアドレスは必須です');
      return;
    }
    onUpdateProfile(regData);
    setView('MAIN');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isRegistration: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isRegistration) {
          setRegData({ ...regData, iconUrl: result });
        } else if (userProfile) {
          onUpdateProfile({ ...userProfile, iconUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ---- Handlers for Editing (Logged In) ----

  const openEditModal = (field: keyof UserProfile) => {
    if (!userProfile) return;
    
    // For icon, trigger file input directly
    if (field === 'iconUrl') {
      fileInputRef.current?.click();
      return;
    }

    setEditingField(field);
    setTempValue(userProfile[field] || '');
  };

  const saveEdit = () => {
    if (userProfile && editingField) {
      onUpdateProfile({ ...userProfile, [editingField]: tempValue });
      setEditingField(null);
    }
  };

  // ---- Renderers ----

  const renderUnauthenticated = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <User size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">ようこそ</h2>
        <p className="text-slate-500 text-sm">成績管理をはじめるには<br/>ログインまたは登録をしてください</p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={onLogin}
          className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ログイン
        </button>
        <button 
          onClick={() => setView('REGISTER')}
          className="w-full bg-mahjong-green text-white font-bold py-3.5 rounded-xl shadow-lg shadow-mahjong-green/20 active:scale-95 transition-all"
        >
          新規ユーザー登録
        </button>
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="pb-8 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setView('MAIN')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
          <ChevronRight className="rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">新規ユーザー登録</h2>
      </div>

      <div className="space-y-6">
        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-24 h-24 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
               {regData.iconUrl ? (
                 <img src={regData.iconUrl} alt="Preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                   <User size={40} />
                 </div>
               )}
            </div>
            <div className="absolute bottom-0 right-0 bg-mahjong-green text-white p-2 rounded-full shadow-md">
              <Camera size={16} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e, true)}
            />
          </div>
          <span className="text-xs text-slate-400">アイコンを設定</span>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">ユーザー名</label>
            <input 
              type="text" 
              value={regData.username}
              onChange={(e) => setRegData({...regData, username: e.target.value})}
              placeholder="雀士名"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-mahjong-green"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">メールアドレス</label>
            <input 
              type="email" 
              value={regData.email}
              onChange={(e) => setRegData({...regData, email: e.target.value})}
              placeholder="sample@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-mahjong-green"
            />
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">好きな麻雀プロ</label>
            <input 
              type="text" 
              value={regData.favoritePro}
              onChange={(e) => setRegData({...regData, favoritePro: e.target.value})}
              placeholder="プロ名を入力"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-mahjong-green"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">好きなMリーグチーム</label>
            <select 
              value={regData.favoriteTeam}
              onChange={(e) => setRegData({...regData, favoriteTeam: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-mahjong-green"
            >
              {MLEAGUE_TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
            </select>
          </div>
        </div>

        {/* Style */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">麻雀スタイル A (攻守)</label>
            <div className="flex flex-col gap-2">
              {PLAY_STYLE_A.map(style => (
                <label key={style.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${regData.styleA === style.id ? 'bg-mahjong-green/5 border-mahjong-green text-mahjong-green font-bold' : 'bg-slate-50 border-transparent text-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="styleA" 
                    value={style.id}
                    checked={regData.styleA === style.id}
                    onChange={(e) => setRegData({...regData, styleA: e.target.value})}
                    className="mr-3 w-4 h-4 accent-mahjong-green"
                  />
                  {style.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">麻雀スタイル B (進め方)</label>
             <div className="flex flex-col gap-2">
              {PLAY_STYLE_B.map(style => (
                <label key={style.id} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${regData.styleB === style.id ? 'bg-mahjong-green/5 border-mahjong-green text-mahjong-green font-bold' : 'bg-slate-50 border-transparent text-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="styleB" 
                    value={style.id}
                    checked={regData.styleB === style.id}
                    onChange={(e) => setRegData({...regData, styleB: e.target.value})}
                    className="mr-3 w-4 h-4 accent-mahjong-green"
                  />
                  {style.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleRegister}
          className="w-full bg-mahjong-green hover:bg-mahjong-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-mahjong-green/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Check size={20} /> 登録完了
        </button>
      </div>
    </div>
  );

  const renderAuthenticated = () => {
    if (!userProfile) return null;

    const styleALabel = PLAY_STYLE_A.find(s => s.id === userProfile.styleA)?.label || '未設定';
    const styleBLabel = PLAY_STYLE_B.find(s => s.id === userProfile.styleB)?.label || '未設定';

    // List Item Component
    const ProfileItem = ({ 
      label, 
      value, 
      icon, 
      field 
    }: { label: string, value: string, icon: React.ReactNode, field: keyof UserProfile }) => (
      <button 
        onClick={() => openEditModal(field)}
        className="w-full bg-white p-4 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-mahjong-green transition-colors">
            {icon}
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
            <div className="text-sm font-medium text-slate-800">{value}</div>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-xl font-bold text-slate-800 mb-6">プロフィール設定</h2>

        {/* Icon Header */}
        <div className="flex flex-col items-center gap-3 py-4">
           <div className="relative w-28 h-28 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-slate-100 shadow-sm">
                 {userProfile.iconUrl ? (
                   <img src={userProfile.iconUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                     <User size={48} />
                   </div>
                 )}
              </div>
              <div className="absolute bottom-1 right-1 bg-white text-slate-600 p-2 rounded-full shadow border border-slate-100">
                <Camera size={16} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
              />
           </div>
           <p className="text-xs text-slate-400">アイコンをタップして変更</p>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <ProfileItem 
            label="ユーザー名" 
            value={userProfile.username} 
            icon={<User size={18} />} 
            field="username" 
          />
          <ProfileItem 
            label="メールアドレス" 
            value={userProfile.email} 
            icon={<Mail size={18} />} 
            field="email" 
          />
          <ProfileItem 
            label="好きな麻雀プロ" 
            value={userProfile.favoritePro || '未設定'} 
            icon={<Star size={18} />} 
            field="favoritePro" 
          />
          <ProfileItem 
            label="好きなMリーグチーム" 
            value={userProfile.favoriteTeam || '未設定'} 
            icon={<Award size={18} />} 
            field="favoriteTeam" 
          />
          <ProfileItem 
            label="麻雀スタイル" 
            value={`${styleALabel} / ${styleBLabel}`} 
            icon={<Zap size={18} />} 
            field="styleA" 
          />
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          ログアウト
        </button>

        {/* Edit Modal (Overlay) */}
        {editingField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingField(null)} />
            <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl z-10 p-6 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800">
                   {editingField === 'username' && 'ユーザー名の変更'}
                   {editingField === 'email' && 'メールアドレスの変更'}
                   {editingField === 'favoritePro' && '好きな麻雀プロの変更'}
                   {editingField === 'favoriteTeam' && '好きなMリーグチームの変更'}
                   {(editingField === 'styleA' || editingField === 'styleB') && '麻雀スタイルの変更'}
                 </h3>
                 <button onClick={() => setEditingField(null)}><X size={20} className="text-slate-400" /></button>
               </div>

               <div className="mb-6">
                 {editingField === 'favoriteTeam' ? (
                   <select 
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 outline-none focus:border-mahjong-green"
                   >
                     {MLEAGUE_TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
                   </select>
                 ) : (editingField === 'styleA' || editingField === 'styleB') ? (
                   <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">スタイルA (攻守)</label>
                        <select 
                          value={editingField === 'styleA' ? tempValue : userProfile.styleA}
                          onChange={(e) => {
                             if(editingField === 'styleA') setTempValue(e.target.value);
                             else onUpdateProfile({...userProfile, styleA: e.target.value});
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none"
                        >
                           {PLAY_STYLE_A.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-2 block">スタイルB (進め方)</label>
                        <select 
                          value={editingField === 'styleB' ? tempValue : userProfile.styleB}
                          onChange={(e) => {
                             if(editingField === 'styleB') setTempValue(e.target.value);
                             else onUpdateProfile({...userProfile, styleB: e.target.value});
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none"
                        >
                           {PLAY_STYLE_B.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                   </div>
                 ) : (
                   <input 
                    type={editingField === 'email' ? 'email' : 'text'}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 outline-none focus:border-mahjong-green"
                    autoFocus
                   />
                 )}
               </div>

               <button 
                onClick={saveEdit}
                className="w-full bg-mahjong-green text-white font-bold py-3 rounded-lg shadow-md active:scale-95 transition-transform"
               >
                 保存する
               </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-8">
      {userProfile 
        ? renderAuthenticated() 
        : (view === 'MAIN' ? renderUnauthenticated() : renderRegistration())
      }
    </div>
  );
};