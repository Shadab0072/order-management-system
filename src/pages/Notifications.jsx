import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, BellOff, CheckCheck, RefreshCw,
  ShoppingBag, AlertTriangle, Truck, BarChart2, Info,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { notifications as rawNotifications } from '../data/orders'
import { formatDate, formatTime } from '../utils/formatters'

// ─── Notification type config ─────────────────────────────────────────────────
const TYPE_CONFIG = {
  new_order:      { icon: ShoppingBag, color: '#6366f1', bg: '#6366f120', label: 'New Order' },
  status_change:  { icon: RefreshCw,   color: '#3b82f6', bg: '#3b82f620', label: 'Status Update' },
  alert:          { icon: AlertTriangle,color: '#f59e0b', bg: '#f59e0b20', label: 'Alert' },
  delivered:      { icon: Truck,        color: '#10b981', bg: '#10b98120', label: 'Delivered' },
  report:         { icon: BarChart2,    color: '#8b5cf6', bg: '#8b5cf620', label: 'Report' },
  default:        { icon: Info,         color: '#6b7280', bg: '#6b728020', label: 'Info' },
}

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default

// ─── Group notifications by date ──────────────────────────────────────────────
const groupByDate = (items) => {
  const today     = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const fmt = (d) => new Date(d).toDateString()

  const groups = {}
  items.forEach((n) => {
    const d = new Date(n.createdAt)
    let label
    if (fmt(d) === fmt(today))     label = 'Today'
    else if (fmt(d) === fmt(yesterday)) label = 'Yesterday'
    else label = formatDate(n.createdAt)

    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  })

  // Preserve order: Today → Yesterday → older dates
  const ORDER = ['Today', 'Yesterday']
  const sorted = Object.keys(groups).sort((a, b) => {
    const ai = ORDER.indexOf(a)
    const bi = ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return new Date(b) - new Date(a)
  })

  return sorted.map((label) => ({ label, items: groups[label] }))
}

// ─── Single Notification Card ─────────────────────────────────────────────────
const NotificationCard = ({ notification, onMarkRead, onNavigate, isDark }) => {
  const cfg  = getTypeConfig(notification.type)
  const Icon = cfg.icon

  return (
    <div
      onClick={() => notification.orderId && onNavigate(notification.orderId)}
      className={`
        relative flex gap-4 px-5 py-4 rounded-xl border transition-all duration-150
        ${notification.orderId ? 'cursor-pointer' : ''}
        ${!notification.read
          ? isDark
            ? 'border-indigo-800 bg-indigo-950/40 hover:bg-indigo-950/60'
            : 'border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50'
          : isDark
            ? 'border-gray-800 bg-gray-900 hover:bg-gray-800/60'
            : 'border-gray-100 bg-white hover:bg-gray-50'
        }
      `}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
      )}

      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={16} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className={`text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {notification.title}
          </p>
          <span className={`text-xs flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {formatTime(notification.createdAt)}
          </span>
        </div>

        <p className={`text-sm mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {notification.message}
        </p>

        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Type badge */}
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>

          {/* Order link */}
          {notification.orderId && (
            <span className={`text-xs font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>
              {notification.orderId}
            </span>
          )}

          {/* Mark as read */}
          {!notification.read && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id) }}
              className={`text-xs font-medium transition-colors ml-auto ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ filtered, isDark }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {filtered ? <BellOff size={28} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                : <Bell    size={28} className={isDark ? 'text-gray-600' : 'text-gray-400'} />}
    </div>
    <div className="text-center">
      <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {filtered ? 'No unread notifications' : 'All caught up!'}
      </p>
      <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        {filtered ? 'Switch to "All" to see your history' : "You have no notifications yet"}
      </p>
    </div>
  </div>
)

// ─── Notifications Page ───────────────────────────────────────────────────────
const Notifications = () => {
  const { isDark } = useTheme()
  const navigate   = useNavigate()

  const [items, setItems]       = useState(rawNotifications)
  const [filter, setFilter]     = useState('all') // 'all' | 'unread'

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const filtered = useMemo(
    () => filter === 'unread' ? items.filter((n) => !n.read) : items,
    [items, filter]
  )

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Navigate to orders list — in real app resolve orderId → numeric id and go to /orders/:id
  const handleOrderNavigate = () => navigate('/orders')

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Bell size={18} className={isDark ? 'text-indigo-400' : 'text-indigo-500'} />
          <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div className={`flex gap-1 p-1 rounded-xl w-fit ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {['all', 'unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-150
              ${filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className={`ml-1.5 text-xs ${filter === 'unread' ? 'opacity-80' : 'text-indigo-400'}`}>
                ({unreadCount})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Grouped Notifications ── */}
      {groups.length === 0 ? (
        <EmptyState filtered={filter === 'unread'} isDark={isDark} />
      ) : (
        groups.map((group) => (
          <div key={group.label} className="space-y-2">
            {/* Date label */}
            <p className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              {group.label}
            </p>

            {/* Cards */}
            <div className="space-y-2">
              {group.items.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={markRead}
                  onNavigate={handleOrderNavigate}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Notifications