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
  "nav.hub": { en: "Health Hub", fr: "Espace Santé", ar: "مركز الصحة", dar: "ركن الصحة" },
  "nav.community": { en: "Community", fr: "Communauté", ar: "المجتمع", dar: "المجتمع" },
  "nav.scanner": { en: "Scanner", fr: "Scanner", ar: "ماسح", dar: "سكانير" },
  "nav.chef": { en: "AI Chef", fr: "Chef IA", ar: "شيف ذكي", dar: "الشاف الذكي" },
  "nav.installApp": { en: "Install App", fr: "Installer l'Application", ar: "تثبيت التطبيق", dar: "تثبيت التطبيق" },

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

  // Spiritual Tracker
  "ramadan.spiritualGoals": { en: "Spiritual Goals", fr: "Objectifs Spirituels", ar: "أهداف روحية", dar: "أهداف روحية" },
  "ramadan.spiritualSubtitle": { en: "Track your daily acts of worship", fr: "Suivez vos actes d'adoration quotidiens", ar: "تتبع أعمالك الصالحة اليومية", dar: "تتبع صلواتك وأذكارك" },
  "ramadan.prayers": { en: "Daily Prayers", fr: "Prières Quotidiennes", ar: "الصلوات الخمس", dar: "الصلوات الخمسة" },
  "ramadan.taraweeh": { en: "Taraweeh", fr: "Tarawih", ar: "التراويح", dar: "التراويح" },
  "ramadan.adhkar": { en: "Adhkar", fr: "Adhkar", ar: "الأذكار", dar: "الأذكار" },
  "ramadan.morning": { en: "Morning", fr: "Matin", ar: "الصباح", dar: "الصباح" },
  "ramadan.evening": { en: "Evening", fr: "Soir", ar: "المساء", dar: "المساء" },
  "ramadan.quranReading": { en: "Quran Reading", fr: "Lecture du Coran", ar: "تلاوة القرآن", dar: "قراءة القرآن" },
  "ramadan.pagesReadToday": { en: "Pages read today", fr: "Pages lues aujourd'hui", ar: "الصفحات المقروءة اليوم", dar: "الصفحات اللي قريتهم اليوم" },
  "prayer.fajr": { en: "Fajr", fr: "Fajr", ar: "الفجر", dar: "الفجر" },
  "prayer.dhuhr": { en: "Dhuhr", fr: "Dhohr", ar: "الظهر", dar: "الظهر" },
  "prayer.asr": { en: "Asr", fr: "Asr", ar: "العصر", dar: "العصر" },
  "prayer.maghrib": { en: "Maghrib", fr: "Maghreb", ar: "المغرب", dar: "المغرب" },
  "prayer.isha": { en: "Isha", fr: "Icha", ar: "العشاء", dar: "العشاء" },
  
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
  "weekly.sunday": { en: "Sunday", fr: "Dimanche", ar: "الأحد", dar: "الأحد" },
  
  // Install Modal
  "install.title": { en: "Install Mizen", fr: "Installer Mizen", ar: "تثبيت ميزان", dar: "تثبيت ميزان" },
  "install.desc": { en: "Add Mizen to your home screen to use it like a real app, even offline!", fr: "Ajoutez Mizen à votre écran d'accueil pour l'utiliser comme une vraie application, même hors-ligne !", ar: "أضف ميزان إلى شاشتك الرئيسية لاستخدامه كتطبيق حقيقي، حتى بدون إنترنت!", dar: "زيد ميزان في شاشتك الرئيسية باش تستعملو كتطبيق حقيقي، حتى بلا إنترنت!" },
  "install.iosStep1": { en: "Tap the share button below", fr: "Appuyez sur le bouton de partage en bas", ar: "اضغط على زر المشاركة أدناه", dar: "اضغط على زر المشاركة لتحت" },
  "install.iosStep2": { en: "Scroll down and select", fr: "Faites défiler et sélectionnez", ar: "قم بالتمرير للأسفل وحدد", dar: "اهبط لتحت وخير" },
  "install.iosStep2Bold": { en: "\"Add to Home Screen\"", fr: "\"Sur l'écran d'accueil\"", ar: "\"إضافة إلى الشاشة الرئيسية\"", dar: "\"إضافة إلى الشاشة الرئيسية\"" },
  "install.iosStep3": { en: "Tap", fr: "Appuyez sur", ar: "اضغط على", dar: "اضغط على" },
  "install.iosStep3Bold": { en: "\"Add\"", fr: "\"Ajouter\"", ar: "\"إضافة\"", dar: "\"إضافة\"" },
  "install.iosStep3End": { en: "in the top right", fr: "en haut à droite", ar: "في أعلى اليمين", dar: "الفوق على اليمين" },
  "install.androidStep1": { en: "Tap the menu (3 dots) in the top right", fr: "Appuyez sur le menu (les 3 points) en haut à droite", ar: "اضغط على القائمة (3 نقاط) في أعلى اليمين", dar: "اضغط على القائمة (3 نقاط) الفوق على اليمين" },
  "install.androidStep2": { en: "Select", fr: "Sélectionnez", ar: "حدد", dar: "خير" },
  "install.androidStep2Bold1": { en: "\"Add to Home screen\"", fr: "\"Ajouter à l'écran d'accueil\"", ar: "\"إضافة إلى الشاشة الرئيسية\"", dar: "\"إضافة إلى الشاشة الرئيسية\"" },
  "install.androidStep2Or": { en: "or", fr: "ou", ar: "أو", dar: "ولا" },
  "install.androidStep2Bold2": { en: "\"Install app\"", fr: "\"Installer l'application\"", ar: "\"تثبيت التطبيق\"", dar: "\"تثبيت التطبيق\"" },
  "install.androidStep3": { en: "Confirm by tapping", fr: "Confirmez en appuyant sur", ar: "قم بالتأكيد بالضغط على", dar: "أكد بالضغط على" },
  "install.androidStep3Bold1": { en: "\"Add\"", fr: "\"Ajouter\"", ar: "\"إضافة\"", dar: "\"إضافة\"" },
  "install.androidStep3Bold2": { en: "\"Install\"", fr: "\"Installer\"", ar: "\"تثبيت\"", dar: "\"تثبيت\"" },
  "install.gotIt": { en: "Got it!", fr: "J'ai compris !", ar: "فهمت!", dar: "فهمت!" },

  // Health Hub (Phase 1)
  "hub.title": { en: "Health Hub", fr: "Espace Santé", ar: "مركز الصحة", dar: "ركن الصحة" },
  "hub.waterTitle": { en: "Hydration", fr: "Hydratation", ar: "الترطيب", dar: "شريب الما" },
  "hub.waterDesc": { en: "Goal: 2L per day", fr: "Objectif : 2L par jour", ar: "الهدف: 2 لتر يوميا", dar: "الهدف: 2 لتر فاليوم" },
  "hub.sleepTitle": { en: "Sleep Tracker", fr: "Sommeil", ar: "تتبع النوم", dar: "الرقاد" },
  "hub.sleepDesc": { en: "How many hours did you sleep?", fr: "Combien d'heures avez-vous dormi ?", ar: "كم ساعة نمت؟", dar: "شحال رقدت من ساعة؟" },
  "hub.sleepLog": { en: "Log Sleep", fr: "Enregistrer", ar: "سجل النوم", dar: "سجل الرقاد" },
  "hub.challengesTitle": { en: "Weekly Challenges", fr: "Défis Santé", ar: "تحديات الأسبوع", dar: "تحديات السمانة" },
  "hub.mizenPoints": { en: "Mizen Points", fr: "Points Mizen", ar: "نقاط ميزان", dar: "نقاط ميزان" },
  "challenge.veggies": { en: "Eat 5 portions of vegetables today", fr: "Mangez 5 portions de légumes", ar: "تناول 5 حصص من الخضار اليوم", dar: "كول 5 حبات خضرة اليوم" },
  "challenge.nosugar": { en: "No white sugar for 24h", fr: "Zéro sucre blanc pendant 24h", ar: "بدون سكر أبيض لمدة 24 ساعة", dar: "زيرو سكر أبيض لـ 24 ساعة" },
  "challenge.steps": { en: "Walk 10,000 steps", fr: "Marchez 10 000 pas", ar: "امش 10,000 خطوة", dar: "امشي 10,000 خطوة" },
  "hub.complete": { en: "Complete", fr: "Terminer", ar: "إكمال", dar: "كمل" },
  "hub.completed": { en: "Completed!", fr: "Terminé !", ar: "مكتمل!", dar: "كملتها!" },

  // Shopping List (Phase 2)
  "shopping.generate": { en: "Shopping List", fr: "Liste de Courses", ar: "قائمة التسوق", dar: "قائمة القضيان" },
  "shopping.title": { en: "Your Weekly Groceries", fr: "Vos Courses Hebdomadaires", ar: "مشترياتك الأسبوعية", dar: "قضيانك تاع السمانة" },
  "shopping.empty": { en: "Add meals to your week to generate a list.", fr: "Ajoutez des repas à votre semaine pour générer une liste.", ar: "أضف وجبات إلى أسبوعك لإنشاء قائمة.", dar: "زيد ماكلة للسمانة باش نوجدو القائمة." },
  
  // Community Feed (Phase 2)
  "nav.community": { en: "Community", fr: "Communauté", ar: "المجتمع", dar: "المجتمع" },
  "community.title": { en: "Mizen Community", fr: "Communauté Mizen", ar: "مجتمع ميزان", dar: "مجتمع ميزان" },
  "community.subtitle": { en: "Share and discover healthy meals", fr: "Partagez et découvrez des repas sains", ar: "شارك واكتشف وجبات صحية", dar: "شارك واكتشف ماكلة صحية" },
  "community.shareBtn": { en: "Share My Meal", fr: "Partager Mon Repas", ar: "شارك وجبتي", dar: "شارك وجبتي" },
  "community.likes": { en: "Likes", fr: "J'aime", ar: "إعجابات", dar: "جامات" },

  // Scanner & AI Chef (Phase 3)
  "nav.scanner": { en: "Barcode Scanner", fr: "Scanner Code-barres", ar: "ماسح الباركود", dar: "سكانير" },
  "nav.chef": { en: "AI Chef", fr: "Chef IA", ar: "الشيف الذكي", dar: "الشاف الذكي" },
  "scanner.title": { en: "Product Scanner", fr: "Scanner de Produits", ar: "ماسح المنتجات", dar: "سكانير المنتجات" },
  "scanner.subtitle": { en: "Scan a product to check its nutritional value", fr: "Scannez un produit pour voir sa valeur nutritionnelle", ar: "امسح منتج للتحقق من قيمته الغذائية", dar: "سكاني منتج باش تشوف واش فيه" },
  "scanner.scanBtn": { en: "Simulate Scan", fr: "Simuler un Scan", ar: "محاكاة المسح", dar: "سيي تسكاني" },
  "scanner.barcode": { en: "Enter Barcode (e.g. 12345)", fr: "Entrez le Code-barres (ex. 12345)", ar: "أدخل الباركود (مثل 12345)", dar: "اكتب الكود (مثلا 12345)" },
  "chef.title": { en: "Mizen AI Chef", fr: "Chef IA Mizen", ar: "شيف ميزان الذكي", dar: "شاف ميزان" },
  "chef.subtitle": { en: "What's in your fridge? Let's make a healthy meal!", fr: "Qu'avez-vous dans le frigo ? Faisons un repas sain !", ar: "ماذا يوجد في ثلاجتك؟ لنجعل وجبة صحية!", dar: "واش كاين في فريجيدارك؟ نديرو ماكلة صحية!" },
  "chef.ingredients": { en: "Enter ingredients (e.g. Chicken, Olives...)", fr: "Entrez vos ingrédients (ex. Poulet, Olives...)", ar: "أدخل المكونات (مثل الدجاج، الزيتون...)", dar: "اكتب واش عندك (دجاج، زيتون...)" },
  "chef.generateBtn": { en: "Generate Recipe", fr: "Générer une Recette", ar: "توليد وصفة", dar: "اعطيني وصفة" },
  "chef.generating": { en: "Chef is thinking...", fr: "Le Chef réfléchit...", ar: "الشيف يفكر...", dar: "الشاف راه يخمم..." }
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


