import React from 'react';
import CountUp from '../reactbits/CountUp';

export const MetricCard = ({
  label,
  value,
  numericValue,
  subtext,
  icon: Icon,
  trend,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  return (
    <div
      className={`bg-white border border-[#e3e8ee] rounded-xl p-5 md:p-6 shadow-stripe-1 hover:border-[#a8c3de] transition-colors ${className}`}
    >
      <div className="flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider mb-2">
        <span>{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-[#f6f9fc] flex items-center justify-center text-[#533afd] border border-[#e3e8ee]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        {typeof numericValue === 'number' ? (
          <CountUp
            to={numericValue}
            duration={1.5}
            separator=","
            prefix={prefix}
            suffix={suffix}
            className="text-3xl md:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum"
          />
        ) : (
          <span className="text-3xl md:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
            {prefix}{value}{suffix}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-[#64748d] flex items-center gap-1.5 mt-2">
          {trend && (
            <span
              className={`font-medium ${
                trend.startsWith('+') ? 'text-emerald-600' : 'text-[#533afd]'
              }`}
            >
              {trend}
            </span>
          )}
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
};

