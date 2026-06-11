export interface Item {
  id: string;
  name: string;
  emoji: string;
  costPrice: number;
  listPrice: number;
  isSold: boolean;
  description: string;
}

export type CustomerPersonality = "friendly" | "tough" | "hurried" | "picky";

export interface Customer {
  id: string;
  name: string;
  emoji: string;
  personality: CustomerPersonality;
  minBudget: number;
  maxBudget: number;
  bargainingToughness: number;
  maxRounds: number;
}

export interface TradeRecord {
  id: string;
  itemId: string;
  itemName: string;
  salePrice: number;
  profit: number;
  customerName: string;
  customerEmoji: string;
  timestamp: number;
}

export interface StallLevel {
  level: number;
  name: string;
  cost: number;
  customerRateBonus: number;
  priceBonus: number;
  description: string;
  emoji: string;
}

export interface GameState {
  money: number;
  stallLevel: number;
  items: Item[];
  tradeHistory: TradeRecord[];
  currentCustomer: Customer | null;
  currentItem: Item | null;
  currentOffer: number;
  bargainingRound: number;
  isNegotiating: boolean;
  customerMessage: string;
  showCounterOffer: boolean;
  counterOfferPrice: number;
}
