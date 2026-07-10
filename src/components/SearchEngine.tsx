"use client";

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { FoodItem } from '../types/food';
import { useTranslation } from '../contexts/LanguageContext';

interface SearchEngineProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
}

export default function SearchEngine({ foods, onAddFood }: SearchEngineProps) {
  const [query, setQuery] = useState("");
  const { t, getFoodName } = useTranslation();

  const fuse = useMemo(() => {
    return new Fuse(foods, {
      keys: ['name_ar', 'name_fr', 'name_darija', 'name_en'],
      threshold: 0.3, // Fuzzy match threshold
    });
  }, [foods]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    return fuse.search(query).map(result => result.item);
  }, [query, fuse]);

  return (
    <div className="w-full glass rounded-2xl p-6 mb-8 transition-all">
      <div className="relative">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl mb-6 bg-white dark:bg-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          dir="auto"
        />
        <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>

      <div className="space-y-3">
        {results.length > 0 ? (
          results.map(food => (
            <div key={food.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center hover-lift">
              <div className="flex-1">
                <div className="font-heading font-semibold text-lg text-gray-900 dark:text-gray-100">{getFoodName(food)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {food.name_ar} • {food.name_fr}
                </div>
                <div className="text-xs text-primary font-medium flex gap-3">
                  <span className="bg-primary/10 px-2 py-1 rounded-md">{food.calories_per_100g} kcal / 100g</span>
                  <span className={`px-2 py-1 rounded-md ${food.glycemic_index > 70 ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'}`}>GI: {food.glycemic_index}</span>
                </div>
              </div>
              <button 
                onClick={() => onAddFood(food)}
                className="ml-4 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex-shrink-0"
              >
                +
              </button>
            </div>
          ))
        ) : query.trim() ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed">{t('search.noResults')}</div>
        ) : null}
      </div>
    </div>
  );
}

