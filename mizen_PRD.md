# Product Requirements Document (PRD)
## Mizen — ميزان | Algerian Food Intelligence Platform

**Version:** 1.0  
**Date:** June 2026  
**Author:** Solo Developer  
**Status:** Draft

---

## 1. Executive Summary

**Mizen** (ميزان, meaning "The Scale") is a mobile-first web platform dedicated to Algerian food nutrition intelligence. It provides users with a culturally accurate, scientifically grounded tool to analyze their meals, understand their glycemic impact, and make healthier food choices — all without requiring an account or login.

The platform fills a critical gap: no existing nutrition tool properly documents Algerian dishes with accurate, culturally relevant nutritional data. Mizen targets the Algerian population across all health profiles — general public, people managing weight, athletes, diabetics, and Ramadan fasters.

---

## 2. Problem Statement

- Major nutrition apps (MyFitnessPal, Yazio, Cronometer) contain almost no Algerian dishes.
- When Algerian foods appear, portions are defined in grams — not in culturally familiar units (assiette, kess, louche).
- Glycemic index data, critical for Algeria's large diabetic population (estimated 15%+ of adults), is completely absent from local food contexts.
- No tool addresses Ramadan nutrition — a period where Suhoor and Iftar planning has major health implications.
- No platform exists in Darija, the native language of most Algerians.

---

## 3. Goals & Success Metrics

### Goals
- Build the first comprehensive, trustworthy nutritional database for Algerian food.
- Provide an instant meal analysis tool requiring zero friction (no account, no download).
- Make glycemic intelligence accessible and visually understandable to non-specialists.
- Launch a Ramadan-specific planner that can achieve organic viral growth.

### Success Metrics (Post-Launch)
| Metric | Target (3 months post-launch) |
|---|---|
| Unique monthly visitors | 5,000+ |
| Meal analyses completed | 10,000+ |
| Food items in database | 100+ |
| Avg. session duration | > 3 minutes |
| Ramadan planner uses | 2,000+ during Ramadan month |
| Bounce rate | < 55% |

---

## 4. Target Audience

| Segment | Description | Primary Need |
|---|---|---|
| General healthy public | Algerians curious about their diet | Calorie & macro awareness |
| People trying to lose weight | Users tracking daily intake | Calorie budgeting, portion guidance |
| Athletes & fitness people | Gym-goers, runners, footballers | Protein & carb optimization |
| Diabetics / pre-diabetics | High-risk, underserved segment | Glycemic index & sugar impact |
| Ramadan fasters | Seasonal but massive audience | Suhoor/Iftar nutritional balance |

**Primary Device:** Mobile (smartphone-first design, ~380px viewport)

---

## 5. Languages

The platform will support four languages with full UI translation:

- 🇩🇿 **Darija** (Algerian Arabic dialect) — primary/default
- 🌍 **Arabic** (Modern Standard Arabic) — secondary
- 🇫🇷 **French** — secondary
- 🇬🇧 **English** — tertiary

Language detection will default to browser locale, with a persistent manual toggle.

---

## 6. Features — V1 Scope

### 6.1 Algerian Food Database

The core data layer powering every feature.

**Requirements:**
- Minimum 60 dishes at launch, expanding to 100+ within 3 months.
- Each food item includes a full **Nutrition Card**:
  - Calories (kcal) per 100g AND per typical Algerian portion
  - Macronutrients: Protein, Carbohydrates, Fat, Fiber (g)
  - Glycemic Index (GI) and Glycemic Load (GL)
  - Key micronutrients: Iron, Calcium, Vitamin C, Vitamin B12 where relevant
  - Sodium content (important for hypertensive users)
  - Health impact notes (short, plain-language)
  - "Be careful if you have:" flags (diabetes, hypertension, kidney conditions)
  - Healthier preparation tip (1 sentence)
- Portions expressed in real Algerian units: assiette (plate), kess (glass), louche (ladle), tranche (slice), pièce (piece), alongside gram equivalents.
- Categories:
  - Soupes & Bouillons (Chorba Frik, Harira, Lham Lahlou…)
  - Plats Principaux (Couscous, Chakhchoukha, Tajine, Rechta…)
  - Grillades & Viandes (Merguez, Kefta, Poulet…)
  - Légumes & Légumineuses (Lentilles, Pois chiches, Courgettes…)
  - Pains & Galettes (Kesra, Matlouh, Khobz eddar…)
  - Pâtisseries & Sucreries (Baklava, Makroud, Kalb Ellouz…)
  - Boissons (Lben, Rayeb, Jus de citron…)
  - Produits Laitiers (Jben, Rayeb, Lait…)

**Data Source:** USDA FoodData Central and FAO databases as the scientific baseline, adapted to Algerian preparation methods and typical local portion sizes. All adaptations documented and transparent to the user.

---

### 6.2 Meal Builder

