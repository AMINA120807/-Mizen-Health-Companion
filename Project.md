# Mizen Health Companion (ميزان)

## 📌 Project Overview
**Mizen (ميزان)** is a localized, privacy-first, offline-capable Algerian Food Intelligence Platform. It is designed to help users track their daily nutrition (Calories, Macros, Glycemic Load), plan meals, and discover healthier food swaps—all tailored to the Algerian diet and culture.

The application is a Progressive Web App (PWA) that runs entirely in the browser. It requires no backend, no authentication, and stores all user data (meal history, custom recipes) locally in the browser's `localStorage`.

### 🚀 Core Features
1. **Daily Meal Builder:** Search for local foods, adjust portion sizes, and track total macros and Glycemic Load (GL).
2. **Ramadan Planner:** Specialized mode for Iftar and Suhoor. Includes hydration alerts, energy warnings (low fiber), and blood sugar spike warnings (high GL).
3. **Weekly Planner:** A 7-day meal planner with a print-optimized layout for generating physical PDFs or paper plans.
4. **Smart Swaps:** An algorithmic engine that suggests healthier alternatives (lower GI/GL) within the same food category.
5. **Sugar Curve Chart:** A visual projection of blood sugar impact over 2 hours based on the meal's Glycemic Load.
6. **Custom Recipe Builder:** Allows users to combine ingredients into a new custom dish and save it for future use.
7. **Dietitian Directory:** A searchable directory of Algerian dietitians, filterable by Wilaya and Specialty.
8. **Multi-language Support:** Full i18n support for Algerian Darija (دارجة), Standard Arabic (العربية), French (Français), and English, complete with automatic RTL/LTR layout switching.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI & Styling:** React 18, Tailwind CSS v3
- **Language:** TypeScript
- **State & Storage:** React Hooks (`useState`, `useMemo`, `useEffect`) + `localStorage`
- **Fuzzy Search:** `fuse.js` (for highly tolerant search across multiple languages)
- **Data Visualization:** `recharts` (for the blood sugar curve)
- **PWA:** `next-pwa`

---

## 📁 Code Architecture & File Locations

All application source code is located in the `src/` directory.

### 1. Application Core (`src/app/`)
- **`layout.tsx`**: The root layout. Configures fonts (Inter, Outfit), the global `ErrorBoundary`, the `LanguageProvider`, and basic HTML structure.
- **`page.tsx`**: The main Single Page Application (SPA) entry point. It fetches the mock database and orchestrates the tabs (Standard, Weekly, Ramadan, History, Recipes, Dietitians).
- **`globals.css`**: Tailwind directives and CSS variables for the application's design system (Light and Dark theme colors), plus custom `@media print` logic for the Weekly Planner.

### 2. Components (`src/components/`)
- **`SearchEngine.tsx`**: A `fuse.js` powered search bar that searches food names across all 4 supported languages simultaneously.
- **`MealBuilder.tsx`**: The standard daily meal tracker. Calculates totals, triggers Smart Swaps, and renders the Sugar Curve.
- **`RamadanPlanner.tsx`**: The specialized Ramadan tracker. Evaluates Iftar/Suhoor balance and issues health alerts. Features a "quick-add" preset system for common meals.
- **`WeeklyPlanner.tsx`**: A 7-day grid for planning meals, heavily styled for clean printing.
- **`RecipeBuilder.tsx`**: Calculates combined macros and estimates GI for user-created recipes based on their constituent ingredients.
- **`HistoryTab.tsx`**: Reads `localStorage` meal logs to display 30-day averages.
- **`DietitianDirectory.tsx`**: Displays and filters the static list of dietitians.
- **`SugarCurveChart.tsx`**: A responsive `recharts` AreaChart simulating blood sugar impact over a 120-minute window.
- **`LanguageSwitcher.tsx`**: A simple dropdown to change the active language.
- **`ConfirmModal.tsx` & `ErrorBoundary.tsx`**: UI utilities for safe interactions and crash recovery.

### 3. Context & State (`src/contexts/`)
- **`LanguageContext.tsx`**: The heart of the i18n system. It manages the translation dictionary, handles hydration, toggles the document's `dir` attribute (RTL/LTR), and provides the `getFoodName` helper to resolve food names based on the active language.

