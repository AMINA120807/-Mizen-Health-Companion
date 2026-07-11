"use client";

import { useState, useEffect, useCallback } from 'react';
import { FoodItem } from '../types/food';
import { getAllFoods } from '../utils/database';
import MealBuilder from '../components/MealBuilder';
import RamadanPlanner from '../components/RamadanPlanner';
import HistoryTab from '../components/HistoryTab';
import RecipeBuilder from '../components/RecipeBuilder';
import WeeklyPlanner from '../components/WeeklyPlanner';
import DailyTasks from '../components/DailyTasks';
import HealthHub from '../components/HealthHub';
import CommunityFeed from '../components/CommunityFeed';
import BarcodeScanner from '../components/BarcodeScanner';
import AIChef from '../components/AIChef';
import InstallModal from '../components/InstallModal';
import AuthScreen from '../components/AuthScreen';
import UserProfile from '../components/UserProfile';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<'standard' | 'ramadan' | 'history' | 'recipe' | 'weekly' | 'tasks' | 'hub' | 'community' | 'scanner' | 'chef' | 'profile'>('standard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { t } = useTranslation();
  const { user, isReady } = useAuth();

  const fetchFoods = useCallback(() => {
    getAllFoods().then(setFoods);
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  if (!isReady) return <div className="text-center py-20 text-gray-500">{t('app.loading')}</div>;
  if (!user) return <AuthScreen />;
  
  if (foods.length === 0) {
    return <div className="text-center py-20 text-gray-500 dark:text-emerald-200/60">{t('app.loading')}</div>;
  }

  return (
    <div className="space-y-4 py-4 animate-in fade-in duration-500 print-wrapper relative">
      {/* Top Navigation Header */}
      <header className="flex justify-between items-center px-2 mb-4 relative z-50 print-hide">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-black/40 hover:bg-emerald-900/40 border border-emerald-900/50 rounded-xl text-emerald-50 transition-colors shadow-sm flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
        <LanguageSwitcher />
      </header>

      <div className="text-center print-hide flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-[40px] rounded-full pointer-events-none z-0"></div>
        <img src="/icon.png" alt="Mizen Logo" className="w-24 h-24 mb-4 rounded-3xl shadow-2xl border border-emerald-500/20 relative z-10" />
        <h1 className="font-heading text-4xl font-black text-gray-900 dark:text-emerald-50 mb-2 tracking-tight relative z-10 drop-shadow-sm">{t('app.title')}</h1>
        <p className="text-emerald-700 dark:text-emerald-300/80 font-medium tracking-wide relative z-10 uppercase text-xs">{t('app.subtitle')}</p>
      </div>

      <div className="w-full pb-2 -mb-2 print-hide relative z-40">
        <div className={`flex flex-col gap-3 bg-[#0d2115] border border-emerald-900/40 rounded-3xl mx-auto shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[1500px] opacity-100 p-6 mb-8' : 'max-h-0 opacity-0 p-0 border-0'}`}>
          
          {/* Section: Repas & Recettes */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-2">🍽️ REPAS & RECETTES</div>
          <button 
            onClick={() => { setMode('standard'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'standard' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🍽️</span> {t('nav.dailyMeal')}
          </button>
          <button 
            onClick={() => { setMode('weekly'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'weekly' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">📅</span> {t('nav.weekly')}
          </button>
          <button 
            onClick={() => { setMode('recipe'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'recipe' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🍳</span> {t('nav.createRecipe')}
          </button>
          <button 
            onClick={() => { setMode('history'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'history' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">📊</span> {t('nav.history')}
          </button>
          <button 
            onClick={() => { setMode('tasks'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'tasks' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🎯</span> {t('nav.tasks')}
          </button>

          <div className="h-px w-full bg-emerald-900/30 my-4"></div>

          {/* Section: Santé & Outils */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-2">⭐ SANTÉ & OUTILS</div>
          <button 
            onClick={() => { setMode('hub'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'hub' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">⭐</span> {t('nav.hub')}
          </button>
          <button 
            onClick={() => { setMode('chef'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'chef' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🧑‍🍳</span> {t('nav.chef')}
          </button>
          <button 
            onClick={() => { setMode('scanner'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'scanner' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">📸</span> {t('nav.scanner')}
          </button>
          <button 
            onClick={() => { setMode('community'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'community' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🌍</span> {t('nav.community')}
          </button>
          <button 
            onClick={() => { setMode('ramadan'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'ramadan' ? 'text-[#f57f17]' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">🌙</span> {t('nav.ramadanMode')}
          </button>

          <div className="h-px w-full bg-emerald-900/30 my-4"></div>

          {/* Section: Application */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 mb-2">⚙️ APPLICATION</div>
          <button 
            onClick={() => { setMode('profile'); setIsMenuOpen(false); }}
            className={`py-2 px-2 text-base font-bold transition-all flex items-center gap-4 ${mode === 'profile' ? 'text-emerald-400' : 'text-emerald-100/70 hover:text-emerald-50'}`}
          >
            <span className="text-xl opacity-80">👤</span> {t('nav.profile')}
          </button>
          <button 
            onClick={() => { setShowInstallModal(true); setIsMenuOpen(false); }}
            className="py-2 px-2 text-base font-bold transition-all flex items-center gap-4 text-emerald-100/70 hover:text-emerald-50"
          >
            <span className="text-xl opacity-80">📱</span> {t('nav.installApp')}
          </button>
        </div>
      </div>

      {mode === 'profile' && <UserProfile />}
      {mode === 'standard' && <MealBuilder foods={foods} />}
      {mode === 'tasks' && <DailyTasks />}
      {mode === 'hub' && <HealthHub />}
      {mode === 'community' && <CommunityFeed />}
      {mode === 'scanner' && <BarcodeScanner />}
      {mode === 'chef' && <AIChef />}
      {mode === 'weekly' && <WeeklyPlanner foods={foods} />}
      {mode === 'ramadan' && <RamadanPlanner foods={foods} />}
      {mode === 'history' && <HistoryTab />}
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



