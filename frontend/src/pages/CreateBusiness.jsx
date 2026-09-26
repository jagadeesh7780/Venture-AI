import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../services/api';
import BusinessProgress from '../components/BusinessProgress';
import BusinessInformationForm from '../components/BusinessInformationForm';
import LocationForm from '../components/LocationForm';
import EquipmentSelector from '../components/EquipmentSelector';
import FormNavigation from '../components/FormNavigation';
import Notification from '../components/Notification';
import {
  Sparkles,
  Box,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Compass,
  Cpu,
  TrendingUp,
} from 'lucide-react';

export const CreateBusiness = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    category: 'Boutique & Fashion',
    business_name: '',
    description: '',
    budget: '',
    exact_location: '',
    nearby_places: '',
    equipment_status: 'some',
    equipment_owned: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Equipment status radio change handler
  const handleEquipmentStatusChange = (val) => {
    setFormData((prev) => ({ ...prev, equipment_status: val }));
    if (errors.equipment_status) {
      setErrors((prev) => ({ ...prev, equipment_status: null }));
    }
  };

  // Equipment owned list change handler
  const handleEquipmentListChange = (items) => {
    setFormData((prev) => ({ ...prev, equipment_owned: items }));
    if (errors.equipment_owned) {
      setErrors((prev) => ({ ...prev, equipment_owned: null }));
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const stepErrors = {};
    if (!formData.business_name || formData.business_name.trim().length < 2) {
      stepErrors.business_name = 'Business name must be at least 2 characters.';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      stepErrors.description = 'Description must be at least 10 characters.';
    }
    const numBudget = parseFloat(formData.budget);
    if (!formData.budget || isNaN(numBudget) || numBudget <= 0) {
      stepErrors.budget = 'Investment budget must be a positive number greater than 0.';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const stepErrors = {};
    if (!formData.exact_location || formData.exact_location.trim().length < 3) {
      stepErrors.exact_location = 'Exact location is required (min 3 characters).';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const stepErrors = {};
    if (!formData.equipment_status) {
      stepErrors.equipment_status = 'Please select an equipment readiness option.';
    }
    if (
      formData.equipment_status === 'some' &&
      (!formData.equipment_owned || formData.equipment_owned.length === 0)
    ) {
      stepErrors.equipment_owned =
        'Please select or add at least one owned equipment item when "I have some equipment" is selected.';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Next step click
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  // Previous step click
  const handlePrev = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Form Submission to FastAPI POST /api/businesses
  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const payload = {
        business_name: formData.business_name.trim(),
        category: formData.category?.trim() || 'Commercial',
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        exact_location: formData.exact_location.trim(),
        nearby_places: formData.nearby_places?.trim() || null,
        equipment_status: formData.equipment_status,
        equipment_owned:
          formData.equipment_status === 'some' ? formData.equipment_owned : [],
      };

      const savedBusiness = await businessService.createBusiness(payload);

      setNotification({
        type: 'success',
        message: `Venture "${savedBusiness.business_name}" launched! Generating Multi-Agent Digital Twin Output...`,
      });

      // Launch and redirect directly to the AI Analysis dashboard
      setTimeout(() => {
        navigate(`/dashboard/businesses/${savedBusiness.id}/analysis`);
      }, 500);
    } catch (err) {
      console.error('Error creating business:', err);
      const detailMsg =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to save business. Please verify connection to FastAPI backend.';

      setNotification({
        type: 'error',
        message: typeof detailMsg === 'string' ? detailMsg : JSON.stringify(detailMsg),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Banner (Orange Background with White Text) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Step 2: Business Initialization Wizard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Create New Business Venture
            </h1>
            <p className="text-xs sm:text-sm text-orange-50 max-w-2xl leading-relaxed font-medium">
              Capture your commercial parameters, exact geographic coordinates, landmark footprint, and equipment status into database.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Grid: Multi-Step Form on Left, Digital Twin Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 Spans): Wizard Steps */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Stepper Header */}
          <BusinessProgress currentStep={currentStep} totalSteps={totalSteps} />

          {/* Form Step Components */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {currentStep === 1 && (
              <BusinessInformationForm
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <LocationForm
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <EquipmentSelector
                formData={formData}
                onStatusChange={handleEquipmentStatusChange}
                onEquipmentListChange={handleEquipmentListChange}
                errors={errors}
              />
            )}

            {/* Wizard Navigation Buttons */}
            <FormNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={handleSubmit}
              loading={isSubmitting}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>

        {/* Right Column (5 Spans): Site Intelligence & Feasibility Context */}
        <div className="lg:col-span-5 space-y-6">
          {/* Site Intelligence Matrix Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-white" />
                <h3 className="font-extrabold text-white text-sm">Site Intelligence & Telemetry</h3>
              </div>
              <span className="text-[10px] text-white bg-white/20 border border-white/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Live Matrix Active
              </span>
            </div>

            {/* Visual Schematic Box */}
            <div className="w-full rounded-2xl p-5 border border-slate-100 bg-orange-50/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-orange-200/60">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Target Enterprise</div>
                  <div className="text-base font-black text-slate-900 truncate max-w-[200px]">
                    {formData.business_name || 'New Business Venture'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Budget Scope</div>
                  <div className="text-base font-black text-orange-600">
                    {formData.budget ? `₹${Number(formData.budget).toLocaleString('en-IN')}` : '₹0'}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" /> Geographic Location
                  </span>
                  <span className="text-slate-900 font-bold truncate max-w-[170px]">
                    {formData.exact_location || 'Location not specified'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Cpu className="w-3.5 h-3.5 text-orange-500" /> Target Industry
                  </span>
                  <span className="text-slate-900 font-bold">
                    {formData.category || 'Boutique & Fashion'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Feasibility Engine
                  </span>
                  <span className="text-emerald-600 font-extrabold">
                    Autonomous Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Guard Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Step 2 Persistence Architecture</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Strict owner isolation: business record will link to your authenticated User ID.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>Exact location & nearby landmarks stored as distinct geographic fields.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Status marked as <code>ready_for_analysis</code> for Step 3 AI Agent.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusiness;
