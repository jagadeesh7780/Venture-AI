import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  const [activeSlide, setActiveSlide] = useState(0);
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
    <div className="min-h-screen bg-[#0D4C92] text-white font-sans selection:bg-[#FFDE59] selection:text-[#0D4C92] flex flex-col overflow-x-hidden">
      {/* 1. TOP NAVIGATION BAR (Exact Match to 1st Reference Image: Larana, Inc. / Home / About Us / Price / Login / Start for free) */}
      <header className="sticky top-0 z-50 bg-[#0D4C92]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo: Lotus/Flower Leaf Mark + Larana, Inc. */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            {/* Minimalist Stylized Lotus/Leaf Flower SVG */}
            <div className="text-white group-hover:text-[#FFDE59] transition-colors">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Central Petal */}
                <path
                  d="M18 6C18 6 13 14 13 19C13 21.7614 15.2386 24 18 24C20.7614 24 23 21.7614 23 19C23 14 18 6 18 6Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Left Petal */}
                <path
                  d="M14 18C14 18 6 17 6 22C6 24.5 8.5 26 11 26C14.5 26 17 22 17 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Right Petal */}
                <path
                  d="M22 18C22 18 30 17 30 22C30 24.5 27.5 26 25 26C21.5 26 19 22 19 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Stem Base */}
                <path d="M14 28C16 29 20 29 22 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-none">
                Larana, Inc.
              </span>
              <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase mt-1">
                Venture AI Platform
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Exact 1st Image: Home, About Us, Price, Login) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              Price
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#FFDE59] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/create-business"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFDE59] text-[#0D4C92] font-black text-xs flex items-center justify-center">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold text-white hidden sm:inline">
                    {user?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>

                <Link
                  to="/create-business"
                  className="px-4 py-2 bg-[#FFDE59] hover:bg-[#ffe373] text-[#0D4C92] text-xs font-black rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Create Business Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white hover:text-[#FFDE59] transition-colors cursor-pointer"
                >
                  Login
                </Link>

                <Link
                  to="/login?tab=signup"
                  className="px-6 py-2.5 rounded-lg border-2 border-white text-white hover:bg-white hover:text-[#0D4C92] font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Start for free
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Exact Match to 1st Reference Image) */}
      <section id="home" className="relative min-h-[calc(100vh-80px)] flex items-center bg-[#0D4C92] overflow-hidden py-12 lg:py-0">
        {/* Subtle Decorative Wave Line Graphic (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-full max-w-xl pointer-events-none opacity-30 select-none">
          <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 150 C 150 120, 250 180, 400 130 C 500 100, 550 140, 600 120"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <path
              d="M0 165 C 180 130, 280 190, 420 140 C 520 110, 580 150, 600 135"
              stroke="#00F2DE"
              strokeWidth="1.2"
            />
            <path
              d="M0 180 C 120 160, 220 200, 360 160 C 460 130, 540 170, 600 150"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Hero Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Headline & Register CTA */}
            <div className="lg:col-span-6 space-y-6 pt-4 lg:pt-0">
              {/* Paragraph at top left (matching reference layout) */}
              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-lg font-normal">
                Model, simulate, and launch your enterprise with Google Maps geocoding, RAG regulatory intelligence, deterministic Python financial algorithms, and autonomous digital twins.
              </p>

              {/* Huge Bold Headline (Exact Reference Typography) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-white uppercase tracking-tight leading-[1.08]">
                GROW YOUR <br />
                BUSINESS WITH <br />
                OUR HELP!
              </h1>

              {/* Bright Yellow Action Button (Exact Reference: REGISTER NOW) */}
              <div className="pt-2">
                <Link
                  to={isAuthenticated ? '/create-business' : '/login?tab=signup'}
                  className="inline-block px-9 py-4 bg-[#FFDE59] hover:bg-[#ffe373] active:scale-95 text-[#0D4C92] font-black text-sm uppercase tracking-wider rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  REGISTER NOW
                </Link>
              </div>

              {/* 3-Dot Carousel Indicator (Bottom left under text) */}
              <div className="pt-8 flex items-center gap-3">
                <button
                  onClick={() => setActiveSlide(0)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === 0 ? 'bg-white scale-110' : 'bg-[#083669] hover:bg-white/50'
                  }`}
                  aria-label="Slide 1"
                />
                <button
                  onClick={() => setActiveSlide(1)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === 1 ? 'bg-white scale-110' : 'bg-[#083669] hover:bg-white/50'
                  }`}
                  aria-label="Slide 2"
                />
                <button
                  onClick={() => setActiveSlide(2)}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === 2 ? 'bg-white scale-110' : 'bg-[#083669] hover:bg-white/50'
                  }`}
                  aria-label="Slide 3"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Yellow Backdrop Circle + Businessman Photo */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
              {/* Floating Small Yellow Accent Bubble at top right */}
              <div className="absolute -top-4 right-4 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFDE59] z-0 shadow-lg animate-pulse" />

              {/* Main Yellow Circle Background Container */}
              <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[500px] lg:h-[500px] rounded-full bg-[#FFDE59] flex items-end justify-center overflow-hidden shadow-2xl">
                {/* Hero Businessman Portrait */}
                <img
                  src="/assets/hero_businessman.jpg"
                  alt="Confident businessman smiling with tablet"
                  className="w-full h-full object-cover object-top filter contrast-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. KEY METRICS STRIP (Connecting Royal Blue to Features) */}
      <section className="bg-[#0A3D78] border-y border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-[#FFDE59]">9 Nodes</div>
              <div className="text-xs text-white/80 font-semibold mt-1">Multi-Agent Neural Pipeline</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-[#00F2DE]">100+ MSME</div>
              <div className="text-xs text-white/80 font-semibold mt-1">Grounded Industry Catalogs</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-[#FFDE59]">₹ INR</div>
              <div className="text-xs text-white/80 font-semibold mt-1">Deterministic Financial Modeling</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-black text-[#00F2DE]">100% Verified</div>
              <div className="text-xs text-white/80 font-semibold mt-1">RAG Regulatory Standards</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION (`#about`) */}
      <section id="about" className="py-20 bg-[#0C4585] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading Banner */}
          <div className="p-8 rounded-3xl bg-[#083567] border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFDE59] text-[#0D4C92] text-xs font-black mb-3 shadow-xs">
                <Building className="w-3.5 h-3.5" />
                <span>About Larana, Inc. & Venture AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Empowering Founders & MSMEs with Computational Feasibility
              </h2>
              <p className="text-sm text-white/80 mt-2 max-w-2xl font-medium leading-relaxed">
                We replace guesswork with a deterministic multi-agent pipeline that analyzes location feasibility, competitor catchment, machinery manifests, and 12-month financial projections in seconds.
              </p>
            </div>
            <Link
              to="/login?tab=signup"
              className="px-7 py-3.5 bg-[#FFDE59] hover:bg-[#ffe373] text-[#0D4C92] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFDE59]/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFDE59] text-[#0D4C92] flex items-center justify-center font-black shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">9 Multi-Agent Pipeline</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Orchestrated via specialized agents covering concept classification, spatial GIS geocoding, competitor density, equipment matching, and financial simulations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFDE59]/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00F2DE] text-[#0B2545] flex items-center justify-center font-black shadow-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Deterministic INR Math</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Unlike vague generative summaries, our Python modeling engine computes exact 12-month revenue curves, break-even milestones, gross margins, and CapEx in INR (`₹`).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFDE59]/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFDE59] text-[#0D4C92] flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">MSME & RAG Grounded</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Integrates MSME Project Profiles, NSIC Machinery Directory, and ChromaDB vector knowledge for authentic statutory licensing (GST, FSSAI, Trade License) and subsidies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUTIONS & FEATURES SUITE (`#features`) */}
      <section id="features" className="py-20 bg-[#093C72] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D4C92] bg-[#FFDE59] px-3.5 py-1 rounded-full shadow-xs">
              Complete Business Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Everything You Need to Plan & Launch Your Venture
            </h2>
            <p className="text-sm text-white/75 font-medium">
              A comprehensive intelligence deck covering physical operations, spatial footprints, financials, and statutory roadmaps.
            </p>
          </div>

          {/* 6 Rich Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFDE59]/20 border border-[#FFDE59]/40 flex items-center justify-center text-[#FFDE59] font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Instant MSME Machinery Manifest</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Instant access to pre-mapped operational machinery, equipment costs, and NSIC standards for over 100+ commercial industries.
              </p>
              <div className="text-[11px] font-bold text-[#FFDE59] flex items-center gap-1">
                <span>MSME Schema Ready</span> • <span>In-House vs Procure</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#00F2DE]/20 border border-[#00F2DE]/40 flex items-center justify-center text-[#00F2DE] font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">GIS Catchment & Competitor Map</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Interactive spatial maps locating direct competitors, consumer density, transit hubs, and commercial zoning around your exact address.
              </p>
              <div className="text-[11px] font-bold text-[#00F2DE] flex items-center gap-1">
                <span>Spatial Markers</span> • <span>Foot Traffic Rating</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFDE59]/20 border border-[#FFDE59]/40 flex items-center justify-center text-[#FFDE59] font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Deterministic Financial Engine</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Accurate 12-month cash flows, break-even timelines, gross/net margins, and scenario modeling (Conservative, Base, Optimistic) in INR (`₹`).
              </p>
              <div className="text-[11px] font-bold text-[#FFDE59] flex items-center gap-1">
                <span>100% INR Projections</span> • <span>Payback Curves</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#00F2DE]/20 border border-[#00F2DE]/40 flex items-center justify-center text-[#00F2DE] font-bold">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Operations Blueprint Matrix</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Facility floor plans, equipment zones, power allocations, square footage utilization, and spatial nodes across interior operational floors.
              </p>
              <div className="text-[11px] font-bold text-[#00F2DE] flex items-center gap-1">
                <span>Architectural Layout</span> • <span>Node Telemetry</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFDE59]/20 border border-[#FFDE59]/40 flex items-center justify-center text-[#FFDE59] font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Local Sourcing & Vendor Network</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Live discovery of verified industrial dealers, machinery suppliers, and wholesale raw material distributors situated nearby your facility.
              </p>
              <div className="text-[11px] font-bold text-[#FFDE59] flex items-center gap-1">
                <span>Distance Radii</span> • <span>Lead-Time Estimates</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:border-[#FFDE59]/40 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#00F2DE]/20 border border-[#00F2DE]/40 flex items-center justify-center text-[#00F2DE] font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">RAG Compliance & Printable Reports</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Step-by-step statutory licensing roadmap (Udyam, GST, FSSAI, Pollution Board) and one-click printable executive feasibility reports.
              </p>
              <div className="text-[11px] font-bold text-[#00F2DE] flex items-center gap-1">
                <span>RAG Verified</span> • <span>Executive PDF Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION (`#pricing`) */}
      <section id="pricing" className="py-20 bg-[#0C4585] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading & Billing Toggle */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D4C92] bg-[#FFDE59] px-3.5 py-1 rounded-full shadow-xs">
              Simple & Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Invest in Feasibility Before Spending Millions
            </h2>
            <p className="text-sm text-white/80 font-medium">
              Choose the plan that fits your venture stage. All plans include deterministic calculations in INR (`₹`).
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#083567] border border-white/15 mt-2 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#FFDE59] text-[#0D4C92] shadow-xs font-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#FFDE59] text-[#0D4C92] shadow-xs font-black'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#00F2DE] text-[#0B2545] uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (3 Tiers in INR) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/15 flex flex-col justify-between space-y-6 hover:border-[#FFDE59]/50 transition-all shadow-md">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Starter / Solo Venture
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'monthly' ? '₹1,999' : '₹1,599'}
                  </span>
                  <span className="text-xs text-white/70 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-white/75 font-medium leading-relaxed">
                  Ideal for first-time founders modeling a single commercial storefront or MSME enterprise.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>1 Active Business Digital Twin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>Instant MSME Catalog & Machinery Manifest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>Standard GIS Geocoding Catchment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>12-Month Financial Projections (INR)</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Start Starter Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Growth / Professional (Featured Yellow Highlighted Card) */}
            <div className="p-8 rounded-3xl bg-[#083567] border-2 border-[#FFDE59] shadow-2xl relative flex flex-col justify-between space-y-6 transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFDE59] text-[#0D4C92] text-[10px] font-black uppercase tracking-widest shadow-md">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#FFDE59]">
                  Growth & Commercial Expansion
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'monthly' ? '₹4,999' : '₹3,999'}
                  </span>
                  <span className="text-xs text-white/70 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">
                  For growing ventures, franchise owners, and multi-location commercial operators.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFDE59] shrink-0" />
                    <span><strong>5 Active Venture Twins</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFDE59] shrink-0" />
                    <span><strong>Full 9 Multi-Agent Intelligence Pipeline</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFDE59] shrink-0" />
                    <span>Local Machinery Dealers & Sourcing Hubs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFDE59] shrink-0" />
                    <span>Facility Floor Blueprint & Node Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFDE59] shrink-0" />
                    <span>Executive Printable PDF Report Export</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-[#FFDE59] hover:bg-[#ffe373] text-[#0D4C92] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Get Growth Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/15 flex flex-col justify-between space-y-6 hover:border-[#FFDE59]/50 transition-all shadow-md">
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Enterprise / Industrial
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {billingCycle === 'monthly' ? '₹14,999' : '₹11,999'}
                  </span>
                  <span className="text-xs text-white/70 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-white/75 font-medium leading-relaxed">
                  For industrial plants, franchise networks, venture studios, and institutional investors.
                </p>

                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span><strong>Unlimited Venture Twins</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>Bespoke Machinery Catalog Grounding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>Custom RAG Regulatory & Subsidy Tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F2DE] shrink-0" />
                    <span>Dedicated Solution Architect & SLA</span>
                  </div>
                </div>
              </div>

              <Link
                to="/login?tab=signup"
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Contact Enterprise Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT US SECTION (`#contact`) */}
      <section id="contact" className="py-20 bg-[#093C72] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D4C92] bg-[#FFDE59] px-3.5 py-1 rounded-full shadow-xs">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Let's Discuss Your Next Venture
            </h2>
            <p className="text-sm text-white/80 font-medium">
              Have questions regarding custom industry catalogs, API integration, or enterprise deployment? Our engineering team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 bg-[#083567] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl text-white border border-white/10">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#FFDE59]" />
                  Send an Inquiry
                </h3>
                <p className="text-xs text-white/75 font-medium mt-0.5">We typically reply within 2 business hours.</p>
              </div>

              {contactSubmitted && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Thank you! Your message has been received. A representative will contact you shortly.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-[#FFDE59] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-[#FFDE59] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-[#FFDE59] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1.5">
                    Business Concept / Query
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us about the venture you are modeling..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-[#FFDE59] font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#FFDE59] hover:bg-[#ffe373] active:scale-95 text-[#0D4C92] font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            </div>

            {/* Right: Direct Channels */}
            <div className="lg:col-span-5 bg-[#083567] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#FFDE59] mb-1">
                    Direct Contact Channels
                  </div>
                  <h3 className="text-xl font-black text-white">Larana Headquarters</h3>
                </div>

                <div className="space-y-4 text-xs text-white/90 font-medium">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <Phone className="w-5 h-5 text-[#FFDE59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Phone & Hotline:</div>
                      <div className="text-white/80 mt-0.5">+123-456-7890 / +91 98400 12030</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <Mail className="w-5 h-5 text-[#FFDE59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Email Address:</div>
                      <div className="text-white/80 mt-0.5">hello@reallygreatsite.com / contact@ventureai.in</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <Compass className="w-5 h-5 text-[#FFDE59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Headquarters Address:</div>
                      <div className="text-white/80 mt-0.5">123 Anywhere St., Any City / Tech Corridor</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <div className="font-black text-[#FFDE59] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FFDE59]" />
                  <span>Enterprise Security & Confidentiality</span>
                </div>
                <p className="text-[11px] text-white/70 font-medium">
                  All enterprise inputs and financial models are encrypted in compliance with enterprise standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER SECTION */}
      <footer className="bg-[#072B54] border-t border-white/10 mt-auto text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFDE59] text-[#0D4C92] flex items-center justify-center font-black text-xs">
                  LA
                </div>
                <span className="font-black text-lg text-white">
                  Larana, <span className="text-[#FFDE59]">Inc.</span>
                </span>
              </div>
              <p className="text-xs text-white/70 font-medium leading-relaxed">
                Autonomous Feasibility & Operations Engine powered by 9 multi-agent neural pipelines, GIS geocoding, and MSME frameworks.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-white uppercase tracking-wider">Navigation</div>
              <ul className="space-y-1.5 text-white/70 font-medium">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-[#FFDE59] cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-[#FFDE59] cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-[#FFDE59] cursor-pointer">Solutions</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#FFDE59] cursor-pointer">Pricing Plans</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-[#FFDE59] cursor-pointer">Contact Us</button></li>
              </ul>
            </div>

            {/* Col 3: Product Platform */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-white uppercase tracking-wider">Platform Hub</div>
              <ul className="space-y-1.5 text-white/70 font-medium">
                <li><Link to="/login" className="hover:text-[#FFDE59]">User Sign In</Link></li>
                <li><Link to="/login?tab=signup" className="hover:text-[#FFDE59]">Register Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#FFDE59]">Dashboard Workspace</Link></li>
                <li><Link to="/create-business" className="hover:text-[#FFDE59]">Create Business Report</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Standards */}
            <div className="space-y-2 text-xs">
              <div className="font-black text-white uppercase tracking-wider">Standards</div>
              <p className="text-white/70 text-[11px] leading-relaxed">
                Calibrated against MSME Project Profiles, NSIC Machinery Directory & OpenStreetMap GIS protocols.
              </p>
              <div className="text-[11px] font-mono text-[#FFDE59] font-bold pt-1">
                Currency: INR (₹) Grounded
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-medium">
            <div>
              © {new Date().getFullYear()} Larana, Inc. • Venture AI. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="hover:text-[#FFDE59] cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-[#FFDE59] cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-[#FFDE59] cursor-pointer">Security Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
