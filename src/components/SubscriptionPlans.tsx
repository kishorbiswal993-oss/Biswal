import React, { useState } from 'react';
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  IndianRupee,
  X,
} from 'lucide-react';
import { Language, PlanId, SubscriptionPlan, UserSubscription } from '../types';
import { SUBSCRIPTION_PLANS } from '../utils/plans';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SubscriptionPlansProps {
  subscription: UserSubscription;
  setSubscription: React.Dispatch<React.SetStateAction<UserSubscription>>;
  lang: Language;
  isMuted: boolean;
  onPlanActivated?: (planId: PlanId) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  subscription,
  setSubscription,
  lang,
  isMuted,
  onPlanActivated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  const activePlanDetails = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.planId) || SUBSCRIPTION_PLANS[0];

  const handleOpenCheckout = (plan: SubscriptionPlan) => {
    playSound.click(isMuted);
    setSelectedPlan(plan);
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
    setPaymentSuccess(false);
  };

  const handleApplyPromo = () => {
    playSound.click(isMuted);
    const code = promoCode.trim().toUpperCase();
    if (code === 'RIDER50' || code === 'SUPER50') {
      setPromoDiscount(0.5); // 50% discount
      setPromoApplied(true);
    } else if (code === 'RIDER20') {
      setPromoDiscount(0.2); // 20% discount
      setPromoApplied(true);
    } else {
      alert(lang === 'hi' ? 'अमान्य प्रोमो कोड! (टिप: RIDER50 इस्तेमाल करें)' : 'Invalid promo code! (Tip: Use RIDER50)');
    }
  };

  const handleSimulatePayment = () => {
    if (!selectedPlan) return;
    playSound.click(isMuted);
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      playSound.snipeSuccess(isMuted);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });

      const now = Date.now();
      const expiresAt = now + selectedPlan.durationDays * 24 * 60 * 60 * 1000;

      const updatedSub: UserSubscription = {
        ...subscription,
        planId: selectedPlan.id,
        isActive: true,
        activatedAt: now,
        expiresAt,
      };

      setSubscription(updatedSub);
      try {
        localStorage.setItem('speedgrab_sub', JSON.stringify(updatedSub));
      } catch {
        // ignore
      }

      if (onPlanActivated) {
        onPlanActivated(selectedPlan.id);
      }
    }, 1200);
  };

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0;
    if (promoApplied && promoDiscount > 0) {
      return Math.round(selectedPlan.price * (1 - promoDiscount));
    }
    return selectedPlan.price;
  };

  const copyUpiId = () => {
    playSound.click(isMuted);
    navigator.clipboard?.writeText('speedgrab.pay@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Current Active Plan Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 lg:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {lang === 'hi' ? 'वर्तमान एक्टिव प्लान' : 'Current Active Plan'}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-mono">
                {lang === 'hi' ? activePlanDetails.nameHi : activePlanDetails.nameEn}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white">
              {subscription.planId === 'free'
                ? lang === 'hi'
                  ? 'फ्री ट्रायल सक्रिय है (200ms स्पीड लिमिट)'
                  : 'Free Starter Trial Active (200ms Limit)'
                : lang === 'hi'
                ? `${activePlanDetails.nameHi} सक्रिय है (${activePlanDetails.minSpeedMs}ms सुपर स्पीड)`
                : `${activePlanDetails.nameEn} Active (${activePlanDetails.minSpeedMs}ms Ultra Speed)`}
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'वीकली या मंथली प्लान लेकर 5ms और 1ms की स्पीड से पहले आर्डर तुरंत लॉक करें।'
                : 'Upgrade to 5ms or 1ms ultra-fast snipe speeds to win high-paying delivery batches.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase">
                {lang === 'hi' ? 'स्पीड अनलॉक' : 'Speed Limit'}
              </div>
              <div className="text-base font-bold text-emerald-400">
                {activePlanDetails.minSpeedMs}ms
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {lang === 'hi' ? 'राइडर फ्रेंडली सब्सक्रिप्शन प्लान्स' : 'Affordable Delivery Rider Plans'}
          </h2>
          <p className="text-xs lg:text-sm text-slate-400">
            {lang === 'hi'
              ? 'आर्डर आने से पहले एक्सेप्ट करने के लिए अपनी पसंद का प्लान चुनें।'
              : 'Choose the snipe speed and duration that fits your daily delivery shifts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBSCRIPTION_PLANS.filter((p) => p.id !== 'free').map((plan) => {
            const isCurrent = subscription.planId === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular / Best Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan Title & Duration */}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'hi' ? plan.nameHi : plan.nameEn}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">
                      {lang === 'hi' ? plan.durationLabelHi : plan.durationLabelEn}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-white tabular-nums">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-slate-500 line-through font-mono">
                      ₹{plan.originalPrice}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold font-mono">
                      {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Speed Highlight Pill */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Max Snipe Speed:</span>
                    <span className="font-extrabold text-emerald-400">{plan.minSpeedMs}ms</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {(lang === 'hi' ? plan.featuresHi : plan.featuresEn).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-6 mt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : plan.isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <span>
                      {isCurrent
                        ? lang === 'hi'
                          ? 'वर्तमान में एक्टिव है'
                          : 'Currently Active'
                        : lang === 'hi'
                        ? 'अभी एक्टिवेट करें'
                        : 'Activate Now'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            {lang === 'hi'
              ? '100% सुरक्षित भुगतान व तुरंत एक्टिवेशन। किसी भी समस्या के लिए 24/7 हेल्पलाइन नंबर पर कॉल करें।'
              : '100% Secure simulated UPI & Instant Activation. 24/7 Helpline assistance available.'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
          <span>GPay</span>
          <span>·</span>
          <span>PhonePe</span>
          <span>·</span>
          <span>Paytm</span>
          <span>·</span>
          <span>BHIM UPI</span>
        </div>
      </div>

      {/* Simulated UPI Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-emerald-400 uppercase">
                    {lang === 'hi' ? 'रीचार्ज / एक्टिवेशन' : 'Instant Checkout'}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'hi' ? selectedPlan.nameHi : selectedPlan.nameEn}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {lang === 'hi' ? selectedPlan.durationLabelHi : selectedPlan.durationLabelEn} ·{' '}
                    {selectedPlan.minSpeedMs}ms Ultra Snipe
                  </div>
                </div>

                {/* Simulated UPI QR Box */}
                <div className="p-4 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center space-y-2 text-center shadow-inner">
                  <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300 relative overflow-hidden">
                    {/* Stylized QR representation */}
                    <div className="grid grid-cols-6 gap-1 p-2 w-full h-full">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                              ? 'bg-slate-900'
                              : i % 5 === 0
                              ? 'bg-emerald-600'
                              : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-1.5 bg-white rounded-lg shadow border border-slate-200">
                        <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Scan with any UPI App (GPay / PhonePe / Paytm)
                  </div>
                </div>

                {/* Copy UPI ID */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400">UPI ID: </span>
                    <span className="text-white font-bold">speedgrab.pay@upi</span>
                  </div>
                  <button
                    onClick={copyUpiId}
                    className="p-1.5 hover:bg-slate-800 rounded text-emerald-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedUpi ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Promo Code Input */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'प्रोमो कोड डालें (e.g. RIDER50)' : 'Enter Coupon (Try RIDER50)'}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Coupon applied! 50% discount added.</span>
                    </div>
                  )}
                </div>

                {/* Total Price & Checkout button */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Total Payable:</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      ₹{calculateFinalPrice()}
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessingPayment}
                    className="px-6 py-3 rounded-xl font-bold text-xs tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Verifying UPI...</span>
                      </span>
                    ) : (
                      <span>
                        {lang === 'hi' ? 'पेमेंट कन्फर्म करें' : 'Confirm & Activate'}
                      </span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success Confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">
                    {lang === 'hi' ? 'प्लान सफलतापूर्वक सक्रिय हो गया!' : 'Subscription Activated!'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'hi'
                      ? `${selectedPlan.nameHi} अब आपकी आईडी पर एक्टिव है। आप तुरंत ${selectedPlan.minSpeedMs}ms में आर्डर स्नाइप कर सकते हैं!`
                      : `${selectedPlan.nameEn} is now active. Ultra-speed (${selectedPlan.minSpeedMs}ms) unlocked!`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-1">
                  <div>License ID: <span className="text-emerald-400 font-bold">SG-VIP-{Date.now().toString().slice(-6)}</span></div>
                  <div>Valid For: <span className="text-white">{selectedPlan.durationDays} Days</span></div>
                  <div>Status: <span className="text-emerald-400 font-bold">Active ● 24/7 Helpline Enabled</span></div>
                </div>

                <button
                  onClick={() => setSelectedPlan(null)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {lang === 'hi' ? 'ग्रैबर पर वापस जाएं' : 'Done & Return to Auto Grabber'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
