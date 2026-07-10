import { MealLog } from '../types/meal';
import { FoodItem } from '../types/food';

const HISTORY_KEY = 'mizen_meal_history';

export function saveMealLog(log: MealLog) {
  const history = getHistory();
  history.push(log);
  // Keep only the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filteredHistory = history.filter(item => new Date(item.date) >= thirtyDaysAgo);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
}

export function getHistory(): MealLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as MealLog[];
  } catch (e) {
    console.error("Failed to parse history data", e);
    return [];
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

// Custom Recipes Management
const RECIPES_KEY = "mizen_custom_recipes";

export function getCustomRecipes(): FoodItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RECIPES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as FoodItem[];
  } catch (e) {
    console.error("Failed to parse custom recipes", e);
    return [];
  }
}

export function saveCustomRecipe(recipe: FoodItem) {
  if (typeof window === 'undefined') return;
  const existing = getCustomRecipes();
  existing.push(recipe);
  localStorage.setItem(RECIPES_KEY, JSON.stringify(existing));
}

export function getHistoryAverages() {
  const history = getHistory();
  if (history.length === 0) return { avgCalories: 0, avgGL: 0, daysLogged: 0 };

  const totalCalories = history.reduce((sum, log) => sum + log.total_calories, 0);
  const totalGL = history.reduce((sum, log) => sum + log.total_gl, 0);
  
  // Group by unique days to find average per day
  const uniqueDays = new Set(history.map(log => log.date.split('T')[0])).size;
  
  return {
    avgCalories: totalCalories / uniqueDays,
    avgGL: totalGL / uniqueDays,
    daysLogged: uniqueDays
  };
}
