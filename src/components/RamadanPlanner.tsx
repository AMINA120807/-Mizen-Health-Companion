"use client";

import { useState, useMemo } from 'react';
import { FoodItem } from '../types/food';
import { MealItem } from '../types/meal';
import SearchEngine from './SearchEngine';
import { calculateTotals, calculateRamadanScore } from '../utils/math';
import SugarCurveChart from './SugarCurveChart';
import { useTranslation } from '../contexts/LanguageContext';

interface RamadanPlannerProps {
  foods: FoodItem[];
}

export default function RamadanPlanner({ foods }: RamadanPlannerProps) {
  const [suhoorItems, setSuhoorItems] = useState<MealItem[]>([]);
  const [iftarItems, setIftarItems] = useState<MealItem[]>([]);
  const [activeMeal, setActiveMeal] = useState<'suhoor' | 'iftar'>('iftar');
  const { t, getFoodName } = useTranslation();

  const suhoorTotals = useMemo(() => calculateTotals(suhoorItems), [suhoorItems]);
  const iftarTotals = useMemo(() => calculateTotals(iftarItems), [iftarItems]);
  
  const combinedTotals = useMemo(() => {
    return {
      calories: suhoorTotals.calories + iftarTotals.calories,
      protein: suhoorTotals.protein + iftarTotals.protein,
      carbs: suhoorTotals.carbs + iftarTotals.carbs,
      fat: suhoorTotals.fat + iftarTotals.fat,
      fiber: suhoorTotals.fiber + iftarTotals.fiber,
      glycemicLoad: suhoorTotals.glycemicLoad + iftarTotals.glycemicLoad,
    };
  }, [suhoorTotals, iftarTotals]);

  const score = useMemo(() => calculateRamadanScore(combinedTotals), [combinedTotals]);

  const handleAddFood = (food: FoodItem) => {
    const newItem: MealItem = {
      id: crypto.randomUUID(),
      food,
      quantity: 1, 
    };
    if (activeMeal === 'suhoor') {
      setSuhoorItems(prev => [...prev, newItem]);
    } else {
      setIftarItems(prev => [...prev, newItem]);
    }
  };

  const handleRemoveFood = (id: string, meal: 'suhoor' | 'iftar') => {
    if (meal === 'suhoor') {
      setSuhoorItems(prev => prev.filter(item => item.id !== id));
    } else {
      setIftarItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number, meal: 'suhoor' | 'iftar') => {
    if (meal === 'suhoor') {
      setSuhoorItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    } else {
      setIftarItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const [moreFoodsExpanded, setMoreFoodsExpanded] = useState(false);

  const quickAddPresets = [
    { nameKey: 'preset.chickenTagine', icon: '🍲', type: 'iftar' as const, calories: 410, query: 'chicken' },
    { nameKey: 'preset.falafelWrap', icon: '🧆', type: 'suhoor' as const, calories: 300, query: 'falafel' },
    { nameKey: 'preset.samosas', icon: '🥟', type: 'iftar' as const, calories: 180, query: 'potato' },
    { nameKey: 'preset.fruitSalad', icon: '🍉', type: 'suhoor' as const, calories: 150, query: 'apple' },
  ];

  const handleQuickAdd = (query: string, mealType: 'suhoor' | 'iftar') => {
    const matchedFood = foods.find(f => f.name_en.toLowerCase().includes(query) || f.name_ar?.includes(query));
    if (matchedFood) {
      const newItem: MealItem = {
        id: crypto.randomUUID(),
        food: matchedFood,
        quantity: 1, 
      };
      if (mealType === 'suhoor') {
        setSuhoorItems(prev => [...prev, newItem]);
      } else {
        setIftarItems(prev => [...prev, newItem]);
      }
    }
  };

  const renderMealSection = (title: string, items: MealItem[], meal: 'suhoor' | 'iftar') => (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 mb-5 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
      
      <h3 className="font-heading font-bold text-lg text-emerald-50 mb-4 flex justify-between items-center relative z-10">
        {title}
        {activeMeal !== meal && (
          <button 
            onClick={() => setActiveMeal(meal)}
            className="text-[10px] font-semibold bg-white/5 text-emerald-200/70 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            {t('ramadan.switchToThis')}
          </button>
        )}
        {activeMeal === meal && (
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            {t('ramadan.active')}
          </span>
        )}
      </h3>
      
      {items.length === 0 ? (
        <p className="text-sm text-emerald-200/40 italic text-center py-5 relative z-10">{t('ramadan.noItems')} {title}.</p>
      ) : (
        <div className="space-y-3 relative z-10">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white/[0.04] p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex-1">
                <div className="font-semibold text-emerald-50">{getFoodName(item.food)}</div>
                <div className="text-[11px] text-emerald-200/50 mt-0.5">{item.food.typical_portion_label} ({item.food.typical_portion_grams}g)</div>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" min="0" step="0.5" 
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, parseFloat(e.target.value) || 0, meal)}
                  className="w-14 p-1.5 text-sm bg-black/20 border border-white/10 rounded-lg text-center text-emerald-50 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <button onClick={() => handleRemoveFood(item.id, meal)} className="text-emerald-200/40 hover:text-red-400 transition-colors p-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#0b1912] text-emerald-50 p-4 md:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden font-sans max-w-lg mx-auto border border-emerald-900/50">
      
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 blur-[50px] pointer-events-none"></div>

      <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Toggle Meal Buttons */}
        <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1.5 shadow-inner border border-white/10 relative mb-6">
          <button 
            onClick={() => setActiveMeal('iftar')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeMeal === 'iftar' ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-emerald-950 shadow-lg shadow-emerald-500/20 scale-[0.98]' : 'text-emerald-200/70 hover:bg-white/5'}`}
          >
            {t('ramadan.addToIftar')}
          </button>
          <button 
            onClick={() => setActiveMeal('suhoor')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeMeal === 'suhoor' ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-emerald-950 shadow-lg shadow-emerald-500/20 scale-[0.98]' : 'text-emerald-200/70 hover:bg-white/5'}`}
          >
            {t('ramadan.addToSuhoor')}
          </button>
        </div>

        {/* Search Engine - Dark Mode Wrapper */}
        <div className="[&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-white [&_input]:placeholder-emerald-200/30 [&_.bg-white dark:bg-emerald-950/40]:bg-black/40 [&_.bg-white dark:bg-emerald-950/40]:border-white/10 [&_.text-gray-900 dark:text-emerald-50]:text-emerald-50 [&_.text-gray-500 dark:text-emerald-200/60]:text-emerald-200/50 [&_.border-gray-100 dark:border-emerald-900/50]:border-white/10 [&_.bg-gray-50 dark:bg-emerald-900/20]:bg-white/5">
          <SearchEngine foods={foods} onAddFood={handleAddFood} />
        </div>

        {/* More Food Options Toggle */}
        <div className="pt-2 border-t border-white/5">
          <button 
            onClick={() => setMoreFoodsExpanded(!moreFoodsExpanded)}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-300 border border-emerald-500/25 bg-emerald-400/5 hover:bg-emerald-400/10 rounded-2xl py-3 active:scale-[0.98] transition-all"
          >
            <span>{moreFoodsExpanded ? t('ramadan.fewerOptions') : t('ramadan.moreOptions')}</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${moreFoodsExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className={`grid grid-cols-2 gap-3 mt-3 overflow-hidden transition-all duration-500 ${moreFoodsExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {quickAddPresets.map((preset, i) => (
              <div key={i} onClick={() => handleQuickAdd(preset.query, preset.type)} className="food-card rounded-2xl bg-white/[0.04] border border-white/10 p-3 cursor-pointer hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all active:scale-95 flex flex-col group">
                <div className={`w-full h-16 rounded-xl flex items-center justify-center text-3xl mb-3 shadow-inner ${preset.type === 'iftar' ? 'bg-gradient-to-br from-emerald-700/40 to-emerald-900/40' : 'bg-gradient-to-br from-amber-700/30 to-amber-900/30'}`}>
                  {preset.icon}
                </div>
                <p className="text-[13px] font-bold text-emerald-50 leading-tight group-hover:text-emerald-300 transition-colors">{t(preset.nameKey)}</p>
                <p className="text-[11px] text-emerald-200/50 mt-1 uppercase tracking-wider">{preset.type === 'iftar' ? t('ramadan.iftar') : t('ramadan.suhoor')} · {preset.calories} kcal</p>
              </div>
            ))}
          </div>
        </div>

        {(suhoorItems.length > 0 || iftarItems.length > 0) && (
          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-emerald-50 tracking-wide">{t('ramadan.dailyPlan')}</h2>
            </div>

            {renderMealSection(t('ramadan.iftar'), iftarItems, 'iftar')}
            {renderMealSection(t('ramadan.suhoor'), suhoorItems, 'suhoor')}

            {/* Nutrition Summary (Dark Theme) */}
            <div className="bg-gradient-to-br from-[#0d2a1b] to-[#07130c] border border-emerald-900/50 p-5 md:p-6 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] pointer-events-none"></div>
              
              <div className="flex justify-between items-center border-b border-emerald-800/50 pb-4 mb-4 relative z-10">
                <h3 className="font-heading text-[15px] font-semibold text-emerald-200">{t('ramadan.combinedNutrition')}</h3>
                <div className="bg-black/40 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-emerald-900/80">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">{t('ramadan.balanceScore')}</span>
                  <span className="text-lg font-bold text-emerald-50">{score}<span className="text-xs text-emerald-500/70">/10</span></span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-5 gap-x-6 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-1">
                  <span className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">{t('meal.calories')}</span>
                  <span className="font-bold text-lg text-emerald-50 leading-none">{combinedTotals.calories.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-1">
                  <span className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">{t('meal.glycemicLoad')}</span>
                  <span className={`font-bold text-lg leading-none ${combinedTotals.glycemicLoad > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>{combinedTotals.glycemicLoad.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-1">
                  <span className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">{t('meal.protein')}</span>
                  <span className="font-bold text-emerald-100 leading-none">{combinedTotals.protein.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-1">
                  <span className="text-emerald-200/60 text-xs font-medium uppercase tracking-wider">{t('meal.fiber')}</span>
                  <span className="font-bold text-emerald-100 leading-none">{combinedTotals.fiber.toFixed(1)}g</span>
                </div>
              </div>
            </div>
            
            {/* Alerts */}
            <div className="space-y-3">
              {iftarTotals.glycemicLoad > 40 && (
                <div className="bg-rose-950/40 border border-rose-900/50 text-rose-200 px-4 py-3.5 rounded-xl text-sm flex gap-3.5 items-start">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong className="block mb-1 text-rose-100">{t('alert.highSugarTitle')}</strong>
                    <span className="text-rose-200/80 leading-relaxed text-xs">{t('alert.highSugarDesc')}</span>
                  </div>
                </div>
              )}
              {suhoorTotals.fiber < 5 && suhoorItems.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-900/50 text-amber-200 px-4 py-3.5 rounded-xl text-sm flex gap-3.5 items-start">
                  <span className="text-xl">🔋</span>
                  <div>
                    <strong className="block mb-1 text-amber-100">{t('alert.lowEnergyTitle')}</strong>
                    <span className="text-amber-200/80 leading-relaxed text-xs">{t('alert.lowEnergyDesc')}</span>
                  </div>
                </div>
              )}
              <div className="bg-sky-950/30 border border-sky-900/40 text-sky-200 px-4 py-3.5 rounded-xl text-sm flex gap-3.5 items-start">
                <span className="text-xl">💧</span>
                <div>
                  <strong className="block mb-1 text-sky-100">{t('alert.hydrationTitle')}</strong>
                  <span className="text-sky-200/80 leading-relaxed text-xs">{t('alert.hydrationDesc')}</span>
                </div>
              </div>
            </div>

            {/* Sugar Curve Chart (Dark Theme Mode Passed implicitly or handled inside) */}
            <div className="[&_.bg-white dark:bg-emerald-950/40]:bg-black/40 [&_.bg-white dark:bg-emerald-950/40]:border-white/10 [&_.text-gray-900 dark:text-emerald-50]:text-emerald-50 [&_.text-gray-600 dark:text-emerald-200/60]:text-emerald-200/60 [&_.border-gray-200 dark:border-emerald-800/50]:border-white/10">
              <SugarCurveChart currentGL={combinedTotals.glycemicLoad} />
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}


