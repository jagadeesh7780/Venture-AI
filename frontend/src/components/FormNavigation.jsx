import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export const FormNavigation = ({
  currentStep,
  totalSteps = 3,
  onPrev,
  onNext,
  onSubmit,
  loading = false,
  isSubmitting = false,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4 mt-8">
      {/* Previous / Back Button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirstStep || isSubmitting || loading}
        className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
          isFirstStep
            ? 'opacity-0 pointer-events-none'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer shadow-xs'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous Step</span>
      </button>

      {/* Next or Submit Button */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || loading}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Business & Launching...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Save & Launch Business Twin</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Step {currentStep + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
