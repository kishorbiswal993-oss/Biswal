import React from 'react';
import { Zap, Volume2, VolumeX, Shield, Clock } from 'lucide-react';
import { Language, UserSubscription } from '../types';
import { translations } from '../utils/translations';
import { playSound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'clicker' | 'simulator' | 'overlay' | 'plans' | 'support';
  setActiveTab: (tab: 'clicker' | 'simulator' | 'overlay' | 'plans' | 'support') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isClickerRunning: boolean;
  subscription: UserSubscription;
  onOpenPlans: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  isMuted,
  setIsMuted,
  isClickerRunning,
  subscription,
  onOpenPlans,
}) => {
  const t = translations[lang];

  const getPlanBadge = () => {
    switch (subscription.planId) {
      case 'monthly':
        return { label: 'VIP 1ms', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'weekly':
        return { label: 'PRO 5ms', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'daily':
        return { label: 'DAY PASS', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'fleet':
        return { label: 'FLEET', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'TRIAL 200ms', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const planBadge = getPlanBadge();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('clicker');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  SpeedGrab
                </span>
                <span className="text-[11px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 uppercase">
                  v3.8 FastSnipe
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, functional tabs) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('clicker');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'clicker'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            {t.navClicker}
          </button>

          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('simulator');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            <span>{t.navSimulator}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('overlay');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overlay'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            {t.navOverlay}
          </button>

          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('plans');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            {t.navPlans}
          </button>

          <button
            onClick={() => {
              playSound.click(isMuted);
              setActiveTab('support');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'support'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
            }`}
          >
            {t.navSupport}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Status Beacon */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
              isClickerRunning
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isClickerRunning ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
              }`}
            />
            <span className="font-semibold">{isClickerRunning ? t.running : t.stopped}</span>
          </div>

          {/* Plan badge & Upgrade trigger */}
          <button
            onClick={() => {
              playSound.click(isMuted);
              onOpenPlans();
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${planBadge.color}`}
            title="Click to view subscription"
          >
            <Shield className="w-3 h-3" />
            <span>{planBadge.label}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) playSound.click(false);
            }}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Bilingual Switcher (HI / EN) */}
          <button
            onClick={() => {
              playSound.click(isMuted);
              setLang(lang === 'hi' ? 'en' : 'hi');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Switch Language"
          >
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-slate-900 text-[11px] font-medium text-slate-400">
        <button
          onClick={() => {
            playSound.click(isMuted);
            setActiveTab('clicker');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'clicker' ? 'text-emerald-400 font-bold' : ''}`}
        >
          {t.navClicker}
        </button>
        <button
          onClick={() => {
            playSound.click(isMuted);
            setActiveTab('simulator');
          }}
          className={`px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'simulator' ? 'text-emerald-400 font-bold' : ''}`}
        >
          <span>{t.navSimulator}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
        <button
          onClick={() => {
            playSound.click(isMuted);
            setActiveTab('overlay');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'overlay' ? 'text-emerald-400 font-bold' : ''}`}
        >
          {t.navOverlay}
        </button>
        <button
          onClick={() => {
            playSound.click(isMuted);
            setActiveTab('plans');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'plans' ? 'text-emerald-400 font-bold' : ''}`}
        >
          {t.navPlans}
        </button>
        <button
          onClick={() => {
            playSound.click(isMuted);
            setActiveTab('support');
          }}
          className={`px-2 py-1 rounded ${activeTab === 'support' ? 'text-emerald-400 font-bold' : ''}`}
        >
          {t.navSupport}
        </button>
      </div>
    </header>
  );
};
