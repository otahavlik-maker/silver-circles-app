// src/components/atoms/LayoutComponents.jsx

import React from 'react';

/**
 * Základní komponenta tlačítka, extrahovaná z App.jsx pro sdílené použití.
 */
export const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, size = 'md' }) => {
  const baseStyle = 'rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2';
  const sizes = { sm: 'px-3 py-1 text-xs', md: 'px-4 py-3 text-sm', lg: 'px-6 py-4 text-lg' };
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
    ghost: 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50',
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={size === 'lg' ? 24 : 18} />}
      {children}
    </button>
  );
};

/**
 * Základní komponenta karty, extrahovaná z App.jsx pro sdílené použití.
 */
export const Card = ({ children, title, action }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    {(title || action) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="font-bold text-slate-800">{title}</h3>}
        {action}
      </div>
    )}
    {children}
  </div>
);