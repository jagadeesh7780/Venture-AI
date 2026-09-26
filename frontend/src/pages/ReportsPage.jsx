import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Truck,
  Wrench,
  Boxes,
  Compass,
} from 'lucide-react';
import { intelligenceService } from '../services/api';

export default function ReportsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const intel = await intelligenceService.getFullIntelligence(id);
        setData(intel);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4" />
        <h3 className="text-xl font-black text-slate-900">Compiling Executive Feasibility Report...</h3>
      </div>
    );
  }

  const {
    business,
    business_understanding: bu,
    location_analysis: loc,
    competitor_analysis: comp,
    financial_analysis: fin,
    equipment_analysis: equip,
    supplier_analysis: supp,
    marketing_analysis: mkt,
    growth_plan: growth,
    ml_prediction: ml,
    report,
  } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm print:hidden">
        <Link
          to={`/businesses/${id}/analysis`}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis Hub
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to={`/businesses/${id}/digital-twin`}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <Boxes className="w-4 h-4 text-orange-400" />
            Operations Blueprint
          </Link>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save to PDF
          </button>
        </div>
      </div>

      {/* Main Printable Document */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Document Header (Orange Background with White Text) */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-sm print:bg-white print:text-black print:border-b print:border-slate-300 print:p-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black text-white uppercase tracking-wider print:text-orange-700">
              VENTURE AI • Autonomous Enterprise Feasibility Report
            </span>
            <span className="text-xs text-orange-100 font-mono print:text-slate-600">
              Doc Ref: AIB-DT-{business.id}-{new Date().getFullYear()}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight print:text-black">
            {report?.title || `Business Feasibility Report: ${business.business_name}`}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-orange-50 font-medium print:text-slate-600">
            <span><strong>Venture:</strong> {business.business_name}</span>
            <span>•</span>
            <span><strong>Category:</strong> {bu?.business_category}</span>
            <span>•</span>
            <span><strong>Location:</strong> {business.exact_location}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200 print:bg-slate-100 print:border-slate-300 space-y-2">
          <h3 className="text-sm font-black text-orange-900 uppercase tracking-wider print:text-orange-800">
            Executive Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-medium print:text-slate-800">
            {report?.executive_summary ||
              `The venture '${business.business_name}' demonstrates high overall viability with an ML Composite Feasibility Score of ${ml?.overall_feasibility_score}/100.`}
          </p>
        </div>

        {/* Data Provenance Matrix */}
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 print:text-black flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Data Provenance & Attribution Matrix
          </h3>
          <p className="text-xs text-slate-500 font-medium print:text-slate-600">
            Every section clearly identifies whether data was directly supplied, retrieved from live external databases, calculated via Python, or generated as decision-support models.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 print:border-slate-300 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 print:bg-slate-200 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Analysis Dimension</th>
                  <th className="p-3">Data Origin Tag</th>
                  <th className="p-3">Methodology / Source Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300 text-slate-800">
                <tr>
                  <td className="p-3 font-bold">Business Concept & Budget</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">USER_PROVIDED</span></td>
                  <td className="p-3">Direct founder entry in multi-step onboarding</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Coordinates & Geographic Catchment</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">VERIFIED_EXTERNAL</span></td>
                  <td className="p-3">OpenStreetMap Nominatim Geocoding API</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Regulatory Licensing & MSME Schemes</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">VERIFIED_EXTERNAL</span></td>
                  <td className="p-3">ChromaDB RAG Knowledge Base (MSME/GST/FSSAI)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Financial Modeling & Projections</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">ESTIMATED</span></td>
                  <td className="p-3">Deterministic Python NumPy/Pandas formulas</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Composite Viability Score</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">ML_PREDICTION</span></td>
                  <td className="p-3">Scikit-Learn Gradient Boosting Ensemble</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Spatial Operations Blueprint</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-900 border border-orange-200">CONFIGURED</span></td>
                  <td className="p-3">Catchment Matrix & Architectural Schematic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 1: Financial Feasibility Summary */}
        {fin && (
          <div className="space-y-3 pt-4 border-t border-slate-200 print:border-slate-300">
            <h3 className="text-base font-black text-slate-900 print:text-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              1. Financial Projections & Break-Even Analysis
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300">
                <div className="text-[11px] text-slate-500 uppercase font-bold">CapEx Investment</div>
                <div className="text-base font-black text-slate-900 print:text-black mt-0.5">₹{Number(business.budget).toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300">
                <div className="text-[11px] text-slate-500 uppercase font-bold">Monthly Revenue Est.</div>
                <div className="text-base font-black text-orange-600 print:text-orange-700 mt-0.5">₹{(fin.monthly_revenue_estimate || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300">
                <div className="text-[11px] text-slate-500 uppercase font-bold">Gross Margin</div>
                <div className="text-base font-black text-emerald-600 print:text-green-700 mt-0.5">{fin.gross_margin_percent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300">
                <div className="text-[11px] text-slate-500 uppercase font-bold">Payback Period</div>
                <div className="text-base font-black text-amber-600 print:text-amber-700 mt-0.5">{fin.payback_period_months} Months</div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Key Strategic Recommendations */}
        <div className="space-y-3 pt-4 border-t border-slate-200 print:border-slate-300">
          <h3 className="text-base font-black text-slate-900 print:text-black flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-500" />
            2. Strategic Launch Action Plan
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 font-medium print:text-slate-800">
            {(report?.key_recommendations || [
              'Proceed with MSME Udyam and local municipal trade licensing in parallel.',
              'Lock in dual supplier arrangements for key raw materials prior to grand opening.',
              'Focus launch marketing on geo-fenced local social campaigns and corporate B2B outreach.',
            ]).map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Statutory Disclaimers & Limitations */}
        <div className="p-4 rounded-xl bg-slate-50 print:bg-slate-100 border border-slate-200 print:border-slate-300 space-y-1 text-xs text-slate-600 print:text-slate-600 leading-relaxed font-medium">
          <div className="font-black text-slate-800 print:text-slate-700 uppercase tracking-wider text-[10px]">
            Statutory AI Decision-Support Disclaimer
          </div>
          <p>
            This document is generated by the VENTURE AI Autonomous Enterprise Engine as a computational decision-support tool.
            Estimates and models are grounded on current user inputs, deterministic mathematical models, and open market datasets.
            They do not constitute guaranteed commercial returns, legal warranties, or loan sanction assurances.
          </p>
        </div>
      </div>
    </div>
  );
}
