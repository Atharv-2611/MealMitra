import React from 'react';
import ClickSpark from '../reactbits/ClickSpark';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  spark = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-normal rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#533afd] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs md:text-sm px-3.5 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm md:text-[15px] px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[44px]'
  };

  const variantClasses = {
    // DESIGN.md: button-primary-pill
    primary:
      'bg-[#533afd] text-white hover:bg-[#4434d4] active:bg-[#2e2b8c] shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
    // DESIGN.md: button-secondary
    secondary:
      'bg-white text-[#533afd] border border-[#533afd] hover:bg-[#f6f9fc] active:bg-[#eef0ff]',
    // DESIGN.md: button-on-dark
    dark:
      'bg-[#1c1e54] text-white hover:bg-[#272b70] active:bg-[#13153d]',
    // Ghost action
    subtle:
      'bg-transparent text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]',
    // Danger pill
    danger:
      'bg-white text-[#ea2261] border border-[#ea2261]/30 hover:bg-[#ea2261]/5 active:bg-[#ea2261]/10',
    // Soft tint
    soft:
      'bg-[#eef0ff] text-[#4434d4] hover:bg-[#b9b9f9]/50 active:bg-[#b9b9f9]'
  };

  const buttonElement = (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );

  if (spark && variant === 'primary' && !disabled) {
    return (
      <ClickSpark sparkColor="#ffffff" sparkSize={8} sparkRadius={22} sparkCount={5}>
        {buttonElement}
      </ClickSpark>
    );
  }

  return buttonElement;
};

