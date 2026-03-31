import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { notifications } from '../../data/orders'

// Map route paths to readable page titles
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/orders': 'Orders',
  '/orders/create': 'Create Order',
  '/notifications': 'Notifications',
}

const getPageTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/orders/edit/')) return 'Edit Order'
  if (pathname.startsWith('/orders/')) return 'Order Detail'
  return 'OrderFlow'
}

const Topbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.read).length
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header
      className={`
        flex items-center justify-between
        px-6 py-4 border-b
        ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
      `}
    >
      {/* Page Title */}
      <h1
        className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        {pageTitle}
      </h1>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search button — navigates to /orders with focus */}
        <button
          onClick={() => navigate('/orders')}
          className={`
            p-2 rounded-lg transition-colors duration-150
            ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          title="Search Orders"
        >
          <Search size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-colors duration-150
            ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className={`
            relative p-2 rounded-lg transition-colors duration-150
            ${
              isDark
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="ml-2 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold select-none cursor-pointer">
          A
        </div>
      </div>
    </header>
  )
}

export default Topbar