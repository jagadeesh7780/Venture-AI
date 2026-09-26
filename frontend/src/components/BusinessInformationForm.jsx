import React, { useState } from 'react';
import { Building2, FileText, IndianRupee, Info, Layers, Sparkles, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

const CATEGORY_OPTIONS = [
  { id: 'Boutique & Fashion', label: 'Boutique & Fashion Design', key: 'boutique' },
  { id: 'Cafe & Coffee Roastery', label: 'Artisanal Cafe & Coffee Roastery', key: 'cafe' },
  { id: 'Bakery & Confectionery', label: 'Bakery & Confectionery', key: 'bakery' },
  { id: 'Restaurant & Eatery', label: 'Fine Dining & Restaurant', key: 'restaurant' },
  { id: 'Gym & Fitness Arena', label: 'Gym & Fitness Arena', key: 'gym' },
  { id: 'Salon & Luxury Spa', label: 'Unisex Salon & Luxury Spa', key: 'salon' },
  { id: 'Supermarket & Grocery', label: 'Supermarket & Grocery', key: 'supermarket' },
  { id: 'Medical Clinic & Health', label: 'Medical Clinic & Diagnostic Hub', key: 'clinic' },
  { id: 'Electronics & Mobile Tech', label: 'Electronics & Mobile Device Store', key: 'tech' },
  { id: 'Automobile Service Garage', label: 'Automobile Service & Detailing Garage', key: 'auto' },
  { id: 'Pharmacy & Medical Store', label: 'Pharmacy & Health Chemist', key: 'pharmacy' },
  { id: 'Commercial Laundry & Cleaners', label: 'Commercial Laundry & Laundromat', key: 'laundry' },
];

const NAME_SUGGESTIONS = {
  'boutique': [
    'Aura Designer Studio',
    'Velvet & Silk Boutique',
    'Elegance Couture House',
    'The Royal Loom Boutique',
    'Urban Chic Fashion Studio',
  ],
  'cafe': [
    'Apex Artisanal Roastery',
    'Brew & Bean Lounge',
    'Amber Roast Coffee Bar',
    'The Daily Grind Cafe',
    'Velvet Cup Espresso Hub',
  ],
  'bakery': [
    'Golden Crust Artisan Bakehouse',
    'Sweet Brioche Patisserie',
    'The Oven Hearth Bakery',
    'Flour & Frosting Studio',
    'Cinnamon Twist Bakehouse',
  ],
  'restaurant': [
    'Saffron Spice Kitchen',
    'The Grand Feast Bistro',
    'Urban Table Fine Dining',
    'Olive & Thyme Grill',
    'Copper Pot Multi-Cuisine',
  ],
  'gym': [
    'IronCore Fitness Arena',
    'Pulse Performance Gym',
    'Titan Strength Club',
    'Apex Athletic Studio',
    'Vanguard Crossfit Arena',
  ],
  'salon': [
    'Luxe Glow Salon & Spa',
    'Velvet Touch Hair Studio',
    'Aura Aesthetics & Lounge',
    'Elegance Wellness Spa',
    'Crown & Scissors Studio',
  ],
  'supermarket': [
    'FreshHarvest Supermarket',
    'Metro Basket Daily Mart',
    'GreenLeaf Organic Grocers',
    'Prime Mart Express',
    'Urban Pantry Hypermarket',
  ],
  'clinic': [
    'CarePlus Family Clinic',
    'Apex Diagnostic & Wellness',
    'LifeLine Health Center',
    'Vitality Medical Hub',
    'PulseCare Diagnostic Center',
  ],
  'tech': [
    'TechPulse Electronics',
    'SmartFix Mobile & Laptop Hub',
    'Apex Digital Gizmo Store',
    'NextGen Gadget Lounge',
    'PixelCraft Device Studio',
  ],
  'auto': [
    'SpeedCraft Auto Garage',
    'Apex Precision Motors',
    'DriveCare Service Studio',
    'TurboTech Auto Detailing',
    'TorqueMaster Mechanics',
  ],
  'pharmacy': [
    'CarePlus Pharmacy & Wellness',
    'Apex MedStore & Diagnostics',
    'LifeLine Health Chemist',
    'VitalRx Pharmacy Lounge',
    'PrimeCare Medical Dispensary',
  ],
  'laundry': [
    'SparkleWash Commercial Laundromat',
    'SpeedySteam Dry Cleaners',
    'FabricCare Eco Laundry',
    'The Pressing Hub',
    'LuxeClean Garment Care',
  ],
};

export const BusinessInformationForm = ({ formData, onChange, errors }) => {
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const selectedCat = formData.category || 'Boutique & Fashion';

  // Find matching suggestions key
  const catObj = CATEGORY_OPTIONS.find((c) => c.id === selectedCat || c.label === selectedCat);
  const currentKey = catObj ? catObj.key : 'boutique';
  const suggestions = NAME_SUGGESTIONS[currentKey] || NAME_SUGGESTIONS['boutique'];

  const handleSelectName = (name) => {
    onChange({ target: { name: 'business_name', value: name } });
  };

  const handleSelectCategory = (cat) => {
    onChange({ target: { name: 'category', value: cat } });
  };

  const handleGenerateAIDescription = async () => {
    setIsGeneratingDesc(true);
    try {
      const resp = await api.post('/api/dataset/generate-description', {
        category: formData.category || 'Boutique & Fashion',
        business_name: formData.business_name || '',
        budget: parseFloat(formData.budget) || 0,
      });
      if (resp?.data?.description) {
        onChange({ target: { name: 'description', value: resp.data.description } });
      }
    } catch (err) {
      console.warn('AI description generate note:', err);
      const fallbackDesc = `A premier ${formData.category || 'commercial'} enterprise dedicated to delivering high-quality products and bespoke client services, engineered for strong operational margins, brand loyalty, and sustainable local footfall.`;
      onChange({ target: { name: 'description', value: fallbackDesc } });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header Banner (Orange Background with White Text) */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-white" />
          Step 1: Business Information & Investment
        </h3>
        <p className="text-xs text-orange-100 mt-1 font-medium">
          Provide the foundational details and capital parameters for your proposed enterprise.
        </p>
      </div>

      {/* 0. Business Category / Industry (Before Name) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Business Category / Industry <span className="text-orange-500">*</span>
          </label>
          <span className="text-[11px] text-orange-600 font-bold">Select or specify industry</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
            <Layers className="w-4 h-4" />
          </div>
          <select
            name="category"
            value={formData.category || 'Boutique & Fashion'}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer font-medium"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Category Suggestion Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {CATEGORY_OPTIONS.slice(0, 5).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCategory(c.id)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-bold transition-all ${
                formData.category === c.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
              }`}
            >
              {c.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Business Name */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Business Name <span className="text-orange-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500">Type manually or click suggestion below</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Building2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="business_name"
            value={formData.business_name || ''}
            onChange={onChange}
            placeholder="e.g. Apex Artisanal Roastery & Cafe"
            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
              errors?.business_name
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>
        {errors?.business_name && (
          <p className="text-xs text-red-500 font-bold">{errors.business_name}</p>
        )}

        {/* Dynamic Name Suggestions Chips */}
        <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-200/80 space-y-1.5">
          <div className="text-[11px] font-bold text-orange-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Recommended Business Names (Click to select):
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((name, i) => {
              const isSelected = formData.business_name === name;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectName(name)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md font-black'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Venture Description <span className="text-orange-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleGenerateAIDescription}
            disabled={isGeneratingDesc}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isGeneratingDesc ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isGeneratingDesc ? 'Generating...' : '✨ Generate with AI'}</span>
          </button>
        </div>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-400">
            <FileText className="w-4 h-4" />
          </div>
          <textarea
            name="description"
            rows={4}
            value={formData.description || ''}
            onChange={onChange}
            placeholder="Specialty single-origin micro-roastery and European pastry cafe targeting young professionals, digital nomads, and local residents."
            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all resize-none font-medium ${
              errors?.description
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>
        {errors?.description && (
          <p className="text-xs text-red-500 font-bold">{errors.description}</p>
        )}
      </div>

      {/* 3. Investment Budget */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Planned Investment Capital (₹ INR) <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
            <IndianRupee className="w-4 h-4 font-bold" />
          </div>
          <input
            type="number"
            step="1"
            min="1"
            name="budget"
            value={formData.budget || ''}
            onChange={onChange}
            placeholder="500000"
            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-bold ${
              errors?.budget
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>
        {errors?.budget ? (
          <p className="text-xs text-red-500 font-bold">{errors.budget}</p>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-orange-800 bg-orange-50 border border-orange-200 p-3 rounded-xl font-medium">
            <Info className="w-3.5 h-3.5 shrink-0 text-orange-500" />
            <span>
              Total startup capital (in Indian Rupees ₹) for setup, initial leases, interior fit-outs, and initial working inventory.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInformationForm;
