import type { Item, Customer, CustomerPersonality } from "../types";
import { customerTemplates } from "../data/customers";
import { pickRandom, randomInt, randomFloat } from "./format";

export const generateCustomer = (
  itemListPrice: number,
  stallPriceBonus: number,
): Customer => {
  const personalities: CustomerPersonality[] = [
    "friendly",
    "tough",
    "hurried",
    "picky",
  ];
  const personality = pickRandom(personalities);
  const templates = customerTemplates[personality];
  const template = pickRandom(templates);

  const baseMinBudget = itemListPrice * 0.4;
  const baseMaxBudget = itemListPrice * (1.0 + stallPriceBonus);

  const minBudget = Math.floor(baseMinBudget * randomFloat(0.8, 1.2));
  const maxBudget = Math.floor(baseMaxBudget * randomFloat(0.9, 1.3));

  return {
    id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...template,
    minBudget: Math.min(minBudget, maxBudget),
    maxBudget: Math.max(minBudget, maxBudget),
  };
};

export const calculateInitialOffer = (
  customer: Customer,
  item: Item,
): number => {
  const listPrice = item.listPrice;

  let offerFactor: number;
  switch (customer.personality) {
    case "friendly":
      offerFactor = randomFloat(0.6, 0.85);
      break;
    case "tough":
      offerFactor = randomFloat(0.4, 0.65);
      break;
    case "hurried":
      offerFactor = randomFloat(0.65, 0.8);
      break;
    case "picky":
      offerFactor = randomFloat(0.45, 0.7);
      break;
    default:
      offerFactor = randomFloat(0.5, 0.75);
  }

  let offer = Math.floor(listPrice * offerFactor);
  offer = Math.max(offer, customer.minBudget);
  offer = Math.min(offer, customer.maxBudget);

  return offer;
};

export const generateCustomerMessage = (
  customer: Customer,
  item: Item,
  offer: number,
  round: number,
  isCounterOffer: boolean,
): string => {
  if (isCounterOffer && round === 1) {
    const greetings = [
      `你好！我对这个${item.name}很感兴趣~`,
      `嘿，这个${item.name}看起来不错！`,
      `老板，这个${item.name}怎么卖？`,
      `哇，${item.name}！我找了好久了。`,
    ];
    return pickRandom(greetings);
  }

  if (round === 1) {
    const messages = [
      `我出${offer}块，怎么样？`,
      `${offer}块卖不卖？`,
      `能不能便宜点？${offer}块行不？`,
      `我预算只有${offer}块左右...`,
      `给个优惠价吧，${offer}块？`,
    ];
    return pickRandom(messages);
  }

  const reactionMessages = {
    friendly: [
      `嗯...${offer}块有点低啊`,
      `这个价格嘛...让我想想`,
      `能不能再加点？`,
    ],
    tough: [`这价也太高了吧！`, `不可能！太贵了！`, `你这是抢钱啊！`],
    hurried: [
      `行就行，不行我走了`,
      `能不能快点？我赶时间`,
      `痛快一点，${offer}块卖不卖？`,
    ],
    picky: [
      `这东西不值这个价`,
      `我看看别的地方有没有更便宜的`,
      `成色也就那样，不值这么多`,
    ],
  };

  const messages = reactionMessages[customer.personality];
  return pickRandom(messages);
};

export const generateCounterOffer = (
  customer: Customer,
  item: Item,
  playerOffer: number,
  currentOffer: number,
  round: number,
): { newOffer: number; accepted: boolean; left: boolean } => {
  const listPrice = item.listPrice;

  if (playerOffer <= customer.maxBudget) {
    const acceptChance = 1 - customer.bargainingToughness * 0.5;
    if (Math.random() < acceptChance || round >= customer.maxRounds) {
      return { newOffer: playerOffer, accepted: true, left: false };
    }
  }

  if (round >= customer.maxRounds) {
    return { newOffer: currentOffer, accepted: false, left: true };
  }

  const gap = playerOffer - currentOffer;
  const concessionRatio = 0.3 + customer.bargainingToughness * 0.3;
  let newOffer = Math.floor(currentOffer + gap * concessionRatio);

  newOffer = Math.max(newOffer, customer.minBudget);
  newOffer = Math.min(newOffer, customer.maxBudget);
  newOffer = Math.min(newOffer, playerOffer);

  if (newOffer === currentOffer || newOffer >= playerOffer) {
    if (Math.random() < customer.bargainingToughness * 0.3) {
      return { newOffer: currentOffer, accepted: false, left: true };
    }
  }

  const maxReached = newOffer >= customer.maxBudget * 0.95;
  if (maxReached && round >= customer.maxRounds - 1) {
    return { newOffer: newOffer, accepted: false, left: true };
  }

  return { newOffer, accepted: false, left: false };
};

export const pickRandomItem = (items: Item[]): Item | null => {
  const availableItems = items.filter((item) => !item.isSold);
  if (availableItems.length === 0) return null;
  return pickRandom(availableItems);
};

export const getCustomerSpawnInterval = (stallBonus: number): number => {
  const baseInterval = 8000;
  const minInterval = 3000;
  const interval = baseInterval / (1 + stallBonus);
  return Math.max(interval, minInterval);
};
