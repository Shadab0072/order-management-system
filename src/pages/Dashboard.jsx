import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ShoppingBag,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { weeklyData } from '../data/orders'
import { computeDashboardStats } from '../utils/orderHelpers'
import { formatCurrency, formatDate } from '../utils/formatters'
import { statusConfig, priorityConfig } from '../constants/status'

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, delta }) => {
  const { isDark } = useTheme()
  return (
    <div
      className={`
        rounded-xl p-5 flex flex-col gap-4 border
        transition-shadow hover:shadow-lg
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
        {delta !== undefined && (
          <p className="text-xs mt-1 text-emerald-500 flex items-center gap-1">
            <TrendingUp size={12} />
            {delta}% from last week
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Custom Tooltip for Bar Chart ─────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className={`px-3 py-2 rounded-lg text-sm shadow-lg border ${
        isDark
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <p className="font-medium">{label}</p>
      <p className="text-indigo-400 mt-0.5">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

// ─── Recent Orders Row ────────────────────────────────────────────────────────
const OrderRow = ({ order, onClick, isDark }) => {
  const status = statusConfig[order.status]
  const priority = priorityConfig[order.priority]

  return (
    <tr
      onClick={() => onClick(order.id)}
      className={`cursor-pointer transition-colors duration-150 ${
        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
      }`}
    >
      <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
        {order.orderId}
      </td>
      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {order.customerName}
      </td>
      <td className="px-4 py-3">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: priority.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priority.color }} />
          {priority.label}
        </span>
      </td>
      <td className={`px-4 py-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {formatCurrency(order.totalAmount)}
      </td>
      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {formatDate(order.createdAt)}
      </td>
    </tr>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { orders } = useApp()

  const stats = useMemo(() => computeDashboardStats(orders), [orders])

  const statCards = [
    { label: 'Total Orders',  value: stats.total,       icon: ShoppingBag,  color: '#6366f1', delta: 12 },
    { label: 'Pending',       value: stats.pending,     icon: Clock,        color: '#f59e0b' },
    { label: 'In Progress',   value: stats.in_progress, icon: Loader2,      color: '#3b82f6' },
    { label: 'Completed',     value: stats.completed,   icon: CheckCircle2, color: '#10b981', delta: 8 },
    { label: 'Cancelled',     value: stats.cancelled,   icon: XCircle,      color: '#ef4444' },
  ]

  const donutData = [
    { name: 'Pending',     value: stats.pending,     color: '#f59e0b' },
    { name: 'In Progress', value: stats.in_progress, color: '#3b82f6' },
    { name: 'Completed',   value: stats.completed,   color: '#10b981' },
    { name: 'Cancelled',   value: stats.cancelled,   color: '#ef4444' },
  ]

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [orders]
  )

  const gridColor = isDark ? '#1f2937' : '#f3f4f6'
  const axisColor = isDark ? '#4b5563' : '#9ca3af'

  return (
    <div className="space-y-6">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Bar Chart */}
        <div className={`xl:col-span-2 rounded-xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Weekly Revenue
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={28}>
              <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomBarTooltip isDark={isDark} />} cursor={{ fill: gridColor }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className={`rounded-xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order Status
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {donutData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  background: isDark ? '#1f2937' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  color: isDark ? '#fff' : '#111',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.name}</span>
                </div>
                <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs text-indigo-500 hover:text-indigo-400 font-medium transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-xs uppercase tracking-wider ${isDark ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                {['Order ID', 'Customer', 'Status', 'Priority', 'Amount', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {recentOrders.map((order) => (
                <OrderRow key={order.id} order={order} isDark={isDark} onClick={(id) => navigate(`/orders/${id}`)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Dashboard