import React, { useMemo } from "react";
import { useOrders } from "@/context/OrderContext";
import { Bell, CheckCheck, Package, XCircle, Info, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";
import { groupNotificationsByDate } from "@/utils/orderHelpers";
const typeIcon = {
  new_order: ShoppingCart,
  status_change: Package,
  cancellation: XCircle,
  info: Info
};
const typeColor = {
  new_order: "text-success bg-success/10",
  status_change: "text-info bg-info/10",
  cancellation: "text-destructive bg-destructive/10",
  info: "text-muted-foreground bg-surface-2"
};
function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useOrders();
  const grouped = useMemo(() => groupNotificationsByDate(notifications), [notifications]);
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {unreadCount}
            {" unread notification"}
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-2 text-sm text-primary hover:underline">
          <CheckCheck className="h-4 w-4" />
          {" Mark all as read"}
        </button>}
      </div>
      <div className="space-y-8">
        {grouped.map(({ label, items }) => (
          <section key={label} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </h2>
            <div className="space-y-2">
              {items.map((n) => {
                const Icon = typeIcon[n.type] || Bell;
                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      "glass-card p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-white/10",
                      !n.read && "border-l-2 border-l-primary"
                    )}>
                    <div
                      className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", typeColor[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn("text-sm font-medium", n.read ? "text-muted-foreground" : "text-foreground")}>
                          {n.title}
                        </p>
                        {!n.read && <div className="h-2 w-2 rounded-full gradient-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {n.orderId && <Link
                          to={`/orders/${n.orderId}`}
                          className="text-xs text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}>
                          View Order
                        </Link>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        {notifications.length === 0 && <div className="glass-card p-12 text-center text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>
            No notifications
          </p>
        </div>}
      </div>
    </div>
  );
}
export default Notifications;
