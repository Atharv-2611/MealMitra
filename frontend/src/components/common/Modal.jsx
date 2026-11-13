import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0d253d]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        className={`relative bg-white rounded-xl border border-[#e3e8ee] shadow-stripe-2 w-full ${maxWidth} z-10 overflow-hidden transform transition-all`}
      >
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-[#e3e8ee]">
          <div>
            <h3 className="text-lg md:text-xl font-normal text-[#0d253d] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#64748d] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

