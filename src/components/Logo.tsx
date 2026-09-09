import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, inverted = false }) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-base', slogan: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', slogan: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', slogan: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', slogan: 'text-sm' }
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Authentic ISPS Emblem Vector */}
      <div
        className={`${sizeClasses.icon} relative flex-shrink-0 rounded-lg overflow-hidden p-0.5 transition-transform duration-300 group-hover:scale-105 shadow-md shadow-red-950/20`}
        title="Instituto Superior Politécnico de Songo - ISPS Dark"
      >
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow">
          <defs>
            <linearGradient id="ispsRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
            <linearGradient id="ispsBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="ispsGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Left Flag (Red banner with gear) */}
          <path
            d="M 6,14 C 18,10 32,18 48,16 L 48,68 C 32,70 18,62 6,66 Z"
            fill="url(#ispsRedGrad)"
          />
          {/* Gear / Cog silhouette */}
          <circle cx="26" cy="40" r="16" fill="#9ca3af" opacity="0.85" />
          <circle cx="26" cy="40" r="9" fill="#7f1d1d" />
          {/* Atomic energy core */}
          <circle cx="26" cy="40" r="4" fill="#fbbf24" />
          <ellipse cx="26" cy="40" rx="12" ry="5" fill="none" stroke="#f97316" strokeWidth="1.6" transform="rotate(-30 26 40)" />
          <ellipse cx="26" cy="40" rx="12" ry="5" fill="none" stroke="#f59e0b" strokeWidth="1.6" transform="rotate(45 26 40)" />

          {/* Right Section (Blue Open Book / Wings) */}
          <path
            d="M 50,16 L 94,16 L 94,66 C 76,64 62,56 50,68 Z"
            fill="url(#ispsBlueGrad)"
          />
          {/* Swooping white/gold book page curves */}
          <path
            d="M 52,66 C 58,45 74,32 94,32 L 94,22 C 70,22 55,38 52,66 Z"
            fill="#ffffff"
            opacity="0.9"
          />
          <path
            d="M 52,66 C 60,52 74,44 94,44 L 94,38 C 72,38 58,48 52,66 Z"
            fill="url(#ispsGoldGrad)"
          />

          {/* Gold separator spine */}
          <line x1="49" y1="14" x2="49" y2="70" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight ${sizeClasses.text} ${inverted ? 'text-zinc-900' : 'text-zinc-50'}`}>
            ISPS
          </span>
          <span className={`font-black tracking-wider uppercase px-1.5 py-0.5 rounded text-[11px] leading-none bg-amber-500/20 text-amber-400 border border-amber-500/30`}>
            DARK
          </span>
        </div>
        {showSlogan && (
          <span className={`font-medium tracking-wide ${sizeClasses.slogan} text-zinc-400 mt-1`}>
            Aprender. Ensinar. Partilhar.
          </span>
        )}
      </div>
    </div>
  );
};
