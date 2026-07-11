"use client";

import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  const [points, setPoints] = useState(0);
  const [joinedDate, setJoinedDate] = useState("");

  useEffect(() => {
    // Load points
    const savedPoints = localStorage.getItem('mizen_points');
    if (savedPoints) {
        setPoints(parseInt(savedPoints, 10) || 0);
    }

    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      setJoinedDate(date.toLocaleDateString());
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-4 border-4 border-emerald-900/30">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold font-heading text-emerald-950 dark:text-emerald-50 mb-1">
          {t('profile.welcome')}, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-emerald-700/80 dark:text-emerald-200/60">{user.email}</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-emerald-900/30">
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-50 mb-6">{t('profile.stats')}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">⭐</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{points}</span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Mizen Points</span>
          </div>
          
          <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📅</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{joinedDate || "Today"}</span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Joined</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold py-4 px-6 rounded-2xl transition-all"
        >
          {t('auth.logout')}
        </button>
      </div>
    </div>
  );
}
