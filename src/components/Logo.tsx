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
 * Loaded from /public/logo.webp
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
  let containerPadding = 'px-2 py-1';
  let logoHeight = 'h-8 sm:h-9';

  if (variant === 'footer') {
    containerClasses =
      'bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300';
    containerPadding = 'px-2 py-1';
    logoHeight = 'h-9 sm:h-10';
  } else if (variant === 'hero') {
    containerClasses =
      'bg-white/90 backdrop-blur-md border border-white/70 shadow-lg';
    containerPadding = 'px-2.5 py-1';
    logoHeight = 'h-12 sm:h-14';
  } else if (variant === 'standalone') {
    containerClasses = 'bg-transparent border-transparent shadow-none';
    containerPadding = 'px-2 py-1';
    logoHeight = 'h-9';
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} dir="rtl">
      {/* Clean high-contrast container preserving exact aspect ratio */}
      <div
        className={`${containerPadding} rounded-2xl flex items-center justify-center ${containerClasses} group`}
      >
        <img
          src="/logo.webp"
          alt="IDEA HOME Logo"
          className={`${logoHeight} w-auto transition-transform duration-300 group-hover:scale-103`}
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
