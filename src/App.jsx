import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import Offline from "@/pages/Offline";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  DashboardPageSkeleton,
  KanbanPageSkeleton,
  NotFoundPageSkeleton,
  NotificationsPageSkeleton,
  OrderDetailsPageSkeleton,
  OrderFormPageSkeleton,
  OrderListPageSkeleton
} from "@/components/skeleton";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const OrderList = lazy(() => import("@/pages/OrderList"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const OrderForm = lazy(() => import("@/pages/OrderForm"));
const KanbanBoard = lazy(() => import("@/pages/KanbanBoard"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const online = useOnlineStatus();

  if (!online) {
    return <Offline />;
  }

  return (
    <OrderProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<DashboardPageSkeleton />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/orders"
            element={
              <Suspense fallback={<OrderListPageSkeleton />}>
                <OrderList />
              </Suspense>
            }
          />
          <Route
            path="/orders/new"
            element={
              <Suspense fallback={<OrderFormPageSkeleton />}>
                <OrderForm />
              </Suspense>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <Suspense fallback={<OrderDetailsPageSkeleton />}>
                <OrderDetails />
              </Suspense>
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <Suspense fallback={<OrderFormPageSkeleton />}>
                <OrderForm />
              </Suspense>
            }
          />
          <Route
            path="/kanban"
            element={
              <Suspense fallback={<KanbanPageSkeleton />}>
                <KanbanBoard />
              </Suspense>
            }
          />
          <Route
            path="/notifications"
            element={
              <Suspense fallback={<NotificationsPageSkeleton />}>
                <Notifications />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <Suspense fallback={<NotFoundPageSkeleton />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </OrderProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
