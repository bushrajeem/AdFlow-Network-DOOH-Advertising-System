import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';

const Input = ({ label, placeholder, type = 'text', variant = 'standard', value, onChange, required = false, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses = `
    block w-full h-12 transition-all duration-200 text-sm outline-none placeholder:text-gray-400
    ${variant === 'outlined' ? 'bg-[#F1F3F7] border border-gray-100 rounded-lg pl-10 pr-12 focus:bg-white focus:border-[#2297FE] focus:ring-4 focus:ring-blue-50/50' : 'bg-white border border-gray-200 rounded-lg pl-10 pr-4 focus:border-[#2297FE]'}
  `;

  
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && <label className="text-sm font-bold text-[#333333] ml-0.5">{label}</label>}
      <div className="relative group">
        
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          {label === 'Name' || label === 'Full Name' ? <User size={18} strokeWidth={2} /> : null}
          {type === 'password' ? <Lock size={18} strokeWidth={2} /> : null}
          {type === 'email' ? <Mail size={18} strokeWidth={2} /> : null}
        </div>

        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {type === 'password' && (
          <button
          type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;