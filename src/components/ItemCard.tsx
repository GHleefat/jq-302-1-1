import { useState } from "react";
import { Tag, Pencil, Check, X, Minus, Plus } from "lucide-react";
import type { Item } from "../types";
import { formatMoney } from "../utils/format";
import { useGameStore } from "../store/gameStore";
import { cn } from "../lib/utils";

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const { currentItem, isNegotiating, updateItemPrice } = useGameStore();
  const isSelected = currentItem?.id === item.id && isNegotiating;
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(item.listPrice);

  const startEdit = () => {
    if (item.isSold) return;
    setTempPrice(item.listPrice);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setTempPrice(item.listPrice);
    setIsEditing(false);
  };

  const savePrice = () => {
    if (tempPrice > 0 && tempPrice !== item.listPrice) {
      updateItemPrice(item.id, tempPrice);
    }
    setIsEditing(false);
  };

  const adjustPrice = (delta: number) => {
    setTempPrice(Math.max(1, tempPrice + delta));
  };

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

        {isEditing ? (
          <div className="bg-blue-50 rounded-lg p-3 mb-2">
            <p className="text-xs text-blue-600 mb-2 font-medium">修改标价</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => adjustPrice(-10)}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(Number(e.target.value))}
                className="w-20 text-center text-xl font-bold text-blue-600 bg-transparent focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => adjustPrice(10)}
                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              <button
                onClick={savePrice}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                保存
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-bold text-lg">
                {formatMoney(item.listPrice)}
              </span>
            </div>
            {!item.isSold && (
              <button
                onClick={startEdit}
                className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                title="修改标价"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {!isEditing && (
          <>
            <div className="text-xs text-gray-400 mt-1">
              成本 {formatMoney(item.costPrice)}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">利润</span>
                <span className="text-green-600 font-medium">
                  +{formatMoney(item.listPrice - item.costPrice)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
