import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const Notification = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
        isSuccess
          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
          : 'bg-red-950/50 border-red-500/40 text-red-200'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
      <div className="flex-1 leading-relaxed">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Notification;
