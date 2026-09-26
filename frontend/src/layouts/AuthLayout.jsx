import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Phone, Mail, Globe, Home, TrendingUp } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#0A1118] text-white">
      {/* Background Image: Office Team Collaborating with Dark Gradient Overlay (Exact 2nd Image) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-100 filter brightness-65 contrast-105"
        style={{
          backgroundImage: "url('/assets/login-team.jpg')",
        }}
      />
      {/* Subtle Dark / Deep Navy Tint Overlay for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/70 z-0 backdrop-blur-[1px]" />

      {/* TOP HEADER BAR (Exact 2nd Image: Home, About Us, Help, Logo on top right) */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base font-semibold text-white/90">
          <Link to="/" className="hover:text-[#00F2DE] transition-colors">
            Home
          </Link>
          <Link to="/#about" className="hover:text-[#00F2DE] transition-colors">
            About Us
          </Link>
          <Link to="/#contact" className="hover:text-[#00F2DE] transition-colors">
            Help
          </Link>
        </nav>

        {/* Right Brand Logo: Ingoude Company / Venture AI with Growth Bar Graphic */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-[#00F2DE] transition-colors">
            Ingoude Company
          </span>
          <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white">
            {/* Minimal Growth Chart Icon matching the reference */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-6" />
              <path d="M16 10h4v4" />
            </svg>
          </div>
        </Link>
      </header>

      {/* CENTER / MAIN CONTENT (Outlet renders the floating Cyan Login Card) */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-10 py-6 my-auto flex flex-col items-center lg:items-end justify-center">
        <Outlet />
      </main>

      {/* BOTTOM CONTACT INFO STRIP (Exact 2nd Image Layout with Circular Badges) */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-white/90 pt-4 border-t border-white/15">
          {/* Phone */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-[#0B2545] shrink-0 shadow-md">
              <Phone className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">Phone</div>
              <div className="text-xs sm:text-sm font-semibold text-white tracking-wide">+123-456-7890</div>
            </div>
          </div>

          {/* E-Mail */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-[#0B2545] shrink-0 shadow-md">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">E-Mail</div>
              <div className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate max-w-[160px]">
                hello@reallygreatsite.com
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-[#0B2545] shrink-0 shadow-md">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">Website</div>
              <div className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate max-w-[160px]">
                www.reallygreatsite.com
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center text-[#0B2545] shrink-0 shadow-md">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">Address</div>
              <div className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                123 Anywhere St., Any City
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
