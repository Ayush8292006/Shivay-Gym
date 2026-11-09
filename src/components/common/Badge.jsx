import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variantStyles = {
    default: 'bg-[#1E1E1E] text-[#9A9A9A] border-[#2A2A2A]',
    active: 'bg-[#142918] text-[#2F9E44] border-[#2F9E44]/40',
    success: 'bg-[#142918] text-[#2F9E44] border-[#2F9E44]/40',
    expiring: 'bg-[#292211] text-[#E8A317] border-[#E8A317]/40',
    warning: 'bg-[#292211] text-[#E8A317] border-[#E8A317]/40',
    expired: 'bg-[#2A1414] text-[#E03131] border-[#E03131]/40',
    danger: 'bg-[#2A1414] text-[#E03131] border-[#E03131]/40',
    frozen: 'bg-[#14202B] text-[#4DABF7] border-[#4DABF7]/40',
    left: 'bg-[#1E1E1E] text-[#777777] border-[#333333]',
    saffron: 'bg-[#E8590C]/15 text-[#E8590C] border-[#E8590C]/40',
  };

  const normalizedVariant = (() => {
    const v = String(variant).toLowerCase();
    if (v.includes('active')) return 'active';
    if (v.includes('expiring')) return 'expiring';
    if (v.includes('expired')) return 'expired';
    if (v.includes('frozen')) return 'frozen';
    if (v.includes('left')) return 'left';
    return variantStyles[v] ? v : 'default';
  })();

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${variantStyles[normalizedVariant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

