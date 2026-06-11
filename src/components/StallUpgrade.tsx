import { ArrowUp, Lock, Check, Sparkles } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { stallLevels, getStallByLevel } from "../data/stalls";
import { formatMoney } from "../utils/format";
import { cn } from "../lib/utils";

export const StallUpgrade = () => {
  const { money, stallLevel, upgradeStall } = useGameStore();

  const currentStall = getStallByLevel(stallLevel);
  const nextStall = stallLevels.find((s) => s.level === stallLevel + 1);
  const canUpgrade = nextStall && money >= nextStall.cost;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-bold text-gray-800">摊位升级</h2>
      </div>

      <div className="space-y-3">
        {stallLevels.map((stall) => {
          const isCurrent = stall.level === stallLevel;
          const isUnlocked = stall.level <= stallLevel;
          const isNext = stall.level === stallLevel + 1;

          return (
            <div
              key={stall.level}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all",
                isCurrent
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border-orange-300"
                  : isUnlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200",
              )}
            >
              {isCurrent && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  当前
                </div>
              )}

              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-4xl w-14 h-14 rounded-xl flex items-center justify-center",
                    isUnlocked ? "bg-white shadow" : "bg-gray-200 opacity-50",
                  )}
                >
                  {isUnlocked ? (
                    stall.emoji
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-bold",
                        isUnlocked ? "text-gray-800" : "text-gray-400",
                      )}
                    >
                      Lv.{stall.level} {stall.name}
                    </h3>
                    {isUnlocked && !isCurrent && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      isUnlocked ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {stall.description}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span
                      className={cn(
                        isUnlocked ? "text-blue-600" : "text-gray-400",
                      )}
                    >
                      客流+{Math.round(stall.customerRateBonus * 100)}%
                    </span>
                    <span
                      className={cn(
                        isUnlocked ? "text-green-600" : "text-gray-400",
                      )}
                    >
                      售价+{Math.round(stall.priceBonus * 100)}%
                    </span>
                  </div>
                </div>

                {isNext && (
                  <button
                    onClick={upgradeStall}
                    disabled={!canUpgrade}
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-all",
                      canUpgrade
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-95 shadow-lg shadow-orange-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed",
                    )}
                  >
                    <ArrowUp className="w-4 h-4" />
                    {formatMoney(stall.cost)}
                  </button>
                )}

                {!isNext && !isUnlocked && (
                  <div className="text-gray-400 text-sm font-medium">
                    未解锁
                  </div>
                )}

                {isCurrent && (
                  <div className="text-orange-500 text-sm font-medium">
                    使用中
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {nextStall && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            💡 升级到 <strong>{nextStall.name}</strong>{" "}
            可以吸引更多顾客，并且顾客出价更高！
          </p>
        </div>
      )}

      {!nextStall && (
        <div className="mt-4 p-3 bg-amber-50 rounded-xl text-center">
          <p className="text-amber-700 font-medium">
            🎉 恭喜！你已经达到最高级摊位了！
          </p>
        </div>
      )}
    </div>
  );
};
