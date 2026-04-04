import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, User, Phone, Mail, MapPin, Package,
  UserCog, Hash, FileText, CheckCircle2, Circle, Clock, Pencil,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate, formatTime } from '../utils/formatters'
import { statusConfig, priorityConfig } from '../constants/status'

// ─── Section Card ─────────────────────────────────────────────────────────────
const Card = ({ title, icon: Icon, children, isDark }) => (
  <div className={`rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
    <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
      <Icon size={15} className={isDark ? 'text-indigo-400' : 'text-indigo-500'} />
      <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
)

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, isDark }) => (
  <div className="flex items-start gap-3">
    <Icon size={14} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
    <div>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
    </div>
  </div>
)

// ─── Timeline ─────────────────────────────────────────────────────────────────
const Timeline = ({ timeline, isDark, onToggleStep }) => {
  const steps = [
    { key: 'placed',     label: 'Order Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped',    label: 'Shipped' },
    { key: 'delivered',  label: 'Delivered' },
  ]

  const timelineMap = useMemo(() => {
    const map = {}
    if (Array.isArray(timeline)) timeline.forEach((t) => { map[t.status] = t })
    return map
  }, [timeline])

  const lastCompletedIndex = steps.reduce(
    (acc, step, i) => (timelineMap[step.key]?.completed ? i : acc), -1
  )

  return (
    <div className="relative">
      {steps.map((step, i) => {
        const entry = timelineMap[step.key]
        const isCompleted = entry?.completed
        const isActive = i === lastCompletedIndex
        const isPast = i < lastCompletedIndex

        return (
          <div key={step.key} className="flex gap-4">
            {/* Icon + connector line */}
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                ${isCompleted
                  ? 'bg-indigo-600 text-white'
                  : isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-600'
                    : 'bg-gray-100 border border-gray-200 text-gray-400'}
                ${isActive ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-transparent' : ''}
              `}>
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 my-1 min-h-8 ${isPast || isActive ? 'bg-indigo-600' : isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* Step content */}
            <div className={`pb-6 flex-1 flex items-start justify-between ${i === steps.length - 1 ? 'pb-0' : ''}`}>
              <div>
                <p className={`text-sm font-semibold ${
                  isCompleted
                    ? isDark ? 'text-white' : 'text-gray-900'
                    : isDark ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {entry?.timestamp && (
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(entry.timestamp)} · {formatTime(entry.timestamp)}
                  </p>
                )}
                {entry?.note && (
                  <p className={`text-xs mt-1 italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {entry.note}
                  </p>
                )}
                {!isCompleted && !entry && (
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>Pending</p>
                )}
              </div>
              <button
                onClick={() => onToggleStep(step.key, !isCompleted)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                  isCompleted
                    ? isDark ? 'bg-indigo-900/40 text-indigo-400 hover:bg-indigo-900/60 border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200'
                    : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border-gray-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-gray-200'
                }`}
              >
                {isCompleted ? 'Pending' : 'Complete'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Order Items ──────────────────────────────────────────────────────────────
const OrderItems = ({ items, totalAmount, isDark }) => (
  <div className="space-y-3">
    {items?.map((item, i) => (
      <div key={i} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            {i + 1}
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.name}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Qty: {item.quantity}</p>
          </div>
        </div>
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>
    ))}
    <div className={`flex justify-between pt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <span className="text-sm font-semibold">Total</span>
      <span className="text-base font-bold text-indigo-500">{formatCurrency(totalAmount)}</span>
    </div>
  </div>
)

// ─── Not Found ────────────────────────────────────────────────────────────────
const NotFound = ({ isDark, onBack }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <Package size={40} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
    <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Order not found</p>
    <button onClick={onBack} className="text-sm text-indigo-500 hover:text-indigo-400 font-medium">← Back to Orders</button>
  </div>
)

// ─── Order Detail Page ────────────────────────────────────────────────────────
const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { orders, updateTimelineStep } = useApp()

  const order = useMemo(() => orders.find((o) => String(o.id) === String(id)), [id, orders])

  if (!order) return <NotFound isDark={isDark} onBack={() => navigate('/orders')} />

  const status = statusConfig[order.status]
  const priority = priorityConfig[order.priority]

  const agentObj = order.agent && typeof order.agent === 'object' ? order.agent : null
  const legacyAgentName = typeof order.assignedAgent === 'string' ? order.assignedAgent.trim() : ''
  const agentDisplayName = agentObj?.name || legacyAgentName
  const agentDisplayRole = agentObj?.role || 'Support Agent'
  const agentDisplayInitials =
    agentObj?.initials ||
    (agentDisplayName
      ? agentDisplayName
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '')
  const agentDisplayId = agentObj?.id

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/orders')}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.orderId}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: status.bg, color: status.text }}>{status.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: priority.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priority.color }} />
                {priority.label}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Created {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/orders/edit/${order.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Pencil size={14} /> Edit Order
        </button>
      </div>

      {/* ── 3-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Col 1: Timeline + Notes */}
        <div className="space-y-5">
          <Card title="Order Timeline" icon={Clock} isDark={isDark}>
            <Timeline 
              timeline={order.timeline} 
              isDark={isDark} 
              onToggleStep={(stepKey, isCompleted) => updateTimelineStep(order.id, stepKey, isCompleted)} 
            />
          </Card>
          {order.notes && (
            <Card title="Notes" icon={FileText} isDark={isDark}>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Col 2: Items */}
        <div>
          <Card title="Order Items" icon={Package} isDark={isDark}>
            <OrderItems items={order.items} totalAmount={order.totalAmount} isDark={isDark} />
          </Card>
        </div>

        {/* Col 3: Customer + Agent */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          <Card title="Customer" icon={User} isDark={isDark}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {order.customerName?.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.customerName}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Customer</p>
                </div>
              </div>
              <div className="space-y-3">
                <InfoRow icon={Mail}   label="Email"   value={order.customerEmail}   isDark={isDark} />
                <InfoRow icon={Phone}  label="Phone"   value={order.customerPhone}   isDark={isDark} />
                <InfoRow icon={MapPin} label="Address" value={order.shippingAddress} isDark={isDark} />
              </div>
            </div>
          </Card>

          <Card title="Assigned Agent" icon={UserCog} isDark={isDark}>
            {agentDisplayName ? (
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 sm:h-12 sm:w-12">
                    {agentDisplayInitials}
                  </div>
                  <div className="min-w-0 space-y-1.5 pt-0.5">
                    <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {agentDisplayName}
                    </p>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {agentDisplayRole}
                    </p>
                  </div>
                </div>
                {agentDisplayId ? (
                  <div className={`border-t pt-4 sm:pt-5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <InfoRow icon={Hash} label="Agent ID" value={agentDisplayId} isDark={isDark} />
                  </div>
                ) : null}
              </div>
            ) : (
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No agent assigned. Edit the order to assign one.
              </p>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}

export default OrderDetail