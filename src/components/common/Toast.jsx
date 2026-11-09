import React from 'react';
import { useGym } from '../../context/GymContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useGym();

  if (!toast.visible) return null;

  const bgColors = {
    success: 'bg-[#161616] border-[#2F9E44] text-[#F2F2F2]',
    warning: 'bg-[#161616] border-[#E8A317] text-[#F2F2F2]',
    danger: 'bg-[#161616] border-[#E03131] text-[#F2F2F2]',
    info: 'bg-[#161616] border-[#E8590C] text-[#F2F2F2]'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2F9E44] flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#E8A317] flex-shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-[#E03131] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#E8590C] flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-2xl ${bgColors[toast.type] || bgColors.success}`}>
        {icons[toast.type] || icons.success}
        <div className="text-sm font-medium leading-snug flex-1">
          {toast.message}
        </div>
      </div>
    </div>
  );
}

