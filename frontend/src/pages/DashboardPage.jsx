import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { businessService } from '../services/api';
import BusinessCard from '../components/BusinessCard';
import Notification from '../components/Notification';
import AnalysisModal from '../components/AnalysisModal';
import {
  Plus,
  Box,
  Building2,
  IndianRupee,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  Loader2,
  Briefcase,
  AlertTriangle,
  Activity,
  Cpu,
  Layers,
  Globe2,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [notification, setNotification] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBusinesses = async () => {
    try {
      setLoadingBusinesses(true);
      const data = await businessService.getBusinesses();
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDeletePrompt = (business) => {
    setBusinessToDelete(business);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;
    try {
      setIsDeleting(true);
      await businessService.deleteBusiness(businessToDelete.id);
      setBusinesses((prev) => prev.filter((b) => b.id !== businessToDelete.id));
      setNotification({
        type: 'success',
        message: `Business "${businessToDelete.business_name || businessToDelete.name}" was deleted.`,
      });
      setDeleteModalOpen(false);
      setBusinessToDelete(null);
    } catch (err) {
      console.error('Error deleting business:', err);
      setNotification({
        type: 'error',
        message: err?.response?.data?.detail || 'Failed to delete business.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCapital = businesses.reduce((acc, curr) => {
    const val = parseFloat(curr.budget || curr.investment_budget || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner & Action Header (Orange Background with White Text) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>VENTURE AI • Autonomous Enterprise Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="text-white underline decoration-white/40">{user?.full_name?.split(' ')[0] || 'Founder'}</span> 👋
            </h1>
            <p className="text-sm text-orange-50 max-w-xl leading-relaxed font-medium">
              Model, simulate, and launch your business with Google Maps geocoding, RAG regulatory intelligence, deterministic financial algorithms, and interactive 3D spatial twins.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/create')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-sm shadow-xl shadow-black/10 flex items-center gap-2 shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-orange-600 stroke-[3]" />
            <span>Create New Business</span>
          </button>
        </div>

        {/* Global Portfolio KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/25">
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">Active Ventures</div>
            <div className="text-3xl font-black text-white mt-0.5">{businesses.length}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">Total Capital Tracked</div>
            <div className="text-3xl font-black text-white mt-0.5">₹{totalCapital.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">Geocoding Engine</div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span> Google Maps API Active
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">RAG Knowledge Base</div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span> 21 Regulatory Chunks
            </div>
          </div>
        </div>
      </div>

      {/* Business Operations Command Deck Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        {/* Section Heading with Orange Background & White Text */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between mb-5 shadow-md">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-white animate-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">Facility Operations & Supply Chain Telemetry</h2>
          </div>
          <span className="text-xs text-white font-mono bg-white/20 border border-white/30 px-3 py-1 rounded-full font-bold">
            Autonomous Engine Online
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3.5 hover:bg-orange-50 transition-colors">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Logistics & Spatial Hubs</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">Autonomous Terminal</div>
              <div className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Geocoded Coordinates
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3.5 hover:bg-orange-50 transition-colors">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Multi-Agent Intelligence</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">9 Active Neural Nodes</div>
              <div className="text-[11px] text-orange-700 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Deterministic Pipeline Sync
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex items-start gap-3.5 hover:bg-orange-50 transition-colors">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Financial & Market Yield</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">NPV / IRR Algorithmic</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 5-Year Projections Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ventures Catalog Section */}
      <div className="space-y-4">
        {/* Title Banner with Orange Background and White Text */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Your Businesses & Operations</h2>
            <p className="text-xs text-orange-100 mt-0.5 font-medium">Manage parameters, launch multi-agent analysis, or inspect facility metrics</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/businesses')}
            className="self-start sm:self-center px-4 py-2 bg-white/20 hover:bg-white text-white hover:text-orange-600 text-xs font-bold rounded-xl border border-white/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingBusinesses ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
            <div className="text-xs text-slate-600 font-semibold">Loading business ventures...</div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mx-auto shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Businesses Added Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first business feasibility profile to start running the 9-agent intelligence pipeline.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Business</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && businessToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Delete Business Record</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{businessToDelete.business_name || businessToDelete.name}</strong>? All associated multi-agent analysis, financial models, and facility records will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/20"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
