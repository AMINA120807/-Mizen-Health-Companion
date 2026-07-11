"use client";

import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface Recipe {
  id?: string;
  title: string;
  desc: string;
  calories: number;
  time: string;
  ingredients: string[];
  instructions: string[];
  coreIngredients?: string[];
}

export default function AIChef() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsGenerating(false);
      
      // 1. Extraire les mots-clés de l'utilisateur
      const userWords = ingredients
        .split(/[\s,;]+/)
        .map(normalize)
        .filter(word => word.length > 2); // ignorer 'et', 'de', 'le'...

      // 2. Calculer le score de chaque recette
      let bestRecipe: Recipe | null = null;
      let highestScore = 0;

      for (const recipe of recipeDatabase) {
        let score = 0;
        if (recipe.coreIngredients) {
          for (const coreIng of recipe.coreIngredients) {
            const normalizedCore = normalize(coreIng);
            // Si un des mots de l'utilisateur correspond ou contient l'ingrédient clé
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

      // 3. Si une recette a matché, on l'utilise
      if (bestRecipe && highestScore > 0) {
        setRecipe(bestRecipe);
        return;
      }
      
      // 4. Sinon (Fallback) : Générer une recette dynamique sur mesure avec JUSTE les ingrédients de l'utilisateur
      const userIngredientsList = ingredients
        .split(/[,;]/)
        .map(i => i.trim())
        .filter(i => i.length > 0);
        
      if (userIngredientsList.length === 0) userIngredientsList.push("Ingrédient mystère");

      // On n'ajoute PLUS d'ingrédients aléatoires ("randomStaples") comme l'oignon ou l'ail par défaut.
      // Le Chef se concentre UNIQUEMENT sur ce que l'utilisateur a donné.
      const finalIngredients = [...userIngredientsList];
      
      const mainIngredient = userIngredientsList[0];
      const secondIngredient = userIngredientsList.length > 1 ? userIngredientsList[1] : "";
      const cookingMethods = ["Poêlée minute", "Salade express", "Gratin simple", "Papillote légère", "Mijoté maison", "Bowl santé"];
      const method = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
      
      const dynamicTitle = secondIngredient 
        ? `${method} de ${mainIngredient} et ${secondIngredient}`
        : `${method} à base de ${mainIngredient}`;

      const generatedFallbackRecipe: Recipe = {
        title: dynamicTitle,
        desc: "Une recette 100% sur-mesure utilisant UNIQUEMENT les ingrédients que vous avez listés (assaisonnement libre) !",
        calories: Math.floor(Math.random() * 250) + 100, 
        time: `${Math.floor(Math.random() * 15) + 5} min`,
        ingredients: finalIngredients,
        instructions: [
          `Préparez vos ingrédients : lavez et découpez ${userIngredientsList.join(", ")}.`,
          `Choisissez votre mode de cuisson préféré (poêle, four ou vapeur).`,
          `Si vous le souhaitez, vous pouvez ajouter une petite pincée de sel, de poivre et un filet d'huile d'olive (optionnel).`,
          `Commencez par cuire ${mainIngredient} en premier car c'est votre ingrédient principal.`,
          secondIngredient ? `Incorporez ensuite ${secondIngredient} et le reste de vos ingrédients.` : `Laissez cuire doucement jusqu'à ce que ce soit tendre.`,
          `Servez bien chaud et savourez cette recette personnalisée !`
        ]
      };
      
      setRecipe(generatedFallbackRecipe);
    }, 1800);
  };

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
              
              <div className="flex gap-4 mb-6">
                <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-lg font-bold text-sm">
                  🔥 {recipe.calories} kcal
                </span>
                <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-lg font-bold text-sm">
                  ⏱️ {recipe.time}
                </span>
              </div>
              
              <h4 className="font-bold text-gray-800 dark:text-emerald-100 mb-3 text-lg border-b border-emerald-200 dark:border-emerald-800 pb-2">🛒 Ingrédients</h4>
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
              <h4 className="font-bold text-gray-800 dark:text-emerald-100 mb-4 text-lg">👨‍🍳 Préparation</h4>
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-emerald-100/90">
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
