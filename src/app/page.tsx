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
import { useTranslation } from '../contexts/LanguageContext';

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<'standard' | 'ramadan' | 'history' | 'recipe' | 'dietitians' | 'weekly' | 'tasks'>('standard');
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
      <div className="text-center print-hide">
        <h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-emerald-50 mb-2 tracking-tight">{t('app.title')}</h1>
        <p className="text-gray-500 dark:text-emerald-200/60 font-medium">{t('app.subtitle')}</p>
      </div>

      <div className="w-full pb-2 -mb-2 print-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 glass-panel p-3 rounded-2xl mx-auto shadow-sm">
          <button 
            onClick={() => setMode('standard')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'standard' ? 'bg-white dark:bg-emerald-950/40 text-primary shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.dailyMeal')}
          </button>
          <button 
            onClick={() => setMode('tasks')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'tasks' ? 'bg-white dark:bg-emerald-950/40 text-blue-500 shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.tasks')}
          </button>
          <button 
            onClick={() => setMode('weekly')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'weekly' ? 'bg-white dark:bg-emerald-950/40 text-purple-600 shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.weekly')}
          </button>
          <button 
            onClick={() => setMode('ramadan')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'ramadan' ? 'bg-white dark:bg-emerald-950/40 text-[#f57f17] shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.ramadanMode')}
          </button>
          <button 
            onClick={() => setMode('history')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'history' ? 'bg-white dark:bg-emerald-950/40 text-gray-900 dark:text-emerald-50 shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.history')}
          </button>
          <button 
            onClick={() => setMode('recipe')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'recipe' ? 'bg-white dark:bg-emerald-950/40 text-green-600 shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.createRecipe')}
          </button>
          <button 
            onClick={() => setMode('dietitians')}
            className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${mode === 'dietitians' ? 'bg-white dark:bg-emerald-950/40 text-blue-600 shadow-md transform -translate-y-0.5' : 'text-gray-500 dark:text-emerald-200/60 hover:text-gray-900 dark:text-emerald-50 hover:bg-white/50'}`}
          >
            {t('nav.dietitians')}
          </button>
        </div>
      </div>

      {mode === 'standard' && <MealBuilder foods={foods} />}
      {mode === 'tasks' && <DailyTasks />}
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
    </div>
  );
}



