"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const { t } = useTranslation();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // If a user profile already exists locally, default to login mode
    const savedUser = localStorage.getItem('mizen_user_profile');
    setIsLoginMode(!!savedUser);
    
    // Auto-fill email if they previously registered
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) setEmail(parsed.email);
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLoginMode) {
      const success = login(email, password);
      if (!success) {
        setError(t('auth.error'));
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Please fill all fields");
        return;
      }
      register(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1912] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <img src="/icon.png" alt="Mizen" className="w-24 h-24 rounded-3xl shadow-2xl mb-4 border border-emerald-500/30" />
          <h1 className="text-4xl font-extrabold text-emerald-50 font-heading">Mizen</h1>
          <p className="text-emerald-200/70 text-sm mt-2">{isLoginMode ? "Welcome back" : "Create your secure profile"}</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-emerald-900/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-bold text-emerald-100/90 mb-1">{t('auth.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-emerald-800/50 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Amina Mouzai"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-emerald-100/90 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-emerald-800/50 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="amina@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-emerald-100/90 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-emerald-800/50 rounded-xl px-4 py-3 text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
            >
              {isLoginMode ? t('auth.login') : t('auth.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError("");
              }}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors"
            >
              {isLoginMode ? "Don't have an account? Create one" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-emerald-700/60 text-xs">
          <p>🔒 Data is stored securely on your device</p>
        </div>
      </div>
    </div>
  );
}
