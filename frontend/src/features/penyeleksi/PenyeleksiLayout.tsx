import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PenyeleksiSidebar from "./PenyeleksiSidebar";
import PenyeleksiHeader from "./PenyeleksiHeader";

const PenyeleksiLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <PenyeleksiSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <PenyeleksiHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PenyeleksiLayout;
