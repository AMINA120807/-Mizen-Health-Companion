"use client";

import { useState, useMemo } from 'react';
import { FoodItem } from '../types/food';
import { MealItem, MealLog } from '../types/meal';
import SearchEngine from './SearchEngine';
import { saveMealLog } from '../utils/history';
import { calculateTotals, findSwapSuggestion } from '../utils/math';
import SugarCurveChart from './SugarCurveChart';
import { useTranslation } from '../contexts/LanguageContext';

interface MealBuilderProps {
  foods: FoodItem[];
}

export default function MealBuilder({ foods }: MealBuilderProps) {
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const { t, getFoodName } = useTranslation();

  const totals = useMemo(() => calculateTotals(mealItems), [mealItems]);
  const swapSuggestion = useMemo(() => findSwapSuggestion(mealItems, foods), [mealItems, foods]);

  const handleSaveMeal = () => {
    if (mealItems.length === 0) return;
    
    const log: MealLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: "meal",
      items: mealItems,
      total_calories: totals.calories,
      total_gl: totals.glycemicLoad,
    };
    
    saveMealLog(log);
    setMealItems([]); // Clear meal after saving
    alert(t('meal.mealSaved'));
  };

  const handleAddFood = (food: FoodItem) => {
    const newItem: MealItem = {
      id: crypto.randomUUID(),
      food,
      quantity: 1, 
    };
    setMealItems((prev) => [...prev, newItem]);
  };

  const handleRemoveFood = (id: string) => {
    setMealItems((prev) => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setMealItems((prev) => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SearchEngine foods={foods} onAddFood={handleAddFood} />

      {mealItems.length > 0 && (
        <div className="w-full glass rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
          
          <h2 className="font-heading text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {t('meal.yourMeal')}
          </h2>
          
          <div className="space-y-4">
            {mealItems.map(item => (
              <div key={item.id} className="group flex flex-col gap-3 p-4 bg-white/50 border border-gray-100 rounded-xl hover-lift">
                <div className="flex justify-between items-start">
                  <span className="font-heading font-semibold text-gray-900 text-lg">{getFoodName(item.food)}</span>
                  <button 
                    onClick={() => handleRemoveFood(item.id)}
                    className="text-gray-400 hover:text-destructive transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                
                <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-gray-50">
                  <span className="text-gray-500 text-sm font-medium">
                    {item.food.typical_portion_label} <span className="text-gray-400">({item.food.typical_portion_grams}g)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">{t('meal.qty')}</span>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.5" 
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseFloat(e.target.value) || 0)}
                      className="w-16 p-1.5 border border-gray-200 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-semibold text-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-inner mt-8">
            <h3 className="font-heading text-lg text-gray-300 border-b border-gray-700 pb-3 mb-4">{t('meal.totalNutrition')}</h3>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.calories')}</span>
                <span className="font-bold text-xl text-white">{totals.calories.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.glycemicLoad')}</span>
                <span className={`font-bold text-xl ${totals.glycemicLoad > 30 ? 'text-red-400' : 'text-accent'}`}>{totals.glycemicLoad.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.protein')}</span>
                <span className="font-bold">{totals.protein.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.carbs')}</span>
                <span className="font-bold">{totals.carbs.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.fat')}</span>
                <span className="font-bold">{totals.fat.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-sm">{t('meal.fiber')}</span>
                <span className="font-bold">{totals.fiber.toFixed(1)}g</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSaveMeal}
            className="w-full bg-primary text-primary-foreground font-heading font-semibold text-lg py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30"
          >
            {t('meal.saveMeal')}
          </button>

          {swapSuggestion && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 rounded-2xl mt-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <h3 className="font-heading font-bold text-green-900 flex items-center gap-2 mb-3 text-lg">
                <span className="text-xl">💡</span> {t('swap.title')}
              </h3>
              <p className="text-green-800 leading-relaxed">
                {t('swap.replace')} <strong className="font-semibold">{getFoodName(swapSuggestion.original)}</strong> {t('swap.with')} <strong className="font-semibold">{getFoodName(swapSuggestion.swap)}</strong>.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-green-800 font-medium">
                {swapSuggestion.diffKcal > 0 && (
                  <div className="bg-green-100/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    📉 {t('swap.saves')} {swapSuggestion.diffKcal.toFixed(0)} kcal
                  </div>
                )}
                <div className="bg-green-100/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  🩸 {t('swap.glDrops')} {swapSuggestion.diffGL.toFixed(1)}
                </div>
              </div>
              <button 
                onClick={() => {
                  const existingItem = mealItems.find(i => i.food.id === swapSuggestion.original.id);
                  if (existingItem) {
                    const newItem: MealItem = {
                      id: crypto.randomUUID(),
                      food: swapSuggestion.swap,
                      quantity: existingItem.quantity,
                    };
                    setMealItems(prev => prev.map(item => item.id === existingItem.id ? newItem : item));
                  }
                }}
                className="mt-5 bg-green-600 text-white font-semibold px-4 py-3 rounded-xl w-full hover:bg-green-700 transition-colors shadow-sm"
              >
                {t('swap.apply')}
              </button>
            </div>
          )}

          <SugarCurveChart 
            currentGL={totals.glycemicLoad} 
            swapGL={swapSuggestion ? Math.max(0, totals.glycemicLoad - swapSuggestion.diffGL) : undefined} 
          />
        </div>
      )}
    </div>
  );
}
