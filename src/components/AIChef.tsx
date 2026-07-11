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

  // Base de données interne de vraies recettes algériennes avec leurs ingrédients clés
  const recipeDatabase: Recipe[] = [
    {
      id: "mtewem",
      title: "Mtewem (Viande et Pois Chiches)",
      desc: "Un plat algérois traditionnel très parfumé à l'ail, parfait pour les grandes occasions.",
      calories: 450,
      time: "60 min",
      coreIngredients: ["viande", "hache", "hachee", "pois chiche", "pois chiches", "ail"],
      ingredients: ["Viande hachée", "Morceaux de viande (agneau/boeuf)", "Pois chiches trempés", "Beaucoup d'ail", "Amandes (optionnel)", "Smen (beurre clarifié)", "Cumin, Sel, Poivre"],
      instructions: [
        "Préparer les boulettes de viande hachée avec de l'ail écrasé, du cumin, du sel et du poivre.",
        "Faire revenir les morceaux de viande avec du smen et de l'ail dans une marmite.",
        "Ajouter de l'eau chaude, les pois chiches et laisser mijoter.",
        "À mi-cuisson, plonger les boulettes de viande dans la sauce.",
        "Laisser réduire la sauce jusqu'à ce qu'elle soit onctueuse."
      ]
    },
    {
      id: "tajine_zitoun",
      title: "Tajine Zitoun (Poulet aux Olives)",
      desc: "Un classique indémodable, léger et riche en saveurs, accompagné de carottes fondantes.",
      calories: 320,
      time: "45 min",
      coreIngredients: ["poulet", "olive", "olives", "carotte", "carottes", "champignon", "champignons"],
      ingredients: ["Poulet", "Olives vertes dénoyautées", "Carottes en rondelles", "Oignon râpé", "Huile ou Smen", "Safran ou Curcuma", "Persil"],
      instructions: [
        "Faire bouillir les olives 2 ou 3 fois pour enlever l'amertume et le sel.",
        "Faire dorer le poulet avec l'oignon et le smen/huile.",
        "Ajouter les épices (curcuma, poivre, sel) et un peu d'eau.",
        "Ajouter les carottes coupées en rondelles.",
        "Quand le poulet est presque cuit, ajouter les olives et laisser la sauce épaissir."
      ]
    },
    {
      id: "chakchouka",
      title: "Chakchouka Traditionnelle",
      desc: "Le plat rapide et économique par excellence, plein de bons légumes d'été.",
      calories: 250,
      time: "20 min",
      coreIngredients: ["tomate", "tomates", "poivron", "poivrons", "oeuf", "oeufs", "oignon"],
      ingredients: ["Tomates mûres", "Poivrons (verts ou rouges)", "Oignons", "Oeufs", "Huile d'olive", "Ail", "Sel, Poivre, Paprika"],
      instructions: [
        "Faire revenir les oignons émincés dans l'huile d'olive.",
        "Ajouter les poivrons coupés en petits dés et laisser ramollir.",
        "Ajouter les tomates concassées, l'ail et les épices. Laisser compoter à feu doux.",
        "Quand la sauce est bien réduite, casser les oeufs par-dessus.",
        "Couvrir quelques minutes jusqu'à la cuisson des oeufs."
      ]
    },
    {
      id: "chorba_frik",
      title: "Chorba Frik Authentique",
      desc: "La reine du Ramadan ! Une soupe réconfortante au blé concassé.",
      calories: 280,
      time: "90 min",
      coreIngredients: ["frik", "viande", "mouton", "agneau", "celeri", "coriandre", "tomate"],
      ingredients: ["Viande (Mouton/Agneau)", "Frik (Blé vert concassé)", "Oignon râpé", "Tomates fraîches mixées", "Céleri et Coriandre fraîche", "Pois chiches", "Concentré de tomate"],
      instructions: [
        "Faire revenir la viande avec l'oignon, la coriandre hachée, le céleri et le smen.",
        "Ajouter les tomates mixées, le concentré de tomate et les épices (Ras el Hanout, paprika).",
        "Mouiller avec de l'eau chaude et ajouter les pois chiches. Laisser cuire la viande.",
        "Laver le frik et l'ajouter à la soupe bouillante.",
        "Laisser mijoter à feu très doux en remuant souvent jusqu'à cuisson du frik."
      ]
    },
    {
      id: "loubia",
      title: "Loubia (Ragoût de Haricots Blancs)",
      desc: "Le plat d'hiver adoré des Algériens, riche en fibres et en énergie.",
      calories: 380,
      time: "60 min",
      coreIngredients: ["haricot", "haricots", "loubia", "blanc", "blancs", "viande"],
      ingredients: ["Haricots blancs (trempés la veille)", "Viande ou os (optionnel)", "Ail (beaucoup)", "Oignon", "Tomate concentrée", "Cumin, Paprika"],
      instructions: [
        "Dans une cocotte, faire revenir l'oignon et l'ail écrasé avec la viande.",
        "Ajouter les haricots blancs égouttés, le paprika et le cumin.",
        "Couvrir d'eau et fermer la cocotte. Cuire jusqu'à ce que les haricots soient tendres.",
        "Ajouter la tomate concentrée diluée dans un peu d'eau en fin de cuisson.",
        "Laisser épaissir. Servir chaud avec un filet de vinaigre et de l'huile d'olive."
      ]
    },
    {
      id: "bourek",
      title: "Bourek à la Viande et au Fromage",
      desc: "Croustillant à l'extérieur, fondant à l'intérieur. Incontournable avec la Chorba.",
      calories: 300,
      time: "30 min",
      coreIngredients: ["feuille", "feuilles", "brick", "dioul", "viande", "hachee", "fromage"],
      ingredients: ["Feuilles de Dioul (Brick)", "Viande hachée", "Oignon haché", "Persil frais", "Fromage fondu", "Oeuf", "Huile de friture"],
      instructions: [
        "Faire dorer l'oignon, ajouter la viande hachée, saler et poivrer.",
        "Hors du feu, ajouter le persil haché et mélanger avec un oeuf cru pour lier la farce.",
        "Étaler une feuille de Dioul, déposer un peu de farce et un bon morceau de fromage.",
        "Plier en forme de cigare (ou rectangle) en rabattant les bords.",
        "Frire dans une poêle avec de l'huile chaude jusqu'à dorure. Égoutter sur papier absorbant."
      ]
    },
    {
      id: "pizza_maison",
      title: "Pizza Maison Italienne 🇮🇹",
      desc: "Une délicieuse pizza simple et rapide avec les ingrédients du bord.",
      calories: 280,
      time: "25 min",
      coreIngredients: ["pate", "pizza", "tomate", "fromage", "mozzarella", "champignon", "champignons"],
      ingredients: ["Pâte à pizza", "Sauce tomate", "Fromage râpé ou Mozzarella", "Origan", "Huile d'olive", "Garniture au choix (champignons, poivrons...)"],
      instructions: [
        "Préchauffer le four au maximum (220-250°C).",
        "Étaler la pâte à pizza sur une plaque.",
        "Étaler la sauce tomate en laissant 1cm sur les bords.",
        "Ajouter le fromage, l'origan et votre garniture.",
        "Cuire au four 10 à 15 minutes jusqu'à ce que la croûte soit dorée."
      ]
    },
    {
      id: "pates_carbo",
      title: "Pâtes Carbonara Rapides",
      desc: "Un plat de pâtes crémeux et gourmand en un rien de temps.",
      calories: 450,
      time: "15 min",
      coreIngredients: ["pate", "pates", "spaghetti", "macaroni", "creme", "oeuf", "fromage", "poulet", "dinde"],
      ingredients: ["Pâtes au choix", "Crème fraîche ou oeufs", "Fromage râpé", "Poivre noir", "Poulet fumé ou charcuterie halal"],
      instructions: [
        "Faire bouillir une grande casserole d'eau salée et cuire les pâtes.",
        "Dans une poêle, faire dorer la charcuterie ou le poulet.",
        "Égoutter les pâtes en gardant un peu d'eau de cuisson.",
        "Mélanger les pâtes, la crème (ou oeufs battus), le fromage et beaucoup de poivre hors du feu.",
        "Servir immédiatement bien crémeux."
      ]
    },
    {
      id: "salade_cesar",
      title: "Salade César au Poulet",
      desc: "Une salade fraîche, croquante et riche en protéines.",
      calories: 220,
      time: "10 min",
      coreIngredients: ["salade", "laitue", "poulet", "escalope", "fromage", "pain", "crouton"],
      ingredients: ["Laitue ou Salade verte", "Blanc de poulet grillé", "Croûtons de pain", "Fromage en copeaux", "Sauce César ou Yaourt nature"],
      instructions: [
        "Laver et couper la salade en gros morceaux.",
        "Faire griller le poulet à la poêle et le couper en lamelles.",
        "Faire dorer des morceaux de pain avec de l'ail pour les croûtons.",
        "Mélanger le tout avec la sauce et parsemer de fromage."
      ]
    },
    {
      id: "omelette_legumes",
      title: "Omelette aux Légumes d'été",
      desc: "Un repas protéiné et sain avec les légumes qui vous restent.",
      calories: 180,
      time: "10 min",
      coreIngredients: ["oeuf", "oeufs", "omelette", "legume", "legumes", "tomate", "courgette", "epinard"],
      ingredients: ["Oeufs", "Légumes au choix (tomates, épinards, courgettes...)", "Oignon", "Sel, Poivre", "Huile d'olive"],
      instructions: [
        "Battre les oeufs dans un bol avec du sel et du poivre.",
        "Faire revenir les légumes coupés très fins avec un peu d'oignon dans la poêle.",
        "Verser les oeufs battus sur les légumes cuits.",
        "Laisser cuire à feu doux jusqu'à ce que l'omelette soit prise.",
        "Plier en deux et servir avec du pain complet."
      ]
    }
  ];

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
      
      // 1. Extraire les mots-clés de l'utilisateur
      const userWords = ingredients
        .split(/[\s,;]+/)
        .map(normalize)
        .filter(word => word.length > 2); // ignorer 'et', 'de', 'le'...

      // 2. Calculer le score de chaque recette prédéfinie
      let bestRecipe: Recipe | null = null;
      let highestScore = 0;

      for (const recipe of recipeDatabase) {
        let score = 0;
        if (recipe.coreIngredients) {
          for (const coreIng of recipe.coreIngredients) {
            const normalizedCore = normalize(coreIng);
            if (userWords.some(w => w.includes(normalizedCore) || normalizedCore.includes(w))) {
              score += 1;
            }
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestRecipe = recipe;
        }
      }

      // Si on trouve une recette avec un score parfait, on la renvoie
      // Sinon, on calcule les macros avec mockFoods
      
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

      if (bestRecipe && highestScore > 1) {
        // Ajouter les macros approximatives à la recette de base si elle n'en a pas
        bestRecipe.protein = totalProt > 0 ? totalProt : 15;
        bestRecipe.carbs = totalCarbs > 0 ? totalCarbs : 25;
        bestRecipe.fat = totalFat > 0 ? totalFat : 10;
        setRecipe(bestRecipe);
        return;
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
