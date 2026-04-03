import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Plus,
  Columns3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Package,
  X
} from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { cn } from "@/lib/cn";
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Kanban", icon: Columns3, path: "/kanban" },
  { label: "New Order", icon: Plus, path: "/orders/new" },
  { label: "Notifications", icon: Bell, path: "/notifications" }
];
function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { unreadCount } = useOrders();
  return (
    <Fragment>
      {mobileOpen && <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onMobileClose} />}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen flex flex-col border-r border-sidebar-border bg-sidebar z-50 transition-all duration-300",
          // Desktop
          "hidden lg:flex",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}>
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Package className="h-7 w-7 text-primary shrink-0" />
          {!collapsed && <span className="ml-3 text-lg font-bold text-foreground tracking-tight">
            OrderFlow
          </span>}
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path || item.path !== "/" && location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                {active && <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-primary" />}
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>
                  {item.label}
                </span>}
                {item.label === "Notifications" && unreadCount > 0 && <span
                  className={cn(
                    "flex items-center justify-center h-5 min-w-[20px] rounded-full text-[11px] font-semibold gradient-primary text-primary-foreground",
                    collapsed ? "absolute -top-1 -right-1" : "ml-auto"
                  )}>
                  {unreadCount}
                </span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-12 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-[280px] flex flex-col border-r border-sidebar-border bg-sidebar z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        <div
          className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7 text-primary shrink-0" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              OrderFlow
            </span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path || item.path !== "/" && location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                {active && <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-primary" />}
                <item.icon className="h-5 w-5 shrink-0" />
                <span>
                  {item.label}
                </span>
                {item.label === "Notifications" && unreadCount > 0 && <span
                  className="flex items-center justify-center h-5 min-w-[20px] rounded-full text-[11px] font-semibold gradient-primary text-primary-foreground ml-auto">
                  {unreadCount}
                </span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </Fragment>
  );
}
export default Sidebar;
