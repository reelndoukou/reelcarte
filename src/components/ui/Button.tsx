import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  // Removed transition-colors and hover effects for immediate styling
  const baseClasses = "font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: 'bg-orange-dark text-white focus:ring-orange-light',
    secondary: 'bg-premium-off-white text-premium-dark border border-gray-200 focus:ring-gray-300',
    outline: 'bg-transparent text-white border border-white focus:ring-white',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
