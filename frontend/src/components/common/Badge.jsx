import React from 'react';

export const Badge = ({ children, variant = 'soft', className = '' }) => {
  const variantStyles = {
    soft: 'bg-[#eef0ff] text-[#4434d4] border border-[#b9b9f9]/40',
    available: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    claimed: 'bg-sky-50 text-sky-700 border border-sky-200',
    picked_up: 'bg-slate-100 text-slate-700 border border-slate-200',
    cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    neutral: 'bg-[#f6f9fc] text-[#64748d] border border-[#e3e8ee]',
    dark: 'bg-[#1c1e54] text-white'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase tnum ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {children}
    </span>
  );
};

export const CategoryBadge = ({ category, className = '' }) => {
  const getStyle = () => {
    switch (category?.toLowerCase()) {
      case 'cooked meals':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'bakery':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'groceries':
      case 'raw produce':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'packaged':
      case 'packaged foods':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'dairy':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal border ${getStyle()} ${className}`}
    >
      {category}
    </span>
  );
};

