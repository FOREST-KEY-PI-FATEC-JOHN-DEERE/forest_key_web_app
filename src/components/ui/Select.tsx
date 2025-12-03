import React from 'react';

const BASE_FORM_STYLES = [
  'w-full px-3 py-2 text-base',
  'rounded-md',
  // visible backgrounds and borders in light/dark
  'bg-white dark:bg-gray-800',
  'text-gray-900 dark:text-gray-100',
  'border border-gray-300 dark:border-gray-700',
  'shadow-sm',
  'transition duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-700',
  'focus:border-jd-green-500 focus:ring-2 focus:ring-jd-green-500/30 focus:outline-none',
  'appearance-none',
  // placeholder color
  'placeholder-gray-400 dark:placeholder-gray-500',
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