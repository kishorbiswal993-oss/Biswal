import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  IndianRupee,
  Navigation,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ClickerConfig, DeliveryOrder, Language, UserSubscription } from '../types';
import { translations } from '../utils/translations';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface OrderSimulatorProps {
  config: ClickerConfig;
  isClickerRunning: boolean;
  setIsClickerRunning: (running: boolean) => void;
  subscription: UserSubscription;
  setSubscription: React.Dispatch<React.SetStateAction<UserSubscription>>;
  lang: Language;
  isMuted: boolean;
  onOpenPlans: () => void;
}

const SAMPLE_STORES = [
  { name: 'Haldiram’s Sweets & Snacks', area: 'Sector 18' },
  { name: 'Burger King Express', area: 'Mall of India' },
  { name: 'Blinkit Dark Store #4', area: 'Green Park' },
  { name: 'Zepto Quick Hub', area: 'Koramangala' },
  { name: 'KFC Hot & Crispy', area: 'Indiranagar' },
  { name: 'Biryani Blues Royal', area: 'Cyber Hub' },
  { name: 'Subway Fresh Subs', area: 'Connaught Place' },
  { name: 'Porter Freight Center', area: 'Okhla Phase 3' },
];

const PLATFORMS: Array<{ id: DeliveryOrder['platform']; name: string; color: string; badgeBg: string }> = [
  { id: 'zomato', name: 'Zomato', color: 'text-rose-400', badgeBg: 'bg-rose-500/10 border-rose-500/30' },
  { id: 'swiggy', name: 'Swiggy', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'blinkit', name: 'Blinkit', color: 'text-yellow-400', badgeBg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'zepto', name: 'Zepto', color: 'text-purple-400', badgeBg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'porter', name: 'Porter', color: 'text-blue-400', badgeBg: 'bg-blue-500/10 border-blue-500/30' },
];

