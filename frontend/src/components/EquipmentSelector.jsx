import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  PackageCheck,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Layers,
  Search,
  Filter,
  Info,
  IndianRupee,
  TrendingUp,
} from 'lucide-react';
import { datasetService } from '../services/api';
import { getInstantMSMEEquipment } from '../data/msmeEquipmentCatalog';

export const EquipmentSelector = ({ formData, onStatusChange, onEquipmentListChange, errors }) => {
  const [customItem, setCustomItem] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'mandatory', 'operational', 'owned'

  const currentOwned = formData.equipment_owned || [];

  // 1. Instant 0ms Latency MSME Catalog Initialization (Never empty)
  const [datasetMatch, setDatasetMatch] = useState(() =>
    getInstantMSMEEquipment(formData.business_name, formData.category, currentOwned)
  );
  const [matchingLoading, setMatchingLoading] = useState(false);

  const statusOptions = [
    {
      value: 'all',
      title: 'I have all equipment',
      description: 'Fully equipped and ready to operate immediately without capital procurement.',
    },
    {
      value: 'some',
      title: 'I have some equipment',
      description: 'Partially equipped; inventory details will specify owned vs missing assets.',
    },
    {
      value: 'none',
      title: 'I need equipment',
      description: 'Zero existing physical machinery; complete procurement pipeline required.',
    },
  ];

  // 2. Synchronously refresh local MSME manifest whenever business inputs change
  useEffect(() => {
    const instantData = getInstantMSMEEquipment(formData.business_name, formData.category, currentOwned);
    setDatasetMatch(instantData);
  }, [formData.business_name, formData.category, formData.equipment_owned]);

  // 3. Concurrently query backend for Google Places local machinery dealers & dynamic refinement
  const runDatasetMatch = async () => {
    const query = `${formData.business_name || ''} ${formData.category || ''}`.trim() || formData.category || 'Commercial Venture';
    if (!query) return;

    try {
      setMatchingLoading(true);
      const res = await datasetService.matchEquipment(query, currentOwned, formData.exact_location);
      if (res && res.equipment_comparison && res.equipment_comparison.all_mapped_equipment?.length > 0) {
        setDatasetMatch((prev) => ({
          ...prev,
          matched_business: res.matched_business || prev.matched_business,
          equipment_comparison: res.equipment_comparison,
          nearby_providers: res.nearby_providers || [],
        }));
      }
    } catch (err) {
      console.warn('Backend equipment refinement note:', err?.message);
    } finally {
      setMatchingLoading(false);
    }
  };

  useEffect(() => {
    runDatasetMatch();
  }, [formData.business_name, formData.category, formData.exact_location]);

  // Toggle item ownership
  const handleToggleItem = (itemName) => {
    let updated;
    const exists = currentOwned.some((x) => x.toLowerCase() === itemName.toLowerCase());
    if (exists) {
      updated = currentOwned.filter((x) => x.toLowerCase() !== itemName.toLowerCase());
    } else {
      updated = [...currentOwned, itemName];
    }
    onEquipmentListChange(updated);

    // If user interacts with list, set equipment_status to 'some' if not already
    if (formData.equipment_status !== 'some' && updated.length > 0) {
      onStatusChange('some');
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const trimmed = customItem.trim();
    if (trimmed && !currentOwned.some((x) => x.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...currentOwned, trimmed];
      onEquipmentListChange(updated);
      setCustomItem('');
      if (formData.equipment_status !== 'some') {
        onStatusChange('some');
      }
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    onEquipmentListChange(currentOwned.filter((x) => x !== itemToRemove));
  };

  // Extract equipment list safely
  const rawList = datasetMatch?.equipment_comparison?.all_mapped_equipment || [];
  const filteredEquipment = rawList.filter((item) => {
    const name = item.equipment_name || item.name || '';
    const isOwned = currentOwned.some(
      (o) => o.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(o.toLowerCase())
    );
    const isMandatory = item.priority === 'Mandatory' || item.essential === 'Yes';

    if (filterMode === 'mandatory') return isMandatory;
    if (filterMode === 'operational') return !isMandatory;
    if (filterMode === 'owned') return isOwned;
    return true;
  });

  const totalItemsCount = rawList.length;
  const ownedCount = rawList.filter((item) => {
    const name = item.equipment_name || item.name || '';
    return currentOwned.some(
      (o) => o.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(o.toLowerCase())
    );
  }).length;
  const missingCount = Math.max(0, totalItemsCount - ownedCount);

  const totalCost = rawList.reduce((sum, item) => sum + (Number(item.estimated_cost || item.unit_price) || 0), 0);
  const missingCost = rawList.reduce((sum, item) => {
    const name = item.equipment_name || item.name || '';
    const isOwned = currentOwned.some(
      (o) => o.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(o.toLowerCase())
    );
    return isOwned ? sum : sum + (Number(item.estimated_cost || item.unit_price) || 0);
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header with Orange Background & White Text */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-md">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-white" />
          Step 3: Machinery & Equipment Readiness
        </h3>
        <p className="text-xs text-orange-100 font-medium mt-1">
          Review operational machinery derived from MSME Project Profiles, NSIC Machinery Directory & Industry Standards.
        </p>
      </div>

      {/* Main MSME Enterprise Equipment Intelligence Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Card Header Banner in Orange */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              MSME & Commercial Portal Machinery Manifest
            </span>
          </div>
          <div className="flex items-center gap-2">
            {matchingLoading && (
              <span className="text-[10px] text-white/90 animate-pulse font-semibold">Syncing location providers...</span>
            )}
            <span className="text-[10px] font-mono text-orange-700 bg-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-orange-600" />
              MSME & NSIC Standard Grounded
            </span>
          </div>
        </div>

        {/* Enterprise Profile & Standard Framework Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Enterprise Classification
              </div>
              <div className="text-sm font-black text-slate-900 mt-0.5">
                {formData.business_name || datasetMatch?.matched_business?.business_name || 'Venture Enterprise'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-500 text-white shadow-xs">
                {formData.category || datasetMatch?.matched_business?.category || 'Commercial Industry'}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-700 font-mono bg-white px-2.5 py-1.5 rounded border border-slate-200 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-orange-500" />
            <span>Standard: <strong>{datasetMatch?.matched_business?.standard_framework || 'MSME Ministry Scheme Norms'}</strong></span>
          </div>
        </div>

        {/* Capital Telemetry Strip */}
        <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="border-r border-slate-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Required Assets</div>
            <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{totalItemsCount} Units</div>
            <div className="text-[10px] text-slate-600 font-mono font-semibold">₹{totalCost.toLocaleString('en-IN')}</div>
          </div>
          <div className="border-r border-slate-200">
            <div className="text-[10px] text-emerald-600 uppercase font-bold">In-House Owned</div>
            <div className="text-sm sm:text-base font-black text-emerald-600 mt-0.5">{ownedCount} Units</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Available</div>
          </div>
          <div>
            <div className="text-[10px] text-orange-600 uppercase font-bold">To Procure</div>
            <div className="text-sm sm:text-base font-black text-orange-600 mt-0.5">{missingCount} Units</div>
            <div className="text-[10px] text-orange-600 font-mono font-semibold">₹{missingCost.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-bold text-[11px]">Filter:</span>
            {[
              { id: 'all', label: `All (${totalItemsCount})` },
              { id: 'mandatory', label: 'Mandatory' },
              { id: 'operational', label: 'Operational' },
              { id: 'owned', label: `Owned (${ownedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                  filterMode === f.id
                    ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-orange-600 hover:border-orange-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Click item to toggle In-House vs Procurement
          </span>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {filteredEquipment.map((eq, idx) => {
            const eqName = eq.equipment_name || eq.name;
            const isAvailable = currentOwned.some(
              (o) => o.toLowerCase() === eqName.toLowerCase() || eqName.toLowerCase().includes(o.toLowerCase())
            );
            const isMandatory = eq.priority === 'Mandatory' || eq.essential === 'Yes';
            const eqQty = eq.typical_quantity || eq.quantity || 1;
            const purpose = eq.purpose || 'Commercial production and operations';
            const standard = eq.standard || 'Industrial Standard';
            const cost = Number(eq.estimated_cost || eq.unit_price) || 0;

            return (
              <button
                type="button"
                key={eq.equipment_id || idx}
                onClick={() => handleToggleItem(eqName)}
                className={`flex flex-col justify-between p-3.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                  isAvailable
                    ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-sm ring-1 ring-orange-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50/40'
                }`}
              >
                <div className="flex items-start gap-2.5 w-full">
                  <div
                    className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border shrink-0 transition-all ${
                      isAvailable
                        ? 'bg-orange-500 border-orange-600 text-white font-black text-[10px]'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-slate-900 text-xs leading-snug">{eqName}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">{purpose}</div>
                    <div className="text-[10px] text-orange-600 font-mono mt-1 font-semibold truncate">
                      ⚙️ {standard}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Qty: <strong className="text-slate-800">{eqQty}</strong></span>
                    <span>•</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        isMandatory
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-orange-100 text-orange-800 border border-orange-300'
                      }`}
                    >
                      {isMandatory ? 'Mandatory' : 'Operational'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-orange-600 font-extrabold">₹{cost.toLocaleString('en-IN')}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isAvailable ? 'OWNED' : 'PROCURE'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Status Radio Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Equipment Readiness Status <span className="text-orange-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {statusOptions.map((opt) => {
            const isSelected = formData.equipment_status === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 shadow-sm ring-2 ring-orange-500/50'
                    : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{opt.title}</span>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>
        {errors?.equipment_status && (
          <p className="text-xs text-red-600 font-semibold">{errors.equipment_status}</p>
        )}
      </div>

      {/* Equipment Checklist & Custom Item Addition */}
      {formData.equipment_status === 'some' && (
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-orange-500" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Confirmed In-House Hardware <span className="text-orange-500">*</span>
              </label>
            </div>
            <span className="text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full shadow-xs">
              {currentOwned.length} Items Selected
            </span>
          </div>

          {/* Add Custom Equipment Item */}
          <div className="pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Add bespoke equipment, machine, or proprietary tooling..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustom(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customItem.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 disabled:opacity-40 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-orange-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* List of currently selected tags */}
          {currentOwned.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Selected Available Assets:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentOwned.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-300 text-xs font-bold text-orange-900 shadow-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className="text-slate-500 hover:text-red-500 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {errors?.equipment_owned && (
            <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errors.equipment_owned}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentSelector;
