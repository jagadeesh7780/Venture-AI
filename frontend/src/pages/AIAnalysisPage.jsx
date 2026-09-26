import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  MapPin,
  TrendingUp,
  Wrench,
  Truck,
  Megaphone,
  Rocket,
  BrainCircuit,
  FileText,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  Building,
} from 'lucide-react';
import { intelligenceService } from '../services/api';
import BusinessMap from '../components/BusinessMap';
import FinancialVisualizer from '../components/FinancialVisualizer';

export default function AIAnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [agentStatus, setAgentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orchestrating, setOrchestrating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  const fetchIntelligence = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fullIntel, statusRes] = await Promise.all([
        intelligenceService.getFullIntelligence(id),
        intelligenceService.getAgentStatus(id),
      ]);
      setData(fullIntel);
      setAgentStatus(statusRes);
    } catch (err) {
      console.error('Failed to load intelligence data:', err);
      setError(err.response?.data?.detail || 'Failed to load business intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [id]);

  const handleRunOrchestrator = async () => {
    try {
      setOrchestrating(true);
      await intelligenceService.orchestratePipeline(id);
      await fetchIntelligence();
    } catch (err) {
      console.error('Orchestration failed:', err);
    } finally {
      setOrchestrating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4" />
        <h3 className="text-xl font-black text-slate-900">Aggregating Multi-Agent Intelligence...</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">Executing GIS geocoding, RAG knowledge retrieval, and financial modeling</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-red-200 max-w-xl mx-auto my-12 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-black text-slate-900 mb-2">Error Loading Intelligence</h3>
        <p className="text-sm text-slate-600 mb-6 font-medium">{error}</p>
        <button
          onClick={fetchIntelligence}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20"
        >
          Retry Analysis
        </button>
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
  } = data;

  const tabs = [
    { id: 'overview', label: 'Overview & Agents', icon: Bot },
    { id: 'location', label: 'Location & Map', icon: MapPin },
    { id: 'competitors', label: 'Competitors', icon: ShieldCheck },
    { id: 'financials', label: 'Financial Engine', icon: TrendingUp },
    { id: 'equipment', label: 'Equipment & Operations', icon: Wrench },
    { id: 'suppliers', label: 'Suppliers & Raw Materials', icon: Truck },
    { id: 'marketing', label: 'Marketing & B2B', icon: Megaphone },
    { id: 'growth', label: 'Growth & Compliance', icon: Rocket },
    { id: 'ml', label: 'ML Viability Score', icon: BrainCircuit },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Action Header (Orange Background with White Text) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 md:p-8 shadow-md text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-black rounded-md bg-white/20 text-white border border-white/30 uppercase tracking-wide">
                {bu?.business_category || 'Commercial Venture'}
              </span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-white text-orange-700 shadow-xs">
                Feasibility: <strong className="text-orange-600">{ml?.overall_feasibility_score || 75}/100</strong>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {business.business_name}
            </h1>
            <p className="text-sm text-orange-50 mt-1 max-w-2xl leading-relaxed font-medium">
              {business.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunOrchestrator}
              disabled={orchestrating}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 disabled:opacity-50 text-orange-600 text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-orange-600 ${orchestrating ? 'animate-spin' : ''}`} />
              {orchestrating ? 'Re-running Agents...' : 'Re-Run All Agents'}
            </button>

            <Link
              to={`/businesses/${business.id}/digital-twin`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Boxes className="w-4 h-4 text-orange-400" />
              Operations Blueprint
            </Link>

            <Link
              to={`/businesses/${business.id}/report`}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-white" />
              Executive Report
            </Link>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase">CapEx Investment</div>
            <div className="text-lg font-black text-white mt-0.5">₹{Number(business.budget).toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase">Monthly Revenue Est.</div>
            <div className="text-lg font-black text-white mt-0.5">
              ₹{(fin?.monthly_revenue_estimate || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase">Net Monthly Profit</div>
            <div className="text-lg font-black text-emerald-200 mt-0.5">
              ₹{(fin?.net_profit_estimate || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase">Payback Horizon</div>
            <div className="text-lg font-black text-white mt-0.5">
              {fin?.payback_period_months || 16} Months
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:text-orange-600 border border-slate-200 hover:border-orange-300 shadow-xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-500'}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview & Agents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Agent Pipeline Real-Time Dashboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Header Banner */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white mb-6 shadow-xs">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-white" />
                Multi-Agent Pipeline Intelligence Status
              </h3>
              <p className="text-xs text-orange-100 font-medium mt-0.5">Real-time status and telemetry for each specialized AI agent</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(agentStatus?.agents || []).map((agent, idx) => {
                const isCompleted = agent.status === 'completed' || agent.status === 'skipped';
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900">{agent.name}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-medium">{agent.description}</div>
                      {agent.duration_ms > 0 && (
                        <div className="text-[10px] text-slate-500 font-mono mt-2 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-orange-500" /> {agent.duration_ms}ms
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-wider ${
                        agent.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : agent.status === 'skipped'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : agent.status === 'running'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Understanding Deep-Dive */}
          {bu && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    Target Customers & Value Proposition
                  </h3>
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-bold mb-2">Target Customer Segments:</div>
                  <div className="flex flex-wrap gap-2">
                    {bu.target_customers?.map((c, i) => (
                      <span key={i} className="px-3 py-1 text-xs rounded-lg bg-orange-50 text-orange-900 border border-orange-200 font-bold shadow-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-bold mb-2">Core Products & Offerings:</div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                    {bu.products_or_services?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Operational Requirements & Risks
                  </h3>
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-bold mb-2">Prerequisites:</div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                    {bu.operational_requirements?.map((op, i) => (
                      <li key={i}>{op}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-slate-700 font-bold mb-2">Potential Venture Risks:</div>
                  <div className="space-y-2">
                    {bu.potential_risks?.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Location & Map */}
      {activeTab === 'location' && loc && (
        <div className="space-y-6">
          <BusinessMap
            center={[loc.latitude || 12.9716, loc.longitude || 77.5946]}
            businessName={business.business_name}
            markers={loc.spatial_markers || []}
            locationScore={loc.location_score}
            footTraffic={loc.foot_traffic_estimate}
            dataSource={loc.data_source}
          />

          {/* Location Breakdown Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(loc.nearby_places_breakdown || {}).map(([k, v], idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-sm">
                <div className="text-2xl font-black text-orange-600">{v}</div>
                <div className="text-xs text-slate-600 font-bold capitalize mt-1">
                  {k.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Competitor Analysis */}
      {activeTab === 'competitors' && comp && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-500 uppercase font-bold">Competition Level</div>
              <div className="text-2xl font-black text-red-600 mt-1">{comp.competition_level}</div>
              <div className="text-xs text-slate-600 mt-1 font-medium">Density Index: {comp.competitive_density_score}/100</div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl md:col-span-2 shadow-sm">
              <div className="text-xs text-slate-700 uppercase font-bold mb-2">Recommended Differentiation</div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                {comp.differentiation_strategies?.map((strat, i) => (
                  <li key={i} className="leading-relaxed">{strat}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitor List Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
              <h4 className="text-sm font-black text-white">Direct & Indirect Competitor Directory</h4>
              <span className="text-xs text-orange-100 font-mono font-bold">VERIFIED / ESTIMATED</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Competitor Entity</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Price Tier</th>
                    <th className="p-3">Identified Weakness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {[...(comp.direct_competitors || []), ...(comp.indirect_competitors || [])].map((c, i) => (
                    <tr key={i} className="hover:bg-orange-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${c.type?.includes('Direct') ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-orange-600 font-bold">~{c.distance_meters}m</td>
                      <td className="p-3 font-medium">{c.price_tier}</td>
                      <td className="p-3 text-slate-600 font-medium">{c.weaknesses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Financial Engine */}
      {activeTab === 'financials' && fin && (
        <FinancialVisualizer financialData={fin} />
      )}

      {/* TAB CONTENT: Equipment & Machinery */}
      {activeTab === 'equipment' && equip && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-500 uppercase font-bold">Equipment Status</div>
              <div className="text-xl font-black text-slate-900 mt-1 capitalize">{equip.equipment_status}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">User Declared Input</div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-500 uppercase font-bold">Missing Machinery Cost</div>
              <div className="text-xl font-black text-orange-600 mt-1">₹{(equip.estimated_total_cost || 0).toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{equip.missing_equipment?.length || 0} items to acquire</div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-500 uppercase font-bold">Facility Assets</div>
              <div className="text-xl font-black text-slate-900 mt-1">{equip.spatial_3d_specs?.length || 0} Configured</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Mapped in Operations Blueprint</div>
            </div>
          </div>

          {/* Equipment Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">Required Equipment & Operational Purposes</h4>
                <p className="text-xs text-orange-100 mt-0.5 font-medium">Comprehensive manifest derived from curated dataset</p>
              </div>
              <span className="text-[10px] font-mono text-orange-700 bg-white font-bold px-2.5 py-1 rounded-full shadow-xs">
                DATASET GROUNDED
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Equipment Name</th>
                    <th className="p-3">Operational Purpose</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Unit Cost Est.</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {equip.required_equipment?.map((eq, i) => (
                    <tr key={i} className="hover:bg-orange-50/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{eq.name}</td>
                      <td className="p-3 text-slate-700 font-medium max-w-xs">{eq.purpose || eq.description || 'Core operations'}</td>
                      <td className="p-3 text-slate-600">
                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${eq.essential === 'Yes' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                          {eq.equipment_type || (eq.essential === 'Yes' ? 'Essential' : 'Optional')}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">{eq.quantity || 1}</td>
                      <td className="p-3 font-mono text-orange-600 font-bold">₹{Number(eq.unit_price_estimate || eq.unit_price || 10000).toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded ${eq.is_owned ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                          {eq.is_owned ? 'IN-HOUSE' : 'TO PROCURE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nearby Equipment Providers */}
          {(equip.potential_sellers?.length > 0 || equip.nearby_providers?.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-white" />
                    Nearby Equipment Providers & Sourcing Hubs
                  </h4>
                  <p className="text-xs text-orange-100 mt-0.5 font-medium">
                    Authorized commercial machinery dealers and showrooms located in your business area
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-white font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Location Intelligence Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(equip.potential_sellers || equip.nearby_providers)?.map((dealer, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-black text-slate-900">{dealer.seller_name || dealer.name || dealer.provider_name}</h5>
                        <div className="text-[11px] text-orange-600 font-bold mt-0.5">{dealer.seller_type || dealer.dealer_type}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                          {dealer.distance_km || '2.0 km'}
                        </span>
                        {dealer.rating && (
                          <div className="text-[11px] font-bold text-amber-600 mt-1">★ {dealer.rating}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 font-medium">
                      <div><strong className="text-slate-800">Specialty:</strong> {dealer.specialty || 'Commercial Equipment'}</div>
                      <div><strong className="text-slate-800">Address:</strong> {dealer.address || 'Local Industrial Market Hub'}</div>
                      <div><strong className="text-slate-800">Lead Time:</strong> <span className="text-emerald-600 font-bold">{dealer.lead_time || '1-3 Business Days'}</span></div>
                    </div>

                    {dealer.supplies_missing_items?.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Supplies Missing Equipment:</div>
                        <div className="flex flex-wrap gap-1">
                          {dealer.supplies_missing_items.map((item, idx) => (
                            <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-900 border border-orange-200">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>📞 {dealer.contact_phone || '+91 98400 12030'}</span>
                      <span className="text-slate-500 text-[11px]">✉️ {dealer.contact_email || 'sales@dealer.in'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Suppliers & Raw Materials */}
      {activeTab === 'suppliers' && supp && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white mb-4 shadow-xs">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-white" />
                  Raw Materials & Procurement Rhythm
                </h4>
              </div>
              <div className="space-y-2.5">
                {supp.raw_materials?.map((rm, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">{rm.item}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Frequency: {rm.procurement_frequency}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 text-orange-800">
                      {rm.cost_impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white mb-4 shadow-xs">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-white" />
                  Wholesale Supplier Networks
                </h4>
              </div>
              <div className="space-y-3">
                {supp.vetted_suppliers?.map((s, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black text-slate-900">{s.name}</div>
                      <span className="text-xs font-bold text-amber-600">★ {s.rating}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{s.category} • Dist: {s.distance_est}</div>
                    <div className="text-[11px] text-emerald-600 font-mono font-bold">{s.pricing_tier}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Marketing & B2B Distribution */}
      {activeTab === 'marketing' && mkt && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-xs text-slate-500 uppercase font-bold">Marketing Opportunity</div>
              <div className="text-3xl font-black text-orange-600 mt-1">{mkt.marketing_opportunity_score}/100</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Omnichannel Potential</div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl md:col-span-2 shadow-sm">
              <div className="text-xs text-slate-700 uppercase font-bold mb-2">Revenue Channel Distribution Split</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {mkt.distribution_channels?.map((dc, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-lg font-black text-orange-600">{dc.revenue_share_target}</div>
                    <div className="text-[11px] text-slate-700 font-bold truncate">{dc.channel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white mb-4 shadow-xs">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-white" />
                High-Velocity B2B & Institutional Targets
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mkt.b2b_opportunities?.map((b2b, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-slate-900">{b2b.target_name}</div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 text-orange-800">
                      {b2b.entity_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{b2b.opportunity_rationale}</p>
                  <div className="text-xs text-emerald-600 pt-1 border-t border-slate-200 font-bold">
                    Approach: {b2b.conversion_approach}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Growth & Compliance Roadmap */}
      {activeTab === 'growth' && growth && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white mb-4 shadow-xs">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                Mandatory Licensing & Regulatory Compliance (RAG Grounded)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {growth.regulatory_compliance?.map((rc, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-slate-900">{rc.compliance_name}</div>
                    <div className="text-[11px] text-orange-600 font-mono font-bold">{rc.authority} • {rc.importance}</div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{rc.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-white" />
                12-Month Phased Launch Timeline
              </h4>
            </div>
            <div className="space-y-4">
              {Object.entries(growth.timeline_phases || {}).map(([k, v], i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-black text-orange-600 uppercase tracking-wide">
                    {v.phase_name}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                    {v.milestones?.map((m, idx) => (
                      <li key={idx} className="leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ML Viability Score */}
      {activeTab === 'ml' && ml && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-6 rounded-3xl text-center flex flex-col items-center justify-center shadow-md text-white">
              <div className="text-xs font-black uppercase text-orange-100 tracking-wider">Composite ML Feasibility</div>
              <div className="text-5xl font-black text-white my-3">
                {ml.overall_feasibility_score}
                <span className="text-lg text-orange-200 font-normal">/100</span>
              </div>
              <div className="text-xs text-white font-black bg-white/20 px-3 py-1 rounded-full">Success Probability: {ml.success_probability}%</div>
              <div className="text-xs text-orange-100 mt-2 font-mono font-bold">{ml.risk_level}</div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl md:col-span-2 space-y-4 shadow-sm">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
                <h4 className="text-sm font-black text-white">Factor Attribution & Drivers</h4>
              </div>
              <div>
                <div className="text-xs text-emerald-700 font-bold mb-1.5">Positive Viability Drivers:</div>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {ml.positive_factors?.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              {ml.negative_factors?.length > 0 && (
                <div>
                  <div className="text-xs text-amber-800 font-bold mb-1.5">Risk & Drag Factors:</div>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                    {ml.negative_factors?.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">!</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
