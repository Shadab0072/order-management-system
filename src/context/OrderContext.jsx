import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
const OrderContext = createContext(void 0);
const defaultTimeline = () => [
  { id: "placed", label: "Placed", completed: true, date: ((new Date())).toISOString() },
  { id: "processing", label: "Processing", completed: false },
  { id: "shipped", label: "Shipped", completed: false },
  { id: "delivered", label: "Delivered", completed: false }
];
const sampleCustomers = [
  { name: "Sarah Chen", email: "sarah@example.com", phone: "+1 555-0101", address: "123 Oak Ave", city: "San Francisco", state: "CA", zip: "94102" },
  { name: "James Wilson", email: "james@example.com", phone: "+1 555-0102", address: "456 Pine St", city: "New York", state: "NY", zip: "10001" },
  { name: "Emily Davis", email: "emily@example.com", phone: "+1 555-0103", address: "789 Elm Dr", city: "Austin", state: "TX", zip: "73301" },
  { name: "Michael Brown", email: "michael@example.com", phone: "+1 555-0104", address: "321 Cedar Ln", city: "Seattle", state: "WA", zip: "98101" },
  { name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 555-0105", address: "654 Maple Rd", city: "Chicago", state: "IL", zip: "60601" },
  { name: "David Kim", email: "david@example.com", phone: "+1 555-0106", address: "987 Birch Ct", city: "Denver", state: "CO", zip: "80201" },
  { name: "Anna Martinez", email: "anna@example.com", phone: "+1 555-0107", address: "147 Walnut Way", city: "Miami", state: "FL", zip: "33101" },
  { name: "Robert Taylor", email: "robert@example.com", phone: "+1 555-0108", address: "258 Spruce Pl", city: "Portland", state: "OR", zip: "97201" }
];
const sampleItems = [
  [{ id: "1", name: 'MacBook Pro 16"', quantity: 1, price: 2499 }, { id: "2", name: "USB-C Hub", quantity: 2, price: 49.99 }],
  [{ id: "3", name: "Standing Desk", quantity: 1, price: 799 }, { id: "4", name: "Monitor Arm", quantity: 1, price: 129.99 }],
  [{ id: "5", name: "Wireless Keyboard", quantity: 3, price: 79.99 }, { id: "6", name: "Mouse Pad XL", quantity: 3, price: 24.99 }],
  [{ id: "7", name: "AirPods Pro", quantity: 2, price: 249 }],
  [{ id: "8", name: '4K Monitor 27"', quantity: 1, price: 649 }, { id: "9", name: "HDMI Cable", quantity: 2, price: 15.99 }],
  [{ id: "10", name: "Mechanical Keyboard", quantity: 1, price: 169 }],
  [{ id: "11", name: "Webcam HD", quantity: 1, price: 99.99 }, { id: "12", name: "Ring Light", quantity: 1, price: 39.99 }],
  [{ id: "13", name: "Laptop Stand", quantity: 2, price: 59.99 }]
];
const statuses = ["pending", "in_progress", "completed", "cancelled", "pending", "in_progress", "completed", "pending"];
const priorities = ["low", "medium", "high", "urgent", "medium", "high", "low", "medium"];
function generateSeedOrders() {
  return sampleCustomers.map((customer, i) => {
    const items = sampleItems[i];
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date(Date.now() - daysAgo * 864e5).toISOString();
    const status = statuses[i];
    const timeline = defaultTimeline();
    if (status === "in_progress") {
      timeline[1].completed = true;
      timeline[1].date = date;
    }
    if (status === "completed") {
      timeline.forEach((s) => {
        s.completed = true;
        s.date = date;
      });
    }
    return { id: `ORD-${String(1001 + i)}`, customer, status, priority: priorities[i], items, amount: Math.round(amount * 100) / 100, date, timeline, notes: [] };
  });
}
function generateSeedNotifications() {
  return [
    { id: "n1", type: "new_order", title: "New Order Received", message: "Order ORD-1008 placed by Robert Taylor", read: false, date: ((new Date())).toISOString(), orderId: "ORD-1008" },
    { id: "n2", type: "status_change", title: "Order Shipped", message: "Order ORD-1003 has been shipped", read: false, date: new Date(Date.now() - 36e5).toISOString(), orderId: "ORD-1003" },
    { id: "n3", type: "cancellation", title: "Order Cancelled", message: "Order ORD-1004 was cancelled by customer", read: true, date: new Date(Date.now() - 864e5).toISOString(), orderId: "ORD-1004" },
    { id: "n4", type: "info", title: "System Update", message: "Dashboard analytics have been updated", read: true, date: new Date(Date.now() - 1728e5).toISOString() }
  ];
}
const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : generateSeedOrders();
  });
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : generateSeedNotifications();
  });
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  const addNotification = useCallback((n) => {
    setNotifications((prev) => [{ ...n, id: `n-${Date.now()}`, date: ((new Date())).toISOString(), read: false }, ...prev]);
  }, []);
  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      date: ((new Date())).toISOString(),
      timeline: defaultTimeline()
    };
    setOrders((prev) => [newOrder, ...prev]);
    addNotification({ type: "new_order", title: "New Order Created", message: `Order ${newOrder.id} placed by ${newOrder.customer.name}`, orderId: newOrder.id });
  }, [addNotification]);
  const updateOrder = useCallback((id, updates) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, ...updates } : o));
    if (updates.status) {
      addNotification({ type: "status_change", title: "Status Updated", message: `Order ${id} status changed to ${updates.status}`, orderId: id });
    }
  }, [addNotification]);
  const cancelOrder = useCallback((id) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "cancelled" } : o));
    addNotification({ type: "cancellation", title: "Order Cancelled", message: `Order ${id} has been cancelled`, orderId: id });
  }, [addNotification]);
  const updateTimelineStep = useCallback((orderId, stepId, completed) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const timeline = o.timeline.map((s) => s.id === stepId ? { ...s, completed, date: completed ? ((new Date())).toISOString() : void 0 } : s);
      return { ...o, timeline };
    }));
  }, []);
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <OrderContext.Provider
      value={{ orders, notifications, addOrder, updateOrder, cancelOrder, updateTimelineStep, markNotificationRead, markAllNotificationsRead, unreadCount }}>
      {children}
    </OrderContext.Provider>
  );
};
const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
export {
  OrderProvider,
  useOrders
};
