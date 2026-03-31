
// ─────────────────────────────────────────────
// src/data/orders.js (UPDATED - STANDARDIZED)
// ─────────────────────────────────────────────

export const customers = [
  {
    id: "CUST-001",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210",
    address: "Sector 18, Noida, Uttar Pradesh - 201301",
    avatar: "PS",
    totalOrders: 12,
  },
  {
    id: "CUST-002",
    name: "Rahul Verma",
    email: "rahul.verma@outlook.com",
    phone: "+91 91234 56789",
    address: "Koramangala, Bengaluru, Karnataka - 560034",
    avatar: "RV",
    totalOrders: 7,
  },
  {
    id: "CUST-003",
    name: "Anjali Singh",
    email: "anjali.singh@yahoo.com",
    phone: "+91 87654 32109",
    address: "Banjara Hills, Hyderabad, Telangana - 500034",
    avatar: "AS",
    totalOrders: 3,
  },
  {
    id: "CUST-004",
    name: "Vikram Mehta",
    email: "vikram.mehta@gmail.com",
    phone: "+91 99887 76655",
    address: "Andheri West, Mumbai, Maharashtra - 400053",
    avatar: "VM",
    totalOrders: 19,
  },
  {
    id: "CUST-005",
    name: "Nisha Gupta",
    email: "nisha.gupta@gmail.com",
    phone: "+91 70123 45678",
    address: "Civil Lines, Jaipur, Rajasthan - 302006",
    avatar: "NG",
    totalOrders: 5,
  },
  {
    id: "CUST-006",
    name: "Arjun Nair",
    email: "arjun.nair@gmail.com",
    phone: "+91 80091 23456",
    address: "Kakkanad, Kochi, Kerala - 682030",
    avatar: "AN",
    totalOrders: 8,
  },
  {
    id: "CUST-007",
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    phone: "+91 93456 78901",
    address: "Navrangpura, Ahmedabad, Gujarat - 380009",
    avatar: "SP",
    totalOrders: 14,
  },
  {
    id: "CUST-008",
    name: "Rohan Das",
    email: "rohan.das@gmail.com",
    phone: "+91 62345 67890",
    address: "Salt Lake, Kolkata, West Bengal - 700091",
    avatar: "RD",
    totalOrders: 2,
  },
];

export const agents = [
  { id: "AGT-001", name: "Suraj Patel", avatar: "SU", role: "Senior Agent" },
  { id: "AGT-002", name: "Nimisha Shah", avatar: "NI", role: "Agent" },
  { id: "AGT-003", name: "Rohan Das", avatar: "RO", role: "Agent" },
  { id: "AGT-004", name: "Deepa Menon", avatar: "DE", role: "Junior Agent" },
];

// helper
const mapStage = (stage) => {
  switch (stage) {
    case "Order Placed": return "placed";
    case "Payment Confirmed": return "processing";
    case "Processing": return "processing";
    case "Shipped": return "shipped";
    case "Delivered": return "delivered";
    default: return "placed";
  }
};

const normalizeTimeline = (timeline) =>
  timeline.map((t) => ({
    status: mapStage(t.stage),
    completed: t.status === "done",
    timestamp: t.time,
    note: t.note || "",
  }));

const normalizeItems = (items) =>
  items.map((i) => ({
    name: i.name,
    quantity: i.qty,
    price: i.price,
  }));

