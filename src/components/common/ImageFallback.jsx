import React, { useState } from 'react';

export default function ImageFallback({
  src,
  alt = 'Shivay Gym',
  className = '',
  overlay = false,
  overlayOpacity = 'bg-black/55',
  zoomOnHover = false,
  children
}) {
  const [hasError, setHasError] = useState(!src);

  return (
    <div className={`relative overflow-hidden bg-[#1E1E1E] ${className}`}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            zoomOnHover ? 'hover:scale-[1.04]' : ''
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#1E1E1E] text-[#9A9A9A] text-center border border-[#2A2A2A]">
          <span className="font-heading uppercase text-sm font-bold tracking-wider text-[#E8590C]">
            SHIVAY GYM
          </span>
          <span className="text-xs text-[#666666] mt-1">{alt}</span>
        </div>
      )}

      {overlay && !hasError && (
        <div className={`absolute inset-0 ${overlayOpacity}`} />
      )}

      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}

