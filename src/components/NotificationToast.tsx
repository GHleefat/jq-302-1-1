import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { cn } from "../lib/utils";
import type { NotificationType } from "../types";

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  error: <XCircle className="w-6 h-6 text-red-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
};

const bgMap: Record<NotificationType, string> = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
  warning: "bg-amber-50 border-amber-200",
};

export const NotificationToast = () => {
  const { notifications, removeNotification } = useGameStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={cn(
            "pointer-events-auto rounded-xl border-2 shadow-lg p-4 flex items-start gap-3",
            "animate-fade-in-up",
            bgMap[notification.type],
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex-shrink-0 mt-0.5">
            {iconMap[notification.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800">{notification.title}</p>
            <p className="text-sm text-gray-600 mt-0.5">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
};
