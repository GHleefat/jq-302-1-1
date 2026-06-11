import { useState, useEffect } from "react";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Minus,
  Plus,
} from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../utils/format";
import { personalityDescriptions } from "../data/customers";
import { cn } from "../lib/utils";

export const CustomerDialog = () => {
  const {
    currentCustomer,
    currentItem,
    currentOffer,
    bargainingRound,
    isNegotiating,
    customerMessage,
    showCounterOffer,
    counterOfferPrice,
    acceptOffer,
    rejectOffer,
    makeCounterOffer,
    toggleCounterOffer,
    setCounterOfferPrice,
  } = useGameStore();

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentCustomer) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentCustomer]);

  const handleCounterOffer = () => {
    if (counterOfferPrice > 0) {
      makeCounterOffer(counterOfferPrice);
    }
  };

  const adjustPrice = (delta: number) => {
    const newPrice = Math.max(1, counterOfferPrice + delta);
    setCounterOfferPrice(newPrice);
  };

  if (!isNegotiating || !currentCustomer || !currentItem) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-amber-300">
        <div className="text-center py-8">
          <div className="text-6xl mb-4 animate-bounce">👀</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            等待顾客光顾...
          </h3>
          <p className="text-gray-400">好位置会吸引更多顾客哦！</p>
        </div>
      </div>
    );
  }

  const profit = currentOffer - currentItem.costPrice;
  const profitPercent = ((profit / currentItem.costPrice) * 100).toFixed(0);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200 transition-all duration-300",
        isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100",
      )}
    >
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-white/20 rounded-full p-3">
            {currentCustomer.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl">
              {currentCustomer.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-orange-100 text-sm">
                {personalityDescriptions[currentCustomer.personality]}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                第 {bargainingRound} 轮
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-xs">感兴趣的商品</p>
            <p className="text-white font-bold flex items-center gap-1">
              <span className="text-2xl">{currentItem.emoji}</span>
              {currentItem.name}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-amber-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-lg">{customerMessage}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">顾客出价</p>
              <p className="text-3xl font-bold text-green-600">
                {formatMoney(currentOffer)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">预计利润</p>
              <p
                className={cn(
                  "text-xl font-bold",
                  profit >= 0 ? "text-green-600" : "text-red-500",
                )}
              >
                {profit >= 0 ? "+" : ""}
                {formatMoney(profit)}
                <span className="text-sm ml-1">
                  ({profit >= 0 ? "+" : ""}
                  {profitPercent}%)
                </span>
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">标价</span>
              <span className="text-gray-700">
                {formatMoney(currentItem.listPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-500">成本</span>
              <span className="text-gray-700">
                {formatMoney(currentItem.costPrice)}
              </span>
            </div>
          </div>
        </div>

        {showCounterOffer ? (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 font-medium mb-3">我的还价</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => adjustPrice(-10)}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <input
                  type="number"
                  value={counterOfferPrice}
                  onChange={(e) => setCounterOfferPrice(Number(e.target.value))}
                  className="text-3xl font-bold text-blue-600 bg-transparent text-center w-32 focus:outline-none"
                />
                <p className="text-gray-400 text-sm">元</p>
              </div>
              <button
                onClick={() => adjustPrice(10)}
                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              <button
                onClick={() => setCounterOfferPrice(currentItem.listPrice)}
                className="px-3 py-1 text-xs bg-white rounded-lg text-gray-600 hover:bg-gray-100"
              >
                标价
              </button>
              <button
                onClick={() =>
                  setCounterOfferPrice(
                    Math.floor((currentOffer + currentItem.listPrice) / 2),
                  )
                }
                className="px-3 py-1 text-xs bg-white rounded-lg text-gray-600 hover:bg-gray-100"
              >
                折中
              </button>
              <button
                onClick={() => setCounterOfferPrice(currentItem.costPrice)}
                className="px-3 py-1 text-xs bg-white rounded-lg text-gray-600 hover:bg-gray-100"
              >
                成本价
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            onClick={acceptOffer}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all shadow-lg shadow-green-200"
          >
            <ThumbsUp className="w-5 h-5" />
            接受
          </button>

          {showCounterOffer ? (
            <button
              onClick={handleCounterOffer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-600 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              <Reply className="w-5 h-5" />
              还价
            </button>
          ) : (
            <button
              onClick={toggleCounterOffer}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-600 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              <Reply className="w-5 h-5" />
              还价
            </button>
          )}

          <button
            onClick={rejectOffer}
            className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-gray-500 hover:to-gray-600 active:scale-95 transition-all shadow-lg shadow-gray-200"
          >
            <ThumbsDown className="w-5 h-5" />
            拒绝
          </button>
        </div>
      </div>
    </div>
  );
};
