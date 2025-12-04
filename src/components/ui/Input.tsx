import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const BASE_FORM_STYLES = [
  "w-full px-3 py-2 text-base",
  "rounded-md",
  // visible backgrounds and borders in light and dark mode
  "bg-[var(--color-card)]",
  "text-[var(--color-foreground)]",
  "border border-[var(--color-divider)]",
  "shadow-sm",
  "transition duration-150",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  // focus using jd green token where available
  "focus:border-jd-green-500 focus:ring-2 focus:ring-jd-green-500/30 focus:outline-none",
  // placeholder color
  "placeholder-[color:var(--color-text-secondary)]",
].join(" ");


const Input: React.FC<InputProps> = ({ icon, className = "", ...props }) => {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3">
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
