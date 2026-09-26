import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import Logo from './Logo';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* App Branding & Logo (Orange & White) */}
      <div className="flex items-center gap-3">
        <Logo size="md" subtitle="Autonomous Feasibility Engine" />
      </div>

      {/* User Profile & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Pill Badge */}
        <div className="flex items-center gap-2.5 bg-orange-50/80 border border-orange-200 py-1.5 px-3 rounded-full shadow-xs">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 line-clamp-1">
              {user?.full_name || 'Innovator'}
            </div>
            <div className="text-[10px] font-medium text-orange-600 line-clamp-1">
              {user?.email || 'user@example.com'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-white bg-white hover:bg-orange-500 border border-orange-300 hover:border-orange-500 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          title="Sign out of your session"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

