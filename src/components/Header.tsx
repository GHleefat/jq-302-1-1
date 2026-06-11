import { Coins, TrendingUp, Store } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { getStallByLevel } from "../data/stalls";
import { formatMoney } from "../utils/format";

export const Header = () => {
  const { money, stallLevel, tradeHistory } = useGameStore();
  const stall = getStallByLevel(stallLevel);

  const todayProfit = tradeHistory.reduce(
    (sum, record) => sum + record.profit,
    0,
  );

  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{stall.emoji}</span>
            <div>
              <h1 className="text-xl font-bold">{stall.name}</h1>
              <p className="text-amber-100 text-sm">
                Lv.{stallLevel} · {stall.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="text-xs text-amber-100">余额</p>
                <p className="text-lg font-bold">{formatMoney(money)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <div>
                <p className="text-xs text-amber-100">今日利润</p>
                <p
                  className={`text-lg font-bold ${todayProfit >= 0 ? "text-green-300" : "text-red-300"}`}
                >
                  {todayProfit >= 0 ? "+" : ""}
                  {formatMoney(todayProfit)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Store className="w-5 h-5 text-orange-200" />
              <div>
                <p className="text-xs text-amber-100">已售出</p>
                <p className="text-lg font-bold">{tradeHistory.length} 件</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
