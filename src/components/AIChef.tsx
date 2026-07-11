"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { mockFoods } from '../data/mockData';

interface Recipe {
  id?: string;
  title: string;
  desc: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time: string;
  ingredients: string[];
  instructions: string[];
  coreIngredients?: string[];
}

export default function AIChef() {
  const { t, language } = useTranslation();
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);

  // Helper pour nettoyer les mots (minuscules, sans accents)
  const normalize = (str: string) => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };

  const handleGenerate = () => {
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    setRecipe(null);
    setTypingIndex(0);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsGenerating(false);
      
      const userIngredientsList = ingredients
        .split(/[\n,;]+/)
        .map(i => i.trim())
        .filter(i => i.length > 0);
        
      if (userIngredientsList.length === 0) userIngredientsList.push("Ingrédient mystère");

      // Chercher chaque ingrédient dans mockFoods pour extraire les macros et catégoriser
      let totalCals = 0;
      let totalProt = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      
      const preciseIngredients: string[] = [];
      const meats: string[] = [];
      const veggies: string[] = [];
      const carbs: string[] = [];
      const others: string[] = [];

      const isAr = language === 'ar' || language === 'dar';
      const isEn = language === 'en';

      userIngredientsList.forEach(ing => {
        const normIng = normalize(ing);
        // Trouver l'aliment qui matche le mieux
        const matchedFood = mockFoods.find(food => 
          normalize(food.name_fr).includes(normIng) || 
          normalize(food.name_ar).includes(normIng) ||
          normalize(food.name_en || "").includes(normIng) ||
          normalize(food.name_darija || "").includes(normIng)
        );

        const ingName = ing.charAt(0).toUpperCase() + ing.slice(1);

        if (matchedFood) {
          totalCals += matchedFood.calories_per_100g;
          totalProt += matchedFood.protein_g;
          totalCarbs += matchedFood.carbs_g;
          totalFat += matchedFood.fat_g;
          
          // Formater précisément
          const portionText = matchedFood.typical_portion_label ? `${matchedFood.typical_portion_label} (${matchedFood.typical_portion_grams}g)` : `100g`;
          
          if (isEn) preciseIngredients.push(`${portionText} of ${ingName}`);
          else if (isAr) preciseIngredients.push(`${portionText} من ${ingName}`);
          else preciseIngredients.push(`${portionText} de ${ingName}`);

          // Catégoriser pour la recette
          const cat = matchedFood.category;
          if (cat === "Viandes & Poissons" || cat === "Protéines") meats.push(ingName);
          else if (cat === "Légumes" || cat.includes("Salade")) veggies.push(ingName);
          else if (cat === "Plats Principaux" || normIng.includes("riz") || normIng.includes("pate") || normIng.includes("pain")) carbs.push(ingName);
          else others.push(ingName);

        } else {
          if (isEn) preciseIngredients.push(`Quantity of your choice of ${ingName}`);
          else if (isAr) preciseIngredients.push(`الكمية التي تختارها من ${ingName}`);
          else preciseIngredients.push(`Quantité au choix de ${ingName}`);
          
          // Guessing pour les ingrédients non trouvés
          if (normIng.includes("poulet") || normIng.includes("viande") || normIng.includes("oeuf") || normIng.includes("chicken") || normIng.includes("meat")) meats.push(ingName);
          else if (normIng.includes("tomate") || normIng.includes("oignon") || normIng.includes("tomato") || normIng.includes("onion")) veggies.push(ingName);
          else if (normIng.includes("riz") || normIng.includes("pate") || normIng.includes("rice") || normIng.includes("pasta")) carbs.push(ingName);
          else others.push(ingName);
        }
      });

      const matchedIngredientsCount = preciseIngredients.filter(p => !p.startsWith("Quantité")).length;

      // Si on n'a rien trouvé du tout, on donne des valeurs génériques
      if (matchedIngredientsCount === 0) {
        totalCals = Math.floor(Math.random() * 250) + 100;
        totalProt = Math.floor(Math.random() * 15) + 5;
        totalCarbs = Math.floor(Math.random() * 20) + 10;
        totalFat = Math.floor(Math.random() * 10) + 2;
      } else {
        // Ajuster pour faire une portion réaliste (~250g total)
        const factor = 2.5 / (matchedIngredientsCount || 1); 
        totalCals = Math.round(totalCals * factor);
        totalProt = Math.round(totalProt * factor);
        totalCarbs = Math.round(totalCarbs * factor);
        totalFat = Math.round(totalFat * factor);
      }

      const mainIngredient = userIngredientsList[0];
      const secondIngredient = userIngredientsList.length > 1 ? userIngredientsList[1] : "";
      
      const isAr = language === 'ar' || language === 'dar';
      const isEn = language === 'en';
      
      let method = "Poêlée";
      if (meats.length > 0 && carbs.length === 0) method = isEn ? "High-Protein Stir-fry" : isAr ? "طبق مقلي غني بالبروتين" : "Sauté hyperprotéiné";
      else if (veggies.length > 0 && meats.length === 0) method = isEn ? "Vegetarian Dish" : isAr ? "طبق نباتي" : "Plat végétarien";
      else if (carbs.length > 0) method = isEn ? "Healthy Bowl" : isAr ? "وعاء صحي" : "Bowl santé";
      else method = isEn ? "Quick Skillet" : isAr ? "مقلات سريعة" : "Poêlée express";
      
      const dynamicTitle = secondIngredient 
        ? `${method} : ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} & ${secondIngredient}`
        : `${method} : ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)}`;

      const finalIngredients = [...preciseIngredients];

      // Génération dynamique des instructions traduites
      const smartInstructions: string[] = [];
      
      if (veggies.length > 0) {
        if (isEn) smartInstructions.push(`Wash, peel and chop your vegetables (${veggies.join(", ")}).`);
        else if (isAr) smartInstructions.push(`اغسل وقشر وقطع الخضار (${veggies.join(", ")}).`);
        else smartInstructions.push(`Lavez, épluchez et coupez vos légumes (${veggies.join(", ")}).`);
      }
      
      if (isEn) smartInstructions.push(`Heat a pan or pot with a light drizzle of olive oil.`);
      else if (isAr) smartInstructions.push(`سخن مقلاة أو قدر مع القليل من زيت الزيتون.`);
      else smartInstructions.push(`Faites chauffer une poêle ou une marmite avec un léger filet d'huile d'olive.`);
      
      if (meats.length > 0) {
        if (isEn) smartInstructions.push(`Start by browning your proteins (${meats.join(", ")}) on each side.`);
        else if (isAr) smartInstructions.push(`ابدأ بتحمير البروتينات (${meats.join(", ")}) من كل جانب.`);
        else smartInstructions.push(`Commencez par faire revenir vos protéines (${meats.join(", ")}) pour bien les dorer de chaque côté.`);
      }
      
      if (veggies.length > 0) {
        const addedToEn = meats.length > 0 ? "Then add the vegetables" : "Sauté the vegetables";
        const addedToAr = meats.length > 0 ? "ثم أضف الخضار" : "اقلي الخضار";
        const addedToFr = meats.length > 0 ? "Ajoutez ensuite les légumes" : "Faites revenir les légumes";
        
        if (isEn) smartInstructions.push(`${addedToEn} and cook on medium heat until tender.`);
        else if (isAr) smartInstructions.push(`${addedToAr} واطبخها على نار متوسطة حتى تصبح طرية.`);
        else smartInstructions.push(`${addedToFr} et laissez cuire à feu moyen jusqu'à ce qu'ils soient tendres.`);
      }
      
      if (carbs.length > 0) {
        if (isEn) smartInstructions.push(`Meanwhile, cook ${carbs.join(", ")} in boiling water if needed, then mix it in.`);
        else if (isAr) smartInstructions.push(`في هذه الأثناء، اطبخ ${carbs.join(", ")} في ماء مغلي إذا لزم الأمر، ثم امزجها مع الباقي.`);
        else smartInstructions.push(`Pendant ce temps, faites cuire ${carbs.join(", ")} (si nécessaire) dans l'eau bouillante, puis incorporez.`);
      }
      
      if (others.length > 0) {
        if (isEn) smartInstructions.push(`Add the rest of your ingredients: ${others.join(", ")}.`);
        else if (isAr) smartInstructions.push(`أضف باقي المكونات: ${others.join(", ")}.`);
        else smartInstructions.push(`Ajoutez le reste de vos ingrédients : ${others.join(", ")}.`);
      }
      
      if (isEn) smartInstructions.push(`Season to taste with salt, pepper, and spices, and let it simmer for a few minutes.`);
      else if (isAr) smartInstructions.push(`تبل بالملح والفلفل والبهارات حسب الذوق، واتركه يغلي لبضع دقائق.`);
      else smartInstructions.push(`Assaisonnez à votre goût avec du sel, du poivre et vos épices préférées, puis laissez mijoter.`);

      if (isEn) smartInstructions.push(`Serve hot. This custom meal gives you around ${totalProt}g of protein!`);
      else if (isAr) smartInstructions.push(`قدمه ساخناً. هذه الوجبة المخصصة تمنحك حوالي ${totalProt} غرام من البروتين!`);
      else smartInstructions.push(`Servez bien chaud. Ce repas sur-mesure vous apportera environ ${totalProt}g de protéines !`);

      const descEn = "A 100% custom recipe using ONLY the ingredients you listed!";
      const descAr = "وصفة مخصصة 100٪ باستخدام المكونات التي ذكرتها فقط!";
      const descFr = "Une recette 100% sur-mesure utilisant UNIQUEMENT les ingrédients que vous avez listés !";

      const generatedFallbackRecipe: Recipe = {
        title: dynamicTitle,
        desc: isEn ? descEn : isAr ? descAr : descFr,
        calories: totalCals,
        protein: totalProt,
        carbs: totalCarbs,
        fat: totalFat,
        time: `${Math.floor(Math.random() * 15) + 10} min`,
        ingredients: finalIngredients,
        instructions: smartInstructions
      };
      
      setRecipe(generatedFallbackRecipe);
    }, 1800);
  };

  // Effet machine à écrire pour les instructions
  useEffect(() => {
    if (recipe && typingIndex < recipe.instructions.length) {
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
      }, 800); // 800ms par étape pour donner l'illusion que l'IA écrit
      return () => clearTimeout(timer);
    }
  }, [recipe, typingIndex]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading text-emerald-950 dark:text-emerald-50 mb-2">🧑‍🍳 {t('chef.title')}</h2>
        <p className="text-emerald-700/80 dark:text-emerald-200/60">{t('chef.subtitle')}</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-emerald-900/30 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 pointer-events-none"></div>
        
        <textarea 
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={t('chef.ingredients')}
          rows={3}
          className="w-full relative z-10 bg-white/50 dark:bg-black/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4 resize-none"
        />

        <button 
          onClick={handleGenerate}
          disabled={!ingredients || isGenerating}
          className="w-full relative z-10 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 transform hover:scale-[1.02]"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('chef.generating')}
            </span>
          ) : (
            `✨ ${t('chef.generateBtn')}`
          )}
        </button>
      </div>

      {recipe && (
        <div className="glass p-8 rounded-3xl border border-emerald-500/30 animate-in slide-in-from-bottom-4 relative overflow-hidden bg-white/60 dark:bg-emerald-950/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Colonne Gauche : Titre et Ingrédients */}
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-emerald-900 dark:text-emerald-50 mb-2">{recipe.title}</h3>
              <p className="text-gray-600 dark:text-emerald-200/80 mb-6 italic">{recipe.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-lg font-bold text-sm">
                  🔥 {recipe.calories} kcal
                </span>
                <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-lg font-bold text-sm">
                  ⏱️ {recipe.time}
                </span>
                {recipe.protein && (
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg font-bold text-sm">
                    🥩 Prot: {recipe.protein}g
                  </span>
                )}
                {recipe.carbs && (
                  <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-lg font-bold text-sm">
                    🍞 Glu: {recipe.carbs}g
                  </span>
                )}
                {recipe.fat && (
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 px-3 py-1 rounded-lg font-bold text-sm">
                    🥑 Lip: {recipe.fat}g
                  </span>
                )}
              </div>
              
              <h4 className="font-bold text-gray-800 dark:text-emerald-100 mb-3 text-lg border-b border-emerald-200 dark:border-emerald-800 pb-2">
                🛒 {language === 'en' ? 'Ingredients' : language === 'ar' || language === 'dar' ? 'المكونات' : 'Ingrédients'}
              </h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-emerald-100/90">
                    <span className="text-emerald-500 mt-1">•</span> {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne Droite : Préparation */}
            <div className="flex-1 bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
              <h4 className="font-bold text-gray-800 dark:text-emerald-100 mb-4 text-lg flex items-center gap-2">
                👨‍🍳 {language === 'en' ? 'Preparation' : language === 'ar' || language === 'dar' ? 'طريقة التحضير' : 'Préparation'}
                {typingIndex < recipe.instructions.length && (
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                )}
              </h4>
              <ol className="space-y-4">
                {recipe.instructions.slice(0, typingIndex + 1).map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-emerald-100/90 animate-in fade-in slide-in-from-left-2 duration-500">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="leading-tight">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
