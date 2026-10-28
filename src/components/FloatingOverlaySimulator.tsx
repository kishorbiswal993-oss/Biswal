import React, { useState } from 'react';
import {
  Play,
  Square,
  Zap,
  Target,
  Settings,
  Minimize2,
  Maximize2,
  X,
  Move,
  CheckCircle,
  Smartphone,
} from 'lucide-react';
import { ClickerConfig, Language } from '../types';
import { translations } from '../utils/translations';
import { playSound } from '../utils/audio';

interface FloatingOverlaySimulatorProps {
  config: ClickerConfig;
  setConfig: React.Dispatch<React.SetStateAction<ClickerConfig>>;
  isClickerRunning: boolean;
  setIsClickerRunning: (running: boolean) => void;
  lang: Language;
  isMuted: boolean;
}

export const FloatingOverlaySimulator: React.FC<FloatingOverlaySimulatorProps> = ({
  config,
  setConfig,
  isClickerRunning,
  setIsClickerRunning,
  lang,
  isMuted,
}) => {
  const t = translations[lang];
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 40, y: 120 });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 240, e.clientX - dragOffset.x)),
      y: Math.max(70, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleRunning = () => {
    playSound.click(isMuted);
    setIsClickerRunning(!isClickerRunning);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="space-y-6 relative min-h-[600px]"
    >
      {/* Overview Info Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h1 className="text-lg font-bold text-white">{t.floatingWidgetTitle}</h1>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">{t.floatingWidgetDesc}</p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
            {lang === 'hi'
              ? 'टिप: नीचे तैरते हुए विजेट को ड्रैग करके कहीं भी रख सकते हैं।'
              : 'Tip: Click and drag the floating controller anywhere on the viewport.'}
          </div>
        </div>
      </div>

      {/* Simulated Device Screen Mockup with Floating Controller */}
      <div className="relative mx-auto w-full max-w-3xl h-[520px] bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Background Mockup of rider working on phone */}
        <div className="space-y-4 opacity-40 pointer-events-none select-none">
          <div className="h-6 w-48 bg-slate-800 rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl" />
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl" />
            <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl" />
          </div>
          <div className="h-44 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-8 w-full bg-slate-800/80 rounded" />
            <div className="h-10 w-full bg-emerald-900/40 rounded-xl" />
          </div>
        </div>

        {/* The Draggable Floating Widget Container */}
        <div
          style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
          className={`absolute top-0 left-0 transition-shadow select-none z-40 ${
            isDragging ? 'cursor-grabbing scale-102' : 'cursor-grab'
          }`}
        >
          {isMinimized ? (
            /* Minimized Floating Bubble */
            <div
              onClick={() => {
                playSound.click(isMuted);
                setIsMinimized(false);
              }}
              onMouseDown={handleMouseDown}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 transition-transform cursor-pointer ${
                isClickerRunning
                  ? 'bg-emerald-500 border-white text-slate-950 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-7 h-7 fill-current" />
            </div>
          ) : (
            /* Full Floating Controller Bar */
            <div className="w-56 bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden text-white ring-1 ring-white/10">
              {/* Header / Drag Bar */}
              <div
                onMouseDown={handleMouseDown}
                className="px-3 py-2 bg-slate-900/90 border-b border-slate-800/90 flex items-center justify-between cursor-move"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Move className="w-3.5 h-3.5" />
                  <span>SpeedGrab</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      playSound.click(isMuted);
                      setIsMinimized(true);
                    }}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Minimize"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 space-y-2.5">
                {/* Play / Stop Toggle */}
                <button
                  onClick={toggleRunning}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isClickerRunning
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {isClickerRunning ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'hi' ? 'रोकें (STOP)' : 'PAUSE SNIPER'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'hi' ? 'चालू करें (START)' : 'START SNIPER'}</span>
                    </>
                  )}
                </button>

                {/* Status Readout */}
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Speed:</span>
                  <span className="font-bold text-emerald-400">{config.speedMs}ms</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Mode:</span>
                  <span className="font-bold text-slate-200 uppercase text-[10px]">
                    {config.mode}
                  </span>
                </div>

                {/* Target Pins indicator */}
                <div className="text-[10px] text-slate-400 text-center font-mono">
                  {config.points.length} Target Pins Active
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="text-center text-xs text-slate-500 font-mono select-none">
          {lang === 'hi'
            ? 'स्पीडग्रैब फ्लोटिंग विजेट: स्क्रीन पर किसी भी डिलीवरी ऐप के ऊपर एक्टिव रहता है।'
            : 'SpeedGrab Accessibility Overlay stays pinned over Zomato, Swiggy, and Blinkit.'}
        </div>
      </div>
    </div>
  );
};
