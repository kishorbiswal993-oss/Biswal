export interface QuickPrompt {
  id: string;
  labelEn: string;
  labelHi: string;
  query: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: '1',
    labelEn: 'How to snipe orders before others?',
    labelHi: 'आर्डर आने से पहले कैसे एक्सेप्ट करें?',
    query: 'Order aane se pehle instant accept kaise kare?',
  },
  {
    id: '2',
    labelEn: 'Is anti-ban safe for Zomato/Swiggy?',
    labelHi: 'क्या एंटी-बैन से आईडी सुरक्षित रहेगी?',
    query: 'Kya anti-ban safe hai aur ID block to nahi hogi?',
  },
  {
    id: '3',
    labelEn: 'Best coordinate & speed settings?',
    labelHi: 'बेस्ट कोऑर्डिनेट्स और स्पीड क्या रखें?',
    query: 'Best speed aur target points kaise set kare?',
  },
  {
    id: '4',
    labelEn: 'How to recharge / activate subscription?',
    labelHi: 'सब्सक्रिप्शन रीचार्ज कैसे करें?',
    query: 'Subscription kaise activate kare aur UPI se pay kare?',
  },
  {
    id: '5',
    labelEn: 'Request immediate phone callback',
    labelHi: 'कॉल पर बात करने के लिए रिक्वेस्ट',
    query: 'Mujhe technician se call par baat karni hai helpline pe',
  },
];

