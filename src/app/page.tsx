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
import { useTranslation } from '../contexts/LanguageContext';

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [mode, setMode] = useState<'standard' | 'ramadan' | 'history' | 'recipe' | 'dietitians' | 'weekly'>('standard');
  const { t } = useTranslation();

  const fetchFoods = useCallback(() => {
    getAllFoods().then(setFoods);
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  if (foods.length === 0) {
    return <div className="text-center py-20 text-gray-500">{t('app.loading')}</div>;
  }

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-500 print-wrapper">
      <div className="text-center print-hide">
        <h1 className="font-heading text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{t('app.title')}</h1>
        <p className="text-gray-500 font-medium">{t('app.subtitle')}</p>
      </div>

      <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-hide print-hide">
        <div className="flex justify-start sm:justify-center bg-gray-100 p-1 rounded-xl min-w-max sm:min-w-0 sm:max-w-3xl mx-auto shadow-inner gap-1">
          <button 
            onClick={() => setMode('standard')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'standard' ? 'bg-white text-primary shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.dailyMeal')}
          </button>
          <button 
            onClick={() => setMode('weekly')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'weekly' ? 'bg-white text-purple-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.weekly')}
          </button>
          <button 
            onClick={() => setMode('ramadan')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'ramadan' ? 'bg-white text-[#f57f17] shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.ramadanMode')}
          </button>
          <button 
            onClick={() => setMode('history')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'history' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.history')}
          </button>
          <button 
            onClick={() => setMode('recipe')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'recipe' ? 'bg-white text-green-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.createRecipe')}
          </button>
          <button 
            onClick={() => setMode('dietitians')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${mode === 'dietitians' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('nav.dietitians')}
          </button>
        </div>
      </div>

      {mode === 'standard' && <MealBuilder foods={foods} />}
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

