"use client";

import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export default function BarcodeScanner() {
  const { t } = useTranslation();
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Mock product database for Algerian products
  const mockDatabase: Record<string, any> = {
    "12345": { name: "Jus d'Orange N'gaous", score: "C", calories: 45, sugar: 10, warning: "High Sugar" },
    "54321": { name: "Yaourt Nature Soummam", score: "A", calories: 55, sugar: 4, warning: null },
    "99999": { name: "Gaufrettes BIMO", score: "E", calories: 480, sugar: 35, warning: "Very High Sugar & Fat" }
  };

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsScanning(false);
      const product = mockDatabase[barcode] || { 
        name: "Produit Inconnu / Unknown", 
        score: "?", 
        calories: 0, 
        sugar: 0, 
        warning: "Not in database" 
      };
      setResult(product);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading text-emerald-950 dark:text-emerald-50 mb-2">📸 {t('scanner.title')}</h2>
        <p className="text-emerald-700/80 dark:text-emerald-200/60">{t('scanner.subtitle')}</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-emerald-900/30 flex flex-col items-center">
        {/* Mock Camera View */}
        <div className="w-full h-48 bg-black/80 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border-2 border-dashed border-emerald-500/50">
          {isScanning ? (
            <div className="w-full h-1 bg-red-500 absolute animate-[scan_2s_ease-in-out_infinite]" />
          ) : (
            <div className="text-white/30 text-sm">Camera Preview</div>
          )}
          {/* Target Box */}
          <div className="w-3/4 h-24 border border-white/20 rounded-xl absolute z-10"></div>
        </div>

        <div className="w-full flex gap-2">
          <input 
            type="text" 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder={t('scanner.barcode')}
            className="flex-1 bg-white/50 dark:bg-black/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
          />
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">Try: 12345, 54321, 99999</p>

        <button 
          onClick={handleScan}
          disabled={!barcode || isScanning}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-emerald-900/20"
        >
          {isScanning ? "..." : t('scanner.scanBtn')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="glass p-6 rounded-3xl border border-emerald-900/30 animate-in slide-in-from-bottom-4">
          <h3 className="font-bold text-xl text-gray-900 dark:text-emerald-50 mb-4">{result.name}</h3>
          
          <div className="flex items-center gap-6 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white ${
              result.score === 'A' || result.score === 'B' ? 'bg-green-500' :
              result.score === 'C' ? 'bg-yellow-500' :
              result.score === 'E' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              {result.score}
            </div>
            <div>
              <p className="text-gray-600 dark:text-emerald-200/80">Calories: <span className="font-bold">{result.calories} kcal/100g</span></p>
              <p className="text-gray-600 dark:text-emerald-200/80">Sugar: <span className="font-bold">{result.sugar}g/100g</span></p>
            </div>
          </div>
          
          {result.warning && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-xl text-sm font-bold">
              ⚠️ {result.warning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
