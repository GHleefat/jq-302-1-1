import { History, TrendingUp, TrendingDown } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { formatMoney, formatTime } from "../utils/format";

export const TradeHistory = () => {
  const { tradeHistory } = useGameStore();

  if (tradeHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-6 h-6 text-amber-700" />
          <h2 className="text-xl font-bold text-gray-800">交易记录</h2>
        </div>
        <div className="text-center py-8 text-gray-400">
          <p>还没有交易记录</p>
          <p className="text-sm">等待第一位顾客吧~</p>
        </div>
      </div>
    );
  }

  const totalRevenue = tradeHistory.reduce((sum, r) => sum + r.salePrice, 0);
  const totalProfit = tradeHistory.reduce((sum, r) => sum + r.profit, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-amber-700" />
          <h2 className="text-xl font-bold text-gray-800">交易记录</h2>
          <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full font-medium">
            {tradeHistory.length} 笔
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-sm text-blue-600 mb-1">总销售额</p>
          <p className="text-xl font-bold text-blue-700">
            {formatMoney(totalRevenue)}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-sm text-green-600 mb-1">总利润</p>
          <p
            className={`text-xl font-bold ${totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {totalProfit >= 0 ? "+" : ""}
            {formatMoney(totalProfit)}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {tradeHistory.map((record) => (
          <div
            key={record.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="text-3xl">{record.customerEmoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 truncate">
                  {record.itemName}
                </span>
                <span className="text-xs text-gray-400">
                  {record.customerName}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatTime(record.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">
                {formatMoney(record.salePrice)}
              </p>
              <p
                className={`text-sm flex items-center justify-end gap-0.5 ${
                  record.profit >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {record.profit >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {record.profit >= 0 ? "+" : ""}
                {formatMoney(record.profit)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
