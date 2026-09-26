import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, IndianRupee, Clock, ShieldCheck, Layers } from 'lucide-react';

export default function FinancialVisualizer({ financialData }) {
  const [selectedScenario, setSelectedScenario] = useState('base');

  if (!financialData) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
        Financial projections are being calculated by the deterministic Python agent...
      </div>
    );
  }

  const {
    initial_investment = 50000,
    monthly_revenue_estimate = 12000,
    monthly_expenses_estimate = 9000,
    net_profit_estimate = 3000,
    gross_margin_percent = 68,
    net_margin_percent = 25,
    break_even_months = 7.5,
    payback_period_months = 16.5,
    roi_annual_percent = 72,
    scenarios = {},
    monthly_cash_flow = [],
    assumptions = [],
    data_source = 'Deterministic Python Financial Modeling',
  } = financialData;

  const currentScenario = scenarios[selectedScenario] || {
    monthly_revenue: monthly_revenue_estimate,
    monthly_expenses: monthly_expenses_estimate,
    net_profit: net_profit_estimate,
    net_margin_pct: net_margin_percent,
    payback_period_months: payback_period_months,
  };

  return (
    <div className="space-y-6">
      {/* Top Scenario Selector & KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'conservative', title: 'Conservative (75% Sizing)', color: 'border-amber-400 text-amber-600' },
          { key: 'base', title: 'Base Target (100% Plan)', color: 'border-orange-500 text-orange-600 bg-orange-50' },
          { key: 'optimistic', title: 'Optimistic (130% Growth)', color: 'border-emerald-500 text-emerald-600' },
        ].map((s) => {
          const sc = scenarios[s.key] || {};
          const isSelected = selectedScenario === s.key;
          return (
            <div
              key={s.key}
              onClick={() => setSelectedScenario(s.key)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-orange-50 border-orange-500 shadow-sm ring-2 ring-orange-500/50'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.title}</span>
                {isSelected && (
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-white shadow-xs">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹{(sc.monthly_revenue || 0).toLocaleString('en-IN')}
                <span className="text-xs font-medium text-slate-500 ml-1">/mo</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Net Margin: <strong className="text-emerald-600 font-bold">{sc.net_margin_pct || 0}%</strong></span>
                <span>Payback: <strong className="text-orange-600 font-bold">{sc.payback_period_months || 0} mos</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary KPI Ribbons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-bold">Initial CapEx Budget</div>
          <div className="text-xl font-black text-slate-900 mt-1">₹{Number(initial_investment).toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-orange-600 mt-1 font-mono font-bold">INR ALLOCATED</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-bold">Est. Gross Margin</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{gross_margin_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono font-medium">COGS: {100 - gross_margin_percent}%</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-bold">Break-Even Horizon</div>
          <div className="text-xl font-black text-orange-600 mt-1">{break_even_months} Months</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono font-medium">Operational Target</div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-500 font-bold">Annualized ROI</div>
          <div className="text-xl font-black text-amber-600 mt-1">{roi_annual_percent}%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono font-bold">DETERMINISTIC</div>
        </div>
      </div>

      {/* 12-Month Projections: Revenue vs Expenses vs Net Profit */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 shadow-xs">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" />
              12-Month Operating Cash Flow & Ramp-Up Curve
            </h3>
            <p className="text-xs text-orange-100 font-medium">Monthly revenue scaling from initial soft-launch to full capacity</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-white text-orange-700 font-mono font-bold self-start shadow-xs">
            PYTHON MATH
          </span>
        </div>

        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly_cash_flow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `₹${Math.abs(val) >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'k'}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F97316', borderRadius: '10px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#F97316" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#EF4444" strokeWidth={1.5} fillOpacity={0.1} fill="#EF4444" />
              <Area type="monotone" dataKey="net_profit" name="Net Profit" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Cash Flow Recovery (Payback) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white mb-4 shadow-xs">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            Cumulative Net Capital Recovery Horizon
          </h3>
          <p className="text-xs text-orange-100 font-medium">Tracking initial CapEx recovery toward net positive capital accumulation</p>
        </div>

        <div className="h-[240px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly_cash_flow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `₹${Math.abs(val) >= 100000 ? (val / 100000).toFixed(1) + 'L' : (val / 1000).toFixed(0) + 'k'}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F97316', borderRadius: '10px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Cumulative Cash Position']}
              />
              <ReferenceLine y={0} stroke="#F97316" strokeDasharray="4 4" label={{ value: 'Full CapEx Recovery Point', fill: '#F97316', fontSize: 11, position: 'top' }} />
              <Line type="monotone" dataKey="cumulative_cash_flow" name="Net Cumulative Balance" stroke="#F97316" strokeWidth={3} dot={{ fill: '#F97316', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Itemized Assumption Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h4 className="text-sm font-black text-white">Itemized Assumption Audit Trail</h4>
          </div>
          <span className="text-xs text-orange-100 font-mono font-bold">100% Transparent Attribution</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Financial Parameter</th>
                <th className="p-3">Assumed Value</th>
                <th className="p-3">Measurement Unit</th>
                <th className="p-3">Data Source Provenance</th>
                <th className="p-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {assumptions.map((a, idx) => (
                <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{a.parameter}</td>
                  <td className="p-3 font-mono text-orange-600 font-bold">{a.value}</td>
                  <td className="p-3 text-slate-500 font-medium">{a.unit}</td>
                  <td className="p-3 text-slate-700 font-medium">{a.source}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-emerald-100 text-emerald-800">
                      {Math.round((a.confidence || 0.85) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
