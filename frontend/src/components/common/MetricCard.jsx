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
  className = '',
  compact = false
}) => {
  return (
    <div
      className={`bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 hover:border-[#a8c3de] transition-colors ${
        compact ? 'p-3.5 sm:p-4' : 'p-5 md:p-6'
      } ${className}`}
    >
      <div
        className={`flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider ${
          compact ? 'mb-1.5' : 'mb-2'
        }`}
      >
        <span>{label}</span>
        {Icon && (
          <div
            className={`${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } rounded-full bg-[#f6f9fc] flex items-center justify-center text-[#533afd] border border-[#e3e8ee]`}
          >
            <Icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
        )}
      </div>

      <div className={`flex items-baseline gap-1 ${compact ? 'mb-0.5' : 'mb-1'}`}>
        {typeof numericValue === 'number' ? (
          <CountUp
            to={numericValue}
            duration={1.5}
            separator=","
            prefix={prefix}
            suffix={suffix}
            className={`${
              compact ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl'
            } font-light text-[#0d253d] tracking-[-0.03em] tnum`}
          />
        ) : (
          <span
            className={`${
              compact ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl'
            } font-light text-[#0d253d] tracking-[-0.03em] tnum`}
          >
            {prefix}{value}{suffix}
          </span>
        )}
      </div>

      {subtext && (
        <p
          className={`text-xs text-[#64748d] flex items-center gap-1.5 ${
            compact ? 'mt-1' : 'mt-2'
          }`}
        >
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

