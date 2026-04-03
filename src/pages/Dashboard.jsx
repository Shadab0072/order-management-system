import React, { useMemo } from "react";
import {
  ShoppingCart,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useOrders } from "@/context/OrderContext";
import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";
function ThemedTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  const items = payload.filter((p) => p && p.value != null);
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-md px-3 py-2 text-xs">
      {label != null && (
        <div className="mb-1 text-[11px] text-muted-foreground">
          {label}
        </div>
      )}
      <div className="space-y-0.5">
        {items.map((item, idx) => {
          const rawName = item.name ?? item.dataKey ?? "Value";
          const [value, name] = typeof formatter === "function"
            ? formatter(item.value, rawName, item, idx, payload)
            : [item.value, rawName];
          return (
            <div key={`${rawName}-${idx}`} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">
                {name}
              </span>
              <span className="font-medium text-foreground">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const statusColors = {
  pending: "text-warning",
  in_progress: "text-info",
  completed: "text-success",
  cancelled: "text-destructive"
};
const statusBg = {
  pending: "bg-warning/10 text-warning",
  in_progress: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive"
};
const revenueData = [
  { day: "Mon", revenue: 2400 },
  { day: "Tue", revenue: 1398 },
  { day: "Wed", revenue: 4800 },
  { day: "Thu", revenue: 3908 },
  { day: "Fri", revenue: 4800 },
  { day: "Sat", revenue: 3800 },
  { day: "Sun", revenue: 4300 }
];
const DONUT_COLORS = ["hsl(38 92% 50%)", "hsl(199 89% 48%)", "hsl(152 69% 53%)", "hsl(0 72% 51%)"];
function Dashboard() {
  const { orders } = useOrders();
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const inProgress = orders.filter((o) => o.status === "in_progress").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    return [
      { label: "Total Orders", value: total, icon: ShoppingCart, trend: "+12%", up: true, color: "text-primary" },
      { label: "Pending", value: pending, icon: Clock, trend: "+5%", up: true, color: "text-warning" },
      { label: "In Progress", value: inProgress, icon: Loader2, trend: "-2%", up: false, color: "text-info" },
      { label: "Completed", value: completed, icon: CheckCircle2, trend: "+18%", up: true, color: "text-success" },
      { label: "Cancelled", value: cancelled, icon: XCircle, trend: "-8%", up: false, color: "text-destructive" }
    ];
  }, [orders]);
  const donutData = useMemo(() => [
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length },
    { name: "In Progress", value: orders.filter((o) => o.status === "in_progress").length },
    { name: "Completed", value: orders.filter((o) => o.status === "completed").length },
    { name: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length }
  ], [orders]);
  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
    [orders]
  );
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s, i) => <div
          key={i}
          className={cn("glass-card p-4 sm:p-5 animate-slide-up", i === 0 && "col-span-2 sm:col-span-1")}
          style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <s.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", s.color)} />
            <span
              className={cn("flex items-center gap-1 text-[10px] sm:text-xs font-medium", s.up ? "text-success" : "text-destructive")}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.trend}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {s.value}
          </div>
          <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">
            {s.label}
          </div>
        </div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 glass-card p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Weekly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="hsl(215 20% 55%)"
                fontSize={11}
                tickLine={false}
                axisLine={false} />
              <YAxis
                stroke="hsl(215 20% 55%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v}`}
                width={45} />
              <Tooltip
                content={(props) => (
                  <ThemedTooltip
                    {...props}
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                  />
                )}
                formatter={(value) => [`₹${value}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(239 84% 67%)"
                strokeWidth={2}
                fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Order Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}>
                {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
              </Pie>
              <Tooltip
                content={(props) => (
                  <ThemedTooltip
                    {...props}
                    formatter={(value, name) => [`${value}`, name]}
                  />
                )} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {donutData.map((d, i) => <div key={i} className="flex items-center gap-2 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: DONUT_COLORS[i] }} />
              <span className="text-muted-foreground truncate">
                {d.name}
              </span>
              <span className="ml-auto font-medium text-foreground">
                {d.value}
              </span>
            </div>)}
          </div>
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Recent Orders
          </h3>
          <Link to="/orders" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="sm:hidden divide-y divide-border">
          {recentOrders.map((order) => <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
            <div
              className="h-9 w-9 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
              {order.customer.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {order.customer.name}
                </span>
                <span className="text-sm font-medium text-foreground">
                  ₹
                  {order.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span
                  className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium capitalize", statusBg[order.status])}>
                  {order.status.replace("_", " ")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>)}
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="text-left py-3 px-4 sm:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th
                  className="text-left py-3 px-4 sm:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th
                  className="text-left py-3 px-4 sm:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="text-right py-3 px-4 sm:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th
                  className="text-right py-3 px-4 sm:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 sm:px-6">
                  <Link
                    to={`/orders/${order.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors">
                    {order.id}
                  </Link>
                </td>
                <td className="py-3 px-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-foreground hidden md:flex">
                      {order.customer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-foreground">
                      {order.customer.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 sm:px-6">
                  <span
                    className={cn("px-2.5 py-1 rounded-lg text-xs font-medium capitalize", statusBg[order.status])}>
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-right font-medium text-foreground">
                  ₹
                  {order.amount.toLocaleString()}
                </td>
                <td
                  className="py-3 px-4 sm:px-6 text-right text-muted-foreground hidden md:table-cell">
                  {new Date(order.date).toLocaleDateString()}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
