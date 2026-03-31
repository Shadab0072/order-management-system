// ─────────────────────────────────────────────
// src/utils/orderHelpers.js
// Business logic for orders — filtering, sorting,
// searching, and computing derived stats.
// All pure functions. No UI. No side effects.
// ─────────────────────────────────────────────

/**
 * Filter orders by status.
 * @param {Array}  orders
 * @param {string} status - "all" | "pending" | "in_progress" | "completed" | "cancelled"
 */
export const filterByStatus = (orders, status) => {
  if (!status || status === "all") return orders;
  return orders.filter((order) => order.status === status);
};

/**
 * Filter orders by priority.
 * @param {Array}  orders
 * @param {string} priority - "all" | "high" | "medium" | "low"
 */
export const filterByPriority = (orders, priority) => {
  if (!priority || priority === "all") return orders;
  return orders.filter((order) => order.priority === priority);
};

/**
 * Filter orders by date range.
 * @param {Array}  orders
 * @param {string} range - "all" | "today" | "this_week" | "this_month"
 */
export const filterByDate = (orders, range) => {
  if (!range || range === "all") return orders;

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return orders.filter((order) => {
    const created = new Date(order.createdAt);

    if (range === "today") {
      return created >= today;
    }

    if (range === "this_week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return created >= weekStart;
    }

    if (range === "this_month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return created >= monthStart;
    }

    return true;
  });
};

/**
 * Search orders by ID, customer name, or customer email.
 * Case-insensitive. Trims whitespace.
 * @param {Array}  orders
 * @param {string} query
 */
export const searchOrders = (orders, query) => {
  const q = query?.trim().toLowerCase();
  if (!q) return orders;

  return orders.filter(
    (order) =>
      order.id.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.email.toLowerCase().includes(q)
  );
};
// ─── Add to src/utils/orderHelpers.js if not already present ─────────────────

/**
 * Applies all active filters to an orders array.
 * @param {Array} orders
 * @param {{ search, status, priority, dateFrom, dateTo }} filters
 */
export const applyAllFilters = (orders, filters) => {
  let result = [...orders]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (o) =>
        o.orderId?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q)
    )
  }

  if (filters.status) {
    result = result.filter((o) => o.status === filters.status)
  }

  if (filters.priority) {
    result = result.filter((o) => o.priority === filters.priority)
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom)
    result = result.filter((o) => new Date(o.createdAt) >= from)
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo)
    to.setHours(23, 59, 59, 999) // include the full end day
    result = result.filter((o) => new Date(o.createdAt) <= to)
  }

  return result
}

/**
 * Sorts orders by a given field and direction.
 * @param {Array} orders
 * @param {string} field
 * @param {'asc'|'desc'} direction
 */
export const sortOrders = (orders, field, direction) => {
  return [...orders].sort((a, b) => {
    let valA = a[field]
    let valB = b[field]

    // Handle dates
    if (field === 'createdAt') {
      valA = new Date(valA)
      valB = new Date(valB)
    }

    // Handle numbers
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA
    }

    // Handle strings
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return direction === 'asc' ? -1 : 1
    if (valA > valB) return direction === 'asc' ? 1 : -1
    return 0
  })
}
/**
 * Compute all dashboard stats from the orders array.
 * Keeps stats always in sync with real data.
 *
 * @param {Array} orders
 * @returns {Object} stats
 */
export const computeDashboardStats = (orders) => {
  const total     = orders.length;
  const pending   = orders.filter((o) => o.status === "pending").length;
  const inProgress = orders.filter((o) => o.status === "in_progress").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const avgOrderValue =
    total > 0 ? Math.round(totalRevenue / (total - cancelled)) : 0;

  const cancellationRate =
    total > 0 ? Math.round((cancelled / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    cancelled,
    totalRevenue,
    avgOrderValue,
    cancellationRate,
  };
};

/**
 * Get an order by its ID.
 * @param {Array}  orders
 * @param {string} id     - e.g. "ORD-001"
 * @returns {Object|undefined}
 */
export const getOrderById = (orders, id) =>
  orders.find((order) => order.id === id);

/**
 * Compute the total value of items in an order.
 * Guards against missing/malformed items.
 * @param {Array} items - order.items array
 * @returns {number}
 */
export const computeOrderTotal = (items = []) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0);

/**
 * Group notifications by date label ("Today", "Yesterday", older dates).
 * Returns an array of { label, items } groups in chronological order.
 * @param {Array} notifications
 * @returns {Array}
 */
export const groupNotificationsByDate = (notifications) => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups = {};

  notifications.forEach((notif) => {
    const d    = new Date(notif.time);
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let label;
    if (date.getTime() === today.getTime())     label = "Today";
    else if (date.getTime() === yesterday.getTime()) label = "Yesterday";
    else label = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
  });

  // Sort within each group newest-first
  Object.values(groups).forEach((group) =>
    group.sort((a, b) => new Date(b.time) - new Date(a.time))
  );

  // Return as array preserving Today → Yesterday → older order
  const order = ["Today", "Yesterday"];
  const result = [];

  order.forEach((label) => {
    if (groups[label]) result.push({ label, items: groups[label] });
  });

  Object.keys(groups)
    .filter((k) => !order.includes(k))
    .forEach((label) => result.push({ label, items: groups[label] }));

  return result;
};

/**
 * Count unread notifications.
 * @param {Array} notifications
 * @returns {number}
 */
export const countUnread = (notifications) =>
  notifications.filter((n) => !n.read).length;




