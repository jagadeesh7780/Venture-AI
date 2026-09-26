import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../services/api';
import BusinessCard from '../components/BusinessCard';
import Notification from '../components/Notification';
import AnalysisModal from '../components/AnalysisModal';
import {
  Briefcase,
  Plus,
  Search,
  Building2,
  IndianRupee,
  Layers,
  AlertTriangle,
  Loader2,
  Filter,
} from 'lucide-react';

export const MyBusinesses = () => {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all_filter');
  const [notification, setNotification] = useState(null);

  // Analysis modal state
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [businessToAnalyze, setBusinessToAnalyze] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // Fetch businesses for currently authenticated user
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinesses();
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setNotification({
        type: 'error',
        message: 'Could not load your businesses from PostgreSQL. Please ensure the backend is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Open delete confirmation modal
  const handleDeletePrompt = (business) => {
    setBusinessToDelete(business);
    setDeleteModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;
    try {
      setIsDeleting(true);
      await businessService.deleteBusiness(businessToDelete.id);
      setBusinesses((prev) => prev.filter((b) => b.id !== businessToDelete.id));
      setNotification({
        type: 'success',
        message: `Business "${businessToDelete.business_name || businessToDelete.name}" was permanently deleted.`,
      });
      setDeleteModalOpen(false);
      setBusinessToDelete(null);
    } catch (err) {
      console.error('Error deleting business:', err);
      setNotification({
        type: 'error',
        message:
          err?.response?.data?.detail ||
          'Failed to delete business. You can only delete businesses you own.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter businesses by search term and equipment status
  const filteredBusinesses = businesses.filter((b) => {
    const name = (b.business_name || b.name || '').toLowerCase();
    const desc = (b.description || '').toLowerCase();
    const loc = (b.exact_location || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = name.includes(query) || desc.includes(query) || loc.includes(query);
    const matchesFilter =
      equipmentFilter === 'all_filter' || b.equipment_status === equipmentFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate summary metrics
  const totalBudget = businesses.reduce((acc, curr) => {
    const amt = parseFloat(curr.budget || curr.investment_budget || 0);
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner (Orange Background with Crisp White Text) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-white" />
              <span>Step 2: Business Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              My Businesses
            </h1>
            <p className="text-xs sm:text-sm text-orange-50 max-w-2xl leading-relaxed font-medium">
              Manage your commercial digital twin portfolio stored in PostgreSQL. View parameters, update feasibility data, or prepare for AI analysis.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/create')}
            className="self-start md:self-center px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-black/10 hover:shadow-black/20 flex items-center gap-2.5 transition-all duration-200 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-orange-600 stroke-[3]" />
            <span>Create Business</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Businesses */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Active Ventures
            </span>
            <span className="text-2xl font-black text-slate-900">{businesses.length}</span>
          </div>
        </div>

        {/* Metric 2: Total Investment Capital */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              Total Capital Budget
            </span>
            <span className="text-2xl font-black text-orange-600">
              ₹{totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Metric 3: Ready for AI Analysis */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:border-orange-300 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
              AI Readiness Status
            </span>
            <span className="text-2xl font-black text-slate-900">
              {businesses.length > 0 ? 'Ready (Step 3)' : '0 Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search businesses by name, description, or location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Equipment Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-orange-500 shrink-0" />
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
          >
            <option value="all_filter">All Equipment Statuses</option>
            <option value="all">Fully Equipped (all)</option>
            <option value="some">Partially Equipped (some)</option>
            <option value="none">Procurement Needed (none)</option>
          </select>
        </div>
      </div>

      {/* Business Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">
            Fetching businesses from PostgreSQL database...
          </p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mx-auto shadow-xs">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {searchTerm ? 'No matching businesses found' : 'No businesses registered yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {searchTerm
                ? 'Try adjusting your search keywords or equipment status filter.'
                : 'Initialize your first commercial digital twin feasibility study by adding your business idea.'}
            </p>
          </div>

          {!searchTerm && (
            <button
              onClick={() => navigate('/dashboard/create')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Business</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              onDelete={handleDeletePrompt}
              onAnalyze={(selectedBiz) => {
                setBusinessToAnalyze(selectedBiz);
                setAnalysisModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* AI Business Understanding Analysis Modal (Step 3) */}
      <AnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => {
          setAnalysisModalOpen(false);
          setBusinessToAnalyze(null);
        }}
        business={businessToAnalyze}
        onAnalysisComplete={(bizId) => {
          setBusinesses((prev) =>
            prev.map((b) => (b.id === bizId ? { ...b, status: 'analyzed' } : b))
          );
        }}
      />


      {/* Delete Confirmation Modal */}
      {deleteModalOpen && businessToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Business Record</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">
                "{businessToDelete.business_name || businessToDelete.name}"
              </strong>{' '}
              from PostgreSQL? All associated feasibility records and location parameters will be removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setBusinessToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting from DB...</span>
                  </>
                ) : (
                  <span>Yes, Delete Business</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBusinesses;
