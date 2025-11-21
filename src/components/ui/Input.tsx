import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const BASE_FORM_STYLES = [
  "w-full px-3 py-2 text-base",
  "border border-gray-300 rounded-md",
  "bg-white text-gray-800 shadow-sm",
  "transition duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100",
  "focus:border-main-green focus:ring-2 focus:ring-main-green/50 focus:outline-none",
].join(" ");

const Input: React.FC<InputProps> = ({ icon, className = "", ...props }) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 text-gray-400">
          {icon}
        </span>
      )}

      <input
        className={`${BASE_FORM_STYLES} ${icon ? "pl-10" : ""} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
