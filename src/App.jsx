import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import CreateOrder from './pages/CreateOrder'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* All pages share the Layout (Sidebar + Topbar) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders/edit/:id" element={<CreateOrder />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App