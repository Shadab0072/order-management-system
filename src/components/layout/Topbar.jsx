import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

const pageTitles = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/kanban": "Kanban Board",
  "/orders/new": "Create Order",
  "/notifications": "Notifications"
};

function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const { unreadCount } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const title = pageTitles[location.pathname] || (location.pathname.includes("/orders/") ? "Order Details" : "Page");
  return (
    <header
      className="sticky top-0 z-40 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-muted transition-colors lg:hidden">
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-base sm:text-xl font-semibold text-foreground truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 lg:w-64 h-9 pl-9 pr-4 rounded-xl bg-surface-1 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
        </button>
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && <span
            className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full text-[10px] font-bold gradient-primary text-primary-foreground">
            {unreadCount}
          </span>}
        </Link>
        <div
          className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
          A
        </div>
      </div>
    </header>
  );
}
export default Topbar;