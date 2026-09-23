import React from 'react';
import { EditableText } from './EditableText';

interface LogoProps {
  variant?: 'header' | 'footer' | 'hero' | 'standalone';
  className?: string;
  showText?: boolean;
  color?: string; // default #346D80
}

/**
 * Official Brand Logo for IDEA HOME (آیدیا هوم)
 * Loaded from /public/logo.svg, with a slight stroke-dilate filter
 * applied to compensate for the thin lines of the traced artwork.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  className = '',
  showText = true,
  color = '#346D80',
}) => {
  // Container styling tailored to frosted glass white (سفید شیشه‌ای) for a modern, beautiful aesthetic
  let containerClasses =
    'bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300';
  let logoHeight = 'h-9 sm:h-10';

  if (variant === 'footer') {
    containerClasses =
      'bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300';
    logoHeight = 'h-10 sm:h-11';
  } else if (variant === 'hero') {
    containerClasses =
      'bg-white/90 backdrop-blur-md border border-white/70 shadow-lg';
    logoHeight = 'h-12 sm:h-14';
  } else if (variant === 'standalone') {
    containerClasses = 'bg-transparent border-transparent shadow-none';
    logoHeight = 'h-9';
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} dir="rtl">
      {/* Clean high-contrast container preserving exact aspect ratio */}
      <div
        className={`px-3 py-1.5 rounded-2xl flex items-center justify-center ${containerClasses} group`}
      >
        {/* Hidden SVG filter that dilates (thickens) the thin traced strokes */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="boldenLogo">
            <feMorphology operator="dilate" radius="1.2" />
          </filter>
        </svg>
        <img
          src="/logo.svg"
          alt="IDEA HOME Logo"
          className={`${logoHeight} w-auto transition-transform duration-300 group-hover:scale-103`}
          style={{ filter: 'url(#boldenLogo)' }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <EditableText
              id="footer.brandName"
              as="span"
              className="font-bold text-base sm:text-lg text-[#EDEAE4] tracking-normal font-vazir"
              defaultText="آیدیا هوم"
            />
            <EditableText
              id="footer.brandBadge"
              as="span"
              className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 font-vazir"
              defaultText="کارخانه تخصصی"
            />
          </div>
          <EditableText
            id="footer.brandSubtitle"
            as="span"
            className="text-[11px] text-[#7FA69C] font-medium font-vazir"
            defaultText="تولید لوازم خانه و آشپزخانه"
          />
        </div>
      )}
    </div>
  );
};
