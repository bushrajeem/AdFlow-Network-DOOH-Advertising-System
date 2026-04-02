import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center gap-2.5 w-full h-12 px-4 rounded-lg font-bold transition-all duration-200 shadow-sm";

  const variants = {
    primary: {
      className: "!bg-[#2297FE] !text-white hover:bg-[#1a85e6] hover:shadow-md",
      style: { backgroundColor: '#2297FE', color: 'white' }
    },
    outline: {
      className: "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-200",
      style: {}
    }
  };

  const config = variants[variant] || variants.primary;

  return (
    <button
      type="button"
      className={`${base} ${config.className} ${className}`}
      style={config.style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;