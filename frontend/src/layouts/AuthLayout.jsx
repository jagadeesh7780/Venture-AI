import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Database, ShieldCheck, Phone, Mail, Globe, MapPin, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';

export const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-stretch bg-[#F8FAFC] selection:bg-orange-500 selection:text-white">
      {/* LEFT COLUMN: Corporate Visual & Information Panel (Inspired by 2nd Screenshot) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-[#10172A] text-white overflow-hidden">
        {/* Background Image Container with Soft Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 filter blur-[1px] opacity-25"
          style={{
            backgroundImage: "url('/assets/login-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-0" />

        {/* Top Header Navigation on Left Side */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm font-bold text-slate-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link to="/#about" className="hover:text-orange-400 transition-colors">
              About Us
            </Link>
            <Link to="/#features" className="hover:text-orange-400 transition-colors">
              Solutions & Help
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400">
              MongoDB / Chrome DB Mesh Active
            </span>
          </div>
        </div>

        {/* Center Informational Value Prop */}
        <div className="relative z-10 my-auto py-12 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-black shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Autonomous Enterprise Modeling Terminal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Accelerate Your Business Feasibility with AI Precision.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Join hundreds of entrepreneurs modeling CapEx, catchment intelligence, MSME machinery manifests, and 12-month deterministic cashflows.
          </p>
        </div>

        {/* Bottom Corporate Contact Info Strip (Exact Match to 2nd Screenshot) */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Phone</div>
              <div className="font-semibold text-white">+91 98400 12030</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">E-Mail</div>
              <div className="font-semibold text-white">contact@ventureai.in</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Website</div>
              <div className="font-semibold text-white">www.ventureai.in</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Address</div>
              <div className="font-semibold text-white">Innovation Cyber Hub, India</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        {/* Mobile Top Brand (visible on small screens) */}
        <div className="lg:hidden w-full max-w-md mb-6 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <Link to="/" className="text-xs font-bold text-orange-600 hover:underline">
            ← Home
          </Link>
        </div>

        <Outlet />

        {/* Bottom Small Security Note */}
        <div className="mt-8 text-center text-[11px] text-slate-500 font-medium tracking-wide">
          Protected by JWT Session Security & Encrypted Enterprise Database
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
