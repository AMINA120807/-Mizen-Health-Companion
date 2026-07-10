"use client";

import { useTranslation, Language } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 text-gray-500 dark:text-emerald-200/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
      </svg>
      <select 
        value={language}
        onChange={handleLanguageChange}
        className="bg-transparent text-sm text-gray-600 dark:text-emerald-200/60 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md py-1 cursor-pointer"
        dir="ltr"
      >
        <option value="dar">الدارجة</option>
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}


