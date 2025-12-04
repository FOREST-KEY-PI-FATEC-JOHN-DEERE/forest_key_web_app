import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonIntent = 'positive' | 'negative' | 'none';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  intent?: ButtonIntent;
  isLoading?: boolean;
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const intentMap: Record<ButtonIntent, string> = {
  positive: 'bg-[color:var(--color-main-green)] text-white hover:bg-[color:var(--color-main-green-dark)] focus:ring-4 focus:ring-[color:var(--color-main-green)]/30',
  negative: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-600/30',
  none: '',
};

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-[color:var(--color-main-green)] text-white hover:bg-[color:var(--color-main-green-dark)] focus:ring-4 focus:ring-[color:var(--color-main-green)]/30',
  secondary: 'bg-[var(--color-card)] border border-[color:var(--color-main-green)] text-[color:var(--color-main-green)] hover:bg-[var(--color-card-hover)]',
  outline: 'bg-transparent border border-[var(--color-divider)] text-[var(--color-foreground)] hover:bg-[var(--color-card-hover)]',
};


const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  intent = 'none', 
  isLoading = false,
  className = '', 
  ...props 
}) => {
  
  const baseStyles = 'rounded font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const colorStyles = intent !== 'none' 
    ? intentMap[intent] 
    : variantMap[variant];

  const finalClasses = `${baseStyles} ${sizeMap[size]} ${colorStyles} ${className} flex items-center justify-center gap-2`;

  return (
    <button className={finalClasses} disabled={props.disabled || isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>

  );
};

export default Button;