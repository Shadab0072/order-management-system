import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Bell,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ShoppingBag,
  },
  {
    label: 'Create Order',
    path: '/orders/create',
    icon: PlusCircle,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
  },
]

const Sidebar = ({ collapsed, onToggle }) => {
  const { isDark } = useTheme()
  const location = useLocation()

  return (
    <aside
      className={`
        relative flex flex-col h-full
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        border-r
      `}
    >
      {/* Logo */}
      <div
        className={`
          flex items-center gap-3 px-4 py-5
          ${isDark ? 'border-gray-800' : 'border-gray-200'}
          border-b
        `}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Package size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span
            className={`font-bold text-base tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            OrderFlow
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          // Active check: exact for dashboard, startsWith for others
          const isActive =
            path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(path)

          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-150 group relative
                ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div
                  className={`
                    absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium
                    pointer-events-none opacity-0 group-hover:opacity-100
                    transition-opacity duration-150 whitespace-nowrap z-50
                    ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}
                  `}
                >
                  {label}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          absolute -right-3 top-20
          w-6 h-6 rounded-full border flex items-center justify-center
          transition-colors duration-150 z-10
          ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'
          }
        `}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Bottom: version tag */}
      {!collapsed && (
        <div
          className={`px-4 py-3 text-xs ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          v1.0.0
        </div>
      )}
    </aside>
  )
}

export default Sidebar