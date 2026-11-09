import React from 'react';

export default function StatCard({
  label,
  value,
  subtext,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  accent = false,
  onClick,
  className = ''
}) {
  const changeColors = {
    positive: 'text-[#2F9E44]',
    negative: 'text-[#E03131]',
    neutral: 'text-[#9A9A9A]'
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#E8590C]/50 hover:-translate-y-0.5' : 'hover:border-[#3A3A3A]'
      } ${className}`}
    >
      <div className="text-xs uppercase tracking-wider font-semibold text-[#9A9A9A] mb-1">
        {label}
      </div>
      <div className={`text-3xl font-heading font-bold tabular-nums tracking-tight ${accent ? 'text-[#E8590C]' : 'text-[#F2F2F2]'}`}>
        {value}
      </div>
      {(subtext || change) && (
        <div className="flex items-center gap-2 mt-2 text-xs">
          {change && (
            <span className={`font-medium ${changeColors[changeType] || changeColors.neutral}`}>
              {change}
            </span>
          )}
          {subtext && (
            <span className="text-[#666666] truncate">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}

