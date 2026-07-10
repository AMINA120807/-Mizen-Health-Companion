import { FoodItem } from '../types/food';

const CUSTOM_FOODS_KEY = 'mizen_custom_foods';

export const getCustomFoods = (): FoodItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CUSTOM_FOODS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse custom foods", e);
    return [];
  }
};

export const saveCustomFood = (food: FoodItem): void => {
  if (typeof window === 'undefined') return;
  const current = getCustomFoods();
  
  // if updating existing
  const existingIndex = current.findIndex(f => f.id === food.id);
  if (existingIndex >= 0) {
    current[existingIndex] = { ...food, isCustom: true };
  } else {
    current.push({ ...food, isCustom: true });
  }
  
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(current));
};

export const deleteCustomFood = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getCustomFoods();
  const updated = current.filter(f => f.id !== id);
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(updated));
};
