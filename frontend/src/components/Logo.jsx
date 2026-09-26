import React from 'react';

export const Logo = ({ size = 'md', showText = true, subtitle = 'Autonomous Enterprise Engine' }) => {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7',
      svg: 20,
      text: 'text-base',
      sub: 'text-[9px]',
    },
    md: {
      box: 'w-9 h-9',
      svg: 24,
      text: 'text-lg sm:text-xl',
      sub: 'text-[10px]',
    },
    lg: {
      box: 'w-12 h-12',
      svg: 30,
      text: 'text-2xl',
      sub: 'text-xs',
    },
    xl: {
      box: 'w-14 h-14',
      svg: 36,
      text: 'text-3xl',
      sub: 'text-xs',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Dynamic Geometric Enterprise AI Icon (Orange & White) */}
      <div
        className={`${currentSize.box} rounded-2xl bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#FED7AA] p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0 group relative`}
      >
        <div className="w-full h-full rounded-[14px] bg-[#070B17] flex items-center justify-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
          
          <svg
            width={currentSize.svg}
            height={currentSize.svg}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            {/* Top Facet */}
            <path
              d="M16 3L27 9.5L16 16L5 9.5L16 3Z"
              fill="url(#topGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Left Facet */}
            <path
              d="M5 11V22.5L16 29V17.5L5 11Z"
              fill="url(#leftGrad)"
              stroke="#F97316"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Right Facet */}
            <path
              d="M27 11V22.5L16 29V17.5L27 11Z"
              fill="url(#rightGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Center Neural Core Node */}
            <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
            <circle cx="16" cy="16" r="2" fill="#F97316" />

            <defs>
              <linearGradient id="topGrad" x1="5" y1="3" x2="27" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="1" stopColor="#FED7AA" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="leftGrad" x1="5" y1="11" x2="16" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EA580C" />
                <stop offset="1" stopColor="#7C2D12" />
              </linearGradient>
              <linearGradient id="rightGrad" x1="16" y1="17.5" x2="27" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316" />
                <stop offset="1" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 leading-none">
            <span className={`font-black tracking-wider text-white ${currentSize.text}`}>
              VENTURE
            </span>
            <span
              className={`font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 ${currentSize.text}`}
            >
              AI
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/40">
              PRO
            </span>
          </div>
          {subtitle && (
            <span className={`text-slate-400 font-medium tracking-wide mt-0.5 ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
