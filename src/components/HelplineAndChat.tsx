import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Send,
  Headphones,
  Clock,
  CheckCircle2,
  HelpCircle,
  Shield,
  Smartphone,
  ExternalLink,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import { CallbackRequest, ChatMessage, Language } from '../types';
import { translations } from '../utils/translations';
import { playSound } from '../utils/audio';
import { QUICK_PROMPTS, getSmartReply } from '../utils/chatKnowledge';

interface HelplineAndChatProps {
  lang: Language;
  isMuted: boolean;
}

export const HelplineAndChat: React.FC<HelplineAndChatProps> = ({ lang, isMuted }) => {
  const t = translations[lang];

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text:
        lang === 'hi'
          ? 'नमस्ते राइडर साथी! SpeedGrab 24/7 हेल्पलाइन चैट में आपका स्वागत है। आप मुझसे स्पीड सेटिंग्स, आर्डर आने से पहले एक्सेप्ट करने के तरीके, एंटी-बैन या रीचार्ज के बारे में कुछ भी पूछ सकते हैं!'
          : 'Hello Rider Partner! Welcome to SpeedGrab 24/7 Support. Ask me anything about ultra-fast 5ms order sniping, anti-ban safety, coordinates, or subscription activation!',
      timestamp: Date.now() - 30000,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Callback form state
  const [riderName, setRiderName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [issueTopic, setIssueTopic] = useState<string>('speed_setting');
  const [callbackSubmitted, setCallbackSubmitted] = useState<boolean>(false);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    playSound.click(isMuted);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulated technician typing delay
    setTimeout(() => {
      const replyText = getSmartReply(text, lang);
      playSound.radarBeep(isMuted);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    playSound.snipeSuccess(isMuted);
    setCallbackSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Helpline Numbers Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Toll Free Card */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                {lang === 'hi' ? '24/7 टोल-फ्री हेल्पलाइन' : '24/7 Toll-Free Support'}
              </div>
              <div className="text-lg font-black text-white font-mono">1800-202-4722</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'बिना किसी चार्ज के सीधे सपोर्ट टीम से बात करें। सभी भारतीय भाषाओं में सहायता।'
              : 'Direct toll-free connection to senior technical support.'}
          </p>
          <a
            href="tel:18002024722"
            onClick={() => playSound.click(isMuted)}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.callNow}</span>
          </a>
        </div>

        {/* Direct Mobile / WhatsApp Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {lang === 'hi' ? 'सीधा मोबाइल व व्हाट्सएप' : 'WhatsApp Official'}
              </div>
              <div className="text-lg font-black text-white font-mono">+91 98765 43210</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'स्क्रीनशॉट भेजें और तुरंत कोऑर्डिनेट सेटिंग्स की सहायता प्राप्त करें।'
              : 'Send app screenshots for immediate coordinate alignment help.'}
          </p>
          <button
            onClick={() => {
              playSound.click(isMuted);
              window.open('https://api.whatsapp.com/send?phone=919876543210&text=Hi%20SpeedGrab%20Help', '_blank');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.whatsappSupport}</span>
          </button>
        </div>

        {/* Priority VIP Line */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                {lang === 'hi' ? 'वीआईपी राइडर लाइन' : 'VIP Priority Line'}
              </div>
              <div className="text-lg font-black text-white font-mono">&lt; 30s Wait Time</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'वीकली प्रो और मंथली वीआईपी सब्सक्राइबर्स के लिए डेडिकेटेड पर्सनल इंजीनियर।'
              : 'Fast-track phone dispatch for active Weekly & Monthly plan holders.'}
          </p>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>24 Hours Duty Desk Open</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Live Chat on Left (7 cols), Callback Form on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Live Chat (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[560px] shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>SpeedGrab Live Assistant</span>
                  <span className="text-[10px] text-emerald-400 font-mono">● Online</span>
                </h3>
                <div className="text-[11px] text-slate-400">
                  {lang === 'hi' ? 'स्पीड, एंटी-बैन और आर्डर सेटिंग्स सहायता' : 'Rider Technical Specialist'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click(isMuted);
                setMessages([
                  {
                    id: 'm-reset',
                    sender: 'assistant',
                    text:
                      lang === 'hi'
                        ? 'चैट रीसेट हो गई है। आप अपनी समस्या यहाँ लिख सकते हैं।'
                        : 'Chat reset. How can I help you today?',
                    timestamp: Date.now(),
                  },
                ]);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              {lang === 'hi' ? 'रीसेट' : 'Clear'}
            </button>
          </div>

          {/* Quick FAQ Chips */}
          <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSendMessage(prompt.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap shrink-0 transition-colors cursor-pointer text-[11px]"
              >
                {lang === 'hi' ? prompt.labelHi : prompt.labelEn}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isBot = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 shadow-md ${
                      isBot
                        ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 whitespace-pre-line'
                        : 'bg-emerald-600 text-white font-medium ml-auto'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-[9px] font-mono ${
                        isBot ? 'text-slate-400' : 'text-emerald-100'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Assistant is typing answer...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold cursor-pointer transition-colors"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Request Instant Callback Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 lg:p-6 space-y-5 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">{t.requestCallback}</h2>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'अपना मोबाइल नंबर दर्ज करें। हमारी टेक्निकल टीम 2 मिनट में आपको कॉल करेगी।'
                : 'Enter your phone number. Our engineering desk will call you within 2 minutes.'}
            </p>
          </div>

          {!callbackSubmitted ? (
            <form onSubmit={handleCallbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'आपका नाम (Rider Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर (Phone Number)' : 'Mobile Phone Number'}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-r-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  {lang === 'hi' ? 'समस्या का विषय (Issue Topic)' : 'Issue Subject'}
                </label>
                <select
                  value={issueTopic}
                  onChange={(e) => setIssueTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="speed_setting">
                    {lang === 'hi' ? 'आर्डर आने से पहले एक्सेप्ट / स्पीड सेटिंग्स' : 'Fast Snipe / Millisecond Speed Calibration'}
                  </option>
                  <option value="zomato_swiggy_setup">
                    {lang === 'hi' ? 'Zomato / Swiggy / Blinkit कोऑर्डिनेट्स' : 'Zomato / Swiggy Screen Coordinates'}
                  </option>
                  <option value="anti_ban">
                    {lang === 'hi' ? 'एंटी-बैन सुरक्षा व अकाउंट सेफ्टी' : 'Anti-Ban Safety & ID Protection'}
                  </option>
                  <option value="subscription_help">
                    {lang === 'hi' ? 'सब्सक्रिप्शन रीचार्ज व एक्टिवेशन' : 'Subscription Recharge & Payment'}
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                {lang === 'hi' ? 'तुरंत कॉलबैक रिक्वेस्ट भेजें' : 'Request Immediate Call'}
              </button>
            </form>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  {lang === 'hi' ? 'कॉलबैक दर्ज हो गया!' : 'Callback Registered!'}
                </h3>
                <p className="text-xs text-emerald-300">
                  {t.callbackSubmitted}
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                Ticket #{Math.floor(Math.random() * 89999 + 10000)} · Phone: +91 {phoneNumber}
              </div>
              <button
                onClick={() => setCallbackSubmitted(false)}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                {lang === 'hi' ? 'दूसरा नंबर दर्ज करें' : 'Submit Another Request'}
              </button>
            </div>
          )}

          {/* Quick Support Guidelines */}
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">
              {lang === 'hi' ? 'सपोर्ट का समय व भाषाएँ:' : 'Support Timings & Languages:'}
            </div>
            <div className="text-[11px] leading-relaxed">
              {lang === 'hi'
                ? '• 24x7 कॉलिंग सुविधा हिंदी, इंग्लिश, बंगाली, तमिल, तेलुगु में उपलब्ध है।'
                : '• 24/7 Calling available in Hindi, English, Bengali, Tamil, and Telugu.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
