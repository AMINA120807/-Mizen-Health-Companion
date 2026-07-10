import { FoodItem } from '../types/food';
import { MealItem, MealTotals } from '../types/meal';

export function calculateTotals(mealItems: MealItem[]): MealTotals {
  return mealItems.reduce((acc, item) => {
    const weightInGrams = item.quantity * item.food.typical_portion_grams;
    const multiplier = weightInGrams / 100;

    return {
      calories: acc.calories + (item.food.calories_per_100g * multiplier),
      protein: acc.protein + (item.food.protein_g * multiplier),
      carbs: acc.carbs + (item.food.carbs_g * multiplier),
      fat: acc.fat + (item.food.fat_g * multiplier),
      fiber: acc.fiber + (item.food.fiber_g * multiplier),
      glycemicLoad: acc.glycemicLoad + (item.food.glycemic_load_per_100g * multiplier),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, glycemicLoad: 0 });
}

export function findSwapSuggestion(mealItems: MealItem[], foods: FoodItem[]) {
  if (mealItems.length === 0) return null;

  // 1. Find item with highest GL
  let highestGLItem = mealItems[0];
  let maxGL = -1;

  for (const item of mealItems) {
    const weightInGrams = item.quantity * item.food.typical_portion_grams;
    const gl = item.food.glycemic_load_per_100g * (weightInGrams / 100);
    if (gl > maxGL) {
      maxGL = gl;
      highestGLItem = item;
    }
  }

  if (maxGL === 0) return null;

  // 2. Find alternative in the same category with lower GI
  const alternatives = foods.filter(f => 
    f.category === highestGLItem.food.category && 
    f.id !== highestGLItem.food.id &&
    f.glycemic_index < highestGLItem.food.glycemic_index
  );

  if (alternatives.length === 0) return null;

  // Pick the one with the lowest GI
  alternatives.sort((a, b) => a.glycemic_index - b.glycemic_index);
  const bestSwap = alternatives[0];

  // 3. Calculate differences based on SAME weight
  const weightInGrams = highestGLItem.quantity * highestGLItem.food.typical_portion_grams;
  const multiplier = weightInGrams / 100;

  const oldKcal = highestGLItem.food.calories_per_100g * multiplier;
  const oldGL = highestGLItem.food.glycemic_load_per_100g * multiplier;

  const newKcal = bestSwap.calories_per_100g * multiplier;
  const newGL = bestSwap.glycemic_load_per_100g * multiplier;

  const diffKcal = oldKcal - newKcal;
  const diffGL = oldGL - newGL;

  if (diffGL <= 0) return null;

  return {
    original: highestGLItem.food,
    swap: bestSwap,
    diffKcal,
    diffGL,
    percentGLDrop: (diffGL / oldGL) * 100
  };
}

export function calculateRamadanScore(totals: MealTotals) {
  // Score out of 10 based on fiber vs sugar vs protein
  let score = 5; // Base score
  
  if (totals.fiber > 10) score += 2;
  else if (totals.fiber > 5) score += 1;
  
  if (totals.protein > 20) score += 2;
  
  if (totals.glycemicLoad > 50) score -= 3;
  else if (totals.glycemicLoad > 30) score -= 1;
  else if (totals.glycemicLoad < 15) score += 1;
  
  return Math.max(1, Math.min(10, score));
}
