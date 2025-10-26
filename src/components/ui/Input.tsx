import React from 'react';


const BASE_FORM_STYLES = [
  'w-full px-3 py-2 text-base', 
  'border border-gray-300 rounded-md',
  'bg-white text-gray-800 shadow-sm', 
  'transition duration-150', 
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
  
  'focus:border-main-green focus:ring-2 focus:ring-main-green/50 focus:outline-none', 
].join(' ');

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  const finalClasses = `${BASE_FORM_STYLES} ${className}`;
  
  return (
    <input
      className={finalClasses}
      {...props}
    />
  );
};

export default Input;