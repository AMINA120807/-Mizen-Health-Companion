"use client";

import { useState, useMemo } from 'react';
import { mockDietitians } from '../data/dietitians';
import { useTranslation } from '../contexts/LanguageContext';

export default function DietitianDirectory() {
  const { t, isRtl } = useTranslation();
  const [wilayaFilter, setWilayaFilter] = useState<string>('All');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('All');

  // Extract unique Wilayas and Specialties for filters
  const wilayas = useMemo(() => {
    const list = new Set(mockDietitians.map(d => d.wilaya));
    return ['All', ...Array.from(list)];
  }, []);

  const specialties = useMemo(() => {
    const list = new Set(mockDietitians.flatMap(d => d.specialties));
    return ['All', ...Array.from(list)];
  }, []);

  const filteredDietitians = useMemo(() => {
    return mockDietitians.filter(d => {
      const matchWilaya = wilayaFilter === 'All' || d.wilaya === wilayaFilter;
      const matchSpecialty = specialtyFilter === 'All' || d.specialties.includes(specialtyFilter);
      return matchWilaya && matchSpecialty;
    });
  }, [wilayaFilter, specialtyFilter]);

  return (
    <div className="w-full glass rounded-2xl p-6 transition-all fade-in">
      {/* Disclaimer Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 shadow-sm">
        <svg className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-800 leading-relaxed font-medium">
          {t('dietitians.disclaimer')}
        </p>
      </div>

      <h2 className="font-heading text-2xl font-bold mb-6 text-primary tracking-tight">
        {t('dietitians.title')}
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('dietitians.wilayaFilter')}
          </label>
          <select 
            value={wilayaFilter}
            onChange={(e) => setWilayaFilter(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            {wilayas.map(w => (
              <option key={w} value={w}>{w === 'All' ? t('dietitians.all') : w}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t('dietitians.specialtyFilter')}
          </label>
          <select 
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            {specialties.map(s => (
              <option key={s} value={s}>{s === 'All' ? t('dietitians.all') : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredDietitians.length > 0 ? (
          filteredDietitians.map(dietitian => (
            <div key={dietitian.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover-lift shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100">{dietitian.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{dietitian.title}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200">
                  📍 {dietitian.wilaya}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {dietitian.specialties.map(s => (
                  <span key={s} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                {dietitian.contact.phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">📞</span> {dietitian.contact.phone}
                  </div>
                )}
                {dietitian.contact.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">✉️</span> {dietitian.contact.email}
                  </div>
                )}
                {dietitian.contact.instagram && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">📱</span> {dietitian.contact.instagram}
                  </div>
                )}
                {dietitian.contact.address && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">🏢</span> {dietitian.contact.address}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            {t('dietitians.noResults')}
          </div>
        )}
      </div>
    </div>
  );
}

