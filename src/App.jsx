import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import OrderList from './pages/OrderList'
import OrderDetail from './pages/OrderDetail'
import CreateOrder from './pages/CreateOrder'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/orders"          element={<OrderList />} />
          {/* /orders/create MUST be before /orders/:id to avoid "create" being treated as an id */}
          <Route path="/orders/create"   element={<CreateOrder />} />
          <Route path="/orders/edit/:id" element={<CreateOrder />} />
          <Route path="/orders/:id"      element={<OrderDetail />} />
          <Route path="/notifications"   element={<Notifications />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App