import React, { useState } from 'react';
import { Wind, Users, AlertTriangle, Calculator, UserPlus, Check, Flame, Target, Calendar, MapPin, BookOpen, ChevronRight, X, Trash2, GripVertical, ArrowLeft, LogOut, RotateCcw, MessageSquare } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AddGameFormProps {
  onSubmit: (data: any, isFinished: boolean) => void;
}

// ---- Types & Constants ----

type Step = 'session' | 'game';

const RULES = [
  'Mリーグルール',
  '連盟ルール',
  '協会ルール',
  '最高位戦ルール',
  'Classicルール',
  'WRCルール',
  'μルール'
];

const LOCATIONS = [
  '東京都新宿区',
  '東京都渋谷区',
  'オンライン (Mahjong Soul)',
  'オンライン (天鳳)',
  '自宅',
  '知人宅'
];

// Mock data for opponent suggestions
const RECENT_OPPONENTS = [
  '佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'
];

interface Opponent {
  id: string;
  name: string;
  score: string;
}

// ---- Sub-components ----

interface SortableOpponentItemProps {
  id: string; 
  name: string; 
  score: string;
  wind: string; 
  onChange: (val: string) => void;
  onScoreChange: (val: string) => void;
  onClear: () => void;
  hasError?: boolean;
}

