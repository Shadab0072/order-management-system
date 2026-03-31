// ─────────────────────────────────────────────
// src/constants/status.js
// Single source of truth for all status/priority
// colors, labels, and UI config across the app.
// ─────────────────────────────────────────────

export const ORDER_STATUS = {
  PENDING:     "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED:   "completed",
  CANCELLED:   "cancelled",
};

export const ORDER_PRIORITY = {
  HIGH:   "high",
  MEDIUM: "medium",
  LOW:    "low",
};

// Used in badges, filters, and anywhere a status
// needs a label or color — import this, never hardcode.
export const statusConfig = {
  [ORDER_STATUS.PENDING]: {
    label:   "Pending",
    badgeBg: "#451a03",
    badgeFg: "#f59e0b",
    dotColor: "#f59e0b",
    tailwind: "bg-amber-950 text-amber-400",
  },
  [ORDER_STATUS.IN_PROGRESS]: {
    label:   "In Progress",
    badgeBg: "#1e3a5f",
    badgeFg: "#60a5fa",
    dotColor: "#60a5fa",
    tailwind: "bg-blue-950 text-blue-400",
  },
  [ORDER_STATUS.COMPLETED]: {
    label:   "Completed",
    badgeBg: "#0a4f3c",
    badgeFg: "#22c997",
    dotColor: "#22c997",
    tailwind: "bg-emerald-950 text-emerald-400",
  },
  [ORDER_STATUS.CANCELLED]: {
    label:   "Cancelled",
    badgeBg: "#450a0a",
    badgeFg: "#ef4444",
    dotColor: "#ef4444",
    tailwind: "bg-red-950 text-red-400",
  },
};

export const priorityConfig = {
  [ORDER_PRIORITY.HIGH]: {
    label:    "High",
    dotColor: "#ef4444",
    badgeBg:  "#3d1a1a",
    badgeFg:  "#f87171",
  },
  [ORDER_PRIORITY.MEDIUM]: {
    label:    "Medium",
    dotColor: "#f59e0b",
    badgeBg:  "#2a2010",
    badgeFg:  "#fbbf24",
  },
  [ORDER_PRIORITY.LOW]: {
    label:    "Low",
    dotColor: "#22c997",
    badgeBg:  "#0d2a1a",
    badgeFg:  "#4ade80",
  },
};

// Timeline dot styles used in OrderDetail
export const timelineStageConfig = {
  done:      { bg: "#0a4f3c", fg: "#22c997", border: "#22c997", icon: "✓" },
  active:    { bg: "#1e3a5f", fg: "#60a5fa", border: "#7c6ff7", icon: "→" },
  pending:   { bg: "#1a1d27", fg: "#6b74a0", border: "#2a2f45", icon: "○" },
  cancelled: { bg: "#450a0a", fg: "#ef4444", border: "#ef4444", icon: "✕" },
};

// Notification type → icon color mapping
export const notifTypeConfig = {
  status_change: { bg: "#1e3a5f", fg: "#60a5fa" },
  delivered:     { bg: "#0a4f3c", fg: "#22c997" },
  alert:         { bg: "#3d1a1a", fg: "#f87171" },
  new_order:     { bg: "#2a1a45", fg: "#a89af9" },
  cancelled:     { bg: "#450a0a", fg: "#ef4444" },
  report:        { bg: "#451a03", fg: "#f59e0b" },
};

// All filter options for the Order Listing page
export const STATUS_FILTER_OPTIONS = [
  { value: "all",         label: "All Status"  },
  { value: "pending",     label: "Pending"     },
  { value: "in_progress", label: "In Progress" },
  { value: "completed",   label: "Completed"   },
  { value: "cancelled",   label: "Cancelled"   },
];

export const PRIORITY_FILTER_OPTIONS = [
  { value: "all",    label: "All Priority" },
  { value: "high",   label: "High"         },
  { value: "medium", label: "Medium"       },
  { value: "low",    label: "Low"          },
];

export const DATE_FILTER_OPTIONS = [
  { value: "all",       label: "All Time"   },
  { value: "today",     label: "Today"      },
  { value: "this_week", label: "This Week"  },
  { value: "this_month",label: "This Month" },
];

export const SORT_OPTIONS = [
  { value: "newest",  label: "Newest First"  },
  { value: "oldest",  label: "Oldest First"  },
  { value: "amount_high", label: "Amount: High → Low" },
  { value: "amount_low",  label: "Amount: Low → High" },
];