export function getSmartReply(userText: string, lang: 'hi' | 'en'): string {
  const query = userText.toLowerCase();

  if (query.includes('pehle') || query.includes('before') || query.includes('snipe') || query.includes('instant') || query.includes('accept')) {
    if (lang === 'hi') {
      return `⚡ **आर्डर आने से पहले एक्सेप्ट करने का सीक्रेट फॉर्मूला:**
1. **प्री-एक्सेप्ट रडार मोड चालू करें**: ऐप में "Instant Pre-Accept Radar" सेलेक्ट करें। यह मोड स्क्रीन पर आर्डर पॉप-अप होने के माइक्रोसेकंड (1ms-10ms) में ट्रिगर करता है।
2. **स्पीड को 5ms या 10ms पर सेट करें**: वीकली प्रो या वीआईपी प्लान में आप स्पीड 5ms तक कर सकते हैं, जिससे अन्य किसी भी राइडर के हाथ छूने से पहले आर्डर आपके पास लॉक हो जाता है।
3. **टारगेट पॉइंट सही जगह रखें**: अपने डिलीवरी ऐप में "Accept Order" या "Swipe to Accept" के ऊपर टारगेट पिन नंबर 1 सेट करें।
4. **प्राइस फ़िल्टर ऑन रखें**: मिनिमम आर्डर वैल्यू ₹80 या ₹100 रखें ताकि छोटे नुकसान वाले आर्डर्स अपने आप छूट जाएँ और केवल भारी कमाई वाले आर्डर ही स्नाइप हों!`;
    }
    return `⚡ **How to Snipe Orders Before Other Riders:**
1. **Enable Instant Radar Mode**: Switch mode to "Instant Pre-Accept Radar" in the Auto Clicker tab. This scans and fires within 5ms the millisecond an order packet enters the view buffer.
2. **Set Speed to 5ms - 10ms**: Under Weekly Pro or Monthly VIP, set click interval to 5ms. This beats human reaction time (average 250ms) by 50x!
3. **Align Target Pin**: Place Target Pin #1 right over the "Accept" or "Swipe" button coordinates.
4. **Set Minimum Payout Filter**: Keep Min Order value at ₹80-₹100 so you never waste time on low-paying deliveries!`;
  }

  if (query.includes('ban') || query.includes('safe') || query.includes('id') || query.includes('block') || query.includes('सुरक्षा')) {
    if (lang === 'hi') {
      return `🛡️ **एंटी-बैन (Anti-Ban) सुरक्षा विवरण:**
• SpeedGrab में हमारा proprietary **Human Jitter Engine** लगा है।
• हर क्लिक का अंतराल ठीक एक जैसा नहीं होता, बल्कि ±3ms का प्राकृतिक कंपन और ±2px का टच वेरिएशन रहता है।
• इससे Zomato, Swiggy, Blinkit, Zepto के एंटी-चीट अल्गोरिदम को यह वास्तविक मानवीय उंगली का स्पर्श लगता है।
• हमारी सलाह: लगातार 8 घंटे ऑन न रखें, बीच-बीच में 10-15 मिनट का ब्रेक लें। 100% आईडी सुरक्षित रहेगी!`;
    }
    return `🛡️ **Anti-Ban Safety & ID Protection:**
• SpeedGrab utilizes human jitter randomized micro-delays (±3ms variation) and spatial micro-offsets (±2px).
• Delivery partner algorithms cannot distinguish between your ultra-fast finger tap and the automated snipe.
• Tip: Keep the "Anti-Ban Human Jitter" toggle ON at all times for complete account peace of mind!`;
  }

  if (query.includes('speed') || query.includes('setting') || query.includes('point') || query.includes('coordinate') || query.includes('co-ordinate')) {
    if (lang === 'hi') {
      return `⚙️ **अनुशंसित सेटिंग्स (Recommended Settings):**
• **Zomato**: Single Point, Speed 10ms, Anti-ban ON, Minimum Order ₹80.
• **Swiggy**: Multi-Point (Point 1: Card tap, Point 2: Swipe right / Accept), Speed 15ms.
• **Blinkit / Zepto**: Instant Radar, Speed 5ms, Minimum Order ₹50, Target Center-Bottom.
• **Porter**: Single Point, Speed 25ms, Minimum Order ₹150.
आप "Quick Presets" में जाकर 1-क्लिक में ये सेटिंग्स लोड कर सकते हैं!`;
    }
    return `⚙️ **Recommended Settings by App:**
• **Zomato**: Single Point, 10ms interval, Anti-Ban ON, Min ₹80.
• **Swiggy**: Multi-Point (Point 1 on card, Point 2 on Accept button), 15ms interval.
• **Blinkit / Zepto**: Instant Radar, 5ms speed, Min ₹50.
• **Porter**: Single Point, 25ms speed, Min ₹150.
Use the "Quick Presets" buttons in the Auto Clicker tab to apply these instantly!`;
  }

  if (query.includes('subscri') || query.includes('plan') || query.includes('recharge') || query.includes('upi') || query.includes('pay') || query.includes('खरीद') || query.includes('पैसे')) {
    if (lang === 'hi') {
      return `💳 **सब्सक्रिप्शन कैसे एक्टिवेट करें:**
1. ऊपर "सब्सक्रिप्शन प्लान्स" टैब पर क्लिक करें।
2. अपने बजट के अनुसार चुनें:
   - **डेली पास (₹29)**: आज की ड्यूटी के लिए
   - **वीकली प्रो (₹149)**: 5ms अल्ट्रा-स्पीड + एंटी-बैन (सबसे लोकप्रिय)
   - **मंथली वीआईपी (₹399)**: 1ms सुपर रडार + पर्सनल सपोर्ट
3. "अभी रीचार्ज करें" दबाएँ। वहाँ आपको PhonePe, GPay, Paytm UPI QR कोड और UPI ID दिखेगी।
4. पेमेंट पूरा होते ही आपका प्लान तुरंत एक्टिवेट हो जाता है और टाइमर शुरू हो जाता है!`;
    }
    return `💳 **How to Activate Subscription:**
1. Navigate to the "Subscription Plans" tab.
2. Choose from Daily (₹29), Weekly Pro (₹149 - Most Popular), or Monthly VIP (₹399).
3. Click "Activate Now" to open the seamless UPI Checkout modal.
4. Scan the QR code or copy the UPI ID with GPay, PhonePe, or Paytm.
5. Your plan activates immediately with instant license generation!`;
  }

  if (query.includes('call') || query.includes('helpline') || query.includes('number') || query.includes('phone') || query.includes('बात')) {
    if (lang === 'hi') {
      return `📞 **हेल्पलाइन से संपर्क करें:**
• **टोल-फ्री नंबर**: 1800-202-4722 (24 घंटे चालू)
• **सीधा हेल्पलाइन**: +91 98765 43210
• **व्हाट्सएप चैट**: "Helpline & Chat" टैब में दिए गए हरे बटन को दबाकर सीधा चैट शुरू करें।
• यदि आप चाहते हैं कि हम आपको कॉल करें, तो "Request Callback" फॉर्म में अपना मोबाइल नंबर डालकर सबमिट करें — 2 मिनट के भीतर कॉल आ जाएगी!`;
    }
    return `📞 **Contact Our 24/7 Helpline:**
• **Toll-Free**: 1800-202-4722 (24x7)
• **Direct Phone**: +91 98765 43210
• **WhatsApp**: Click the WhatsApp Support button in the Helpline tab.
• **Instant Callback**: Submit your phone number in the callback form and an engineer will call you in under 2 minutes!`;
  }

  // Default response
  if (lang === 'hi') {
    return `नमस्ते राइडर साथी! SpeedGrab सपोर्ट में आपका स्वागत है। 
आप हमसे स्पीड सेटिंग्स, आर्डर आने से पहले एक्सेप्ट करने की तकनीक, एंटी-बैन प्रोटेक्शन या सब्सक्रिप्शन रीचार्ज के बारे में कुछ भी पूछ सकते हैं। हमारे 24/7 टोल-फ्री नंबर 1800-202-4722 पर भी सीधे संपर्क कर सकते हैं!`;
  }
  return `Hello Rider Partner! Welcome to SpeedGrab 24/7 Support.
You can ask about instant order sniping, speed millisecond calibration, anti-ban protection, app coordinates, or subscription activation. You can also reach our toll-free rider helpline at 1800-202-4722 anytime!`;
}
