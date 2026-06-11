import { create } from "zustand";
import type { GameState, Item, TradeRecord } from "../types";
import { initialItems } from "../data/items";
import { getStallByLevel, stallLevels } from "../data/stalls";
import {
  generateCustomer,
  calculateInitialOffer,
  generateCustomerMessage,
  generateCounterOffer,
  pickRandomItem,
} from "../utils/gameLogic";

interface GameActions {
  acceptOffer: () => void;
  rejectOffer: () => void;
  makeCounterOffer: (price: number) => void;
  upgradeStall: () => void;
  spawnCustomer: () => void;
  resetGame: () => void;
  setCounterOfferPrice: (price: number) => void;
  toggleCounterOffer: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  money: 200,
  stallLevel: 1,
  items: [...initialItems],
  tradeHistory: [],
  currentCustomer: null,
  currentItem: null,
  currentOffer: 0,
  bargainingRound: 0,
  isNegotiating: false,
  customerMessage: "",
  showCounterOffer: false,
  counterOfferPrice: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  spawnCustomer: () => {
    const state = get();
    if (state.isNegotiating) return;

    const item = pickRandomItem(state.items);
    if (!item) return;

    const stall = getStallByLevel(state.stallLevel);
    const customer = generateCustomer(item.listPrice, stall.priceBonus);
    const initialOffer = calculateInitialOffer(customer, item);
    const message = generateCustomerMessage(
      customer,
      item,
      initialOffer,
      1,
      true,
    );
    const priceMessage = generateCustomerMessage(
      customer,
      item,
      initialOffer,
      1,
      false,
    );

    set({
      currentCustomer: customer,
      currentItem: item,
      currentOffer: initialOffer,
      bargainingRound: 1,
      isNegotiating: true,
      customerMessage: `${message} ${priceMessage}`,
      showCounterOffer: false,
      counterOfferPrice: item.listPrice,
    });
  },

  acceptOffer: () => {
    const state = get();
    if (!state.currentCustomer || !state.currentItem) return;

    const profit = state.currentOffer - state.currentItem.costPrice;

    const record: TradeRecord = {
      id: `trade-${Date.now()}`,
      itemId: state.currentItem.id,
      itemName: state.currentItem.name,
      salePrice: state.currentOffer,
      profit,
      customerName: state.currentCustomer.name,
      customerEmoji: state.currentCustomer.emoji,
      timestamp: Date.now(),
    };

    set((state) => ({
      money: state.money + state.currentOffer,
      items: state.items.map((item) =>
        item.id === state.currentItem?.id ? { ...item, isSold: true } : item,
      ),
      tradeHistory: [record, ...state.tradeHistory],
      currentCustomer: null,
      currentItem: null,
      currentOffer: 0,
      bargainingRound: 0,
      isNegotiating: false,
      customerMessage: "",
      showCounterOffer: false,
    }));
  },

  rejectOffer: () => {
    set({
      currentCustomer: null,
      currentItem: null,
      currentOffer: 0,
      bargainingRound: 0,
      isNegotiating: false,
      customerMessage: "",
      showCounterOffer: false,
    });
  },

  makeCounterOffer: (price: number) => {
    const state = get();
    if (!state.currentCustomer || !state.currentItem) return;

    const result = generateCounterOffer(
      state.currentCustomer,
      state.currentItem,
      price,
      state.currentOffer,
      state.bargainingRound + 1,
    );

    if (result.accepted) {
      const profit = price - state.currentItem.costPrice;
      const record: TradeRecord = {
        id: `trade-${Date.now()}`,
        itemId: state.currentItem.id,
        itemName: state.currentItem.name,
        salePrice: price,
        profit,
        customerName: state.currentCustomer.name,
        customerEmoji: state.currentCustomer.emoji,
        timestamp: Date.now(),
      };

      set((state) => ({
        money: state.money + price,
        items: state.items.map((item) =>
          item.id === state.currentItem?.id ? { ...item, isSold: true } : item,
        ),
        tradeHistory: [record, ...state.tradeHistory],
        currentCustomer: null,
        currentItem: null,
        currentOffer: 0,
        bargainingRound: 0,
        isNegotiating: false,
        customerMessage: "成交！",
        showCounterOffer: false,
      }));
    } else if (result.left) {
      set((state) => ({
        currentCustomer: null,
        currentItem: null,
        currentOffer: 0,
        bargainingRound: 0,
        isNegotiating: false,
        customerMessage: "顾客摇了摇头，走了...",
        showCounterOffer: false,
      }));

      setTimeout(() => {
        set({ customerMessage: "" });
      }, 2000);
    } else {
      const newRound = state.bargainingRound + 1;
      const message = generateCustomerMessage(
        state.currentCustomer,
        state.currentItem,
        result.newOffer,
        newRound,
        false,
      );

      set({
        currentOffer: result.newOffer,
        bargainingRound: newRound,
        customerMessage: message,
        showCounterOffer: false,
        counterOfferPrice: state.currentItem.listPrice,
      });
    }
  },

  upgradeStall: () => {
    const state = get();
    const nextLevel = state.stallLevel + 1;
    const nextStall = stallLevels.find((s) => s.level === nextLevel);

    if (!nextStall || state.money < nextStall.cost) return;

    set((state) => ({
      money: state.money - nextStall.cost,
      stallLevel: nextLevel,
    }));
  },

  resetGame: () => {
    set({ ...initialState, items: [...initialItems] });
  },

  setCounterOfferPrice: (price: number) => {
    set({ counterOfferPrice: price });
  },

  toggleCounterOffer: () => {
    set((state) => ({ showCounterOffer: !state.showCounterOffer }));
  },
}));
