'use client';

import React from 'react';
import { useUI } from '@/context/UIContext';
import { Check, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useUI();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#181817] text-[#F6F3ED] border border-[#333] shadow-2xl px-5 py-3.5 flex items-center gap-3.5 transition-all animate-in slide-in-from-bottom-3 duration-300"
        >
          {toast.type === 'success' && <Check size={16} className="text-[#A3E635] shrink-0" />}
          {toast.type === 'info' && <Info size={16} className="text-[#38BDF8] shrink-0" />}
          {toast.type === 'alert' && <AlertCircle size={16} className="text-[#FB923C] shrink-0" />}
          <p className="text-xs tracking-wider uppercase font-medium flex-1">
            {toast.message}
          </p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-[#77736C] hover:text-[#F6F3ED] transition-colors p-1"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
