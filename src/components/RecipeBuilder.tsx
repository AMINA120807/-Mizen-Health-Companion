"use client";

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { FoodItem } from '../types/food';
import { saveCustomFood } from '../utils/customFoods';
import { useTranslation } from '../contexts/LanguageContext';

interface RecipeBuilderProps {
  foods: FoodItem[];
  onRecipeSaved: () => void;
}

interface RecipeIngredient {
  food: FoodItem;
  weightGrams: number;
}

export default function RecipeBuilder({ foods, onRecipeSaved }: RecipeBuilderProps) {
  const { t, getFoodName } = useTranslation();
  
  const [query, setQuery] = useState("");
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [portionGrams, setPortionGrams] = useState<number | "">("");

  const fuse = useMemo(() => {
    return new Fuse(foods, {
      keys: ['name_ar', 'name_fr', 'name_darija', 'name_en'],
      threshold: 0.3,
    });
  }, [foods]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map(result => result.item).slice(0, 5); // top 5
  }, [query, fuse]);

  const addIngredient = (food: FoodItem) => {
    setIngredients([...ingredients, { food, weightGrams: 100 }]);
    setQuery("");
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredientWeight = (index: number, weight: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].weightGrams = weight;
    setIngredients(newIngredients);
  };

  // Calculations
  const totalWeight = ingredients.reduce((acc, curr) => acc + curr.weightGrams, 0);
  
  const totalMacros = useMemo(() => {
    let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0, glycemicLoad = 0, sodium = 0;
    
    ingredients.forEach(({ food, weightGrams }) => {
      const multiplier = weightGrams / 100;
      calories += food.calories_per_100g * multiplier;
      protein += food.protein_g * multiplier;
      carbs += food.carbs_g * multiplier;
      fat += food.fat_g * multiplier;
      fiber += food.fiber_g * multiplier;
      glycemicLoad += food.glycemic_load_per_100g * multiplier;
      sodium += food.sodium_mg * multiplier;
    });

    return { calories, protein, carbs, fat, fiber, glycemicLoad, sodium };
  }, [ingredients]);

  const handleSave = () => {
    if (!recipeName.trim() || ingredients.length === 0 || !portionGrams || totalWeight === 0) return;

    // We calculate per 100g values
    const per100gMultiplier = 100 / totalWeight;

    // Approximate GI from GL and Carbs: GL = (GI * Carbs) / 100  => GI = (GL * 100) / Carbs
    const totalCarbsPer100g = totalMacros.carbs * per100gMultiplier;
    const totalGlPer100g = totalMacros.glycemicLoad * per100gMultiplier;
    let estimatedGI = 0;
    if (totalCarbsPer100g > 0) {
      estimatedGI = Math.round((totalGlPer100g * 100) / totalCarbsPer100g);
    }

    const customFood: FoodItem = {
      id: `custom_${crypto.randomUUID()}`,
      name_darija: recipeName,
      name_ar: recipeName,
      name_fr: recipeName,
      name_en: recipeName,
      category: "Recettes Personnalisées",
      calories_per_100g: Math.round(totalMacros.calories * per100gMultiplier),
      protein_g: Number((totalMacros.protein * per100gMultiplier).toFixed(1)),
      carbs_g: Number((totalMacros.carbs * per100gMultiplier).toFixed(1)),
      fat_g: Number((totalMacros.fat * per100gMultiplier).toFixed(1)),
      fiber_g: Number((totalMacros.fiber * per100gMultiplier).toFixed(1)),
      glycemic_index: estimatedGI,
      glycemic_load_per_100g: Number(totalGlPer100g.toFixed(1)),
      sodium_mg: Math.round(totalMacros.sodium * per100gMultiplier),
      typical_portion_label: "1 portion",
      typical_portion_grams: Number(portionGrams),
      health_flags: [],
      preparation_tip: "Custom recipe created by you.",
      data_source: "Custom",
      last_verified: new Date().toISOString()
    };

    saveCustomFood(customFood);
    
    // Reset state
    setRecipeName("");
    setIngredients([]);
    setPortionGrams("");
    
    onRecipeSaved();
  };

  return (
    <div className="w-full glass rounded-2xl p-6 transition-all fade-in">
      <h2 className="font-heading text-2xl font-bold mb-6 text-primary tracking-tight">
        {t('recipeBuilder.title', 'Create Custom Recipe')}
      </h2>

      {/* Step 1: Add Ingredients */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('recipeBuilder.searchIngredient', 'Search & Add Ingredients')}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            dir="auto"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg">
              {searchResults.map(food => (
                <button
                  key={food.id}
                  onClick={() => addIngredient(food)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex justify-between items-center"
                >
                  <span className="font-medium text-gray-900">{getFoodName(food)}</span>
                  <span className="text-sm text-gray-500">{food.calories_per_100g} kcal / 100g</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Adjust Weights */}
      {ingredients.length > 0 && (
        <div className="mb-8 space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('recipeBuilder.ingredientsList', 'Ingredients (Cooked Weight)')}
          </label>
          {ingredients.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 font-medium text-gray-900 truncate">
                {getFoodName(item.food)}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.weightGrams || ""}
                  onChange={(e) => updateIngredientWeight(index, Number(e.target.value))}
                  className="w-20 p-2 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <span className="text-gray-500 text-sm">g</span>
              </div>
              <button 
                onClick={() => removeIngredient(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Remove ingredient"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="text-right text-sm text-gray-600 font-medium pt-2 border-t border-gray-100">
            {t('recipeBuilder.totalWeight', 'Total Weight:')} {totalWeight}g
          </div>
        </div>
      )}

      {/* Step 3: Recipe Details */}
      {ingredients.length > 0 && (
        <div className="space-y-4 mb-8 bg-primary/5 p-5 rounded-xl border border-primary/10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('recipeBuilder.recipeName', 'Recipe Name')}
            </label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="e.g. My healthy couscous"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              dir="auto"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('recipeBuilder.portionSize', 'Typical Portion Size (g)')}
            </label>
            <input
              type="number"
              value={portionGrams}
              onChange={(e) => setPortionGrams(Number(e.target.value))}
              placeholder="e.g. 250"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Save Action */}
      <button
        onClick={handleSave}
        disabled={!recipeName.trim() || ingredients.length === 0 || !portionGrams || totalWeight === 0}
        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {t('recipeBuilder.saveButton', 'Save Custom Recipe')}
      </button>
    </div>
  );
}
