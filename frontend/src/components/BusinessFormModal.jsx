import React, { useState } from 'react';
import { businessService } from '../services/api';
import Notification from './Notification';
import {
  X,
  Building2,
  IndianRupee,
  MapPin,
  Compass,
  Wrench,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const BusinessFormModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    investment_budget: '',
    exact_location: '',
    nearby_places: '',
    equipment_status: 'I have some equipment',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const equipmentOptions = [
    'I have all equipment',
    'I have some equipment',
    'I need equipment',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.investment_budget ||
      !formData.exact_location.trim() ||
      !formData.nearby_places.trim()
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    const budgetNum = parseFloat(formData.investment_budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError('Investment budget must be a positive number.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        investment_budget: budgetNum,
        exact_location: formData.exact_location.trim(),
        nearby_places: formData.nearby_places.trim(),
        equipment_status: formData.equipment_status,
      };

      const result = await businessService.createBusiness(payload);
      setSuccess(`Business "${result.name}" saved to PostgreSQL successfully!`);

      if (onCreated) {
        onCreated(result);
      }

      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to save business. Ensure PostgreSQL backend is running.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New Business Feasibility Entry</h2>
              <p className="text-xs text-slate-400">Step 1: Capture business information into PostgreSQL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && <Notification type="error" message={error} onClose={() => setError(null)} />}
          {success && <Notification type="success" message={success} />}

          {/* 1. Business Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Business Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apex Artisanal Coffee & Roastery"
              required
              className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
            />
          </div>

          {/* 2. Business Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Business Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product, target audience, business model, and unique value proposition..."
              required
              className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 resize-none"
            />
          </div>

          {/* 3. Investment Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              3. Investment Budget (₹ INR) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="1"
                min="1"
                name="investment_budget"
                value={formData.investment_budget}
                onChange={handleChange}
                placeholder="500000"
                required
                className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* 4. Exact Business Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              4. Exact Business Location * (Physical Address or Coordinates)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="exact_location"
                value={formData.exact_location}
                onChange={handleChange}
                placeholder="452 Market Street, Suite 100, San Francisco, CA 94105"
                required
                className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Specific plot or storefront address.</p>
          </div>

          {/* 5. Nearby Area / Places (Separate Field) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              5. Nearby Area / Places * (Surrounding Landmarks & Transit)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Compass className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="nearby_places"
                value={formData.nearby_places}
                onChange={handleChange}
                placeholder="Near Montgomery Metro Station, adjacent to Salesforce Tower and university"
                required
                className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Distinct from exact location: captures neighborhood foot-traffic context.
            </p>
          </div>

          {/* 6. Equipment Status (3 Options) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              6. Equipment Status *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {equipmentOptions.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    formData.equipment_status === opt
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="equipment_status"
                    value={opt}
                    checked={formData.equipment_status === opt}
                    onChange={handleChange}
                    className="text-cyan-500 focus:ring-cyan-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!success}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to PostgreSQL...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Business</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessFormModal;
