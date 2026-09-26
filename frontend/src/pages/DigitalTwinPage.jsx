import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  Filter,
  Info,
  X,
  ArrowLeft,
  Compass,
  Building,
  MapPin,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Target,
  Maximize2,
} from 'lucide-react';
import { intelligenceService } from '../services/api';

export default function DigitalTwinPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInteriorMode, setIsInteriorMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const intel = await intelligenceService.getFullIntelligence(id);
        setData(intel);
      } catch (err) {
        console.error('Failed to load spatial operations data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-14 h-14 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mb-4" />
        <h3 className="text-lg font-black text-slate-900">Loading Digital Operations Blueprint...</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Retrieving spatial markers, catchment telemetry, and facility specs</p>
      </div>
    );
  }

  const { business, location_analysis: loc, equipment_analysis: equip } = data;

  const rawMarkers = loc?.spatial_markers || [];
  const equipmentList = equip?.spatial_3d_specs || equip?.recommendations || [];

  const filters = [
    { id: 'all', label: 'All Entities', color: 'bg-white text-slate-700 border-slate-200' },
    { id: 'competitor', label: 'Competitors', color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 'potential_customer', label: 'Customers', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'supplier', label: 'Suppliers', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'distribution', label: 'Distribution', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  const filteredMarkers = activeFilter === 'all'
    ? rawMarkers
    : rawMarkers.filter((m) => (m.category || m.type || '').toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="relative w-full min-h-[calc(100vh-5rem)] rounded-3xl overflow-hidden border border-slate-200 bg-[#F8FAFC] shadow-sm flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 z-20 shadow-xs">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to={`/businesses/${id}/analysis`}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-all cursor-pointer border border-slate-200"
            title="Back to Analysis"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-[10px] uppercase font-black tracking-wider text-orange-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Digital Operations Matrix
            </div>
            <h1 className="text-base font-black text-slate-900 truncate max-w-xs sm:max-w-md">
              {business.business_name}
            </h1>
          </div>
        </div>

        {/* Center: View Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => {
              setIsInteriorMode(false);
              setSelectedObject(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isInteriorMode
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catchment & Ecosystem
          </button>
          <button
            onClick={() => {
              setIsInteriorMode(true);
              setSelectedObject(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isInteriorMode
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facility Floor Blueprint
          </button>
        </div>

        {/* Right: Filters */}
        {!isInteriorMode && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            {filters.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-orange-500 text-white font-black border-orange-600 shadow-xs'
                      : `${f.color} hover:border-orange-300`
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {!isInteriorMode ? (
          /* MODE 1: CATCHMENT & ECOSYSTEM MATRIX */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
              <div>
                <h2 className="text-sm font-black text-white">Geospatial Catchment Nodes</h2>
                <p className="text-xs text-orange-100 font-medium">
                  Showing {filteredMarkers.length} identified businesses, suppliers, and client clusters within operational radius
                </p>
              </div>
              <span className="text-[11px] font-mono text-orange-800 bg-white font-bold px-2.5 py-1 rounded-full shadow-xs">
                Lat: {business.latitude || '13.0827'} • Lng: {business.longitude || '80.2707'}
              </span>
            </div>

            {filteredMarkers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <div className="text-sm font-black text-slate-900">No Spatial Entities Found</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">Run location intelligence agent to populate catchment data.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMarkers.map((marker, idx) => {
                  const category = marker.category || marker.type || 'Entity';
                  const isCompetitor = category.toLowerCase().includes('competitor');
                  const isCustomer = category.toLowerCase().includes('customer');
                  const isSupplier = category.toLowerCase().includes('supplier');

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedObject(marker)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                        selectedObject === marker
                          ? 'border-orange-500 bg-orange-50 shadow-sm ring-2 ring-orange-500/50'
                          : 'border-slate-200 bg-white hover:border-orange-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isCompetitor
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : isCustomer
                                ? 'bg-orange-50 text-orange-800 border-orange-200'
                                : isSupplier
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {category}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 mt-2 truncate">
                            {marker.name || marker.title || `Catchment Node #${idx + 1}`}
                          </h3>
                        </div>
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-1" />
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Distance: {marker.distance || '1.2 km'}</span>
                        <span className="text-orange-600 font-bold hover:underline">Inspect Details →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: FACILITY FLOOR BLUEPRINT */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
              <div>
                <h2 className="text-sm font-black text-white">Architectural Equipment & Floor Layout Blueprint</h2>
                <p className="text-xs text-orange-100 font-medium">
                  Spatial distribution of hardware, stations, and operational zones
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-white font-bold px-2.5 py-1 rounded-full shadow-xs">
                Floor Area: ~2,400 sq ft
              </span>
            </div>

            {/* Architectural Blueprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipmentList.length > 0 ? (
                equipmentList.map((eq, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedObject(eq)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                      selectedObject === eq
                        ? 'border-orange-500 bg-orange-50 shadow-sm ring-2 ring-orange-500/50'
                        : 'border-slate-200 bg-white hover:border-orange-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 truncate max-w-[180px]">
                            {eq.name || eq.item || `Equipment Zone #${i + 1}`}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Zone: {eq.zone || 'Primary Floor'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-orange-600">
                        {eq.estimated_cost ? `₹${Number(eq.estimated_cost).toLocaleString('en-IN')}` : 'Allocated'}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                      <div>Power: <strong className="text-slate-900">{eq.power || '2.5 kW'}</strong></div>
                      <div>Footprint: <strong className="text-slate-900">{eq.footprint || '12 sq ft'}</strong></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <div className="text-sm font-black text-slate-900">No Equipment Configured</div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">
                    Run the equipment & spatial agent to generate the facility blueprint.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Inspector Drawer */}
      {selectedObject && (
        <div className="absolute top-20 right-6 bottom-6 w-80 sm:w-96 z-30 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                Entity Telemetry
              </span>
              <button
                onClick={() => setSelectedObject(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-base font-black text-slate-900">
                {selectedObject.name || selectedObject.title || 'Selected Entity'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedObject.description || selectedObject.details || 'Configured operational node within business environment matrix.'}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                {Object.entries(selectedObject).slice(0, 6).map(([k, v]) => {
                  if (typeof v === 'object' || k === 'description') return null;
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium capitalize">{k.replace(/_/g, ' ')}</span>
                      <span className="text-slate-900 font-bold">{String(v)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => setSelectedObject(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
