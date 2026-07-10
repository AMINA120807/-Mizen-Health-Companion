"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export default function HealthHub() {
  const { t } = useTranslation();
  const [glasses, setGlasses] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [points, setPoints] = useState(0);
  
  const [challenges, setChallenges] = useState({
    veggies: false,
    nosugar: false,
    steps: false
  });

  // Load from local storage
  useEffect(() => {
    const savedGlasses = localStorage.getItem('mizen_water');
    if (savedGlasses) setGlasses(parseInt(savedGlasses));
    
    const savedSleep = localStorage.getItem('mizen_sleep');
    if (savedSleep) setSleepHours(parseInt(savedSleep));
    
    const savedPoints = localStorage.getItem('mizen_points');
    if (savedPoints) setPoints(parseInt(savedPoints));
    
    const savedChallenges = localStorage.getItem('mizen_challenges');
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
  }, []);

  // Save changes
  const updateWater = (val: number) => {
    const newVal = Math.max(0, Math.min(8, val));
    setGlasses(newVal);
    localStorage.setItem('mizen_water', newVal.toString());
  };

  const updateSleep = (val: number) => {
    setSleepHours(val);
    localStorage.setItem('mizen_sleep', val.toString());
  };

  const completeChallenge = (key: keyof typeof challenges) => {
    if (challenges[key]) return;
    const newChallenges = { ...challenges, [key]: true };
    setChallenges(newChallenges);
    localStorage.setItem('mizen_challenges', JSON.stringify(newChallenges));
    
    const newPoints = points + 50;
    setPoints(newPoints);
    localStorage.setItem('mizen_points', newPoints.toString());
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Profile with Points */}
      <div className="glass p-6 rounded-3xl flex items-center justify-between border border-emerald-900/30">
        <div>
          <h2 className="text-2xl font-bold font-heading text-emerald-950 dark:text-emerald-50">{t('hub.title')}</h2>
          <p className="text-emerald-700/80 dark:text-emerald-200/60 text-sm">Votre espace bien-être</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-2xl text-center shadow-lg shadow-emerald-900/20 text-white">
          <div className="text-3xl font-black">{points}</div>
          <div className="text-xs uppercase tracking-wider font-bold opacity-80">{t('hub.mizenPoints')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Tracker */}
        <div className="glass p-6 rounded-3xl border border-blue-900/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 transition-transform duration-1000 origin-bottom" style={{ transform: `scaleY(${glasses / 8})` }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">{t('hub.waterTitle')}</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-6">{t('hub.waterDesc')} (8 verres)</p>
            
            <div className="flex gap-2 flex-wrap justify-center mb-6">
              {[...Array(8)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateWater(i + 1)}
                  className={`w-10 h-14 rounded-b-xl rounded-t-sm border-2 transition-all ${
                    i < glasses 
                      ? 'bg-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' 
                      : 'bg-transparent border-blue-200 dark:border-blue-900 hover:border-blue-400 opacity-50'
                  }`}
                />
              ))}
            </div>
            
            <button onClick={() => updateWater(0)} className="text-xs text-blue-500/60 hover:text-blue-500 underline">Reset</button>
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="glass p-6 rounded-3xl border border-indigo-900/20">
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">{t('hub.sleepTitle')}</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-6">{t('hub.sleepDesc')}</p>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <input 
              type="range" 
              min="0" 
              max="12" 
              step="0.5"
              value={sleepHours}
              onChange={(e) => updateSleep(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div className="text-center text-4xl font-black text-indigo-600 dark:text-indigo-400">
            {sleepHours}h
          </div>
        </div>
      </div>

      {/* Gamification / Challenges */}
      <div className="glass p-6 rounded-3xl border border-orange-900/20">
        <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
          <span>🏆</span> {t('hub.challengesTitle')}
        </h3>
        
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${challenges.veggies ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
            <span className={challenges.veggies ? 'line-through opacity-50' : ''}>🥗 {t('challenge.veggies')}</span>
            <button 
              onClick={() => completeChallenge('veggies')}
              disabled={challenges.veggies}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${challenges.veggies ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-400'}`}
            >
              {challenges.veggies ? t('hub.completed') : `+50 ${t('hub.complete')}`}
            </button>
          </div>
          
          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${challenges.nosugar ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
            <span className={challenges.nosugar ? 'line-through opacity-50' : ''}>🚫 {t('challenge.nosugar')}</span>
            <button 
              onClick={() => completeChallenge('nosugar')}
              disabled={challenges.nosugar}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${challenges.nosugar ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-400'}`}
            >
              {challenges.nosugar ? t('hub.completed') : `+50 ${t('hub.complete')}`}
            </button>
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${challenges.steps ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
            <span className={challenges.steps ? 'line-through opacity-50' : ''}>👟 {t('challenge.steps')}</span>
            <button 
              onClick={() => completeChallenge('steps')}
              disabled={challenges.steps}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${challenges.steps ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-400'}`}
            >
              {challenges.steps ? t('hub.completed') : `+50 ${t('hub.complete')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
