import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

const LOCATION_SUGGESTIONS = [
  {
    id: 'mall',
    title: 'Shopping Mall & Retail Arcade',
    icon: '🏬',
    snippet: 'Near Central Shopping Mall, High-Street Retail Arcade & Multiplex',
    color: 'border-orange-500/40 hover:bg-orange-500/10 text-orange-300',
  },
  {
    id: 'highway',
    title: 'National/State Highway Corridor',
    icon: '🛣️',
    snippet: 'Adjacent to National/State Highway bypass, main commercial transport junction',
    color: 'border-amber-500/40 hover:bg-amber-500/10 text-amber-300',
  },
  {
    id: 'transit',
    title: 'Transit Hub / Metro & Railway Station',
    icon: '🚇',
    snippet: 'Within 300m of Central Railway Station & Metro Rail interchange terminal',
    color: 'border-orange-500/40 hover:bg-orange-500/10 text-orange-200',
  },
  {
    id: 'techpark',
    title: 'Tech Park & Premium Residential Area',
    icon: '🏢',
    snippet: 'Opposite Cyber Tech Park, Corporate IT Hub & Luxury Residential Towers',
    color: 'border-amber-500/40 hover:bg-amber-500/10 text-amber-200',
  },
];

export const LocationForm = ({ formData, onChange, errors }) => {
  // Handler to append or replace location suggestion
  const handleApplySuggestion = (sug) => {
    const existing = formData.nearby_places?.trim() || '';
    let updated = '';
    if (!existing) {
      updated = sug.snippet;
    } else if (existing.includes(sug.snippet)) {
      // already exists, don't duplicate
      return;
    } else {
      updated = `${existing}, ${sug.snippet}`;
    }
    onChange({ target: { name: 'nearby_places', value: updated } });
  };

  const handleSetExactLocationSuggestion = (sug) => {
    if (!formData.exact_location || formData.exact_location.trim().length === 0) {
      onChange({ target: { name: 'exact_location', value: sug.snippet } });
    } else {
      handleApplySuggestion(sug);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Step Header Banner (Orange Background with White Text) */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-white" />
          Step 2: Geographic & Locality Context
        </h3>
        <p className="text-xs text-orange-100 mt-1 font-medium">
          Specify the pinpoint business location and select or type relevant surrounding landmarks.
        </p>
      </div>

      {/* 4 Interactive Locality Suggestions */}
      <div className="bg-orange-50/60 border border-orange-200/80 p-4 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-orange-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Compass className="w-4 h-4 text-orange-500" />
            4 Quick Locality Suggestions (Click to add or select):
          </div>
          <span className="text-[11px] text-slate-500 font-medium">User friendly 1-click select</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {LOCATION_SUGGESTIONS.map((sug) => {
            const isAdded = formData.nearby_places?.includes(sug.snippet);
            return (
              <button
                key={sug.id}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white shadow-xs'
                    : 'bg-white border-slate-200 hover:border-orange-300 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="text-lg leading-none shrink-0 mt-0.5">{sug.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span className={isAdded ? 'text-white font-black' : 'text-slate-900'}>{sug.title}</span>
                    {isAdded && (
                      <span className="text-[10px] text-white bg-white/25 px-2 py-0.5 rounded-md font-mono font-bold">Added ✓</span>
                    )}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isAdded ? 'text-orange-50' : 'text-slate-500'}`}>{sug.snippet}</p>
                  <div className={`flex items-center gap-2 mt-1 pt-1 border-t text-[10px] ${isAdded ? 'border-white/30 text-white' : 'border-slate-100 text-slate-500'}`}>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange({ target: { name: 'exact_location', value: sug.snippet } });
                      }}
                      className={`${isAdded ? 'text-white underline font-bold' : 'text-orange-600 hover:text-orange-700 font-bold underline'} cursor-pointer`}
                    >
                      Set Location
                    </span>
                    <span className={isAdded ? 'text-white/60' : 'text-slate-300'}>·</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySuggestion(sug);
                      }}
                      className={`${isAdded ? 'text-white font-semibold' : 'text-slate-600 hover:text-slate-900 font-semibold'} cursor-pointer`}
                    >
                      + Add to Nearby
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Exact Business Location */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Exact Business Location <span className="text-orange-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500">Enter city, area, or street</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-500">
            <Navigation className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="exact_location"
            value={formData.exact_location || ''}
            onChange={onChange}
            placeholder="e.g. Tenali, Guntur District, Andhra Pradesh"
            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-medium ${
              errors?.exact_location
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>
        {errors?.exact_location ? (
          <p className="text-xs text-red-500 font-bold">{errors.exact_location}</p>
        ) : (
          <p className="text-[11px] text-slate-500">
            Physical street address, city, town, or specific locality (e.g., Tenali, Indiranagar Bangalore, T. Nagar Chennai).
          </p>
        )}
      </div>

      {/* 2. Nearby Area / Places (Manual entry, separate field) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nearby Area / Places & Landmarks (Manual Entry or 1-Click Suggestions)
          </label>
          {formData.nearby_places && (
            <button
              type="button"
              onClick={() => onChange({ target: { name: 'nearby_places', value: '' } })}
              className="text-[11px] text-red-600 font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-orange-500">
            <Compass className="w-4 h-4" />
          </div>
          <textarea
            name="nearby_places"
            rows={3}
            value={formData.nearby_places || ''}
            onChange={onChange}
            placeholder="e.g. Near Central Shopping Mall, 200m from Bus Station, High-Street Retail Corridor, Commercial Market Road."
            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all resize-none font-medium ${
              errors?.nearby_places
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }`}
          />
        </div>
        {errors?.nearby_places ? (
          <p className="text-xs text-red-500 font-bold">{errors.nearby_places}</p>
        ) : (
          <p className="text-[11px] text-slate-500">
            Click the suggestions above or manually enter landmarks, malls, highways, or transit stops.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationForm;
