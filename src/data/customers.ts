import type { Customer, CustomerPersonality } from "../types";

export const customerTemplates: Record<
  CustomerPersonality,
  Omit<Customer, "id" | "minBudget" | "maxBudget">[]
> = {
  friendly: [
    {
      name: "小明",
      emoji: "😊",
      personality: "friendly",
      bargainingToughness: 0.2,
      maxRounds: 4,
    },
    {
      name: "阿姨",
      emoji: "👩",
      personality: "friendly",
      bargainingToughness: 0.3,
      maxRounds: 3,
    },
    {
      name: "学生妹",
      emoji: "👧",
      personality: "friendly",
      bargainingToughness: 0.25,
      maxRounds: 3,
    },
  ],
  tough: [
    {
      name: "大叔",
      emoji: "🧔",
      personality: "tough",
      bargainingToughness: 0.7,
      maxRounds: 5,
    },
    {
      name: "精明商人",
      emoji: "🕴️",
      personality: "tough",
      bargainingToughness: 0.8,
      maxRounds: 6,
    },
    {
      name: "砍价王",
      emoji: "🦊",
      personality: "tough",
      bargainingToughness: 0.85,
      maxRounds: 5,
    },
  ],
  hurried: [
    {
      name: "上班族",
      emoji: "👨‍💼",
      personality: "hurried",
      bargainingToughness: 0.4,
      maxRounds: 2,
    },
    {
      name: "游客",
      emoji: "🧳",
      personality: "hurried",
      bargainingToughness: 0.35,
      maxRounds: 2,
    },
    {
      name: "快递员",
      emoji: "🚚",
      personality: "hurried",
      bargainingToughness: 0.5,
      maxRounds: 1,
    },
  ],
  picky: [
    {
      name: "收藏家",
      emoji: "🤓",
      personality: "picky",
      bargainingToughness: 0.5,
      maxRounds: 4,
    },
    {
      name: "鉴赏家",
      emoji: "🎩",
      personality: "picky",
      bargainingToughness: 0.6,
      maxRounds: 5,
    },
    {
      name: "老奶奶",
      emoji: "👵",
      personality: "picky",
      bargainingToughness: 0.45,
      maxRounds: 4,
    },
  ],
};

export const personalityDescriptions: Record<CustomerPersonality, string> = {
  friendly: "人很友善，容易沟通",
  tough: "非常精明，不好对付",
  hurried: "赶时间，没耐心",
  picky: "眼光挑剔，喜欢砍价",
};