export const OrderSimulator: React.FC<OrderSimulatorProps> = ({
  config,
  isClickerRunning,
  setIsClickerRunning,
  subscription,
  setSubscription,
  lang,
  isMuted,
  onOpenPlans,
}) => {
  const t = translations[lang];

  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<DeliveryOrder | null>(null);
  const [manualCpsCount, setManualCpsCount] = useState<number>(0);
  const [manualCpsActive, setManualCpsActive] = useState<boolean>(false);
  const [cpsResult, setCpsResult] = useState<number | null>(null);
  const [streamAutoSpawn, setStreamAutoSpawn] = useState<boolean>(true);

  // Stats
  const [totalEarned, setTotalEarned] = useState<number>(subscription.totalEarningsGrabbed || 2480);
  const [snipedCount, setSnipedCount] = useState<number>(subscription.orderSnipesCount || 16);
  const [lastSnipeSpeed, setLastSnipeSpeed] = useState<number | null>(null);

  // Spawn a new simulated incoming delivery order
  const spawnOrder = () => {
    const store = SAMPLE_STORES[Math.floor(Math.random() * SAMPLE_STORES.length)];
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    const payout = Math.floor(Math.random() * 160) + 45; // ₹45 to ₹205
    const distanceKm = Number((Math.random() * 5 + 1.2).toFixed(1));
    const itemsCount = Math.floor(Math.random() * 4) + 1;

    const newOrder: DeliveryOrder = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      platform: platform.id,
      platformName: platform.name,
      orderNumber: `#${Math.floor(Math.random() * 89999 + 10000)}`,
      pickupLocation: store.name,
      dropLocation: `${store.area} Sector ${Math.floor(Math.random() * 30 + 1)}`,
      payout,
      distanceKm,
      itemsCount,
      timeRemainingSec: 2.8,
      initialTimeSec: 2.8,
      status: 'incoming',
      timestamp: Date.now(),
    };

    setActiveOrder(newOrder);

    // If Auto Clicker is ON, evaluate instant pre-accept or grab
    if (isClickerRunning) {
      // Check price filter
      if (payout < config.minOrderPrice) {
        // Skipped due to filter
        setTimeout(() => {
          setActiveOrder((curr) => (curr && curr.id === newOrder.id ? { ...curr, status: 'rejected_filter' } : curr));
        }, 150);
      } else {
        // SNIPE! Calculate reaction speed based on configured speed
        const jitter = config.antiBanJitter ? (Math.random() * 4 - 2) : 0;
        const snipeMs = Math.max(1, Math.round(config.speedMs + jitter));

        // Ultra fast snipe!
        setTimeout(() => {
          setActiveOrder((curr) => {
            if (curr && curr.id === newOrder.id && curr.status === 'incoming') {
              playSound.snipeSuccess(isMuted);

              // Confetti on big order
              if (payout >= 120) {
                confetti({
                  particleCount: 25,
                  spread: 45,
                  origin: { y: 0.6 },
                  colors: ['#10b981', '#34d399', '#fbbf24'],
                });
              }

              setTotalEarned((prev) => prev + payout);
              setSnipedCount((prev) => prev + 1);
              setLastSnipeSpeed(snipeMs);

              setOrders((prevLogs) => [
                { ...curr, status: 'sniped', snipedInMs: snipeMs },
                ...prevLogs.slice(0, 19),
              ]);

              return { ...curr, status: 'sniped', snipedInMs: snipeMs };
            }
            return curr;
          });
        }, Math.min(snipeMs, 120)); // trigger virtually instantaneously
      }
    } else {
      playSound.radarBeep(isMuted);
    }
  };

  // Timer countdown for active incoming order
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'incoming') return;

    const interval = setInterval(() => {
      setActiveOrder((curr) => {
        if (!curr || curr.status !== 'incoming') return curr;
        if (curr.timeRemainingSec <= 0.1) {
          // Missed order
          playSound.alertMissed(isMuted);
          setOrders((prev) => [{ ...curr, status: 'missed' }, ...prev.slice(0, 19)]);
          return { ...curr, status: 'missed' };
        }
        return {
          ...curr,
          timeRemainingSec: Number((curr.timeRemainingSec - 0.1).toFixed(1)),
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeOrder, isMuted]);

  // Auto-spawner loop
  useEffect(() => {
    if (!streamAutoSpawn) return;

    const timer = setInterval(() => {
      // Spawn new order every 4 seconds if currently idle or finished
      if (!activeOrder || activeOrder.status !== 'incoming') {
        spawnOrder();
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [streamAutoSpawn, activeOrder, isClickerRunning, config, isMuted]);

  // Manual Accept Click
  const handleManualAccept = () => {
    if (!activeOrder || activeOrder.status !== 'incoming') return;
    playSound.snipeSuccess(isMuted);
    const manualMs = Math.floor(Math.random() * 80 + 240); // 240-320ms manual reaction

    setTotalEarned((prev) => prev + activeOrder.payout);
    setSnipedCount((prev) => prev + 1);
    setLastSnipeSpeed(manualMs);

    const snipedObj: DeliveryOrder = {
      ...activeOrder,
      status: 'sniped',
      snipedInMs: manualMs,
    };
    setActiveOrder(snipedObj);
    setOrders((prev) => [snipedObj, ...prev.slice(0, 19)]);
  };

  // Manual CPS (Clicks Per Second) Speed Tester
  const handleCpsClick = () => {
    playSound.click(isMuted);
    if (!manualCpsActive) {
      setManualCpsActive(true);
      setManualCpsCount(1);
      setCpsResult(null);

      setTimeout(() => {
        setManualCpsActive(false);
        setManualCpsCount((latest) => {
          setCpsResult(Number((latest / 3).toFixed(1))); // 3 sec test
          return latest;
        });
      }, 3000);
    } else {
      setManualCpsCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.totalEarned}</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
            ₹{totalEarned.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            +₹{(totalEarned * 0.12).toFixed(0)} surge bonus
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.ordersGrabbedCount}</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {snipedCount}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            99.2% Snipe Success
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.averageLatency}</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
            {isClickerRunning ? `${config.speedMs}ms` : 'Manual (~280ms)'}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {lastSnipeSpeed ? `Last Grab: ${lastSnipeSpeed}ms` : 'Waiting for order'}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'hi' ? 'ग्रैबर स्थिति' : 'Grabber Mode'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold font-mono ${
                isClickerRunning ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isClickerRunning ? 'RADAR ACTIVE' : 'MANUAL'}
            </span>
          </div>
          <button
            onClick={() => {
              setIsClickerRunning(!isClickerRunning);
              playSound.click(isMuted);
            }}
            className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer mt-1"
          >
            {isClickerRunning ? 'Turn OFF' : 'Turn ON Auto Grab'}
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Live Order Stream on Left, CPS Speed Arena & Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Order Stream Arena (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {lang === 'hi' ? 'लाइव आर्डर स्ट्रीम (सिम्युलेटर)' : 'Live Incoming Order Stream'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'hi'
                    ? 'यहाँ देखें कि कैसे ऑटो क्लिकर इंसान के हाथ से 40 गुना तेजी से आर्डर लॉक करता है।'
                    : 'Watch SpeedGrab snatch orders the millisecond they appear before competitors.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={spawnOrder}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'नया आर्डर भेजें' : 'Spawn Order'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Order Card Container */}
            <div className="min-h-[290px] flex items-center justify-center p-2">
              {activeOrder ? (
                <div
                  className={`w-full max-w-lg rounded-2xl border transition-all duration-200 p-5 space-y-4 shadow-xl ${
                    activeOrder.status === 'sniped'
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-emerald-500/10'
                      : activeOrder.status === 'missed'
                      ? 'bg-rose-950/30 border-rose-500/50 opacity-80'
                      : activeOrder.status === 'rejected_filter'
                      ? 'bg-amber-950/30 border-amber-500/50'
                      : 'bg-slate-950/90 border-slate-700'
                  }`}
                >
                  {/* Order Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-bold uppercase font-mono px-2 py-0.5 rounded border ${
                          PLATFORMS.find((p) => p.id === activeOrder.platform)?.badgeBg
                        } ${PLATFORMS.find((p) => p.id === activeOrder.platform)?.color}`}
                      >
                        {activeOrder.platformName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {activeOrder.orderNumber}
                      </span>
                    </div>

                    {/* Countdown Timer or Status badge */}
                    {activeOrder.status === 'incoming' ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activeOrder.timeRemainingSec}s left</span>
                      </div>
                    ) : activeOrder.status === 'sniped' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>SNIPED IN {activeOrder.snipedInMs}ms!</span>
                      </div>
                    ) : activeOrder.status === 'missed' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>TAKEN BY OTHER RIDER</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                        <span>SKIPPED BY FILTER (&lt;₹{config.minOrderPrice})</span>
                      </div>
                    )}
                  </div>

                  {/* Order Details Body */}
                  <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800/80">
                    <div>
                      <div className="text-[11px] text-slate-400">
                        {lang === 'hi' ? 'पिकअप दुकान' : 'Pickup Store'}
                      </div>
                      <div className="text-sm font-bold text-white truncate">
                        {activeOrder.pickupLocation}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-emerald-400" />
                        <span>{activeOrder.distanceKm} km trip</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">
                        {lang === 'hi' ? 'राइडर पेआउट (कमाई)' : 'Rider Earnings'}
                      </div>
                      <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                        ₹{activeOrder.payout}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {activeOrder.itemsCount} Items · Pre-paid
                      </div>
                    </div>
                  </div>

                  {/* Order Action Button / Auto Trigger indicator */}
                  <div>
                    {activeOrder.status === 'incoming' ? (
                      <button
                        onClick={handleManualAccept}
                        className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isClickerRunning
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                        }`}
                      >
                        {isClickerRunning ? (
                          <>
                            <Zap className="w-4 h-4 fill-current" />
                            <span>
                              {lang === 'hi'
                                ? 'ऑटो क्लिकर लॉक कर रहा है (Instant Snipe)...'
                                : 'SpeedGrab Auto-Sniping in Background...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>{lang === 'hi' ? 'हाथ से एक्सेप्ट करें (MANUAL ACCEPT)' : 'TAP TO ACCEPT ORDER NOW'}</span>
                          </>
                        )}
                      </button>
                    ) : activeOrder.status === 'sniped' ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {lang === 'hi'
                            ? `आर्डर लॉक हो गया! ₹${activeOrder.payout} आपके वॉलेट में जुड़ गए।`
                            : `Order Grabbed! ₹${activeOrder.payout} locked to your shift.`}
                        </span>
                      </div>
                    ) : activeOrder.status === 'missed' ? (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
                        {lang === 'hi'
                          ? 'ऑटो क्लिकर बंद था, इसलिए दूसरे तेज राइडर ने 250ms में आर्डर झपट लिया!'
                          : 'Auto Grabber was OFF! Another rider took the batch in 240ms.'}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center">
                        {lang === 'hi'
                          ? `स्मार्ट फ़िल्टर ने ₹${activeOrder.payout} का छोटा आर्डर छोड़ दिया (न्यूनतम ₹${config.minOrderPrice} सेट है)।`
                          : `Filter bypassed: ₹${activeOrder.payout} was below your ₹${config.minOrderPrice} minimum.`}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                  <div className="text-sm font-semibold text-slate-400">
                    {lang === 'hi' ? 'नए आर्डर की प्रतीक्षा की जा रही है...' : 'Scanning for incoming batches...'}
                  </div>
                  <button
                    onClick={spawnOrder}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    {lang === 'hi' ? 'अभी आर्डर भेजें (Spawn Now)' : 'Spawn Order Now'}
                  </button>
                </div>
              )}
            </div>

            {/* Stream Spawner toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={streamAutoSpawn}
                  onChange={(e) => setStreamAutoSpawn(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>
                  {lang === 'hi' ? 'लगातार नए आर्डर्स भेजते रहें (Auto Loop)' : 'Continuously simulate order batches every 4s'}
                </span>
              </label>

              <span className="font-mono text-emerald-400">
                Speed: {config.speedMs}ms
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Speed Arena (Human vs Bot) + Sniped History (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Human Reaction Speed Tester (CPS) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{t.manualTestButton}</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">3-Sec Benchmark</span>
            </div>

            <p className="text-xs text-slate-400">{t.manualTestDesc}</p>

            <button
              onClick={handleCpsClick}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all cursor-pointer select-none active:scale-95 ${
                manualCpsActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-4 ring-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {manualCpsActive
                ? `🔥 TAP RAPIDLY! (${manualCpsCount} clicks)`
                : 'START SPEED TEST (TAP HERE)'}
            </button>

            {cpsResult !== null && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Your Finger Speed: </span>
                  <span className="font-bold text-amber-400 font-mono">{cpsResult} CPS</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Reaction: ~280ms</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">SpeedGrab: </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {Math.round(1000 / config.speedMs)} CPS
                  </span>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    Reaction: {config.speedMs}ms ({Math.round(280 / config.speedMs)}x Faster!)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sniped Orders History Log */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'हालिया स्नाइप आर्डर लॉग' : 'Recent Sniped Orders'}</span>
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 tabular-nums">
                {orders.filter((o) => o.status === 'sniped').length} Saved
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  {lang === 'hi' ? 'अभी कोई आर्डर लॉग नहीं है।' : 'No sniped orders logged yet.'}
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ord.status === 'sniped'
                            ? 'bg-emerald-400'
                            : ord.status === 'missed'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{ord.platformName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ord.orderNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {ord.pickupLocation}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">
                        ₹{ord.payout}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {ord.status === 'sniped' ? `${ord.snipedInMs}ms` : ord.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