The hero feature — instant full meal analysis with zero friction.

**User Flow:**
1. User searches for a dish by name (in any supported language).
2. Selects portion size using Algerian units.
3. Adds multiple items to build a complete meal.
4. Receives an instant combined nutrition summary.

**Output displayed:**
- Total calories
- Combined macros (protein / carbs / fat / fiber)
- Total glycemic load of the meal
- Sugar impact curve (visual — see 6.3)
- Meal verdict badge:
  - 🟢 **Équilibré / Balanced**
  - 🟡 **Surveillez le sucre / Watch the sugar**
  - 🔴 **Repas lourd / Heavy meal**
- Personalized tip based on the meal composition

**UX Requirements:**
- Instant fuzzy search supporting Arabic, French, Darija, English queries simultaneously.
- No login, no form filling, no email required.
- Works fully offline after first load (PWA).
- Results shareable via a generated link or screenshot-ready summary card.

---

### 6.3 Glycemic Index & Sugar Curve Visualization

A visual tool making glycemic impact understandable to non-specialists.

**Requirements:**
- Display a simple blood sugar impact curve over 2 hours post-meal.
- Curve generated from the combined glycemic load of the meal.
- Color-coded zones: green (low impact), yellow (moderate), red (high spike).
- Accompanied by a plain-language explanation in the user's language.
- Show comparison: "With the Swap This suggestion, your curve looks like this..." (two curves overlaid).
- Special indicator for diabetic users: a reference "safe zone" line.

**Visual Style:**
- Clean, minimal chart — not a medical dashboard aesthetic.
- Accessible: works without color alone (pattern fills for colorblind users).

---

### 6.4 "Swap This" — Healthier Alternative Suggestions

After each meal analysis, one concrete, culturally grounded swap suggestion.

**Requirements:**
- Suggest ONE swap per meal (not a list — one actionable idea).
- Swap must use another Algerian food or preparation method, not a foreign substitute.
- Show the impact of the swap: calorie difference, GL difference.
- Examples:
  - "Replace Kesra Beida with Kesra Bel Choumène — saves 40 kcal and drops glycemic load by 28%"
  - "Grill your Merguez instead of frying — saves 60 kcal per piece"
  - "Replace white couscous with Belboula (barley couscous) — cuts glycemic load by 35%"
- Swap logic based on: highest GI contributor in the meal gets the swap suggestion first.

---

### 6.5 Ramadan Suhoor / Iftar Planner

A seasonal feature — planned to launch 3 weeks before Ramadan for maximum organic reach.

**Requirements:**
- Two separate meal builders: one for Suhoor, one for Iftar.
- Suhoor guidance: focus on slow-digesting carbs, fiber, hydration. Flag meals likely to cause midday fatigue.
- Iftar guidance: flag meals with excessive sugar spike risk (common with traditional sweets after fasting).
- Display combined Suhoor + Iftar daily nutrition summary.
- "Ramadan Balance Score": a simple score (1–10) rating how nutritionally balanced the day is.
- Specific tips for fasting physiology: hydration reminders, caffeine timing, breaking the fast gently.
- No religious content — purely nutritional guidance.
- Available in all 4 languages. Darija version is the priority.

---

### 6.6 Local Browser History Tracker

Persistent meal history stored entirely on the user's device — no server, no account.

**Requirements:**
- Store up to 30 days of meal logs in browser localStorage.
- Display a simple weekly summary: average daily calories, average GL, most eaten foods.
- Allow the user to clear their history at any time with one tap.
- Explicit on-screen notice: "Your data stays on your device only. Nothing is sent to any server."
- No sync between devices (by design — privacy first).
- History accessible from a "Mon Historique / تاريخي" tab.

---

## 7. Features — Post V1 Roadmap

| Feature | Priority | Target |
|---|---|---|
| Recipe builder (custom dish from ingredients) | High | V2 |
| Dietitian directory (Algerian professionals) | Medium | V2 |
| Printable weekly meal plan PDF | Medium | V2 |
| B2B nutrition data API | Low | V3 |
| Native mobile app (Android) | Low | V3 |
| Community-submitted recipes with moderation | Low | V3 |

---

## 8. Technical Architecture

### Stack (AI-Assisted Development)
| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | Fast, SEO-friendly, PWA support |
| Styling | Tailwind CSS | Rapid mobile-first UI |
| Database | Supabase (PostgreSQL) | Free tier, open source, real-time ready |
| Search | Fuse.js | Client-side fuzzy search, multilingual |
| Charts | Recharts | Glycemic curve visualization |
| Offline | PWA + Service Workers | Works without internet after first load |
| i18n | next-i18next | Arabic (RTL), French, Darija, English |
| Hosting | Vercel | Free tier, global CDN, zero config |
| Analytics | Plausible (privacy-first) | No cookies, GDPR compliant |

