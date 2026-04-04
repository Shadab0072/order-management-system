import { useState } from "react";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/cn";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={cn(
          "flex-1 flex flex-col transition-[margin] duration-300 min-w-0",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
        )}>
        <Topbar onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default AppLayout;