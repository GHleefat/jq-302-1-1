import type { StallLevel } from "../types";

export const stallLevels: StallLevel[] = [
  {
    level: 1,
    name: "街角小摊",
    cost: 0,
    customerRateBonus: 0,
    priceBonus: 0,
    description: "最普通的摊位位置，客流量一般",
    emoji: "🏪",
  },
  {
    level: 2,
    name: "市场入口",
    cost: 500,
    customerRateBonus: 0.2,
    priceBonus: 0.05,
    description: "入口位置，顾客更多一些",
    emoji: "🚪",
  },
  {
    level: 3,
    name: "中心摊位",
    cost: 1500,
    customerRateBonus: 0.5,
    priceBonus: 0.1,
    description: "市场中心位置，客流量大",
    emoji: "🎪",
  },
  {
    level: 4,
    name: "黄金地段",
    cost: 3500,
    customerRateBonus: 0.8,
    priceBonus: 0.15,
    description: "黄金位置，顾客络绎不绝",
    emoji: "🏰",
  },
  {
    level: 5,
    name: "VIP专属区",
    cost: 8000,
    customerRateBonus: 1.2,
    priceBonus: 0.25,
    description: "顶级摊位，高端顾客常来",
    emoji: "👑",
  },
];

export const getStallByLevel = (level: number): StallLevel => {
  return stallLevels.find((s) => s.level === level) || stallLevels[0];
};
