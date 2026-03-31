// ─────────────────────────────────────────────
// src/utils/formatters.js
// Pure functions — no side effects, no imports.
// Each function takes a value, returns a string.
// Easy to unit test. Easy to reuse anywhere.
// ─────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency.
 * @example formatCurrency(12400) → "₹12,400"
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style:                 "currency",
    currency:              "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format an ISO date string to readable date.
 * @example formatDate("2026-03-28T10:32:00") → "28 Mar 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
};

/**
 * Format an ISO date string to time only.
 * @example formatTime("2026-03-28T10:32:00") → "10:32 AM"
 */
export const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour:   "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format both date and time together.
 * @example formatDateTime("2026-03-28T10:32:00") → "28 Mar 2026, 10:32 AM"
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return `${formatDate(dateStr)}, ${formatTime(dateStr)}`;
};

/**
 * Return a human-readable relative time string.
 * @example formatRelativeTime("2026-03-31T10:10:00") → "10 minutes ago"
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "";

  const now   = new Date();
  const date  = new Date(dateStr);
  const diffMs = now - date;
  const diffMins  = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays  = Math.floor(diffMs / 86400000);

  if (diffMins < 1)    return "Just now";
  if (diffMins < 60)   return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24)  return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1)  return "Yesterday";
  if (diffDays < 7)    return `${diffDays} days ago`;
  return formatDate(dateStr);
};

/**
 * Get initials from a full name (max 2 chars).
 * @example getInitials("Priya Sharma") → "PS"
 */
export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

/**
 * Truncate a string to a max length with ellipsis.
 * @example truncate("Long text here", 10) → "Long text…"
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
};

/**
 * Format a number with Indian comma system.
 * @example formatNumber(1284) → "1,284"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};