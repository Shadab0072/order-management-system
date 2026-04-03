import { useState } from "react";
import { Outlet } from "react-router-dom";import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div
        className="flex-1 lg:ml-[240px] flex flex-col transition-all duration-300"
        style={{ minWidth: 0 }}>
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