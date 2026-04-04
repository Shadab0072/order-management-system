import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit,
  XCircle,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { cn } from "@/lib/cn";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const PAGE_SIZE = 10;
const statusBg = {
  pending: "bg-warning/10 text-warning",
  in_progress: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive"
};
const priorityDot = {
  low: "bg-muted-foreground",
  medium: "bg-info",
  high: "bg-warning",
  urgent: "bg-destructive"
};
function OrderList() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((o) => o.priority === priorityFilter);
    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [orders, search, statusFilter, priorityFilter, sortField, sortDir]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = filtered.length === 0 ? 0 : Math.min(page * PAGE_SIZE, filtered.length);
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, sortField, sortDir]);
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);
  const pageItems = useMemo(() => {
    const t = totalPages;
    const p = page;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const set = new Set([1, t, p, p - 1, p + 1].filter((n) => n >= 1 && n <= t));
    const sorted = [...set].sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    for (const n of sorted) {
      if (prev && n - prev > 1) out.push("ellipsis");
      out.push(n);
      prev = n;
    }
    return out;
  }, [page, totalPages]);
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-10 sm:pb-12">
      <div
        className="glass-card p-3 sm:p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none h-9 px-3 rounded-xl bg-surface-2 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">
              All Status
            </option>
            <option value="pending">
              Pending
            </option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1 sm:flex-none h-9 px-3 rounded-xl bg-surface-2 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">
              All Priority
            </option>
            <option value="low">
              Low
            </option>
            <option value="medium">
              Medium
            </option>
            <option value="high">
              High
            </option>
            <option value="urgent">
              Urgent
            </option>
          </select>
        </div>
        <Link
          to="/orders/new"
          className="h-9 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          + New Order
        </Link>
      </div>
      <div className="sm:hidden space-y-2">
        {paginated.map((order) => <div
          key={order.id}
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/orders/${order.id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/orders/${order.id}`);
            }
          }}
          className="glass-card p-4 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              {order.id}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium capitalize", statusBg[order.status])}>
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-6 w-6 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
              {order.customer.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-sm text-foreground truncate">
              {order.customer.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", priorityDot[order.priority])} />
              <span className="text-[11px] text-muted-foreground capitalize">
                {order.priority}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground">
              ₹
              {order.amount.toLocaleString()}
            </span>
          </div>
          <div
            className="flex items-center justify-between mt-2 pt-2 border-t border-border"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}>
            <span className="text-[11px] text-muted-foreground">
              {new Date(order.date).toLocaleDateString()}
            </span>
            <div className="flex gap-2">
              <Link
                to={`/orders/${order.id}`}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              <Link
                to={`/orders/${order.id}/edit`}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
              {order.status !== "cancelled" && <button
                type="button"
                onClick={() => cancelOrder(order.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                <XCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>}
            </div>
          </div>
        </div>)}
        {filtered.length === 0 && <div className="glass-card p-12 text-center text-muted-foreground">
          No orders found
        </div>}
      </div>
      <div className="glass-card overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="text-left py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th
                  className="text-left py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th
                  className="text-left py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="text-left py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Priority
                </th>
                <th
                  scope="col"
                  aria-sort={
                    sortField === "amount"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className="text-right py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort("amount")}>
                  <span className="inline-flex w-full items-center justify-end gap-1.5">
                    Amount
                    {sortField === "amount" ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 shrink-0 text-red-500" strokeWidth={2.5} aria-hidden />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
                    )}
                  </span>
                </th>
                <th
                  scope="col"
                  aria-sort={
                    sortField === "date"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className="text-right py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors hidden lg:table-cell"
                  onClick={() => toggleSort("date")}>
                  <span className="inline-flex w-full items-center justify-end gap-1.5">
                    Date
                    {sortField === "date" ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 shrink-0 text-red-500" strokeWidth={2.5} aria-hidden />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
                    )}
                  </span>
                </th>
                <th
                  className="text-right py-3 px-4 lg:px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => <tr
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/orders/${order.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/orders/${order.id}`);
                  }
                }}
                className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="py-3 px-4 lg:px-6 font-medium text-foreground">
                  {order.id}
                </td>
                <td className="py-3 px-4 lg:px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-7 w-7 rounded-full bg-surface-2 flex items-center justify-center text-xs font-semibold text-foreground shrink-0 hidden md:flex">
                      {order.customer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-foreground truncate max-w-[120px] lg:max-w-none">
                      {order.customer.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 lg:px-6">
                  <span
                    className={cn("px-2.5 py-1 rounded-lg text-xs font-medium capitalize", statusBg[order.status])}>
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-4 lg:px-6 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", priorityDot[order.priority])} />
                    <span className="text-muted-foreground capitalize">
                      {order.priority}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 lg:px-6 text-right font-medium text-foreground">
                  ₹
                  {order.amount.toLocaleString()}
                </td>
                <td
                  className="py-3 px-4 lg:px-6 text-right text-muted-foreground hidden lg:table-cell">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 lg:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild={true}>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Order actions">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-36 rounded-xl border-border bg-surface-1 py-1 shadow-xl">
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted/50 focus:bg-muted/50"
                        onClick={() => navigate(`/orders/${order.id}`)}>
                        <Eye className="h-3.5 w-3.5 shrink-0" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-foreground hover:bg-muted/50 focus:bg-muted/50"
                        onClick={() => navigate(`/orders/${order.id}/edit`)}>
                        <Edit className="h-3.5 w-3.5 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      {order.status !== "cancelled" && <DropdownMenuItem
                        className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-destructive hover:bg-muted/50 focus:bg-muted/50"
                        onClick={() => cancelOrder(order.id)}>
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        Cancel
                      </DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>)}
              {filtered.length === 0 && <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length > 0 && <div
        className="glass-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-2xl">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          {"Showing "}
          <span className="font-medium text-foreground">
            {rangeStart}
            {"–"}
            {rangeEnd}
          </span>
          {" of "}
          <span className="font-medium text-foreground">
            {filtered.length}
          </span>
        </p>
        <Pagination className="mx-0 w-full sm:w-auto justify-center sm:justify-end">
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={cn(page <= 1 && "pointer-events-none opacity-40")}
                aria-disabled={page <= 1} />
            </PaginationItem>
            {pageItems.map((item, idx) => item === "ellipsis" ? <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem> : <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(item);
                }}>
                {item}
              </PaginationLink>
            </PaginationItem>)}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={cn(page >= totalPages && "pointer-events-none opacity-40")}
                aria-disabled={page >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>}
    </div>
  );
}
export default OrderList;
