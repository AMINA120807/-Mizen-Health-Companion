"use client";

import { useState, useEffect } from 'react';
import { getHistoryAverages, clearHistory } from '../utils/history';
import { useTranslation } from '../contexts/LanguageContext';
import ConfirmModal from './ConfirmModal';

export default function HistoryTab() {
  const { t, isRtl } = useTranslation();
  const [historyStats, setHistoryStats] = useState({ avgCalories: 0, avgGL: 0, daysLogged: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setHistoryStats(getHistoryAverages());
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistoryStats({ avgCalories: 0, avgGL: 0, daysLogged: 0 });
    setIsModalOpen(false);
  };

  if (historyStats.daysLogged === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p className="text-gray-500 font-medium text-center">{t('history.noData')}</p>
      </div>
    );
  }

  return (
    <div className="w-full glass rounded-2xl p-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600"></div>
      
      <h2 className="font-heading text-2xl font-bold text-gray-800 mb-8 text-center">{t('history.title')}</h2>
      
      <div className="grid grid-cols-2 gap-4 text-center mb-8">
        <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm hover-lift">
          <p className="text-gray-500 text-sm font-medium mb-2">{t('history.avgDailyCalories')}</p>
          <p className="font-heading font-bold text-3xl text-gray-900">{historyStats.avgCalories.toFixed(0)}</p>
        </div>
        <div className="bg-white/60 p-6 rounded-xl border border-gray-100 shadow-sm hover-lift">
          <p className="text-gray-500 text-sm font-medium mb-2">{t('history.avgDailyGL')}</p>
          <p className="font-heading font-bold text-3xl text-accent">{historyStats.avgGL.toFixed(1)}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 text-center mb-8 bg-gray-50 py-2 rounded-lg">
        {t('history.basedOn')} <span className="font-bold text-gray-700">{historyStats.daysLogged}</span> {t('history.daysOfData')}
      </p>
      
      <div className="text-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-destructive font-semibold px-6 py-3 hover:bg-destructive/10 rounded-xl transition-colors border border-destructive/20"
        >
          {t('history.clear')}
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title={t('history.title')}
        message={t('history.confirmClear')}
        onConfirm={handleClearHistory}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
