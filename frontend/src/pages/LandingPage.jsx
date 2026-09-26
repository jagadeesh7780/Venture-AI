import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  MapPin,
  TrendingUp,
  Wrench,
  Truck,
  FileText,
  Boxes,
  CheckCircle2,
  Phone,
  Mail,
  Compass,
  Building,
  Zap,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Send,
  User,
  LogOut,
  HelpCircle,
  IndianRupee,
} from 'lucide-react';

export const LandingPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* 1. FIXED TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo with Orange and White typography */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  VENTURE
                </span>
                <span className="font-black text-xl tracking-tight text-orange-500">
                  AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wide mt-0.5">
                Autonomous Feasibility & Operations Engine
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right User State / Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-slate-900 hover:bg-orange-100 transition-all shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-black text-slate-800 hidden sm:inline">
                    {user?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>

                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/login?tab=signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Start for free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Inspired by 1st Image Layout) */}
      <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-[#F8FAFC]">
        {/* Subtle Ambient Shapes */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black shadow-xs">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>VENTURE AI • Autonomous Enterprise Engine</span>
              </div>

              {/* Massive Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                GROW YOUR BUSINESS WITH{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  OUR AUTONOMOUS AI!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
                Model, simulate, and launch your enterprise with Google Maps geocoding, RAG regulatory intelligence, deterministic Python financial algorithms, and interactive spatial digital blueprints.
              </p>

              {/* CTA Action Strip */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login?tab=signup'}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={isAuthenticated ? '/dashboard/create' : '/login'}
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-orange-500" />
                  <span>Launch Business Twin</span>
                </Link>
              </div>

              {/* Key Platform Counter Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-black text-slate-900">9 Nodes</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Multi-Agent Intelligence</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-600">100+ MSME</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Industry Standard Catalogs</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">₹ INR</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">Deterministic CapEx Math</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">100% Verified</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">RAG Regulatory Grounding</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic Presentation Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Backdrop Card */}
                <div className="relative rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5">
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs">
                        AI
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Autonomous Enterprise Terminal</div>
                        <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Live Geocoded & Mathematical Sync
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-800">
                      ₹ INR MODE
                    </span>
                  </div>

                  {/* Simulated Telemetry Cards */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="text-xs font-black text-slate-900">CapEx Investment & Payback</div>
                          <div className="text-[11px] text-slate-600">Break-even at ~16.5 months</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-orange-600">₹10,00,000</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <div>
                          <div className="text-xs font-black text-slate-900">Spatial Catchment Density</div>
                          <div className="text-[11px] text-slate-600">Google Maps GIS verified radius</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600">High Foot-Traffic</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Wrench className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="text-xs font-black text-slate-900">Machinery & Asset Manifest</div>
                          <div className="text-[11px] text-slate-600">MSME & NSIC Grounded Catalog</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-orange-600">12 Required</span>
                    </div>
                  </div>

                  {/* Bottom Agent Badge */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold">RAG Knowledge Retrieval Active</span>
                    </div>
                    <span className="text-[10px] font-black bg-white text-orange-700 px-2 py-0.5 rounded-full">
                      21 Regulatory Chunks
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION (`#about`) */}
      <section id="about" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading Banner in Orange */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black mb-2 shadow-xs">
                <Building className="w-3.5 h-3.5 text-white" />
                <span>About Venture AI Platform</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Empowering Founders & MSMEs with Computational Certainty
              </h2>
              <p className="text-sm text-orange-100 mt-2 max-w-2xl font-medium leading-relaxed">
                Venture AI replaces guesswork with a deterministic multi-agent pipeline that evaluates market feasibility, location viability, operational machinery, and statutory compliance in seconds.
              </p>
            </div>
            <Link
              to="/login?tab=signup"
              className="px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </Link>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 font-black">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">9 Multi-Agent Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Orchestrated via specialized agents covering concept classification, spatial GIS geocoding, competitor density, equipment matching, and financial simulations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 font-black">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Deterministic INR Math</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unlike vague LLM summaries, our Python modeling engine computes exact 12-month revenue curves, break-even milestones, gross margins, and CapEx in INR (`₹`).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">MSME & RAG Grounded</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Integrates MSME Project Profiles, NSIC Machinery Directory, and ChromaDB vector knowledge for authentic licensing (GST, FSSAI, Trade License) and subsidies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTIONS & FEATURES SECTION (`#features`) */}
      <section id="features" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Complete Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything You Need to Plan & Launch Your Venture
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              A comprehensive intelligence deck covering physical operations, spatial footprints, financials, and statutory roadmaps.
            </p>
          </div>

          {/* 6 Rich Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Instant MSME Machinery Manifest</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Instant 0ms latency access to pre-mapped operational machinery, equipment costs, and NSIC standards for over 100+ commercial industries.
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>MSME Schema Ready</span> • <span>In-House vs Procure</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">GIS Catchment & Competitor Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Interactive spatial maps locating direct competitors, consumer density, transit hubs, and commercial zoning around your exact address.
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>Spatial Markers</span> • <span>Foot Traffic Rating</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Deterministic Financial Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Accurate 12-month cash flows, break-even timelines, gross/net margins, and scenario modeling (Conservative, Base, Optimistic) in INR (`₹`).
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>100% INR Projections</span> • <span>Payback Curves</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Operations Blueprint Matrix</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Facility floor plans, equipment zones, power allocations, square footage utilization, and spatial nodes across interior operational floors.
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>Architectural Layout</span> • <span>Node Telemetry</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Local Sourcing & Vendor Network</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Live discovery of verified industrial dealers, machinery suppliers, and wholesale raw material distributors situated nearby your facility.
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>Distance Radii</span> • <span>Lead-Time Estimates</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-orange-300 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">RAG Compliance & Printable Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Step-by-step statutory licensing roadmap (Udyam, GST, FSSAI, Pollution Board) and one-click printable executive feasibility reports.
              </p>
              <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <span>RAG Verified</span> • <span>Executive PDF Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION (`#pricing`) */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading & Billing Toggle */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Simple & Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Invest in Feasibility Before Spending Millions
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Choose the plan that fits your venture stage. All plans include deterministic calculations in INR (`₹`).
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-2 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (3 Tiers in INR) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Starter */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-6 hover:border-orange-300 transition-all shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter / Solo Venture
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '₹1,999' : '₹1,599'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Ideal for first-time founders modeling a single commercial storefront or MSME enterprise.
                </p>

                <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 Active Business Digital Twin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant MSME Catalog & Machinery Manifest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard GIS Geocoding Catchment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>12-Month Financial Projections (INR)</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Start Starter Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Plan 2: Professional (Featured Orange Card) */}
            <div className="p-8 rounded-3xl bg-white border-2 border-orange-500 shadow-xl relative flex flex-col justify-between space-y-6 transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Growth & Commercial Expansion
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '₹4,999' : '₹3,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  For growing ventures, franchise owners, and multi-location commercial operators.
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-800 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span><strong>5 Active Venture Twins</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span><strong>Full 9 Multi-Agent Intelligence Pipeline</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Local Machinery Dealers & Sourcing Hubs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Facility Floor Blueprint & Node Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Executive Printable PDF Report Export</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Get Growth Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-6 hover:border-orange-300 transition-all shadow-xs">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enterprise / Industrial
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    {billingCycle === 'monthly' ? '₹14,999' : '₹11,999'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  For industrial plants, franchise networks, venture studios, and institutional investors.
                </p>

                <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Unlimited Venture Twins</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bespoke Machinery Catalog Grounding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom RAG Regulatory & Subsidy Tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated Solution Architect & 24/7 Priority SLA</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Contact Enterprise Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT US SECTION (`#contact`) */}
      <section id="contact" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Let's Discuss Your Next Venture
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Have questions regarding custom industry catalogs, API integration, or enterprise deployment? Our engineering team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Form Title Banner */}
              <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white shadow-xs">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-white" />
                  Send an Inquiry
                </h3>
                <p className="text-xs text-orange-100 font-medium">We typically reply within 2 business hours.</p>
              </div>

              {contactSubmitted && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your message has been received. A representative will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Business Concept / Query
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us about the venture you are modeling or questions you have..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            </div>

            {/* Right: Direct Information & Corporate Location Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-orange-600 mb-1">
                    Direct Contact Channels
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Venture AI Headquarters</h3>
                </div>

                <div className="space-y-4 text-xs text-slate-700 font-medium">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <Phone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Phone & Hotline:</div>
                      <div className="text-slate-600 mt-0.5">+91 98400 12030 / +91 80 4920 1100</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Email Address:</div>
                      <div className="text-slate-600 mt-0.5">contact@ventureai.in / support@ventureai.in</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <Compass className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Headquarters Address:</div>
                      <div className="text-slate-600 mt-0.5">Venture AI Cyber Park, 4th Floor, Tech Innovation Corridor, Bengaluru / Chennai, India</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Trust Strip */}
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1 text-xs">
                <div className="font-black text-orange-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Enterprise Security & Data Protection</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  All enterprise inputs and financial models are encrypted in compliance with Indian IT Act standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-xs">
                  AI
                </div>
                <span className="font-black text-lg text-slate-900">
                  VENTURE <span className="text-orange-500">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Autonomous Feasibility & Operations Engine powered by 9 multi-agent neural pipelines, GIS geocoding, and MSME frameworks.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 uppercase tracking-wider">Navigation</div>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-orange-600 cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-orange-600 cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-orange-600 cursor-pointer">Solutions</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-orange-600 cursor-pointer">Pricing Plans</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-orange-600 cursor-pointer">Contact Us</button></li>
              </ul>
            </div>

            {/* Col 3: Product Platform */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 uppercase tracking-wider">Platform Hub</div>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li><Link to="/login" className="hover:text-orange-600">User Sign In</Link></li>
                <li><Link to="/login?tab=signup" className="hover:text-orange-600">Register Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-orange-600">Dashboard Workspace</Link></li>
                <li><Link to="/dashboard/create" className="hover:text-orange-600">Create Venture Twin</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Standards */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-slate-900 uppercase tracking-wider">Standards</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Calibrated against MSME Project Profiles, NSIC Machinery Directory & OpenStreetMap GIS protocols.
              </p>
              <div className="text-[11px] font-mono text-orange-600 font-bold pt-1">
                Currency: INR (₹) Grounded
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div>
              © {new Date().getFullYear()} VENTURE AI Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="hover:text-orange-600 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-orange-600 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-orange-600 cursor-pointer">Security Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
