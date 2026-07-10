"use client";

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { FoodItem } from '../types/food';
import { useTranslation } from '../contexts/LanguageContext';

interface WeeklyPlannerProps {
  foods: FoodItem[];
}

type DayPlan = {
  dayId: number;
  meals: FoodItem[];
};

export default function WeeklyPlanner({ foods }: WeeklyPlannerProps) {
  const { t, getFoodName } = useTranslation();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  
  // Initialize 7 days
  const [plan, setPlan] = useState<DayPlan[]>(
    Array.from({ length: 7 }, (_, i) => ({ dayId: i, meals: [] }))
  );

  const daysOfWeek = [
    t('weekly.monday'),
    t('weekly.tuesday'),
    t('weekly.wednesday'),
    t('weekly.thursday'),
    t('weekly.friday'),
    t('weekly.saturday'),
    t('weekly.sunday')
  ];

  const fuse = useMemo(() => {
    return new Fuse(foods, {
      keys: ['name_ar', 'name_fr', 'name_darija', 'name_en'],
      threshold: 0.3,
    });
  }, [foods]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map(result => result.item).slice(0, 5);
  }, [query, fuse]);

  const addMealToDay = (dayId: number, food: FoodItem) => {
    setPlan(prev => prev.map((day, i) => 
      i === dayId ? { ...day, meals: [...day.meals, food] } : day
    ));
    setQuery("");
    setActiveDay(null);
  };

  const removeMealFromDay = (dayId: number, mealIndex: number) => {
    setPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayId].meals = newPlan[dayId].meals.filter((_, i) => i !== mealIndex);
      return newPlan;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full transition-all fade-in print-container">
      {/* Header & Print Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print-hide">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary tracking-tight">
            {t('weekly.title')}
          </h2>
          <p className="text-gray-500 text-sm">
            {t('weekly.subtitle')}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          {t('weekly.print')}
        </button>
      </div>

      {/* Print-only title (hidden on screen) */}
      <div className="hidden print-show mb-6 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-black">{t('weekly.printTitle')}</h1>
      </div>

      {/* Search Modal (Only visible when adding a meal) */}
      {activeDay !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 print-hide">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => { setActiveDay(null); setQuery(""); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4 text-gray-900">
              {t('weekly.addTo')} {daysOfWeek[activeDay]}
            </h3>
            
            <div className="relative mb-4">
              <input
                type="text"
                autoFocus
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                dir="auto"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map(food => (
                  <button
                    key={food.id}
                    onClick={() => addMealToDay(activeDay, food)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 rounded-xl border border-gray-100 flex justify-between items-center transition-colors"
                  >
                    <span className="font-medium text-gray-900">{getFoodName(food)}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{food.calories_per_100g} kcal</span>
                  </button>
                ))
              ) : query.trim() ? (
                <p className="text-center text-gray-500 py-4">{t('search.noResults')}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 print-grid">
        {plan.map((dayPlan) => (
          <div key={dayPlan.dayId} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full print-card">
            {/* Day Header */}
            <div className="bg-primary/5 border-b border-gray-100 p-4 flex justify-between items-center print-card-header">
              <h3 className="font-bold text-gray-900">{daysOfWeek[dayPlan.dayId]}</h3>
              <button 
                onClick={() => setActiveDay(dayPlan.dayId)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors print-hide"
                title={t('weekly.addMeal')}
              >
                +
              </button>
            </div>
            
            {/* Meals List */}
            <div className="p-4 flex-1 flex flex-col gap-3 min-h-[120px]">
              {dayPlan.meals.length === 0 ? (
                <div className="text-sm text-gray-400 italic text-center my-auto print-hide">
                  {t('weekly.emptyDay')}
                </div>
              ) : (
                dayPlan.meals.map((meal, index) => (
                  <div key={`${meal.id}-${index}`} className="flex justify-between items-start group">
                    <div className="flex items-start gap-2">
                      <span className="text-primary mt-1 text-xs">●</span>
                      <div>
                        <p className="font-medium text-sm text-gray-900 leading-tight">{getFoodName(meal)}</p>
                        <p className="text-xs text-gray-500">{meal.calories_per_100g} kcal/100g</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeMealFromDay(dayPlan.dayId, index)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 print-hide text-lg leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* Print Empty Spaces for Writing */}
            <div className="hidden print-empty-slots p-4 flex-1 flex-col gap-3">
              {dayPlan.meals.length === 0 && (
                <>
                  <div className="border-b border-dashed border-gray-300 pb-4"></div>
                  <div className="border-b border-dashed border-gray-300 pb-4"></div>
                  <div className="border-b border-dashed border-gray-300 pb-4"></div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
