import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonIntent = 'positive' | 'negative' | 'none';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  intent?: ButtonIntent;
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
};

const intentMap: Record<ButtonIntent, string> = {
  positive: 'bg-status-positivo text-white hover:bg-status-positivo/80 focus:ring-4 focus:ring-status-positivo/50',
  negative: 'bg-status-negativo text-white hover:bg-status-negativo/80 focus:ring-4 focus:ring-status-negativo/50',
  none: '',
};

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-main-green text-white hover:bg-main-green/90 focus:ring-4 focus:ring-main-green/50',
  secondary: 'bg-transparent text-main-green border border-main-green hover:bg-main-green/10',
  outline: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
};


const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  intent = 'none', 
  className = '', 
  ...props 
}) => {
  
  const baseStyles = 'rounded font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';

  const colorStyles = intent !== 'none' 
    ? intentMap[intent] 
    : variantMap[variant];

  const finalClasses = `${baseStyles} ${sizeMap[size]} ${colorStyles} ${className}`;

  return (
    <button
      className={finalClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;