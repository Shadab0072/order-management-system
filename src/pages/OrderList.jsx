import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, SlidersHorizontal, Eye, Pencil, XCircle,
  ChevronUp, ChevronDown, ChevronsUpDown, PackageSearch,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate } from '../utils/formatters'
import { statusConfig, priorityConfig, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/status'
import { applyAllFilters, sortOrders } from '../utils/orderHelpers'

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FilterBar = ({ filters, onChange, isDark }) => {
  const base = `text-sm rounded-lg px-3 py-2 border outline-none transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500'
      : 'bg-white border-gray-200 text-gray-700 focus:border-indigo-400'
  }`
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-48">
        <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <input type="text" placeholder="Search orders, customers…" value={filters.search}
          onChange={(e) => onChange('search', e.target.value)} className={`${base} pl-9 w-full`} />
      </div>
      <select value={filters.status} onChange={(e) => onChange('status', e.target.value)} className={`${base} cursor-pointer`}>
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <select value={filters.priority} onChange={(e) => onChange('priority', e.target.value)} className={`${base} cursor-pointer`}>
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>
      <input type="date" value={filters.dateFrom} onChange={(e) => onChange('dateFrom', e.target.value)} className={`${base} cursor-pointer`} />
      <input type="date" value={filters.dateTo} onChange={(e) => onChange('dateTo', e.target.value)} className={`${base} cursor-pointer`} />
      {(filters.search || filters.status || filters.priority || filters.dateFrom || filters.dateTo) && (
        <button onClick={() => onChange('__reset__', null)} className="text-xs text-indigo-500 hover:text-indigo-400 font-medium transition-colors whitespace-nowrap">
          Clear filters
        </button>
      )}
    </div>
  )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronsUpDown size={13} className="opacity-30" />
  return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
}

// ─── Th ──────────────────────────────────────────────────────────────────────
const Th = ({ label, field, sortField, sortDir, onSort, isDark }) => (
  <th onClick={() => field && onSort(field)}
    className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold select-none
      ${field ? 'cursor-pointer' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
    <span className="flex items-center gap-1">
      {label}
      {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
    </span>
  </th>
)

// ─── Order Row ────────────────────────────────────────────────────────────────
const OrderRow = ({ order, isDark, onView, onEdit, onCancel }) => {
  const status = statusConfig[order.status]
  const priority = priorityConfig[order.priority]
  return (
    <tr className={`group relative transition-colors duration-150 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
      <td className={`px-4 py-3.5 text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{order.orderId}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {order.customerName.charAt(0)}
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{order.customerName}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{order.customerEmail}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{ backgroundColor: status.bg, color: status.text }}>{status.label}</span>
      </td>
      <td className="px-4 py-3.5">
        <span className="flex items-center gap-1.5 text-xs font-medium w-fit" style={{ color: priority.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priority.color }} />
          {priority.label}
        </span>
      </td>
      <td className={`px-4 py-3.5 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(order.totalAmount)}</td>
      <td className={`px-4 py-3.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}
      </td>
      <td className={`px-4 py-3.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(order.createdAt)}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button onClick={() => onView(order.id)} title="View"
            className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}>
            <Eye size={14} />
          </button>
          <button onClick={() => onEdit(order.id)} title="Edit"
            className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'}`}>
            <Pencil size={14} />
          </button>
          {order.status !== 'cancelled' && (
            <button onClick={() => onCancel(order.id)} title="Cancel"
              className="p-1.5 rounded-md transition-colors hover:bg-red-500/10 text-gray-400 hover:text-red-500">
              <XCircle size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ isDark }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <PackageSearch size={28} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
    </div>
    <div className="text-center">
      <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No orders found</p>
      <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Try adjusting your search or filters</p>
    </div>
  </div>
)

// ─── Order List Page ──────────────────────────────────────────────────────────
const INITIAL_FILTERS = { search: '', status: '', priority: '', dateFrom: '', dateTo: '' }

const OrderList = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const { orders, cancelOrder } = useApp()
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const filteredOrders = useMemo(() => {
    const filtered = applyAllFilters(orders, filters)
    return sortOrders(filtered, sortField, sortDir)
  }, [orders, filters, sortField, sortDir])

  const handleFilterChange = (key, value) => {
    if (key === '__reset__') return setFilters(INITIAL_FILTERS)
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const handleCancel = (id) => cancelOrder(id)

  const COLUMNS = [
    { label: 'Order ID', field: 'orderId' },
    { label: 'Customer', field: 'customerName' },
    { label: 'Status',   field: 'status' },
    { label: 'Priority', field: 'priority' },
    { label: 'Amount',   field: 'totalAmount' },
    { label: 'Items',    field: null },
    { label: 'Date',     field: 'createdAt' },
    { label: 'Actions',  field: null },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {filteredOrders.length} of {orders.length} orders
        </p>
        <button onClick={() => navigate('/orders/create')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
          + New Order
        </button>
      </div>

      {/* Filters */}
      <div className={`rounded-xl p-4 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <SlidersHorizontal size={13} /> Filters
        </div>
        <FilterBar filters={filters} onChange={handleFilterChange} isDark={isDark} />
      </div>

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-800/60' : 'bg-gray-50'}>
              <tr>
                {COLUMNS.map((col) => (
                  <Th key={col.label} label={col.label} field={col.field}
                    sortField={sortField} sortDir={sortDir} onSort={handleSort} isDark={isDark} />
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={8}><EmptyState isDark={isDark} /></td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <OrderRow key={order.id} order={order} isDark={isDark}
                    onView={(id) => navigate(`/orders/${id}`)}
                    onEdit={(id) => navigate(`/orders/edit/${id}`)}
                    onCancel={handleCancel}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredOrders.length > 0 && (
          <div className={`px-5 py-3 border-t text-xs ${isDark ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
            Showing {filteredOrders.length} result{filteredOrders.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderList