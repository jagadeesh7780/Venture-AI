import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Body Layout (Sidebar + Main Content Viewport) */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
