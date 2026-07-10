export interface FoodItem {
  id: string;
  name_ar: string;          // Arabic
  name_fr: string;          // French
  name_darija: string;      // Darija
  name_en: string;          // English
  category: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  glycemic_index: number;
  glycemic_load_per_100g: number;
  sodium_mg: number;
  typical_portion_label: string;   // e.g. "1 assiette moyenne"
  typical_portion_grams: number;
  health_flags: string[];          // e.g. ["diabetes", "hypertension"]
  preparation_tip: string;
  data_source: string;             // USDA / FAO / adapted
  last_verified: string;           // ISO date string
  isCustom?: boolean;
}
