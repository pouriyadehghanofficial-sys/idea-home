import React from 'react';

interface ProductIllustrationProps {
  category: 'trays' | 'scales' | 'containers' | 'accessories';
  title: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({ category, title }) => {
  return (
    <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#1E4B57]/80 to-[#346D80]/30 border border-[#EDEAE4]/12 flex items-center justify-center overflow-hidden group-hover:border-[#C9A24B]/40 transition-all duration-300">
      {/* Soft Ambient Inner Glow */}
      <div className="absolute inset-0 bg-[#7FA69C]/10 blur-xl pointer-events-none" />
      
      {/* Watermark / Category Stamp in Tan / Sage */}
      <span className="absolute top-2.5 right-3 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#EDEAE4]/[0.08] text-[#7FA69C] border border-[#EDEAE4]/10 font-latin">
        IDEA HOME
      </span>

      {category === 'trays' && (
        <svg viewBox="0 0 160 110" fill="none" className="w-36 h-28 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          {/* Tray Rim Shadow */}
          <ellipse cx="80" cy="85" rx="60" ry="12" fill="#1E4B57" fillOpacity="0.4" />
          {/* Main Tray Base */}
          <rect x="22" y="30" width="116" height="50" rx="10" fill="#346D80" stroke="#EDEAE4" strokeWidth="2" strokeOpacity="0.4" />
          <rect x="28" y="36" width="104" height="38" rx="6" fill="#EDEAE4" fillOpacity="0.9" />
          {/* Gold handles on both sides */}
          <path d="M14 45C14 41 18 38 22 38V62C18 62 14 59 14 55V45Z" fill="#C9A24B" stroke="#B49A7C" strokeWidth="1.5" />
          <path d="M146 45C146 41 142 38 138 38V62C142 62 146 59 146 55V45Z" fill="#C9A24B" stroke="#B49A7C" strokeWidth="1.5" />
          {/* Marble/ribbed pattern accent */}
          <path d="M38 48C45 42 55 58 65 46C75 36 90 52 105 44" stroke="#7FA69C" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M48 60C60 56 75 64 90 58C105 54 115 62 122 58" stroke="#346D80" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      )}

      {category === 'scales' && (
        <svg viewBox="0 0 160 110" fill="none" className="w-36 h-28 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          {/* Shadow */}
          <ellipse cx="80" cy="88" rx="46" ry="10" fill="#1E4B57" fillOpacity="0.4" />
          {/* Circular tempered scale platform */}
          <circle cx="80" cy="50" r="38" fill="#346D80" stroke="#C9A24B" strokeWidth="2.5" />
          <circle cx="80" cy="50" r="32" fill="#EDEAE4" fillOpacity="0.92" />
          {/* LCD readout */}
          <rect x="62" y="32" width="36" height="18" rx="3" fill="#1E4B57" stroke="#7FA69C" strokeWidth="1" />
          <text x="68" y="44" fill="#C9A24B" fontSize="9" fontWeight="bold" fontFamily="monospace">
            250 g
          </text>
          {/* Touch sensors */}
          <circle cx="70" cy="62" r="3" fill="#7FA69C" />
          <circle cx="90" cy="62" r="3" fill="#346D80" />
          <path d="M78 70H82" stroke="#B49A7C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {category === 'containers' && (
        <svg viewBox="0 0 160 110" fill="none" className="w-36 h-28 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          {/* Base shadow */}
          <ellipse cx="80" cy="85" rx="50" ry="10" fill="#1E4B57" fillOpacity="0.4" />
          {/* Transparent container body */}
          <rect x="36" y="35" width="88" height="46" rx="8" fill="#346D80" fillOpacity="0.35" stroke="#EDEAE4" strokeWidth="1.8" />
          {/* Food content hint */}
          <rect x="42" y="52" width="76" height="24" rx="4" fill="#EDEAE4" fillOpacity="0.85" />
          {/* Silicone airtight lid & clamps */}
          <rect x="30" y="26" width="100" height="12" rx="4" fill="#1E4B57" stroke="#C9A24B" strokeWidth="2" />
          {/* Side clip latches */}
          <rect x="26" y="32" width="6" height="12" rx="2" fill="#C9A24B" />
          <rect x="128" y="32" width="6" height="12" rx="2" fill="#C9A24B" />
          {/* Microwave valve */}
          <circle cx="80" cy="32" r="3.5" fill="#7FA69C" stroke="#EDEAE4" strokeWidth="1" />
        </svg>
      )}

      {category === 'accessories' && (
        <svg viewBox="0 0 160 110" fill="none" className="w-36 h-28 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
          <ellipse cx="80" cy="86" rx="48" ry="10" fill="#1E4B57" fillOpacity="0.4" />
          {/* Dual colander/basket */}
          <path d="M40 38C40 38 48 78 80 78C112 78 120 38 120 38H40Z" fill="#346D80" stroke="#7FA69C" strokeWidth="2" />
          {/* Interior drainage holes */}
          <circle cx="70" cy="54" r="2" fill="#EDEAE4" />
          <circle cx="80" cy="54" r="2" fill="#EDEAE4" />
          <circle cx="90" cy="54" r="2" fill="#EDEAE4" />
          <circle cx="75" cy="62" r="2" fill="#EDEAE4" />
          <circle cx="85" cy="62" r="2" fill="#EDEAE4" />
          {/* Swivel handle */}
          <path d="M34 38C34 32 42 26 80 26C118 26 126 32 126 38" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};