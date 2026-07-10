import { FoodItem } from "./food";

export interface MealItem {
  id: string; // unique id for the meal item instance
  food: FoodItem;
  quantity: number; // Multiplier of the typical portion
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  glycemicLoad: number;
}

export interface MealLog {
  id: string;
  date: string; // ISO string
  type: "suhoor" | "iftar" | "meal";
  items: MealItem[];
  total_calories: number;
  total_gl: number;
}

