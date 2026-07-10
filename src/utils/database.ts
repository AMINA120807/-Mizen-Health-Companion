import { mockFoods } from '../data/mockData';
import { FoodItem } from '../types/food';
import { getCustomFoods } from './customFoods';

// Simulating a database fetch delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllFoods(): Promise<FoodItem[]> {
  await delay(100);
  const customFoods = getCustomFoods();
  return [...mockFoods, ...customFoods];
}

export async function getFoodById(id: string): Promise<FoodItem | undefined> {
  await delay(100);
  const allFoods = [...mockFoods, ...getCustomFoods()];
  return allFoods.find(food => food.id === id);
}

// In the future, this can be easily swapped out with Supabase client calls:
// import { supabase } from './supabaseClient';
// export async function getAllFoods() {
//   const { data, error } = await supabase.from('foods').select('*');
//   if (error) throw error;
//   return data;
// }
