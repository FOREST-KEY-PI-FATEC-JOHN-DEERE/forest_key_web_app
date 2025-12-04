import React from 'react';

const BASE_FORM_STYLES = [
  'w-full px-3 py-2 text-base',
  'rounded-md',
  // visible backgrounds and borders in light/dark
  'bg-[var(--color-card)]',
  'text-[var(--color-foreground)]',
  'border border-[var(--color-divider)]',
  'shadow-sm',
  'transition duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-card-disabled)]',
  'focus:border-jd-green-500 focus:ring-2 focus:ring-jd-green-500/30 focus:outline-none',
  'appearance-none',
  // placeholder color
  'placeholder-[color:var(--color-text-secondary)]',
].join(' ');

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {

}

const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  const finalClasses = `${BASE_FORM_STYLES} ${className}`;
  
  return (
    <select
      className={finalClasses}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;