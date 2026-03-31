import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  orders as initialOrders,
  notifications as initialNotifications,
} from '../data/orders'

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

// ─── ID generators ────────────────────────────────────────────────────────────
const generateOrderId = () => {
  const num = Math.floor(Math.random() * 9000) + 1000
  return `ORD-${num}`
}

const generateId = (arr) => (arr.length > 0 ? Math.max(...arr.map((x) => x.id)) + 1 : 1)

// ─── Build a notification object ──────────────────────────────────────────────
const buildNotification = ({ type, title, message, orderId = null }) => ({
  id: Date.now(),
  type,
  title,
  message,
  orderId,
  read: false,
  createdAt: new Date().toISOString(),
})

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const localData = localStorage.getItem('app_orders')
      return localData ? JSON.parse(localData) : initialOrders
    } catch (err) {
      console.error('Error parsing orders from localStorage', err)
      return initialOrders
    }
  })

  const [notifications, setNotifications] = useState(() => {
    try {
      const localData = localStorage.getItem('app_notifications')
      return localData ? JSON.parse(localData) : initialNotifications
    } catch (err) {
      console.error('Error parsing notifications from localStorage', err)
      return initialNotifications
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('app_orders', JSON.stringify(orders))
    } catch (err) {
      console.error('Error saving orders to localStorage', err)
    }
  }, [orders])

  useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notifications))
    } catch (err) {
      console.error('Error saving notifications to localStorage', err)
    }
  }, [notifications])

  // ── Internal: push a notification ──────────────────────────────────────────
  const pushNotification = useCallback((notif) => {
    setNotifications((prev) => [buildNotification(notif), ...prev])
  }, [])

  // ── Add Order ───────────────────────────────────────────────────────────────
  const addOrder = useCallback((formData) => {
    const newOrder = {
      id:              generateId(orders),
      orderId:         generateOrderId(),
      status:          formData.status       || 'pending',
      priority:        formData.priority     || 'medium',
      notes:           formData.notes        || '',
      customerName:    formData.customerName,
      customerEmail:   formData.customerEmail,
      customerPhone:   formData.customerPhone,
      shippingAddress: formData.shippingAddress,
      assignedAgent:   formData.assignedAgent || '',
      items:           formData.items.filter((i) => i.name.trim()),
      totalAmount:     formData.items.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0
      ),
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status:    'placed',
          completed: true,
          timestamp: new Date().toISOString(),
          note:      'Order received',
        },
        { status: 'processing', completed: false, timestamp: null },
        { status: 'shipped',    completed: false, timestamp: null },
        { status: 'delivered',  completed: false, timestamp: null },
      ],
    }

    setOrders((prev) => [newOrder, ...prev])

    pushNotification({
      type:    'new_order',
      title:   'New order created',
      message: `Order ${newOrder.orderId} has been placed by ${newOrder.customerName} for ₹${newOrder.totalAmount.toLocaleString('en-IN')}.`,
      orderId: newOrder.orderId,
    })

    return newOrder
  }, [orders, pushNotification])

  // ── Update Order ─────────────────────────────────────────────────────────── 
  const updateOrder = useCallback((id, formData) => {
    let updatedOrder = null

    setOrders((prev) =>
      prev.map((o) => {
        if (String(o.id) !== String(id)) return o
        updatedOrder = {
          ...o,
          status:          formData.status,
          priority:        formData.priority,
          notes:           formData.notes        || '',
          customerName:    formData.customerName,
          customerEmail:   formData.customerEmail,
          customerPhone:   formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          assignedAgent:   formData.assignedAgent || '',
          items:           formData.items.filter((i) => i.name.trim()),
          totalAmount:     formData.items.reduce(
            (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0
          ),
        }
        return updatedOrder
      })
    )

    if (updatedOrder) {
      pushNotification({
        type:    'status_change',
        title:   'Order updated',
        message: `Order ${updatedOrder.orderId} has been updated successfully.`,
        orderId: updatedOrder.orderId,
      })
    }

    return updatedOrder
  }, [pushNotification])

  // ── Cancel Order ─────────────────────────────────────────────────────────── 
  const cancelOrder = useCallback((id) => {
    let cancelled = null

    setOrders((prev) =>
      prev.map((o) => {
        if (String(o.id) !== String(id)) return o
        cancelled = { ...o, status: 'cancelled' }
        return cancelled
      })
    )

    if (cancelled) {
      pushNotification({
        type:    'alert',
        title:   'Order cancelled',
        message: `Order ${cancelled.orderId} for ${cancelled.customerName} has been cancelled.`,
        orderId: cancelled.orderId,
      })
    }
  }, [pushNotification])

  // ── Mark notification read ────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  // ── Mark all notifications read ───────────────────────────────────────────
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  // ── Unread count (used by Topbar bell badge) ──────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length

  // ─── Context value ─────────────────────────────────────────────────────────
  const value = {
    // State
    orders,
    notifications,
    unreadCount,

    // Order actions
    addOrder,
    updateOrder,
    cancelOrder,

    // Notification actions
    markNotificationRead,
    markAllNotificationsRead,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext