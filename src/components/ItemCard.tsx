import { Tag } from "lucide-react";
import type { Item } from "../types";
import { formatMoney } from "../utils/format";
import { useGameStore } from "../store/gameStore";
import { cn } from "../lib/utils";

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const { currentItem, isNegotiating } = useGameStore();
  const isSelected = currentItem?.id === item.id && isNegotiating;

  return (
    <div
      className={cn(
        "relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300",
        "border-2 hover:shadow-lg hover:-translate-y-1",
        item.isSold ? "opacity-50 grayscale" : "",
        isSelected
          ? "border-orange-500 ring-2 ring-orange-300 scale-105"
          : "border-transparent",
      )}
    >
      {item.isSold && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold rotate-12">
            已售出
          </span>
        </div>
      )}

      <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 flex items-center justify-center">
        <span className="text-6xl">{item.emoji}</span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 font-bold text-lg">
              {formatMoney(item.listPrice)}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            成本 {formatMoney(item.costPrice)}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">利润</span>
            <span className="text-green-600 font-medium">
              +{formatMoney(item.listPrice - item.costPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
