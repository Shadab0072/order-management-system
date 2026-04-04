import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit,
  XCircle,
  X,
  CalendarIcon,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
const filterDateTriggerClass =
  "flex min-w-0 flex-1 items-center justify-between gap-1 px-2 text-left text-xs sm:text-sm outline-none transition-colors hover:bg-muted/20";
function OrderListFilterDate({ label, value, onChange, disabled }) {
  return (
    <div
      className={cn(
        "flex h-8 w-full min-w-0 sm:h-9 sm:w-auto sm:flex-none sm:min-w-[7rem] sm:max-w-[9rem] items-stretch rounded-xl border border-border bg-surface-2 overflow-hidden",
        "focus-within:ring-2 focus-within:ring-primary/30"
      )}>
      <Popover>
        <PopoverTrigger asChild={true}>
          <button
            type="button"
            className={cn(filterDateTriggerClass, !value && "text-muted-foreground")}>
            <span className="truncate">
              {value ? format(value, "PPP") : label}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus={true}
            disabled={disabled}
            className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
      {value ? <button
        type="button"
        className="flex shrink-0 items-center border-l border-border px-2 hover:bg-muted/40"
        onClick={() => onChange(undefined)}
        aria-label={`Clear ${label}`}>
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button> : null}
    </div>
  );
}
function OrderList() {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
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
    if (dateFrom) {
      const fromT = startOfDay(dateFrom).getTime();
      result = result.filter((o) => new Date(o.date).getTime() >= fromT);
    }
    if (dateTo) {
      const toT = endOfDay(dateTo).getTime();
      result = result.filter((o) => new Date(o.date).getTime() <= toT);
    }
    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [orders, search, statusFilter, priorityFilter, dateFrom, dateTo, sortField, sortDir]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = filtered.length === 0 ? 0 : Math.min(page * PAGE_SIZE, filtered.length);
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, dateFrom, dateTo, sortField, sortDir]);
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
      <div className="glass-card flex flex-wrap items-center gap-2 p-3 sm:gap-2 sm:p-4">
        <div className="relative w-full min-w-0 flex-[1_1_100%] sm:flex-1 sm:basis-[min(100%,12rem)]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:left-3 sm:h-4 sm:w-4" />
          <input
            type="text"
            placeholder="Search ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-xl border border-border bg-surface-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-9 sm:pl-9 sm:pr-4"
          />
        </div>
        <div className="flex w-full min-w-0 flex-[1_1_100%] gap-2 sm:w-auto sm:flex-[0_1_auto] sm:shrink-0">
          <OrderListFilterDate
            label="From"
            value={dateFrom}
            onChange={setDateFrom}
            disabled={dateTo ? { after: endOfDay(dateTo) } : undefined}
          />
          <OrderListFilterDate
            label="To"
            value={dateTo}
            onChange={setDateTo}
            disabled={dateFrom ? { before: startOfDay(dateFrom) } : undefined}
          />
        </div>
        <div className="flex w-full min-w-0 flex-[1_1_100%] gap-2 sm:w-auto sm:flex-[0_1_auto] sm:shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-9 sm:min-w-[6.5rem] sm:flex-none sm:px-2.5 sm:text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:h-9 sm:min-w-[6.5rem] sm:flex-none sm:px-2.5 sm:text-sm">
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <Link
          to="/orders/new"
          className="flex h-8 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-medium text-primary-foreground gradient-primary transition-opacity hover:opacity-90 sm:h-9 sm:w-auto sm:px-3.5 sm:text-sm">
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
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="whitespace-nowrap py-2.5 pl-3 pr-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:py-3 sm:pl-4 sm:pr-3 sm:text-xs lg:px-5">
                  Order ID
                </th>
                <th className="whitespace-nowrap py-2.5 px-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:py-3 sm:px-3 sm:text-xs lg:px-5">
                  Customer
                </th>
                <th className="whitespace-nowrap py-2.5 px-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:py-3 sm:px-3 sm:text-xs lg:px-5">
                  Status
                </th>
                <th className="whitespace-nowrap py-2.5 px-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:py-3 sm:px-3 sm:text-xs lg:px-5">
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
                  className="cursor-pointer select-none whitespace-nowrap py-2.5 px-2 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground sm:py-3 sm:px-3 sm:text-xs lg:px-5"
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
                  className="cursor-pointer select-none whitespace-nowrap py-2.5 px-2 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground sm:py-3 sm:px-3 sm:text-xs lg:px-5"
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
                <th className="whitespace-nowrap py-2.5 pl-2 pr-3 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:py-3 sm:pl-3 sm:pr-4 sm:text-xs lg:px-5">
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
                <td className="whitespace-nowrap py-2.5 pl-3 pr-2 text-sm font-medium text-foreground sm:py-3 sm:pl-4 sm:pr-3 lg:px-5">
                  {order.id}
                </td>
                <td className="max-w-[8rem] py-2.5 px-2 sm:max-w-[10rem] sm:py-3 sm:px-3 md:max-w-[14rem] lg:max-w-none lg:px-5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-foreground sm:flex sm:h-7 sm:w-7 sm:text-xs">
                      {order.customer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="truncate text-foreground">{order.customer.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2.5 px-2 sm:py-3 sm:px-3 lg:px-5">
                  <span
                    className={cn(
                      "inline-block max-w-full truncate rounded-lg px-2 py-0.5 text-[10px] font-medium capitalize sm:px-2.5 sm:py-1 sm:text-xs",
                      statusBg[order.status]
                    )}>
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="whitespace-nowrap py-2.5 px-2 sm:py-3 sm:px-3 lg:px-5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={cn("h-2 w-2 shrink-0 rounded-full", priorityDot[order.priority])} />
                    <span className="capitalize text-muted-foreground text-xs">{order.priority}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-2.5 px-2 text-right text-sm font-medium text-foreground sm:py-3 sm:px-3 lg:px-5">
                  ₹
                  {order.amount.toLocaleString()}
                </td>
                <td className="whitespace-nowrap py-2.5 px-2 text-right text-xs text-muted-foreground sm:py-3 sm:px-3 lg:px-5">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-2.5 pl-2 pr-3 text-right sm:py-3 sm:pl-3 sm:pr-4 lg:px-5" onClick={(e) => e.stopPropagation()}>
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
