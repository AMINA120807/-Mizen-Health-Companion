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
        <div className={`flex flex-col gap-2 bg-gradient-to-b from-[#0b2918] to-[#071a0f] border border-emerald-700/50 rounded-3xl mx-auto shadow-2xl overflow-hidden transition-all duration-500 origin-top ease-out ${isMenuOpen ? 'max-h-[1500px] opacity-100 p-6 mb-8 scale-y-100' : 'max-h-0 opacity-0 p-0 border-0 scale-y-95'}`}>
          
          {/* Section: Repas & Recettes */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-2 px-2">🍽️ REPAS & RECETTES</div>
          <button 
            onClick={() => { setMode('standard'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'standard' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🍽️</span> {t('nav.dailyMeal')}
          </button>
          <button 
            onClick={() => { setMode('weekly'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'weekly' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">📅</span> {t('nav.weekly')}
          </button>
          <button 
            onClick={() => { setMode('recipe'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'recipe' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🍳</span> {t('nav.createRecipe')}
          </button>
          <button 
            onClick={() => { setMode('history'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'history' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">📊</span> {t('nav.history')}
          </button>
          <button 
            onClick={() => { setMode('tasks'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'tasks' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🎯</span> {t('nav.tasks')}
          </button>

          <div className="h-px w-full bg-emerald-800/40 my-3"></div>

          {/* Section: Santé & Outils */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-2 px-2">⭐ SANTÉ & OUTILS</div>
          <button 
            onClick={() => { setMode('hub'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'hub' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">⭐</span> {t('nav.hub')}
          </button>
          <button 
            onClick={() => { setMode('chef'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'chef' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🧑‍🍳</span> {t('nav.chef')}
          </button>
          <button 
            onClick={() => { setMode('scanner'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'scanner' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">📸</span> {t('nav.scanner')}
          </button>
          <button 
            onClick={() => { setMode('community'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'community' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🌍</span> {t('nav.community')}
          </button>
          <button 
            onClick={() => { setMode('ramadan'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'ramadan' ? 'bg-orange-500/20 text-orange-400 scale-[1.02] shadow-lg border border-orange-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-orange-300 hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">🌙</span> {t('nav.ramadanMode')}
          </button>

          <div className="h-px w-full bg-emerald-800/40 my-3"></div>

          {/* Section: Application */}
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 mb-2 px-2">⚙️ APPLICATION</div>
          <button 
            onClick={() => { setMode('profile'); setIsMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group ${mode === 'profile' ? 'bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-lg border border-emerald-500/30' : 'text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2'}`}
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">👤</span> {t('nav.profile')}
          </button>
          <button 
            onClick={() => { setShowInstallModal(true); setIsMenuOpen(false); }}
            className="w-full text-left py-3 px-4 text-base font-bold rounded-xl transition-all duration-300 flex items-center gap-4 group text-emerald-50 hover:bg-white/10 hover:text-white hover:translate-x-2"
          >
            <span className="text-2xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">📱</span> {t('nav.installApp')}
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



