import React from 'react';
import { Briefcase, MapPin, Wrench, Check } from 'lucide-react';

export const BusinessProgress = ({ currentStep, totalSteps = 3 }) => {
  const steps = [
    {
      step: 1,
      title: 'Business Info',
      description: 'Name, idea & capital',
      icon: Briefcase,
    },
    {
      step: 2,
      title: 'Location Context',
      description: 'Exact spot & landmarks',
      icon: MapPin,
    },
    {
      step: 3,
      title: 'Equipment & Assets',
      description: 'Readiness & inventory',
      icon: Wrench,
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 -z-0 rounded-full transition-all duration-500 shadow-xs"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((item) => {
          const Icon = item.icon;
          const isCompleted = currentStep > item.step;
          const isCurrent = currentStep === item.step;

          return (
            <div
              key={item.step}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                    : isCurrent
                    ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/40 ring-4 ring-orange-200 scale-105'
                    : 'bg-slate-100 border border-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center hidden sm:block">
                <span
                  className={`text-xs font-bold block transition-colors ${
                    isCurrent
                      ? 'text-orange-600 font-black'
                      : isCompleted
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                  }`}
                >
                  Step {item.step}: {item.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block max-w-[110px] truncate">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessProgress;
