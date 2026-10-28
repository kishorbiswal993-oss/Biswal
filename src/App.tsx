/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClickerConfig, Language, PlanId, UserSubscription } from './types';
import { Header } from './components/Header';
import { AutoClickerPanel } from './components/AutoClickerPanel';
import { OrderSimulator } from './components/OrderSimulator';
import { FloatingOverlaySimulator } from './components/FloatingOverlaySimulator';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { HelplineAndChat } from './components/HelplineAndChat';
import { translations } from './utils/translations';
import { playSound } from './utils/audio';
import { PhoneCall, ShieldCheck, Zap, Headphones } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'clicker' | 'simulator' | 'overlay' | 'plans' | 'support'>('clicker');
  const [isClickerRunning, setIsClickerRunning] = useState<boolean>(true);

  // User subscription state with localStorage persistence
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('speedgrab_sub');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      planId: 'weekly', // Default to Weekly Pro so the user can immediately experience ultra-fast 5ms sniping!
      isActive: true,
      activatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      orderSnipesCount: 18,
      totalEarningsGrabbed: 2840,
    };
  });

  // Master Auto Clicker Configuration
  const [config, setConfig] = useState<ClickerConfig>({
    isEnabled: true,
    speedMs: 5, // 5ms ultra-fast snipe mode
    mode: 'instant_radar',
    points: [
      { id: 'pt-1', name: 'Zomato/Swiggy Accept', x: 50, y: 84, delayMs: 0 },
    ],
    antiBanJitter: true,
    minOrderPrice: 80,
    maxDistanceKm: 6,
    activePlatforms: ['zomato', 'swiggy', 'blinkit', 'zepto', 'porter'],
    soundAlerts: true,
    hapticFeedback: true,
  });

  const t = translations[lang];

  const handlePlanActivated = (planId: PlanId) => {
    // If user activated high tier, adapt speed
    const newSpeed = planId === 'monthly' || planId === 'fleet' ? 1 : planId === 'weekly' ? 5 : 25;
    setConfig((prev) => ({ ...prev, speedMs: newSpeed }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isClickerRunning={isClickerRunning}
        subscription={subscription}
        onOpenPlans={() => setActiveTab('plans')}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'clicker' && (
          <AutoClickerPanel
            config={config}
            setConfig={setConfig}
            isClickerRunning={isClickerRunning}
            setIsClickerRunning={setIsClickerRunning}
            subscription={subscription}
            lang={lang}
            isMuted={isMuted}
            onOpenPlans={() => setActiveTab('plans')}
            onSwitchToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <OrderSimulator
            config={config}
            isClickerRunning={isClickerRunning}
            setIsClickerRunning={setIsClickerRunning}
            subscription={subscription}
            setSubscription={setSubscription}
            lang={lang}
            isMuted={isMuted}
            onOpenPlans={() => setActiveTab('plans')}
          />
        )}

        {activeTab === 'overlay' && (
          <FloatingOverlaySimulator
            config={config}
            setConfig={setConfig}
            isClickerRunning={isClickerRunning}
            setIsClickerRunning={setIsClickerRunning}
            lang={lang}
            isMuted={isMuted}
          />
        )}

        {activeTab === 'plans' && (
          <SubscriptionPlans
            subscription={subscription}
            setSubscription={setSubscription}
            lang={lang}
            isMuted={isMuted}
            onPlanActivated={handlePlanActivated}
          />
        )}

        {activeTab === 'support' && (
          <HelplineAndChat
            lang={lang}
            isMuted={isMuted}
          />
        )}
      </main>

      {/* Bottom Sticky Quick Helpline & Status Banner (ergonomic mobile thumb access) */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">SpeedGrab Auto Clicker</span>
              <span className="mx-2 text-slate-600">·</span>
              <span>
                {lang === 'hi'
                  ? 'डिलीवरी पार्टनर्स के लिए 100% सुरक्षित ऑटोमेशन'
                  : 'Engineered for Delivery Gig Partners'}
              </span>
            </div>
          </div>

          {/* Quick Helpline Phone Trigger */}
          <div className="flex items-center gap-4">
            <a
              href="tel:18002024722"
              onClick={() => playSound.click(isMuted)}
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-mono font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1800-202-4722 (24/7 Helpline)</span>
            </a>

            <button
              onClick={() => {
                playSound.click(isMuted);
                setActiveTab('support');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold cursor-pointer"
            >
              {lang === 'hi' ? 'लाइव चैट' : 'Live Chat'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © 2026 SpeedGrab Technologies. Zomato, Swiggy, Blinkit, Zepto, Porter trademarks belong to their respective owners.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500/90 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> Anti-Ban Protected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
