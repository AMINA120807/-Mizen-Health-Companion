"use client";

import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export default function AIChef() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  const mockRecipes = [
    {
      title: "Tajine Zitoun Allégé",
      desc: "Un tajine riche en protéines et pauvre en matières grasses.",
      calories: 320,
      time: "45 min",
      ingredients: ["Poulet", "Olives vertes", "Carottes", "Oignon", "Curcuma"]
    },
    {
      title: "Salade Variée Énergétique",
      desc: "Une salade pleine de fibres parfaite pour le déjeuner.",
      calories: 210,
      time: "15 min",
      ingredients: ["Tomates", "Laitue", "Concombre", "Œufs", "Huile d'olive"]
    },
    {
      title: "Chorba Frik Saine",
      desc: "Soupe traditionnelle avec moins de gras, riche en blé concassé.",
      calories: 280,
      time: "60 min",
      ingredients: ["Viande hachée maigre", "Frik", "Céleri", "Tomates", "Coriandre"]
    }
  ];

  const handleGenerate = () => {
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    setRecipe(null);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsGenerating(false);
      // Pick a random recipe for the demo
      const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
      setRecipe(randomRecipe);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading text-emerald-950 dark:text-emerald-50 mb-2">🧑‍🍳 {t('chef.title')}</h2>
        <p className="text-emerald-700/80 dark:text-emerald-200/60">{t('chef.subtitle')}</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-emerald-900/30 flex flex-col items-center relative overflow-hidden">
        {/* Magic Background Gradient */}
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

      {/* Result */}
      {recipe && (
        <div className="glass p-8 rounded-3xl border border-emerald-500/30 animate-in slide-in-from-bottom-4 relative overflow-hidden bg-white/60 dark:bg-emerald-950/60">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
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
          
          <h4 className="font-bold text-gray-800 dark:text-emerald-100 mb-2">Ingrédients :</h4>
          <ul className="list-disc pl-5 text-gray-700 dark:text-emerald-200/80 space-y-1">
            {recipe.ingredients.map((ing: string, i: number) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
