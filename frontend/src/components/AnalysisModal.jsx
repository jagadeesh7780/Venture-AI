import React, { useState, useEffect } from 'react';
import { analysisService } from '../services/api';
import {
  Sparkles,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  ShoppingBag,
  Users,
  Cpu,
  Settings,
  AlertTriangle,
  Compass,
  Check,
  RefreshCw,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const AnalysisModal = ({ isOpen, onClose, business, onAnalysisComplete }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const progressSteps = [
    'Reading business information from database...',
    'Understanding business concept & monetization model...',
    'Identifying primary & secondary target customer segments...',
    'Extracting core resources & operational prerequisites...',
    'Compiling structured understanding & downstream recommendations...',
  ];

  // Fetch or trigger analysis when modal opens
  useEffect(() => {
    if (!isOpen || !business) {
      setAnalysis(null);
      setError(null);
      setStepIndex(0);
      return;
    }

    const checkExistingOrAnalyze = async () => {
      setError(null);
      try {
        // Try fetching existing analysis first
        const existing = await analysisService.getAnalysis(business.id);
        setAnalysis(existing);
      } catch (err) {
        // If not analyzed yet (404), auto-trigger analysis
        if (err.response?.status === 404) {
          await runAnalysis();
        } else {
          setError(err.response?.data?.detail || 'Failed to retrieve analysis.');
        }
      }
    };

    checkExistingOrAnalyze();
  }, [isOpen, business]);

  const runAnalysis = async () => {
    if (!business) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setStepIndex(0);

    // Animate progress steps
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < progressSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const data = await analysisService.analyzeBusiness(business.id);
      setAnalysis(data);
      if (onAnalysisComplete) {
        onAnalysisComplete(business.id, data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to complete AI Business Understanding analysis. Ensure backend is running.'
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (!isOpen || !business) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070B17]/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#10172A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-900/30 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  AI Business Understanding Agent
                </h3>
                <span className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded-full">
                  Step 3 Active
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Venture: <span className="font-semibold text-slate-200">{business.business_name || business.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!loading && analysis && (
              <button
                onClick={runAnalysis}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-300 hover:text-white bg-orange-950/40 hover:bg-orange-900/50 border border-orange-800/60 rounded-xl transition-colors cursor-pointer"
                title="Re-run AI Analysis"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Re-analyze</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* State 1: Loading Progress */}
          {loading && (
            <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-ping"></div>
                <div className="w-20 h-20 rounded-full border-4 border-t-orange-500 border-r-amber-400 border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#F8FAFC]">AI is analyzing your business...</h4>
                <p className="text-xs text-[#94A3B8]">
                  Consulting local open-source LLM via Ollama agent pipeline
                </p>
              </div>

              {/* Progress Steps Checklist */}
              <div className="bg-[#070B17]/70 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 shadow-inner">
                {progressSteps.map((step, idx) => {
                  const isDone = idx < stepIndex;
                  const isCurrent = idx === stepIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                        isDone
                          ? 'text-[#22C55E] font-medium'
                          : isCurrent
                          ? 'text-orange-300 font-semibold translate-x-1'
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin shrink-0"></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* State 2: Error Message */}
          {error && !loading && (
            <div className="p-5 rounded-2xl bg-red-950/40 border border-[#EF4444]/40 text-red-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#EF4444]">
                <ShieldAlert className="w-5 h-5" />
                <span>AI Analysis Notification</span>
              </div>
              <p className="text-xs text-red-300/90 leading-relaxed">{error}</p>
              <button
                onClick={runAnalysis}
                className="px-4 py-2 bg-[#EF4444] hover:bg-red-500 text-white font-medium text-xs rounded-xl shadow-md transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* State 3: Analysis Results */}
          {!loading && analysis && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 to-slate-900 border border-orange-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                    <Layers className="w-4 h-4" />
                    <span>Business Classification</span>
                  </div>
                  <div className="text-base font-bold text-[#F8FAFC]">
                    {analysis.business_category}
                  </div>
                  <div className="text-xs text-[#94A3B8] font-medium">
                    {analysis.business_subcategory}
                  </div>
                </div>

                {/* Business Model Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Business Model</span>
                  </div>
                  <div className="text-sm font-bold text-[#F8FAFC] leading-snug">
                    {analysis.business_model}
                  </div>
                  <div className="text-[11px] text-amber-300/70">
                    Core Delivery & Monetization Architecture
                  </div>
                </div>

                {/* Planned Investment Budget */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 to-slate-900 border border-orange-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span>Investment Capital</span>
                  </div>
                  <div className="text-base font-bold text-[#F8FAFC]">
                    ₹{Number(business.budget || business.investment_budget || 0).toLocaleString('en-IN')} INR
                  </div>
                  <div className="text-[11px] text-orange-300/70">
                    Location: {business.exact_location}
                  </div>
                </div>
              </div>

              {/* Detail Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Target Customers */}
                <div className="p-5 rounded-2xl bg-[#070B17]/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Target Customer Segments</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.target_customers?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products & Services */}
                <div className="p-5 rounded-2xl bg-[#070B17]/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Products & Offerings</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.products_or_services?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Resources */}
                <div className="p-5 rounded-2xl bg-[#070B17]/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Required Resources & Assets</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.required_resources?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operational Requirements */}
                <div className="p-5 rounded-2xl bg-[#070B17]/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <Settings className="w-4 h-4" />
                    <span>Operational Requirements</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.operational_requirements?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Potential Risks Alert Box */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Initial Risks & Vulnerabilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {analysis.potential_risks?.map((risk, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Downstream Analyses */}
              <div className="p-5 rounded-2xl bg-orange-950/20 border border-orange-800/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-300 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Recommended Downstream Agent Analyses</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommended_analysis?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-orange-900/40 border border-orange-700/50 text-orange-200"
                    >
                      <ArrowRight className="w-3 h-3 text-orange-400" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI AGENTS Master Roadmap Status Panel */}
              <div className="p-5 rounded-2xl bg-[#070B17]/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>AI Multi-Agent Pipeline Status</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full">
                    Step 3 Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                  {/* Agent 1 */}
                  <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/40 flex items-center justify-between">
                    <span className="font-semibold text-white">Business Understanding</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#22C55E] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      DONE
                    </span>
                  </div>

                  {/* Agent 2 */}
                  <div className="p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Location Analysis</span>
                    <span className="text-[11px] text-[#F59E0B] font-bold">COMING NEXT</span>
                  </div>

                  {/* Locked Agents */}
                  {[
                    'Competitor Analysis',
                    'Financial Analysis',
                    'Equipment Analysis',
                    'Supplier Analysis',
                    'Marketing Analysis',
                    'Growth Strategy',
                  ].map((agentName, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-slate-500"
                    >
                      <span>{agentName}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#94A3B8]">
            AI Business Understanding Agent (Step 3) • Local Ollama LLM
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
