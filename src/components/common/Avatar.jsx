import React from 'react';

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const getInitials = (n) => {
    if (!n) return 'SG';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold'
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-[#1E1E1E] border border-[#2A2A2A] text-[#F2F2F2] flex-shrink-0 select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-hidden="true"
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}