### Key Technical Constraints
- **RTL support mandatory** — Arabic and Darija require full right-to-left layout.
- **No user accounts** — zero authentication infrastructure in V1.
- **No cookies/tracking** — privacy-first by design.
- **PWA requirement** — service worker must cache the food database for offline use.
- **Performance target** — Lighthouse score ≥ 90 on mobile.
- **Accessibility** — WCAG 2.1 AA minimum for color contrast and touch targets.

---

## 9. Data Model (Simplified)

```
FoodItem {
  id: string
  name_ar: string          // Arabic
  name_fr: string          // French
  name_darija: string      // Darija
  name_en: string          // English
  category: string
  calories_per_100g: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number
  glycemic_index: number
  glycemic_load_per_100g: number
  sodium_mg: number
  typical_portion_label: string   // e.g. "1 assiette moyenne"
  typical_portion_grams: number
  health_flags: string[]          // e.g. ["diabetes", "hypertension"]
  preparation_tip: string
  data_source: string             // USDA / FAO / adapted
  last_verified: date
}

MealLog (localStorage only) {
  id: string
  date: datetime
  type: "suhoor" | "iftar" | "meal"
  items: FoodItem[]
  total_calories: number
  total_gl: number
}
```

---

## 10. Design Principles

- **Mobile-first, always** — every component designed for a 380px screen first.
- **Speed over decoration** — no heavy animations, instant feedback on every interaction.
- **Trust through transparency** — every nutritional value shows its source.
- **Cultural authenticity** — Algerian food names in Darija are the primary label, not translations.
- **One action per screen** — no cognitive overload; the user always knows what to do next.
- **RTL-native** — the Darija/Arabic version is not a mirror of French; it is designed RTL from the start.

---

## 11. Content & Data Integrity Policy

- All nutritional data sourced from USDA FoodData Central or FAO, with documented adaptation for Algerian recipes.
- Every food item page displays its data source clearly.
- A disclaimer is shown on all health-related content: "This information is educational. Consult a healthcare professional for medical dietary advice."
- No personalized medical prescriptions. The platform informs, it does not diagnose or treat.
- Data reviewed and updated at minimum every 6 months.
- A "Report an error" button on every food card allows community correction submissions (reviewed by the developer before publishing).

---

## 12. Monetization

**V1: Free, no monetization.**

The priority is building trust, audience, and data quality. No ads, no subscriptions, no paywalls at launch.

Future monetization options (post V1, only if traffic justifies):
- Partnership banners with Algerian dietitian clinics (clearly labeled, not intrusive).
- A downloadable "Guide Nutritionnel Algérien" PDF (one-time purchase).
- B2B: nutritional database API for Algerian health apps, insurance companies, or hospital systems.

---

## 13. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Inaccurate nutritional data | 🔴 Critical | Use USDA/FAO as baseline; document every adaptation; add "report error" button |
| Recipe variation (home vs restaurant) | 🟡 Medium | Define "standard recipe" clearly per dish; show ingredient assumptions |
| RTL layout bugs | 🟡 Medium | Test every component in Arabic/Darija from day one, not as an afterthought |
| Scope creep delaying launch | 🟡 Medium | Hard V1 feature lock — nothing outside Section 6 ships in V1 |
| Low SEO visibility | 🟡 Medium | Target long-tail Algerian food queries in Arabic and French from day one |
| Medical liability | 🟠 Moderate | Consistent disclaimers; never use prescriptive language; flag "consult a doctor" where relevant |

---

## 14. Launch Strategy

### Phase 1 — Foundation (Months 1–2)
- Build and verify 60 core food items with full nutrition cards.
- Launch Meal Builder + Food Database only.
- Soft launch to friends/family for feedback.
- Fix data errors and UX issues.

### Phase 2 — Ramadan Launch (Month 3, timed to pre-Ramadan)
- Add Suhoor/Iftar Planner.
- Publish 3 pieces of Ramadan nutrition content (blog/social).
- Share on Facebook Algeria, TikTok DZ, Instagram.
- **This is the primary viral moment.**

### Phase 3 — Glycemic Feature + History (Month 4–5)
- Add sugar curve visualization.
- Add Swap This feature.
- Add local browser history tracker.
- Reach out to one Algerian diabetes association for endorsement.

### Phase 4 — Growth (Month 6+)
- Expand database to 100+ items.
- SEO content strategy in Arabic and French.
- Explore B2B API and dietitian partnerships.

---

## 15. Out of Scope (V1)

The following will NOT be built in V1:
- User accounts or authentication
- Social features (sharing, comments, leaderboards)
- Personalized AI recommendations
- Native mobile app
- Integration with fitness trackers or wearables
- Recipes with step-by-step cooking instructions
- Video content
- Any form of advertising

---

*Document version 1.0 — To be updated after each major phase completion.*