export const orders = [
  {
    id: "ORD-001",
    customer: customers[0],
    assignedTo: agents[0],

    customerPhone: customers[0].phone,
    shippingAddress: customers[0].address,
    assignedAgent: agents[0].name,

    status: "in_progress",
    priority: "high",
    createdAt: "2026-03-28T10:32:00",
    updatedAt: "2026-03-30T09:15:00",
    deliveryDate: "2026-04-03",
    amount: 12400,

    items: normalizeItems([
      { name: "Laptop Stand", qty: 1, price: 4200 },
      { name: "USB-C Hub", qty: 2, price: 2900 },
      { name: "Mechanical Keyboard", qty: 1, price: 2400 },
    ]),

    notes: "Customer requested express delivery.",

    timeline: normalizeTimeline([
      { stage: "Order Placed", status: "done", time: "2026-03-28T10:32:00", note: "Order received" },
      { stage: "Payment Confirmed", status: "done", time: "2026-03-28T10:45:00", note: "Payment verified" },
      { stage: "Processing", status: "active", time: "2026-03-29T09:00:00", note: "Preparing items" },
      { stage: "Shipped", status: "pending", time: null, note: "Estimated Apr 1" },
      { stage: "Delivered", status: "pending", time: null, note: "" },
    ]),
  },

  {
    id: "ORD-002",
    customer: customers[1],
    assignedTo: agents[1],

    customerPhone: customers[1].phone,
    shippingAddress: customers[1].address,
    assignedAgent: agents[1].name,

    status: "pending",
    priority: "medium",
    createdAt: "2026-03-27T14:20:00",
    updatedAt: "2026-03-27T14:20:00",
    deliveryDate: "2026-04-05",
    amount: 8750,

    items: normalizeItems([
      { name: "Office Chair", qty: 1, price: 7500 },
      { name: "Desk Lamp", qty: 1, price: 1250 },
    ]),

    notes: "Deliver to back entrance.",

    timeline: normalizeTimeline([
      { stage: "Order Placed", status: "done", time: "2026-03-27T14:20:00" },
      { stage: "Payment Confirmed", status: "done", time: "2026-03-27T14:35:00" },
      { stage: "Processing", status: "pending", time: null },
      { stage: "Shipped", status: "pending", time: null },
      { stage: "Delivered", status: "pending", time: null },
    ]),
  },

  {
    id: "ORD-003",
    customer: customers[2],
    assignedTo: agents[0],

    customerPhone: customers[2].phone,
    shippingAddress: customers[2].address,
    assignedAgent: agents[0].name,

    status: "completed",
    priority: "low",
    createdAt: "2026-03-20T11:00:00",
    updatedAt: "2026-03-25T16:30:00",
    deliveryDate: "2026-03-25",
    amount: 3200,

    items: normalizeItems([
      { name: "Notebook Set", qty: 3, price: 600 },
      { name: "Pen Drive 64GB", qty: 2, price: 700 },
    ]),

    notes: "",

    timeline: normalizeTimeline([
      { stage: "Order Placed", status: "done", time: "2026-03-20T11:00:00" },
      { stage: "Payment Confirmed", status: "done", time: "2026-03-20T11:10:00" },
      { stage: "Processing", status: "done", time: "2026-03-21T09:30:00" },
      { stage: "Shipped", status: "done", time: "2026-03-23T08:00:00" },
      { stage: "Delivered", status: "done", time: "2026-03-25T16:30:00" },
    ]),
  },

  // 👉 Same pattern continues for all remaining orders
];



export const notifications = [
  {
    id: 1,
    type: 'new_order',
    title: 'New order received',
    message: 'Order #ORD-001 has been placed by Rahul Sharma for ₹12,400.',
    orderId: 'ORD-001',
    read: false,
    createdAt: new Date().toISOString(), // today
  },
  {
    id: 2,
    type: 'status_change',
    title: 'Order status updated',
    message: 'Order #ORD-003 has moved from Pending to In Progress.',
    orderId: 'ORD-003',
    read: false,
    createdAt: new Date().toISOString(), // today
  },
  {
    id: 3,
    type: 'alert',
    title: 'High priority order pending',
    message: 'Order #ORD-005 has been pending for over 48 hours. Immediate action required.',
    orderId: 'ORD-005',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // today, 3hrs ago
  },
  {
    id: 4,
    type: 'delivered',
    title: 'Order delivered successfully',
    message: 'Order #ORD-002 has been delivered to the customer.',
    orderId: 'ORD-002',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
  },
  {
    id: 5,
    type: 'status_change',
    title: 'Order shipped',
    message: 'Order #ORD-007 has been dispatched via BlueDart. Expected delivery in 2 days.',
    orderId: 'ORD-007',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
  },
  {
    id: 6,
    type: 'report',
    title: 'Weekly report ready',
    message: 'Your weekly order summary is ready. Total revenue this week: ₹87,500.',
    orderId: null,
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
  },
  {
    id: 7,
    type: 'alert',
    title: 'Payment failed',
    message: 'Payment for Order #ORD-009 failed. Customer has been notified.',
    orderId: 'ORD-009',
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
  },
  {
    id: 8,
    type: 'new_order',
    title: 'Bulk order received',
    message: 'A bulk order #ORD-010 for 15 items worth ₹45,000 has been placed.',
    orderId: 'ORD-010',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // today, 30 mins ago
  },
]

export const weeklyData = [
  { day: "Mon", orders: 18, revenue: 42000 },
  { day: "Tue", orders: 24, revenue: 67000 },
  { day: "Wed", orders: 20, revenue: 51000 },
  { day: "Thu", orders: 31, revenue: 89000 },
  { day: "Fri", orders: 27, revenue: 73000 },
  { day: "Sat", orders: 15, revenue: 31000 },
  { day: "Sun", orders: 11, revenue: 22000 },
];



