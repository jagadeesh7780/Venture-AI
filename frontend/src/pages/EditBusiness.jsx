import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../services/api';
import BusinessInformationForm from '../components/BusinessInformationForm';
import LocationForm from '../components/LocationForm';
import EquipmentSelector from '../components/EquipmentSelector';
import Notification from '../components/Notification';
import {
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const EditBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    budget: '',
    exact_location: '',
    nearby_places: '',
    equipment_status: 'some',
    equipment_owned: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await businessService.getBusinessById(id);
        setFormData({
          business_name: data.business_name || data.name || '',
          description: data.description || '',
          budget: data.budget || data.investment_budget || '',
          exact_location: data.exact_location || '',
          nearby_places: data.nearby_places || '',
          equipment_status: data.equipment_status || 'some',
          equipment_owned: data.equipment_owned || [],
        });
      } catch (err) {
        console.error('Error loading business for edit:', err);
        setNotification({
          type: 'error',
          message:
            err?.response?.data?.detail ||
            'Could not load business. It may not exist or you do not have permission to edit it.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEquipmentStatusChange = (val) => {
    setFormData((prev) => ({ ...prev, equipment_status: val }));
    if (errors.equipment_status) {
      setErrors((prev) => ({ ...prev, equipment_status: null }));
    }
  };

  const handleEquipmentListChange = (items) => {
    setFormData((prev) => ({ ...prev, equipment_owned: items }));
    if (errors.equipment_owned) {
      setErrors((prev) => ({ ...prev, equipment_owned: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.business_name || formData.business_name.trim().length < 2) {
      newErrors.business_name = 'Business name must be at least 2 characters.';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }
    const numBudget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(numBudget) || numBudget <= 0) {
      newErrors.budget = 'Investment budget must be a positive number greater than 0.';
    }
    if (!formData.exact_location || formData.exact_location.trim().length < 3) {
      newErrors.exact_location = 'Exact location is required (min 3 characters).';
    }
    if (!formData.equipment_status) {
      newErrors.equipment_status = 'Please select equipment status.';
    }
    if (
      formData.equipment_status === 'some' &&
      (!formData.equipment_owned || formData.equipment_owned.length === 0)
    ) {
      newErrors.equipment_owned =
        'Please select or enter at least one owned equipment item when "I have some equipment" is selected.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        business_name: formData.business_name.trim(),
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        exact_location: formData.exact_location.trim(),
        nearby_places: formData.nearby_places?.trim() || null,
        equipment_status: formData.equipment_status,
        equipment_owned:
          formData.equipment_status === 'some' ? formData.equipment_owned : [],
      };

      await businessService.updateBusiness(id, payload);

      setNotification({
        type: 'success',
        message: 'Business parameters updated successfully!',
      });

      setTimeout(() => {
        navigate(`/dashboard/businesses/${id}`);
      }, 1000);
    } catch (err) {
      console.error('Error updating business:', err);
      setNotification({
        type: 'error',
        message:
          err?.response?.data?.detail ||
          'Failed to update business. Please check backend connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 max-w-xl mx-auto">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Loading Business Parameters...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <button
        onClick={() => navigate(`/dashboard/businesses/${id}`)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Business Details</span>
      </button>

      {/* Header Banner (Orange Background with White Text) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden text-white">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black shadow-xs">
            <Edit3 className="w-3.5 h-3.5 text-white" />
            <span>Update Business Record #{id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Edit Business Parameters
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-2xl leading-relaxed font-medium">
            Modify venture information, budget constraints, geographic coordinates, or owned equipment inventory.
          </p>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Edit Form Body (White Card Background) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
      >
        <BusinessInformationForm
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
        />

        <LocationForm
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
        />

        <EquipmentSelector
          formData={formData}
          onStatusChange={handleEquipmentStatusChange}
          onEquipmentListChange={handleEquipmentListChange}
          errors={errors}
        />

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/businesses/${id}`)}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200 shadow-xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Update Business</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusiness;