### 4. Data Layer (`src/data/`)
- **`mockData.ts`**: The core food database. Contains hundreds of Algerian and international foods with detailed macros, glycemic indexes, and health flags.
- **`dietitians.ts`**: The static directory of healthcare professionals.

### 5. Types (`src/types/`)
- **`food.ts`**: Defines `FoodItem` (macros, GI, GL, multilingual names).
- **`meal.ts`**: Defines `MealItem` (a food + quantity) and `MealLog` (a saved historical meal).
- **`dietitian.ts`**: Defines the `Dietitian` contact interface.

### 6. Utilities (`src/utils/`)
- **`math.ts`**: Contains the pure logic for calculating combined meal totals, calculating the 1-10 Ramadan balance score, and the algorithm for identifying Smart Swaps.
- **`history.ts`**: Manages reading, writing, and clearing historical `MealLog` data in `localStorage`.
- **`customFoods.ts`**: Manages reading and writing user-created `FoodItem` recipes in `localStorage`.
- **`database.ts`**: Simulates an async database fetch by merging `mockData.ts` and `customFoods.ts`.

---

## 🔒 Security & Privacy Notes
Mizen is designed to be **Privacy-First**:
- All calculations are done client-side.
- All historical data and custom recipes are saved strictly in the user's browser via `localStorage`.
- There are no analytics trackers, no backend databases, and no external API calls.

---

## 👨‍💻 Developer Guide

### 1. Adding New Foods to the Database
To add a new food item, open `src/data/mockData.ts` and append a new object to the `mockFoods` array.

**Required Schema:**
```typescript
{
  id: string,               // Must be unique (e.g., "150")
  name_ar: string,          // Arabic name
  name_fr: string,          // French name
  name_darija: string,      // Algerian Darija name
  name_en: string,          // English name
  category: string,         // e.g., "Plats Principaux", "Boissons", "Pâtisseries"
  calories_per_100g: number,
  protein_g: number,
  carbs_g: number,
  fat_g: number,
  fiber_g: number,
  glycemic_index: number,   // Low: <55, Med: 56-69, High: >70
  glycemic_load_per_100g: number, // (carbs_g * glycemic_index) / 100
  sodium_mg: number,
  typical_portion_label: string, // e.g., "1 bol", "1 pièce"
  typical_portion_grams: number, // Weight of the typical portion
  health_flags: string[],   // e.g., ["diabetes"] (used for warnings/swaps)
  preparation_tip: string,  // Health tip for UI display
  data_source: string,
  last_verified: string
}
```
*Note: Make sure to calculate the `glycemic_load_per_100g` accurately, as the Smart Swaps and Sugar Curve algorithms rely heavily on it.*

### 2. How the Algorithms Work

**Smart Swaps (`math.ts`)**
When a user adds a food with a high Glycemic Index (GI > 55), the app searches the database for a food that matches the *same category* but has a significantly lower GI. If a match is found, it is suggested in the UI as a healthier alternative.

**Sugar Curve (`SugarCurveChart.tsx`)**
The blood sugar spike visualization is an estimation based on the meal's total Glycemic Load (GL). 
- **Time:** Spans from minute 0 to minute 120 (2 hours post-meal).
- **Peak:** The peak occurs around minute 45-60.
- **Amplitude:** The height of the peak is directly proportional to the total GL. High GL meals (e.g., sugary pastries) will show a sharp, red spike. High fiber meals will show a flattened, green curve.

**Ramadan Balance Score (`math.ts`)**
The `calculateRamadanBalance` function returns a score from 0-10. It penalizes meals that are severely unbalanced (e.g., very high carbs with zero protein/fiber). If the score drops below 5, UI warnings are triggered in the Ramadan Planner.

### 3. Build & Deployment (PWA)
Because Mizen is an offline-first PWA (Progressive Web App), it can be installed natively on iOS, Android, and Desktop directly from the browser.

**To build for production:**
1. Run `npm run build`
2. Next.js will generate the static bundle. `next-pwa` will automatically intercept the build and generate the Service Worker (`sw.js`) and `workbox-*.js` files in the `public/` directory.

**To deploy (Vercel/Netlify):**
Simply connect the repository and use the standard Next.js build command (`npm run build`). No backend or environment variables are required. Once deployed, users who visit the site will be prompted to "Add to Home Screen".
