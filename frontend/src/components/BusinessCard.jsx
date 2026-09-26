import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  IndianRupee,
  MapPin,
  Wrench,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  Boxes,
  FileText,
  TrendingUp,
} from 'lucide-react';

export const BusinessCard = ({ business, onDelete }) => {
  const navigate = useNavigate();

  const formatCurrency = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getEquipmentBadge = (status) => {
    switch (status) {
      case 'all':
        return {
          label: 'Fully Equipped',
          className: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40',
        };
      case 'some':
        return {
          label: 'Partially Equipped',
          className: 'text-orange-400 bg-orange-950/50 border-orange-800/40',
        };
      case 'none':
      default:
        return {
          label: 'Procurement Needed',
          className: 'text-amber-400 bg-amber-950/50 border-amber-800/40',
        };
    }
  };

  const eqBadge = getEquipmentBadge(business.equipment_status);

  return (
    <div className="bg-white border border-slate-200 hover:border-orange-500/50 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header: Title & Budget Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
              <h3 className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-orange-600 transition-colors">
                {business.business_name || business.name}
              </h3>
            </div>
            <span className="inline-block text-[11px] text-slate-500 font-mono font-medium">
              ID #{business.id} • {formatDate(business.created_at)}
            </span>
          </div>

          {/* Investment Budget (Orange Background with Crisp White Text) */}
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black shrink-0 flex items-center gap-1 shadow-sm">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{formatCurrency(business.budget || business.investment_budget)}</span>
          </div>
        </div>

        {/* Business Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
          {business.description}
        </p>

        {/* Location & Surrounding Landmarks */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate font-bold">{business.exact_location}</span>
          </div>
          {business.nearby_places && (
            <p className="text-[11px] text-slate-500 line-clamp-1 pl-5">
              Near: {business.nearby_places}
            </p>
          )}
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1"
          >
            <Wrench className="w-3 h-3 text-orange-500" />
            {eqBadge.label}
          </span>

          <span className="text-[11px] font-bold text-orange-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            9 Agents Ready
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
        {/* Main AI Launch Button (Orange Background with White Text) */}
        <button
          onClick={() => navigate(`/businesses/${business.id}/analysis`)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Launch AI Feasibility Hub</span>
        </button>

        {/* Operations & Report Action Grid */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate(`/businesses/${business.id}/digital-twin`)}
            className="px-2 py-1.5 bg-orange-50/80 hover:bg-orange-500 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
            title="Launch Operations Blueprint"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Blueprint</span>
          </button>

          <button
            onClick={() => navigate(`/businesses/${business.id}/report`)}
            className="px-2 py-1.5 bg-slate-50 hover:bg-orange-500 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-500 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
            title="View Executive Feasibility Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>

          <button
            onClick={() => onDelete(business)}
            className="px-2 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
            title="Delete Business Record"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
