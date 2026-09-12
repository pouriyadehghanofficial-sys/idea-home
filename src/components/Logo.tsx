import React from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'hero' | 'standalone';
  className?: string;
  showText?: boolean;
  color?: string; // default #346D80
}

/**
 * Official Brand Logo for IDEA HOME (آیدیا هوم)
 * Features the exact geometric wordmark:
 * - "IDEA" with custom chamfered 'D'
 * - "HOME" with modern wide tracking and the signature three-bar 'E' (≡)
 * - Rendered in exact brand primary color #346D80
 * - Encased in a clean, high-contrast container to ensure maximum visibility on both light and dark backgrounds
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
  let logoHeight = 'h-7 sm:h-8';

  if (variant === 'footer') {
    containerClasses =
      'bg-white/85 backdrop-blur-md hover:bg-white/95 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300';
    logoHeight = 'h-8 sm:h-9';
  } else if (variant === 'hero') {
    containerClasses =
      'bg-white/90 backdrop-blur-md border border-white/70 shadow-lg';
    logoHeight = 'h-10 sm:h-12';
  } else if (variant === 'standalone') {
    containerClasses = 'bg-transparent border-transparent shadow-none';
    logoHeight = 'h-8';
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} dir="rtl">
      {/* Clean high-contrast container preserving exact aspect ratio */}
      <div
        className={`px-3 py-1.5 rounded-2xl flex items-center justify-center ${containerClasses} group`}
      >
        <svg
          viewBox="75 60 885 470"
          className={`${logoHeight} w-auto aspect-[885/470] transition-transform duration-300 group-hover:scale-103`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="IDEA HOME Logo"
          role="img"
        >
          {/* Main Brand Vector Artwork in #346D80 */}
          <g fill={color}>
            {/* Letter I */}
            <rect x="95" y="80" width="62" height="280" />

            {/* Letter D with signature 45-degree chamfer cut at bottom-left */}
            <path
              fillRule="evenodd"
              d="
                M 215 80
                L 330 80
                C 395 80 440 135 440 220
                C 440 305 395 360 330 360
                L 277 360
                L 215 298
                L 215 80
                Z
                M 277 142
                L 322 142
                C 362 142 378 175 378 220
                C 378 265 362 298 322 298
                L 277 298
                Z
              "
            />

            {/* Letter E */}
            <path
              d="
                M 470 80
                H 670
                V 142
                H 532
                V 189
                H 632
                V 251
                H 532
                V 298
                H 670
                V 360
                H 470
                Z
              "
            />

            {/* Letter A */}
            <path
              fillRule="evenodd"
              d="
                M 788 80
                H 838
                L 940 360
                H 872
                L 853 306
                H 773
                L 754 360
                H 686
                L 788 80
                Z
                M 813 148
                L 838 252
                H 788
                Z
              "
            />

            {/* WORD: HOME */}
            {/* H */}
            <path
              d="
                M 312 450
                H 330
                V 472
                H 364
                V 450
                H 382
                V 510
                H 364
                V 488
                H 330
                V 510
                H 312
                Z
              "
            />

            {/* O (Squircle Outline) */}
            <path
              fillRule="evenodd"
              d="
                M 432 450
                H 492
                C 500 450 504 454 504 462
                V 498
                C 504 506 500 510 492 510
                H 432
                C 424 510 420 506 420 498
                V 462
                C 420 454 424 450 432 450
                Z
                M 438 466
                H 486
                C 487 466 488 467 488 469
                V 491
                C 488 493 487 494 486 494
                H 438
                C 437 494 436 493 436 491
                V 469
                C 436 467 437 466 438 466
                Z
              "
            />

            {/* M */}
            <path
              d="
                M 548 450
                H 566
                L 587 486
                L 608 450
                H 626
                V 510
                H 608
                V 475
                L 593 500
                H 581
                L 566 475
                V 510
                H 548
                Z
              "
            />

            {/* E (Three parallel bars with NO vertical spine) */}
            <rect x="670" y="450" width="58" height="15" />
            <rect x="670" y="472.5" width="58" height="15" />
            <rect x="670" y="495" width="58" height="15" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg text-[#EDEAE4] tracking-normal font-vazir">
              آیدیا هوم
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 font-vazir">
              کارخانه تخصصی
            </span>
          </div>
          <span className="text-[11px] text-[#7FA69C] font-medium font-vazir">
            تولید لوازم خانه و آشپزخانه
          </span>
        </div>
      )}
    </div>
  );
};