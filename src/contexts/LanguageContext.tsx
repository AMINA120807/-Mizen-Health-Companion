"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem } from '../types/food';

export type Language = 'en' | 'fr' | 'ar' | 'dar';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navigation & Headers
  "app.title": { en: "Mizen — ميزان", fr: "Mizen — ميزان", ar: "ميزان — Mizen", dar: "ميزان — Mizen" },
  "app.subtitle": { 
    en: "Algerian Food Intelligence Platform", 
    fr: "Plateforme d'Intelligence Alimentaire Algérienne", 
    ar: "منصة ذكاء الغذاء الجزائري", 
    dar: "منصة ذكاء الماكلة الدزيرية" 
  },
  "nav.dailyMeal": { en: "Daily Meal", fr: "Repas Quotidien", ar: "وجبة يومية", dar: "وجبة يومية" },
  "nav.ramadanMode": { en: "Ramadan Mode 🌙", fr: "Mode Ramadan 🌙", ar: "وضع رمضان 🌙", dar: "وضع رمضان 🌙" },
  "nav.history": { en: "History", fr: "Historique", ar: "تاريخي", dar: "تاريخي" },
  "nav.createRecipe": { en: "Create Recipe", fr: "Créer une Recette", ar: "إنشاء وصفة", dar: "صنع وصفة" },
  "nav.dietitians": { en: "Experts", fr: "Experts", ar: "المختصين", dar: "المختصين" },
  "nav.weekly": { en: "Weekly Plan", fr: "Plan Hebdo", ar: "خطة أسبوعية", dar: "خطة سمانة" },
  "nav.tasks": { en: "Daily Goals", fr: "Objectifs", ar: "أهداف يومية", dar: "أهداف يومية" },

  // Search
  "search.placeholder": { en: "Search for a food (e.g. Couscous)...", fr: "Rechercher un aliment (ex. Couscous)...", ar: "ابحث عن طعام (مثل كسكس)...", dar: "حوس على ماكلة (مثلا كسكس)..." },
  "search.resultsFor": { en: "Results for", fr: "Résultats pour", ar: "نتائج", dar: "نتائج" },
  "search.noResults": { en: "No foods found.", fr: "Aucun aliment trouvé.", ar: "لم يتم العثور على أطعمة.", dar: "مالقينا والو." },
  
  // Meal Builder
  "meal.yourMeal": { en: "Your Meal", fr: "Votre Repas", ar: "وجبتك", dar: "وجبتك" },
  "meal.qty": { en: "Qty:", fr: "Qté:", ar: "الكمية:", dar: "الكمية:" },
  "meal.totalNutrition": { en: "Total Nutrition", fr: "Nutrition Totale", ar: "إجمالي التغذية", dar: "إجمالي التغذية" },
  "meal.calories": { en: "Calories", fr: "Calories", ar: "سعرات", dar: "سعرات" },
  "meal.glycemicLoad": { en: "Glycemic Load", fr: "Charge Glycémique", ar: "الحمل الجلايسيمي", dar: "الحمل الجلايسيمي" },
  "meal.protein": { en: "Protein", fr: "Protéines", ar: "بروتين", dar: "بروتين" },
  "meal.carbs": { en: "Carbs", fr: "Glucides", ar: "كربوهيدرات", dar: "كربوهيدرات" },
  "meal.fat": { en: "Fat", fr: "Lipides", ar: "دهون", dar: "دهون" },
  "meal.fiber": { en: "Fiber", fr: "Fibres", ar: "ألياف", dar: "ألياف" },
  "meal.saveMeal": { en: "Save Meal to History", fr: "Enregistrer le Repas", ar: "حفظ الوجبة", dar: "حفظ الوجبة" },
  "meal.mealSaved": { en: "Meal saved to your local history!", fr: "Repas enregistré dans votre historique !", ar: "تم حفظ الوجبة في تاريخك المحلي!", dar: "تخبات الوجبة في تاريخك!" },
  
  // Ramadan Planner
  "ramadan.addToIftar": { en: "Add to Iftar", fr: "Ajouter au Ftour", ar: "أضف إلى الفطور", dar: "زيد للفطور" },
  "ramadan.addToSuhoor": { en: "Add to Suhoor", fr: "Ajouter au S'hour", ar: "أضف إلى السحور", dar: "زيد للسحور" },
  "ramadan.dailyPlan": { en: "Ramadan Daily Plan", fr: "Plan Quotidien du Ramadan", ar: "خطة رمضان اليومية", dar: "خطة رمضان اليومية" },
  "ramadan.iftar": { en: "Iftar", fr: "Ftour", ar: "الفطور", dar: "الفطور" },
  "ramadan.suhoor": { en: "Suhoor", fr: "S'hour", ar: "السحور", dar: "السحور" },
  "ramadan.switchToThis": { en: "Switch to this", fr: "Passer à ceci", ar: "انتقل إلى هذا", dar: "انتقل إلى هذا" },
  "ramadan.active": { en: "Active", fr: "Actif", ar: "نشط", dar: "نشط" },
  "ramadan.noItems": { en: "No items added to", fr: "Aucun élément ajouté à", ar: "لم تتم إضافة أي عناصر إلى", dar: "ما زدت والو لـ" },
  "ramadan.combinedNutrition": { en: "Combined Nutrition", fr: "Nutrition Combinée", ar: "التغذية المجمعة", dar: "التغذية المجمعة" },
  "ramadan.balanceScore": { en: "Balance Score", fr: "Score d'Équilibre", ar: "درجة التوازن", dar: "درجة التوازن" },
  "ramadan.moreOptions": { en: "More food options", fr: "Plus d'options", ar: "المزيد من الخيارات", dar: "زيد خيارات" },
  "ramadan.fewerOptions": { en: "Show fewer options", fr: "Moins d'options", ar: "إظهار خيارات أقل", dar: "نقص خيارات" },
  "preset.chickenTagine": { en: "Chicken Tagine", fr: "Tajine de Poulet", ar: "طاجين الدجاج", dar: "طاجين دجاج" },
  "preset.falafelWrap": { en: "Baked Falafel Wrap", fr: "Wrap de Falafel", ar: "ساندويتش فلافل", dar: "ساندويتش فلافل" },
  "preset.samosas": { en: "Veggie Samosas", fr: "Samoussas aux Légumes", ar: "سمبوسة خضار", dar: "بوراك خضرة" },
  "preset.fruitSalad": { en: "Fruit Salad", fr: "Salade de Fruits", ar: "سلطة فواكه", dar: "شلاضة فاكهة" },
  
  // Smart Swap
  "swap.title": { en: "Smart Swap Suggestion", fr: "Suggestion Maligne", ar: "اقتراح ذكي", dar: "اقتراح ذكي" },
  "swap.replace": { en: "Replace", fr: "Remplacez", ar: "استبدل", dar: "بدل" },
  "swap.with": { en: "with", fr: "par", ar: "بـ", dar: "بـ" },
  "swap.saves": { en: "Saves", fr: "Économise", ar: "يوفر", dar: "ينقص" },
  "swap.glDrops": { en: "GL drops by", fr: "CG baisse de", ar: "ينخفض الحمل بـ", dar: "ينقص الحمل بـ" },
  "swap.apply": { en: "Apply Swap Instantly", fr: "Appliquer Immédiatement", ar: "طبق الاستبدال فوراً", dar: "طبق الاستبدال فوراً" },
  
  // Chart
  "chart.title": { en: "Blood Sugar Impact (2 Hours)", fr: "Impact sur la Glycémie (2 Heures)", ar: "تأثير سكر الدم (ساعتان)", dar: "تأثير سكر الدم (ساعتين)" },
  "chart.safeZone": { en: "Safe Zone", fr: "Zone Sûre", ar: "منطقة آمنة", dar: "منطقة آمنة" },
  "chart.currentMeal": { en: "Current Meal", fr: "Repas Actuel", ar: "الوجبة الحالية", dar: "الوجبة الحالية" },
  "chart.withSwap": { en: "With Swap", fr: "Avec Remplacement", ar: "مع الاستبدال", dar: "مع الاستبدال" },

  // History
  "history.title": { en: "My History", fr: "Mon Historique", ar: "تاريخي", dar: "تاريخي" },
  "history.avgDailyCalories": { en: "Avg Daily Calories", fr: "Moy. Calories Jour", ar: "متوسط السعرات يومياً", dar: "متوسط السعرات يومياً" },
  "history.avgDailyGL": { en: "Avg Daily GL", fr: "Moy. CG Jour", ar: "متوسط الحمل يومياً", dar: "متوسط الحمل يومياً" },
  "history.basedOn": { en: "Based on", fr: "Basé sur", ar: "بناءً على", dar: "مبني على" },
  "history.daysOfData": { en: "days of private, local data.", fr: "jours de données privées et locales.", ar: "أيام من البيانات الخاصة والمحلية.", dar: "أيام من البيانات الخاصة والمحلية." },
  "history.clear": { en: "Clear History", fr: "Effacer l'Historique", ar: "مسح التاريخ", dar: "مسح التاريخ" },
  "history.confirmClear": { en: "Are you sure you want to delete all history?", fr: "Êtes-vous sûr de vouloir supprimer tout l'historique ?", ar: "هل أنت متأكد أنك تريد حذف كل التاريخ؟", dar: "راك سير حاب تمسح كلش؟" },
  "history.noData": { en: "No history data available yet. Start logging meals!", fr: "Aucune donnée disponible. Commencez à enregistrer des repas !", ar: "لا توجد بيانات تاريخية بعد. ابدأ بتسجيل الوجبات!", dar: "مازال ما عندك حتى بيانات. ابدا تخبي وجباتك!" },
  
  // Alerts
  "alert.highSugarTitle": { en: "High Sugar Spike Risk (Iftar)", fr: "Risque de Pic de Sucre Élevé (Ftour)", ar: "خطر ارتفاع السكر (إفطار)", dar: "خطر ارتفاع السكر (فطور)" },
  "alert.highSugarDesc": { en: "Your Iftar has a very high Glycemic Load. Consider replacing sugary sweets like Kalb El Louz with dates, or eat them only after a fiber-rich salad.", fr: "Votre Ftour a une charge glycémique très élevée. Pensez à remplacer les sucreries par des dattes, ou mangez-les après une salade riche en fibres.", ar: "إفطارك يحتوي على حمل جلايسيمي مرتفع جدًا. فكر في استبدال الحلويات السكرية بالتمر، أو تناولها بعد سلطة غنية بالألياف.", dar: "فطورك فيه حمل جلايسيمي طالع بزاف. فكر تبدل الحلوى بالتمر، ولا كولهم مور شلاضة فيها ألياف." },
  "alert.lowEnergyTitle": { en: "Low Energy Risk (Suhoor)", fr: "Risque de Faible Énergie (S'hour)", ar: "خطر نقص الطاقة (سحور)", dar: "خطر نقص الطاقة (سحور)" },
  "alert.lowEnergyDesc": { en: "Your Suhoor is very low in fiber. You might feel hungry and fatigued early in the day. Add complex carbs like barley or whole wheat.", fr: "Votre S'hour est très pauvre en fibres. Vous pourriez avoir faim rapidement. Ajoutez des glucides complexes comme l'orge.", ar: "سحورك منخفض جدًا في الألياف. قد تشعر بالجوع والتعب في وقت مبكر من اليوم. أضف الكربوهيدرات المعقدة مثل الشعير.", dar: "سحورك ناقص بزاف ألياف. قادر تجوع وتعيا بكري. زيد النشويات كيما الشعير ولا القمح." },
  "alert.hydrationTitle": { en: "Hydration Reminder", fr: "Rappel d'Hydratation", ar: "تذكير بالترطيب", dar: "تذكير بالترطيب" },
  "alert.hydrationDesc": { en: "Don't forget to drink at least 1.5L of water between Iftar and Suhoor, spaced out gradually.", fr: "N'oubliez pas de boire au moins 1.5L d'eau entre le Ftour et le S'hour, de manière espacée.", ar: "لا تنس شرب 1.5 لتر من الماء على الأقل بين الإفطار والسحور، على فترات متباعدة.", dar: "ما تنساش تشرب 1.5 لتر ماء على الأقل بين الفطور والسحور، مفرقة بالعقل." },
  
  // Database Loader
  "app.loading": { en: "Loading database...", fr: "Chargement de la base de données...", ar: "جاري تحميل قاعدة البيانات...", dar: "رانا نوجدو فالمعلومات..." },
  
  // Recipe Builder
  "recipeBuilder.title": { en: "Create Custom Recipe", fr: "Créer une Recette Personnalisée", ar: "إنشاء وصفة مخصصة", dar: "صنع وصفة تاعك" },
  "recipeBuilder.searchIngredient": { en: "Search & Add Ingredients", fr: "Rechercher et Ajouter des Ingrédients", ar: "ابحث وأضف المكونات", dar: "حوس وزيد مقادير" },
  "recipeBuilder.ingredientsList": { en: "Ingredients (Cooked Weight)", fr: "Ingrédients (Poids Cuit)", ar: "المكونات (الوزن المطبوخ)", dar: "المقادير (وزن طايب)" },
  "recipeBuilder.totalWeight": { en: "Total Weight:", fr: "Poids Total :", ar: "الوزن الإجمالي:", dar: "الوزن الإجمالي:" },
  "recipeBuilder.recipeName": { en: "Recipe Name", fr: "Nom de la Recette", ar: "اسم الوصفة", dar: "اسم الوصفة" },
  "recipeBuilder.portionSize": { en: "Typical Portion Size (g)", fr: "Portion Typique (g)", ar: "حجم الحصة النموذجي (غ)", dar: "حجم الحصة العادي (غ)" },
  "recipeBuilder.saveButton": { en: "Save Custom Recipe", fr: "Enregistrer la Recette", ar: "حفظ الوصفة", dar: "خبي الوصفة" },
  
  // Dietitians Directory
  "dietitians.title": { en: "Dietitians Directory", fr: "Annuaire des Diététiciens", ar: "دليل أخصائيي التغذية", dar: "دليل المختصين" },
  "dietitians.disclaimer": { en: "Mizen is an educational tool. For personalized medical advice, please consult these verified professionals.", fr: "Mizen est un outil éducatif. Pour des conseils médicaux personnalisés, veuillez consulter ces professionnels vérifiés.", ar: "ميزان أداة تعليمية. للحصول على استشارة طبية شخصية، يرجى استشارة هؤلاء المهنيين المعتمدين.", dar: "ميزان أداة تعليمية. إلا احتجت نصيحة طبية شخصية، شوف مع هادو المختصين." },
  "dietitians.wilayaFilter": { en: "Filter by Wilaya", fr: "Filtrer par Wilaya", ar: "تصفية حسب الولاية", dar: "خير الولاية" },
  "dietitians.specialtyFilter": { en: "Filter by Specialty", fr: "Filtrer par Spécialité", ar: "تصفية حسب التخصص", dar: "خير التخصص" },
  "dietitians.all": { en: "All", fr: "Tous", ar: "الكل", dar: "الكل" },
  "dietitians.noResults": { en: "No professionals found matching your filters.", fr: "Aucun professionnel trouvé pour ces critères.", ar: "لم يتم العثور على أي متخصصين يطابقون تصفيتك.", dar: "مالقينا حتى مختص بهاد الشروط." },

  // Weekly Planner
  "weekly.title": { en: "Weekly Meal Plan", fr: "Plan Hebdomadaire", ar: "خطة الوجبات الأسبوعية", dar: "خطة الماكلة د السمانة" },
  "weekly.subtitle": { en: "Plan your meals for the week and print them.", fr: "Planifiez vos repas pour la semaine et imprimez-les.", ar: "خطط لوجباتك للأسبوع واطبعها.", dar: "خطط ماكلتك للسمانة واطبعها." },
  "weekly.print": { en: "Print / Save PDF", fr: "Imprimer / PDF", ar: "طباعة / حفظ PDF", dar: "اطبع / خبي PDF" },
  "weekly.printTitle": { en: "My Weekly Meal Plan", fr: "Mon Plan de Repas Hebdomadaire", ar: "خطة وجباتي الأسبوعية", dar: "خطة ماكلتي د السمانة" },
  "weekly.addTo": { en: "Add Meal to", fr: "Ajouter un Repas à", ar: "أضف وجبة إلى", dar: "زيد ماكلة لـ" },
  "weekly.addMeal": { en: "Add Meal", fr: "Ajouter Repas", ar: "أضف وجبة", dar: "زيد ماكلة" },
  "weekly.emptyDay": { en: "No meals planned yet.", fr: "Aucun repas prévu.", ar: "لم يتم التخطيط لأي وجبات.", dar: "ما خططت حتى ماكلة." },
  "weekly.monday": { en: "Monday", fr: "Lundi", ar: "الإثنين", dar: "الإثنين" },
  "weekly.tuesday": { en: "Tuesday", fr: "Mardi", ar: "الثلاثاء", dar: "الثلاثاء" },
  "weekly.wednesday": { en: "Wednesday", fr: "Mercredi", ar: "الأربعاء", dar: "الأربعاء" },
  "weekly.thursday": { en: "Thursday", fr: "Jeudi", ar: "الخميس", dar: "الخميس" },
  "weekly.friday": { en: "Friday", fr: "Vendredi", ar: "الجمعة", dar: "الجمعة" },
  "weekly.saturday": { en: "Saturday", fr: "Samedi", ar: "السبت", dar: "السبت" },
  "weekly.sunday": { en: "Sunday", fr: "Dimanche", ar: "الأحد", dar: "الأحد" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
  getFoodName: (food: FoodItem) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('dar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mizen_lang') as Language;
    if (saved && ['en', 'fr', 'ar', 'dar'].includes(saved)) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') setLanguage('fr');
      else if (browserLang === 'ar') setLanguage('dar');
      else if (browserLang === 'en') setLanguage('en');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('mizen_lang', language);
    const isRtl = language === 'ar' || language === 'dar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'dar' ? 'ar-DZ' : language;
  }, [language]);

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]['en'];
  };
  
  const getFoodName = (food: FoodItem) => {
    if (!food) return '';
    switch (language) {
      case 'ar': return food.name_ar;
      case 'fr': return food.name_fr;
      case 'en': return food.name_en;
      case 'dar':
      default: return food.name_darija;
    }
  };

  const isRtl = language === 'ar' || language === 'dar';

  if (!mounted) {
    return null; // Prevents hydration flash
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, getFoodName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}


