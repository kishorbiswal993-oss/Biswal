import React, { useState } from 'react';
import {
  Play,
  Square,
  Zap,
  Sliders,
  ShieldCheck,
  Target,
  Crosshair,
  Smartphone,
  Sparkles,
  Layers,
  IndianRupee,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ClickerConfig, Language, UserSubscription } from '../types';
import { translations } from '../utils/translations';
import { playSound } from '../utils/audio';

interface AutoClickerPanelProps {
  config: ClickerConfig;
  setConfig: React.Dispatch<React.SetStateAction<ClickerConfig>>;
  isClickerRunning: boolean;
  setIsClickerRunning: (running: boolean) => void;
  subscription: UserSubscription;
  lang: Language;
  isMuted: boolean;
  onOpenPlans: () => void;
  onSwitchToSimulator: () => void;
}

export const AutoClickerPanel: React.FC<AutoClickerPanelProps> = ({
  config,
  setConfig,
  isClickerRunning,
  setIsClickerRunning,
  subscription,
  lang,
  isMuted,
  onOpenPlans,
  onSwitchToSimulator,
}) => {
  const t = translations[lang];
  const [activePin, setActivePin] = useState<string>('pt-1');

  // Maximum allowed speed according to user's subscription tier
  const allowedMinSpeed = subscription.planId === 'monthly' || subscription.planId === 'fleet'
    ? 1
    : subscription.planId === 'weekly'
    ? 5
    : subscription.planId === 'daily'
    ? 25
    : 200;

  const handleToggleClicker = () => {
    playSound.click(isMuted);
    const nextState = !isClickerRunning;
    setIsClickerRunning(nextState);
    setConfig((prev) => ({ ...prev, isEnabled: nextState }));
    if (nextState) {
      playSound.radarBeep(isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (speed < allowedMinSpeed) {
      playSound.alertMissed(isMuted);
      onOpenPlans();
      return;
    }
    playSound.click(isMuted);
    setConfig((prev) => ({ ...prev, speedMs: speed }));
  };

  const handlePreset = (preset: 'zomato' | 'swiggy' | 'blinkit' | 'porter') => {
    playSound.click(isMuted);
    if (preset === 'zomato') {
      const speed = Math.max(allowedMinSpeed, 5);
      setConfig((prev) => ({
        ...prev,
        speedMs: speed,
        mode: 'instant_radar',
        minOrderPrice: 80,
        maxDistanceKm: 6,
        antiBanJitter: true,
        activePlatforms: ['zomato'],
        points: [
          { id: 'pt-1', name: 'Zomato Accept Button', x: 50, y: 78, delayMs: 0 },
        ],
      }));
    } else if (preset === 'swiggy') {
      const speed = Math.max(allowedMinSpeed, 10);
      setConfig((prev) => ({
        ...prev,
        speedMs: speed,
        mode: 'multi',
        minOrderPrice: 90,
        maxDistanceKm: 5,
        antiBanJitter: true,
        activePlatforms: ['swiggy'],
        points: [
          { id: 'pt-1', name: 'Swiggy Card Tap', x: 50, y: 45, delayMs: 0 },
          { id: 'pt-2', name: 'Swipe to Accept', x: 75, y: 82, delayMs: 40 },
        ],
      }));
    } else if (preset === 'blinkit') {
      const speed = Math.max(allowedMinSpeed, 5);
      setConfig((prev) => ({
        ...prev,
        speedMs: speed,
        mode: 'instant_radar',
        minOrderPrice: 60,
        maxDistanceKm: 4,
        antiBanJitter: true,
        activePlatforms: ['blinkit', 'zepto'],
        points: [
          { id: 'pt-1', name: 'Blinkit Instant Grab', x: 50, y: 85, delayMs: 0 },
        ],
      }));
    } else if (preset === 'porter') {
      const speed = Math.max(allowedMinSpeed, 25);
      setConfig((prev) => ({
        ...prev,
        speedMs: speed,
        mode: 'single',
        minOrderPrice: 150,
        maxDistanceKm: 10,
        antiBanJitter: true,
        activePlatforms: ['porter', 'uber'],
        points: [
          { id: 'pt-1', name: 'Porter Confirm', x: 50, y: 72, delayMs: 0 },
        ],
      }));
    }
  };

  const handlePhoneCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    playSound.click(isMuted);
    setConfig((prev) => ({
      ...prev,
      points: prev.points.map((p) => (p.id === activePin ? { ...p, x, y } : p)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Snipe Highlights */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 lg:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                {lang === 'hi' ? 'सुपरफास्ट आर्डर स्नाइपर' : 'Zero-Latency Order Grabber'}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {subscription.planId.toUpperCase()} TIER ({allowedMinSpeed}ms Max Speed)
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              {lang === 'hi'
                ? 'आर्डर स्क्रीन पर आने से पहले ही सेकंड में एक्सेप्ट करें'
                : 'Snipe & Grab Orders Before Other Riders Can Touch'}
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 max-w-2xl">
              {lang === 'hi'
                ? 'यह ऑटो क्लिकर हाई-स्पीड रडार और एंटी-बैन टेक्नोलॉजी के साथ सीधे डिलीवरी ऐप्स के आर्डर बटन पर क्लिक करता है।'
                : 'Calibrated for food & grocery delivery gig partners. Locks high-payout orders with human jitter and instant radar.'}
            </p>
          </div>

          {/* Master Launch Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleToggleClicker}
              className={`w-full lg:w-60 h-14 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer ${
                isClickerRunning
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 active:scale-95'
              }`}
            >
              {isClickerRunning ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  <span>{t.stopClicker}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t.startClicker}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Free Plan Upgrade Notice if applicable */}
        {subscription.planId === 'free' && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t.freePlanNotice}</span>
            </div>
            <button
              onClick={() => {
                playSound.click(isMuted);
                onOpenPlans();
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              {lang === 'hi' ? 'वीकली / मंथली प्लान देखें (₹29 से शुरू)' : 'View Plans (Starts at ₹29)'}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Controls Left, Phone Coordinates Canvas Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Speed, Mode, Filters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Presets for Apps */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t.presetsTitle}</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">1-Click Setup</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handlePreset('zomato')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-rose-400 group-hover:text-rose-300">Zomato Flash</div>
                <div className="text-[10px] text-slate-400 font-mono">5ms · Pre-Accept</div>
              </button>

              <button
                onClick={() => handlePreset('swiggy')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300">Swiggy Swipe</div>
                <div className="text-[10px] text-slate-400 font-mono">10ms · Multi-Pt</div>
              </button>

              <button
                onClick={() => handlePreset('blinkit')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-yellow-400 group-hover:text-yellow-300">Blinkit/Zepto</div>
                <div className="text-[10px] text-slate-400 font-mono">5ms · Store Ping</div>
              </button>

              <button
                onClick={() => handlePreset('porter')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-blue-400 group-hover:text-blue-300">Porter/Rapido</div>
                <div className="text-[10px] text-slate-400 font-mono">25ms · High ₹</div>
              </button>
            </div>
          </div>

          {/* Speed Calibration Slider & Presets */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>{t.speedSetting}</span>
                </h2>
                <p className="text-xs text-slate-400">{t.speedDesc}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  {config.speedMs}
                </span>
                <span className="text-xs font-mono text-slate-400 ml-1">ms</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={allowedMinSpeed}
              max="300"
              step="5"
              value={config.speedMs}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Quick Speed Pills */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap pt-1">
              {[1, 5, 10, 25, 50, 100, 200].map((speed) => {
                const isLocked = speed < allowedMinSpeed;
                const isSelected = config.speedMs === speed;
                return (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : isLocked
                        ? 'bg-slate-950/60 text-slate-600 border border-slate-800/80 hover:border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {speed}ms{isLocked ? ' 🔒' : ''}
                  </button>
                );
              })}
            </div>
            {config.speedMs < 20 && (
              <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'अल्ट्रा-फास्ट मोड सक्रिय: साधारण इंसानी हाथ की तुलना में 40 गुना तेज़!'
                    : 'Ultra-fast snipe mode active: 40x faster than normal human reaction time!'}
                </span>
              </p>
            )}
          </div>

          {/* Trigger Mode Selection */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{t.modeTitle}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  playSound.click(isMuted);
                  setConfig((prev) => ({ ...prev, mode: 'instant_radar' }));
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  config.mode === 'instant_radar'
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant Radar</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  {lang === 'hi' ? 'आर्डर आने के 0-5ms में तुरंत ग्रैब' : 'Fires within 5ms upon order detection'}
                </div>
              </button>

              <button
                onClick={() => {
                  playSound.click(isMuted);
                  setConfig((prev) => ({ ...prev, mode: 'single' }));
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  config.mode === 'single'
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Single-Point</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  {lang === 'hi' ? 'एक ही जगह लगातार सुपर क्लिक' : 'Fast clicks at one target coordinate'}
                </div>
              </button>

              <button
                onClick={() => {
                  playSound.click(isMuted);
                  setConfig((prev) => ({ ...prev, mode: 'multi' }));
                }}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  config.mode === 'multi'
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Multi-Point</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  {lang === 'hi' ? 'कार्ड टैप + स्वाइप कन्फर्म' : 'Sequential taps for multi-step accept'}
                </div>
              </button>
            </div>
          </div>

          {/* Anti-Ban & Safety Engine */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">{t.antiBanTitle}</h2>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Safe Algorithm
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.antiBanDesc}</p>
            </div>

            <button
              onClick={() => {
                playSound.click(isMuted);
                setConfig((prev) => ({ ...prev, antiBanJitter: !prev.antiBanJitter }));
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                config.antiBanJitter ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  config.antiBanJitter ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Smart Payout & Distance Filters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  <span>{t.priceFilterTitle}</span>
                </h2>
                <p className="text-xs text-slate-400">{t.priceFilterDesc}</p>
              </div>
              <span className="text-lg font-extrabold font-mono text-emerald-400">
                ₹{config.minOrderPrice}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="250"
              step="10"
              value={config.minOrderPrice}
              onChange={(e) => {
                setConfig((prev) => ({ ...prev, minOrderPrice: Number(e.target.value) }));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex items-center gap-2">
              {[0, 60, 80, 100, 150].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    playSound.click(isMuted);
                    setConfig((prev) => ({ ...prev, minOrderPrice: val }));
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                    config.minOrderPrice === val
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val === 0 ? 'All' : `₹${val}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Screen Coordinates & Target Calibration (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-emerald-400" />
                  <span>
                    {lang === 'hi' ? 'स्क्रीन कोऑर्डिनेट्स कैलिब्रेशन' : 'Screen Target Pin Calibration'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'hi'
                    ? 'नीचे फोन स्क्रीन पर क्लिक करके टारगेट पिन की जगह बदलें।'
                    : 'Click on the simulated phone screen to reposition the target point.'}
                </p>
              </div>
              <button
                onClick={onSwitchToSimulator}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 cursor-pointer"
              >
                {lang === 'hi' ? 'लाइव टेस्ट ➔' : 'Live Test ➔'}
              </button>
            </div>

            {/* Target Pin Selector Tabs */}
            <div className="flex items-center gap-2">
              {config.points.map((pt, idx) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    playSound.click(isMuted);
                    setActivePin(pt.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer ${
                    activePin === pt.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Pin #{idx + 1}</span>
                </button>
              ))}
              {config.mode === 'multi' && config.points.length < 3 && (
                <button
                  onClick={() => {
                    playSound.click(isMuted);
                    const newId = `pt-${config.points.length + 1}`;
                    setConfig((prev) => ({
                      ...prev,
                      points: [
                        ...prev.points,
                        { id: newId, name: `Step ${prev.points.length + 1}`, x: 50, y: 50, delayMs: 50 },
                      ],
                    }));
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono cursor-pointer"
                >
                  + Add Pin
                </button>
              )}
            </div>

            {/* Simulated Phone Display Frame */}
            <div className="relative mx-auto w-full max-w-[280px] h-[460px] bg-slate-950 border-4 border-slate-800 rounded-[36px] p-3 shadow-2xl flex flex-col justify-between overflow-hidden select-none">
              {/* Speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Screen Area (Interactive click capture) */}
              <div
                onClick={handlePhoneCanvasClick}
                className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-[28px] overflow-hidden cursor-crosshair border border-slate-800/80"
              >
                {/* Simulated Gig Delivery App mockup */}
                <div className="p-3 pt-6 space-y-2.5 pointer-events-none opacity-80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>9:41 AM</span>
                    <span className="text-emerald-400">● 5G ONLINE</span>
                  </div>

                  {/* App Header */}
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Zomato / Swiggy Fleet</span>
                    <span className="text-[10px] font-mono text-emerald-400">Duty: ON</span>
                  </div>

                  {/* Simulated Incoming Order Card */}
                  <div className="p-2.5 rounded-xl bg-slate-800/90 border border-emerald-500/40 space-y-2 mt-4 shadow-md">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">Haldiram's Sweets</span>
                      <span className="font-bold text-emerald-400 font-mono">₹145</span>
                    </div>
                    <div className="text-[9px] text-slate-400">Sector 18 ➔ Cyber City (3.8 km)</div>
                  </div>

                  {/* Accept Order Target Button */}
                  <div className="absolute bottom-6 left-3 right-3 p-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs text-center shadow-lg">
                    SWIPE / ACCEPT ORDER (₹145)
                  </div>
                </div>

                {/* Target Pins rendered onto the canvas */}
                {config.points.map((pt, idx) => {
                  const isCurrent = pt.id === activePin;
                  return (
                    <div
                      key={pt.id}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transition-all ${
                        isCurrent ? 'scale-110 z-30' : 'scale-90 opacity-70 z-20'
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                            isCurrent
                              ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse'
                              : 'bg-slate-700 text-slate-200 ring-2 ring-slate-600'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        {/* Crosshair ring */}
                        <div className="absolute -inset-2 border border-dashed border-rose-400/80 rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coordinates display footer */}
              <div className="text-center pt-2 text-[10px] font-mono text-slate-400">
                Active Pin: {config.points.find((p) => p.id === activePin)?.name} (X:{' '}
                {config.points.find((p) => p.id === activePin)?.x}%, Y:{' '}
                {config.points.find((p) => p.id === activePin)?.y}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
