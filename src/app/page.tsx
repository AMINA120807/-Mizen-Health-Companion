"use client";

import { useState, useEffect, useCallback } from 'react';
import { FoodItem } from '../types/food';
import { getAllFoods } from '../utils/database';
import MealBuilder from '../components/MealBuilder';
import RamadanPlanner from '../components/RamadanPlanner';
import HistoryTab from '../components/HistoryTab';
import RecipeBuilder from '../components/RecipeBuilder';
import DietitianDirectory from '../components/DietitianDirectory';
import WeeklyPlanner from '../components/WeeklyPlanner';
import DailyTasks from '../components/DailyTasks';
import HealthHub from '../components/HealthHub';
import CommunityFeed from '../components/CommunityFeed';
import BarcodeScanner from '../components/BarcodeScanner';
import AIChef from '../components/AIChef';
import InstallModal from '../components/InstallModal';
import { useTranslation } from '../contexts/LanguageContext';

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<'standard' | 'ramadan' | 'history' | 'recipe' | 'dietitians' | 'weekly' | 'tasks' | 'hub' | 'community' | 'scanner' | 'chef'>('standard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { t } = useTranslation();

  const fetchFoods = useCallback(() => {
    getAllFoods().then(setFoods);
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  if (foods.length === 0) {
    return <div className="text-center py-20 text-gray-500 dark:text-emerald-200/60">{t('app.loading')}</div>;
  }

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-500 print-wrapper">
      <div className="text-center print-hide flex flex-col items-center justify-center">
        <img src="/icon.png" alt="Mizen Logo" className="w-20 h-20 mb-4 rounded-2xl shadow-lg border border-emerald-900/30" />
        <h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-emerald-50 mb-2 tracking-tight">{t('app.title')}</h1>
        <p className="text-gray-500 dark:text-emerald-200/60 font-medium">{t('app.subtitle')}</p>
      </div>

      <div className="w-full pb-2 -mb-2 print-hide relative z-20">
        <div className="flex justify-end mb-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 bg-black/40 hover:bg-emerald-900/40 border border-emerald-900/50 rounded-xl text-emerald-50 flex items-center gap-2 transition-colors shadow-sm"
          >
            <span className="font-bold text-sm uppercase tracking-wider text-emerald-200/80 mr-1">Menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>

        <div className={`flex flex-col gap-1 glass-panel mx-auto shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[1200px] opacity-100 p-3 mb-6' : 'max-h-0 opacity-0 p-0 border-0'}`}>
          
          {/* Section: Repas & Recettes */}
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-500/80 px-4 py-2 mt-1">🍽️ Repas & Recettes</div>
          <button 
            onClick={() => { setMode('standard'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'standard' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">🍽️</span> {t('nav.dailyMeal')}
          </button>
          <button 
            onClick={() => { setMode('weekly'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'weekly' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">📅</span> {t('nav.weekly')}
          </button>
          <button 
            onClick={() => { setMode('recipe'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'recipe' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">🍳</span> {t('nav.createRecipe')}
          </button>
          <button 
            onClick={() => { setMode('history'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'history' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">📊</span> {t('nav.history')}
          </button>

          <div className="h-px w-full bg-emerald-900/30 my-2"></div>

          {/* Section: Santé & Outils */}
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-500/80 px-4 py-2">⭐ Santé & Outils</div>
          <button 
            onClick={() => { setMode('hub'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'hub' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">⭐</span> {t('nav.hub')}
          </button>
          <button 
            onClick={() => { setMode('chef'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'chef' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">🧑‍🍳</span> {t('nav.chef')}
          </button>
          <button 
            onClick={() => { setMode('scanner'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'scanner' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">📸</span> {t('nav.scanner')}
          </button>
          <button 
            onClick={() => { setMode('community'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'community' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">🌍</span> {t('nav.community')}
          </button>
          <button 
            onClick={() => { setMode('dietitians'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'dietitians' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-emerald-50 border-l-4 border-emerald-500' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">👨‍⚕️</span> {t('nav.dietitians')}
          </button>
          <button 
            onClick={() => { setMode('ramadan'); setIsMenuOpen(false); }}
            className={`py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 ${mode === 'ramadan' ? 'bg-gradient-to-r from-emerald-900/60 to-transparent text-[#f57f17] border-l-4 border-[#f57f17]' : 'text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent'}`}
          >
            <span className="text-xl">🌙</span> {t('nav.ramadanMode')}
          </button>

          <div className="h-px w-full bg-emerald-900/30 my-2"></div>

          {/* Section: Application */}
          <button 
            onClick={() => { setShowInstallModal(true); setIsMenuOpen(false); }}
            className="py-3 px-4 text-sm font-bold rounded-xl transition-all flex items-center gap-3 text-emerald-200/60 hover:text-emerald-50 hover:bg-white/5 border-l-4 border-transparent"
          >
            <span className="text-xl">📱</span> {t('nav.installApp')}
          </button>
        </div>
      </div>

      {mode === 'standard' && <MealBuilder foods={foods} />}
      {mode === 'tasks' && <DailyTasks />}
      {mode === 'hub' && <HealthHub />}
      {mode === 'community' && <CommunityFeed />}
      {mode === 'scanner' && <BarcodeScanner />}
      {mode === 'chef' && <AIChef />}
      {mode === 'weekly' && <WeeklyPlanner foods={foods} />}
      {mode === 'ramadan' && <RamadanPlanner foods={foods} />}
      {mode === 'history' && <HistoryTab />}
      {mode === 'dietitians' && <DietitianDirectory />}
      {mode === 'recipe' && (
        <RecipeBuilder 
          foods={foods} 
          onRecipeSaved={() => {
            fetchFoods();
            setMode('standard');
          }} 
        />
      )}

      {showInstallModal && <InstallModal onClose={() => setShowInstallModal(false)} />}
    </div>
  );
}