// Sortable Item Component
const SortableOpponentItem: React.FC<SortableOpponentItemProps> = ({ 
  id, 
  name, 
  score,
  wind, 
  onChange, 
  onScoreChange,
  onClear,
  hasError
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 mb-2 bg-slate-50 p-2 rounded-lg border touch-none ${hasError ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}>
      <div {...attributes} {...listeners} className="text-slate-400 p-2 cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </div>
      <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-200 text-slate-700 font-bold text-sm shrink-0">
        {wind}
      </div>
      <div className="flex-1 min-w-0 flex gap-2">
        <input
          type="text"
          list="opponent-suggestions"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="名前"
          className="flex-1 min-w-0 bg-white border border-slate-200 rounded px-3 py-2 text-sm focus:border-mahjong-green focus:ring-0 outline-none"
        />
        <div className="relative w-24 shrink-0">
          <input
            type="number"
            value={score}
            onChange={(e) => onScoreChange(e.target.value)}
            placeholder="点数"
            className="w-full bg-white border border-slate-200 rounded px-2 py-2 pr-6 text-sm text-right focus:border-mahjong-green focus:ring-0 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">点</span>
        </div>
      </div>
      <button 
        onClick={onClear}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

// Main Component
export const AddGameForm: React.FC<AddGameFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<Step>('session');
  
  // Validation State
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Session State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<string>('');
  const [rule, setRule] = useState<string>(''); // No default rule

  // Game State
  const [position, setPosition] = useState<string>('東');
  const [rank, setRank] = useState<1 | 2 | 3 | 4 | null>(null);
  const [score, setScore] = useState<string>('');
  const [dealIns, setDealIns] = useState<number>(0);
  const [isYakitori, setIsYakitori] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  
  // Opponents State (with stable IDs for DnD)
  const [opponents, setOpponents] = useState<Opponent[]>([
    { id: 'op-1', name: '', score: '' },
    { id: 'op-2', name: '', score: '' },
    { id: 'op-3', name: '', score: '' },
  ]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ---- Handlers ----

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOpponents((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleOpponentChange = (id: string, newName: string) => {
    setOpponents(prev => prev.map(op => op.id === id ? { ...op, name: newName } : op));
    // Clear error if exists
    if (errors.opponents) {
      const newErrors = { ...errors };
      delete newErrors.opponents;
      setErrors(newErrors);
    }
  };

  const handleOpponentScoreChange = (id: string, newScore: string) => {
    setOpponents(prev => prev.map(op => op.id === id ? { ...op, score: newScore } : op));
  };

  const handleOpponentClear = (id: string) => {
    handleOpponentChange(id, '');
    handleOpponentScoreChange(id, '');
  };

  const handleQuickFill = () => {
    setOpponents(prev => prev.map((op, idx) => ({ ...op, name: `フリー対局者${String.fromCharCode(65 + idx)}` })));
    if (errors.opponents) {
      const newErrors = { ...errors };
      delete newErrors.opponents;
      setErrors(newErrors);
    }
  };

  const handleClearAll = () => {
    setOpponents(prev => prev.map(op => ({ ...op, name: '', score: '' })));
  };

  // Validation Logic
  const validateSession = () => {
    const newErrors: {[key: string]: string} = {};
    if (!date) newErrors.date = '日付を選択してください';
    if (!location.trim()) newErrors.location = '場所を入力してください';
    if (!rule) newErrors.rule = 'ルールを選択してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGame = () => {
    const newErrors: {[key: string]: string} = {};
    if (!rank) newErrors.rank = '順位を選択してください';
    if (!score) newErrors.score = '点数を入力してください';
    
    const emptyOpponent = opponents.some(op => !op.name.trim());
    if (emptyOpponent) newErrors.opponents = '全ての対戦相手の名前を入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateSession()) {
      setStep('game');
    }
  };

  // Handle saving data. 
  // isFinished = true -> Save & Exit
  // isFinished = false -> Save & Reset for next game
  const handleSubmit = (isFinished: boolean) => {
    if (validateGame()) {
      // 1. Submit data
      onSubmit({
        session: { date, location, rule },
        game: {
          position,
          rank,
          score: parseInt(score) || 0,
          dealIns,
          isYakitori,
          opponents: opponents.map(op => op.name),
          opponentDetails: opponents.map(op => ({
            name: op.name,
            score: parseInt(op.score) || 0
          })),
          notes
        }
      }, isFinished);

      // 2. If continuing, reset specific fields
      if (!isFinished) {
        setRank(null);
        setScore('');
        setDealIns(0);
        setIsYakitori(false);
        setNotes('');
        // Keep opponents names, reset scores
        setOpponents(prev => prev.map(op => ({ ...op, score: '' })));
        
        // Scroll to top by targeting the scrollable container in Layout
        const mainContainer = document.getElementById('main-scroll-container');
        if (mainContainer) {
          mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Fallback if structure changes
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  };

  const getOpponentWind = (index: number) => {
    const winds = ['東', '南', '西', '北'];
    const myIndex = winds.indexOf(position);
    // The list of opponents starts from the wind AFTER me
    const actualWindIndex = (myIndex + 1 + index) % 4;
    return winds[actualWindIndex];
  };

  // ---- Renders ----

  const renderSessionStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <BookOpen className="text-mahjong-green" />
        本日の対局情報
      </h2>

      {/* Date */}
      <div className={`bg-white p-4 rounded-xl shadow-sm border ${errors.date ? 'border-red-300' : 'border-slate-100'}`}>
        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1"><Calendar size={14} /> 日付</span>
          {errors.date && <span className="text-red-500 text-[10px]">{errors.date}</span>}
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            if(errors.date) setErrors({...errors, date: ''});
          }}
          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-base focus:border-mahjong-green focus:ring-0 outline-none"
        />
      </div>

      {/* Location */}
      <div className={`bg-white p-4 rounded-xl shadow-sm border ${errors.location ? 'border-red-300' : 'border-slate-100'}`}>
        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1"><MapPin size={14} /> 場所</span>
          {errors.location && <span className="text-red-500 text-[10px]">{errors.location}</span>}
        </label>
        <input
          list="location-history"
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            if(errors.location) setErrors({...errors, location: ''});
          }}
          placeholder="場所を入力または選択"
          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-base focus:border-mahjong-green focus:ring-0 outline-none"
        />
        <datalist id="location-history">
          {LOCATIONS.map((loc, i) => <option key={i} value={loc} />)}
        </datalist>
      </div>

      {/* Rules */}
      <div className={`bg-white p-4 rounded-xl shadow-sm border ${errors.rule ? 'border-red-300' : 'border-slate-100'}`}>
        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1"><BookOpen size={14} /> 対局ルール</span>
          {errors.rule && <span className="text-red-500 text-[10px]">{errors.rule}</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {RULES.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRule(r);
                if(errors.rule) setErrors({...errors, rule: ''});
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                rule === r
                  ? 'bg-mahjong-green text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNextStep}
        className="w-full bg-mahjong-green hover:bg-mahjong-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-mahjong-green/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg mt-8"
      >
        次へ
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderGameStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <datalist id="opponent-suggestions">
        {RECENT_OPPONENTS.map((name, i) => <option key={i} value={name} />)}
      </datalist>

      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => setStep('session')}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft size={16} /> 戻る
        </button>
        <div className="text-xs text-slate-400 font-medium">
          {date.replace(/-/g, '/')} @ {location || '未設定'}
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Calculator className="text-mahjong-green" />
        対局結果の入力
      </h2>

      {/* Position */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1">
          <Wind size={14} /> 自家の座順
        </label>
        <div className="grid grid-cols-4 gap-3">
          {['東', '南', '西', '北'].map((wind) => (
            <button
              key={wind}
              onClick={() => setPosition(wind)}
              className={`h-12 rounded-lg font-bold text-lg transition-all ${
                position === wind
                  ? 'bg-mahjong-green text-white shadow-md transform scale-105'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {wind}
            </button>
          ))}
        </div>
      </div>

      {/* Opponents DnD */}
      <div className={`bg-white p-4 rounded-xl shadow-sm border ${errors.opponents ? 'border-red-300' : 'border-slate-100'}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Users size={14} /> 対戦相手 (ドラッグで席替え)
          </label>
          <div className="flex gap-2">
             <button 
              onClick={handleClearAll}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              クリア
            </button>
            <button 
              onClick={handleQuickFill}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <UserPlus size={12} />
              自動
            </button>
          </div>
        </div>
        
        {errors.opponents && (
          <div className="mb-2 text-red-500 text-xs flex items-center gap-1">
            <AlertTriangle size={12} /> {errors.opponents}
          </div>
        )}

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={opponents}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {opponents.map((opponent, index) => (
                <SortableOpponentItem 
                  key={opponent.id}
                  id={opponent.id}
                  name={opponent.name}
                  score={opponent.score}
                  wind={getOpponentWind(index)}
                  onChange={(val) => handleOpponentChange(opponent.id, val)}
                  onScoreChange={(val) => handleOpponentScoreChange(opponent.id, val)}
                  onClear={() => handleOpponentClear(opponent.id)}
                  hasError={!!errors.opponents && !opponent.name.trim()}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Score & Rank */}
      <div className={`bg-white p-4 rounded-xl shadow-sm border ${errors.score || errors.rank ? 'border-red-300' : 'border-slate-100'}`}>
        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1"><Target size={14} /> 点数と順位</span>
          {(errors.score || errors.rank) && <span className="text-red-500 text-[10px]">{errors.score || errors.rank}</span>}
        </label>
        
        <div className="flex flex-col gap-4">
          {/* Rank Selection */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRank(r as 1|2|3|4);
                  if(errors.rank) {
                    const newErrors = {...errors};
                    delete newErrors.rank;
                    setErrors(newErrors);
                  }
                }}
                className={`h-10 rounded-lg font-bold text-sm transition-all ${
                  rank === r
                    ? 'bg-mahjong-green text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r}着
              </button>
            ))}
          </div>

          {/* Score Input */}
          <div className="relative">
            <input
              type="number"
              value={score}
              onChange={(e) => {
                setScore(e.target.value);
                if(errors.score) {
                  const newErrors = {...errors};
                  delete newErrors.score;
                  setErrors(newErrors);
                }
              }}
              placeholder="30000"
              className="w-full text-center text-3xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-xl py-4 focus:border-mahjong-green focus:outline-none transition-colors placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">点</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Deal Ins */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1">
            <AlertTriangle size={14} /> 放銃回数
          </label>
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1">
            <button 
              onClick={() => setDealIns(Math.max(0, dealIns - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 font-bold active:scale-95 transition-transform"
            >
              -
            </button>
            <span className="text-xl font-bold text-slate-800">{dealIns}</span>
            <button 
              onClick={() => setDealIns(dealIns + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded shadow-sm text-mahjong-red font-bold active:scale-95 transition-transform"
            >
              +
            </button>
          </div>
        </div>

        {/* Yakitori */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1">
            <Flame size={14} /> 焼き鳥
          </label>
          <button
            onClick={() => setIsYakitori(!isYakitori)}
            className={`w-full h-[52px] rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isYakitori
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-50 text-slate-400'
            }`}
          >
            {isYakitori ? (
              <>
                <Flame size={18} />
                あり
              </>
            ) : (
              'なし'
            )}
          </button>
        </div>
      </div>

      {/* Memo */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1"><MessageSquare size={14} /> ひとことMemo</span>
          <span className="text-[10px] text-slate-400">{notes.length}/300</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              setNotes(e.target.value);
            }
          }}
          placeholder="対局の感想や反省点などを記録"
          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm focus:border-mahjong-green focus:ring-0 outline-none min-h-[100px] resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={() => handleSubmit(false)}
          className="w-full bg-white border-2 border-mahjong-green text-mahjong-green hover:bg-green-50 font-bold py-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
        >
          <RotateCcw size={20} />
          保存して次の半荘を入力
        </button>

        <button
          onClick={() => handleSubmit(true)}
          className="w-full bg-mahjong-green hover:bg-mahjong-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-mahjong-green/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
        >
          <Check size={20} />
          保存して終了
        </button>
      </div>
      
      <div className="h-8"></div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {step === 'session' ? renderSessionStep() : renderGameStep()}
    </div>
  );
};