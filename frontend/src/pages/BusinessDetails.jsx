import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../services/api';
import Notification from '../components/Notification';
import AnalysisModal from '../components/AnalysisModal';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Building2,
  IndianRupee,
  MapPin,
  Compass,
  Wrench,
  Sparkles,
  Calendar,
  Layers,
  Box,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Brain,
  AlertTriangle,
} from 'lucide-react';

export const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Analysis modal state
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await businessService.getBusinessById(id);
        setBusiness(data);
      } catch (err) {
        console.error('Error fetching business details:', err);
        setNotification({
          type: 'error',
          message:
            err?.response?.data?.detail ||
            'Business not found or you do not have permission to view it.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await businessService.deleteBusiness(id);
      setNotification({
        type: 'success',
        message: 'Business deleted successfully from database.',
      });
      setTimeout(() => {
        navigate('/dashboard/businesses');
      }, 1000);
    } catch (err) {
      console.error('Error deleting business:', err);
      setNotification({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to delete business.',
      });
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

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
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 max-w-xl mx-auto">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Loading VENTURE AI Enterprise...</h3>
        <p className="text-xs text-slate-500 font-medium">
          Querying record #{id} and user authorization.
        </p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Business Record Not Found</h3>
        <p className="text-xs text-slate-500 font-medium">
          The requested business ID does not exist or belongs to another user account.
        </p>
        <button
          onClick={() => navigate('/dashboard/businesses')}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Businesses</span>
        </button>
      </div>
    );
  }

  const equipmentStatusLabel = {
    all: { text: 'Fully Equipped (All Owned)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    some: { text: 'Partially Equipped (Some Owned)', color: 'text-orange-700 bg-orange-50 border-orange-300' },
    none: { text: 'Procurement Needed (None Owned)', color: 'text-amber-700 bg-amber-50 border-amber-300' },
  }[business.equipment_status] || { text: business.equipment_status, color: 'text-slate-700 bg-slate-100 border-slate-200' };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard/businesses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Businesses</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/businesses/${business.id}/edit`)}
            className="px-4 py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-orange-500" />
            <span>Edit Parameters</span>
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Title Banner (Orange Background & White Text) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-white">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/40 text-white text-xs font-black flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Digital Twin Venture #{business.id}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-700 shadow-xs">
              {equipmentStatusLabel.text}
            </span>
            <span className="text-xs text-orange-100 font-mono font-medium">
              Created: {formatDate(business.created_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {business.business_name || business.name}
          </h1>

          <p className="text-sm text-orange-50 max-w-3xl leading-relaxed font-medium">
            {business.description}
          </p>
        </div>
      </div>

      {/* Commercial Facility Schematic & Spatial Overview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        {/* Title Header with Orange Background & White Text */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Commercial Facility & Site Schematic</h2>
              <p className="text-xs text-orange-100 font-medium">
                Spatial footprint and operational layout for {business.business_name || business.name}
              </p>
            </div>
          </div>
          <span className="text-xs text-orange-700 bg-white px-3 py-1 rounded-full flex items-center gap-1.5 font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Facility Verified
          </span>
        </div>

        <div className="w-full rounded-2xl p-4 border border-slate-100 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facility Type</div>
            <div className="text-sm font-black text-slate-900 mt-1">{business.business_type || 'Commercial Enterprise'}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Zoned for multi-agent compliance</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Site Footprint</div>
            <div className="text-sm font-black text-orange-600 mt-1">{business.address || 'Central Prime District'}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Geocoded coordinates linked</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Capital Allocation</div>
            <div className="text-sm font-black text-slate-900 mt-1">₹{Number(business.budget || 0).toLocaleString('en-IN')}</div>
            <div className="text-xs text-orange-600 font-medium mt-1">Budget calibrated for operations</div>
          </div>
        </div>
      </div>

      {/* 3 Structured Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Investment Budget (Orange / INR) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <IndianRupee className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Financial Allocation</h3>
              <p className="text-[11px] text-slate-500 font-medium">Startup Investment Budget (INR)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 font-bold block">Total Planned Capital:</span>
              <span className="text-3xl font-black text-orange-600">
                {formatCurrency(business.budget || business.investment_budget)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="text-slate-800 font-bold block">Capital Readiness:</span>
              <p className="text-[11px] leading-relaxed font-medium">
                Allocated across site lease, initial inventory stocking, utility connections, and operational reserves.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Geographic & Landmark Context */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Geographic Footprint</h3>
              <p className="text-[11px] text-slate-500 font-medium">Exact & Surrounding Areas</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block font-bold">Exact Storefront / Plot Address:</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate font-semibold">{business.exact_location}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block font-bold">Surrounding Landmarks & Hubs:</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2 font-medium">
                <Compass className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>{business.nearby_places || 'No specific landmarks entered.'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Machinery & Equipment Readiness */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm">Equipment Inventory</h3>
              <p className="text-[11px] text-slate-500 font-medium">Physical Asset Status</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-1 font-bold">Declared Readiness:</span>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${equipmentStatusLabel.color}`}>
                {equipmentStatusLabel.text}
              </span>
            </div>

            {business.equipment_status === 'some' && (
              <div className="space-y-1.5">
                <span className="text-slate-600 block font-bold">
                  Confirmed Owned Assets ({business.equipment_owned?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {business.equipment_owned && business.equipment_owned.length > 0 ? (
                    business.equipment_owned.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-900 text-[11px] font-bold"
                      >
                        ✓ {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific items listed</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Feasibility Readiness Banner (Orange & White) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black shadow-xs">
            <Brain className="w-4 h-4 text-white" />
            <span>AI Business Understanding Agent</span>
          </div>
          <h3 className="text-lg font-black text-white">
            Run AI Business Concept & Feasibility Classification
          </h3>
          <p className="text-xs text-orange-50 max-w-2xl leading-relaxed font-medium">
            The Business Understanding Agent extracts taxonomy, monetization model, resource needs, operational prerequisites, and risk profiles.
          </p>
        </div>

        <button
          onClick={() => setAnalysisModalOpen(true)}
          className="px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2.5 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>{business.status === 'analyzed' ? 'View AI Analysis Report' : 'Analyze My Business'}</span>
        </button>
      </div>

      {/* AI Business Understanding Analysis Modal */}
      <AnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        business={business}
        onAnalysisComplete={() => {
          setBusiness((prev) => (prev ? { ...prev, status: 'analyzed' } : prev));
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Delete Business Record</h3>
                <p className="text-xs text-slate-500 font-medium">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">"{business.business_name || business.name}"</strong>?
              This record will be removed from the system.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
