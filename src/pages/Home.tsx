import { useEffect } from "react";
import { Header } from "@/components/Header";
import { ItemList } from "@/components/ItemList";
import { CustomerDialog } from "@/components/CustomerDialog";
import { TradeHistory } from "@/components/TradeHistory";
import { StallUpgrade } from "@/components/StallUpgrade";
import { NotificationToast } from "@/components/NotificationToast";
import { useGameStore } from "@/store/gameStore";
import { getStallByLevel } from "@/data/stalls";
import { getCustomerSpawnInterval } from "@/utils/gameLogic";

export default function Home() {
  const { stallLevel, isNegotiating, spawnCustomer, items } = useGameStore();
  const stall = getStallByLevel(stallLevel);
  const availableItems = items.filter((item) => !item.isSold);

  useEffect(() => {
    if (isNegotiating || availableItems.length === 0) return;

    const interval = getCustomerSpawnInterval(stall.customerRateBonus);
    const timer = setTimeout(
      () => {
        spawnCustomer();
      },
      interval * (0.7 + Math.random() * 0.6),
    );

    return () => clearTimeout(timer);
  }, [
    isNegotiating,
    stall.customerRateBonus,
    spawnCustomer,
    availableItems.length,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
      <NotificationToast />
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ItemList />
          </div>

          <div className="space-y-6">
            <CustomerDialog />
            <TradeHistory />
            <StallUpgrade />
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-amber-700/60 text-sm">
        <p>🎪 跳蚤市场摆摊模拟器 · 祝你生意兴隆！</p>
      </footer>
    </div>
  );
}
