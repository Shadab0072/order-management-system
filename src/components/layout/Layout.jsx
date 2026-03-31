import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useTheme } from '../../context/ThemeContext'

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isDark } = useTheme()

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        isDark ? 'bg-gray-950' : 'bg-gray-50'
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* React Router renders the matched page here */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout