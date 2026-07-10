import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface InstallModalProps {
  onClose: () => void;
}

export default function InstallModal({ onClose }: InstallModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1912] border border-emerald-900/50 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-emerald-50">
        
        {/* Top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-emerald-500/20 blur-[30px] pointer-events-none rounded-full"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-200/50 hover:text-emerald-50 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-500/20">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('install.title')}</h2>
          <p className="text-emerald-200/70 text-sm">
            {t('install.desc')}
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {/* iOS Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <span className="text-xl">🍎</span> iPhone & iPad (Safari)
            </h3>
            <ol className="text-sm text-emerald-100/80 space-y-2 list-decimal pl-4">
              <li>{t('install.iosStep1')} <span className="inline-block border border-emerald-500/30 rounded px-1 bg-black/20">⎙</span></li>
              <li>{t('install.iosStep2')} <strong className="text-emerald-400">{t('install.iosStep2Bold')}</strong></li>
              <li>{t('install.iosStep3')} <strong className="text-emerald-400">{t('install.iosStep3Bold')}</strong> {t('install.iosStep3End')}</li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-bold flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span> Android (Chrome)
            </h3>
            <ol className="text-sm text-emerald-100/80 space-y-2 list-decimal pl-4">
              <li>{t('install.androidStep1')}</li>
              <li>{t('install.androidStep2')} <strong className="text-emerald-400">{t('install.androidStep2Bold1')}</strong> {t('install.androidStep2Or')} <strong>{t('install.androidStep2Bold2')}</strong></li>
              <li>{t('install.androidStep3')} <strong className="text-emerald-400">{t('install.androidStep3Bold1')}</strong> {t('install.androidStep2Or')} <strong>{t('install.androidStep3Bold2')}</strong></li>
            </ol>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-green-400 transition-all shadow-lg shadow-emerald-900/50"
        >
          {t('install.gotIt')}
        </button>
      </div>
    </div>
  );
}
