export type Language = 'hi' | 'en';

export interface TargetPoint {
  id: string;
  name: string;
  x: number; // percentage or px
  y: number;
  delayMs: number;
}

export interface ClickerConfig {
  isEnabled: boolean;
  speedMs: number; // Interval between clicks in ms (e.g. 10ms - 500ms)
  mode: 'single' | 'multi' | 'instant_radar';
  points: TargetPoint[];
  antiBanJitter: boolean; // Add +/- 2-5ms jitter & slight offset
  minOrderPrice: number; // Only snipe orders above this price (e.g. ₹80)
  maxDistanceKm: number; // Max distance allowed (e.g. 6km)
  activePlatforms: string[]; // ['zomato', 'swiggy', 'blinkit', 'zepto', 'porter', 'uber']
  soundAlerts: boolean;
  hapticFeedback: boolean;
}

export interface DeliveryOrder {
  id: string;
  platform: 'zomato' | 'swiggy' | 'blinkit' | 'zepto' | 'porter' | 'uber';
  platformName: string;
  orderNumber: string;
  pickupLocation: string;
  dropLocation: string;
  payout: number;
  distanceKm: number;
  itemsCount: number;
  timeRemainingSec: number;
  initialTimeSec: number;
  status: 'incoming' | 'sniped' | 'missed' | 'rejected_filter';
  snipedInMs?: number;
  timestamp: number;
}

export type PlanId = 'free' | 'daily' | 'weekly' | 'monthly' | 'fleet';

export interface SubscriptionPlan {
  id: PlanId;
  nameEn: string;
  nameHi: string;
  price: number;
  originalPrice: number;
  durationDays: number;
  durationLabelEn: string;
  durationLabelHi: string;
  minSpeedMs: number;
  maxPoints: number;
  badge?: string;
  featuresEn: string[];
  featuresHi: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  planId: PlanId;
  isActive: boolean;
  activatedAt: number;
  expiresAt: number;
  orderSnipesCount: number;
  totalEarningsGrabbed: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}

export interface CallbackRequest {
  id: string;
  phoneNumber: string;
  riderName: string;
  topic: string;
  requestedAt: number;
  status: 'pending' | 'connecting' | 'resolved';
}
