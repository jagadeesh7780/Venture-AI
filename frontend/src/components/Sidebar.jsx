import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Home,
  PlusCircle,
  Briefcase,
  BarChart3,
  Boxes,
  Settings,
  LogOut,
  Sparkles,
  Bot,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home, exact: true },
    { name: 'Create Business', path: '/dashboard/create', icon: PlusCircle },
    { name: 'My Businesses', path: '/dashboard/businesses', icon: Briefcase },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
    { name: 'Operations Deck', path: '/dashboard/world', icon: Boxes },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0 shadow-xs">
      {/* Navigation List */}
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider px-3 mb-2">
          Platform Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Production AI Platform Badge (Orange & White Theme) */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-3.5">
          <div className="text-xs font-bold text-orange-700 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Google Maps & 9 Agents Active</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            High-precision geocoding, RAG vector retrieval, deterministic Python financials & Operations Matrix.
          </p>
        </div>

        {/* Sidebar Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
