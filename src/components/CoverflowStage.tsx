import React, { useState, useEffect, useCallback } from 'react';
import { Images, ArrowLeft } from 'lucide-react';
import { EditableText } from './EditableText';

export interface CoverflowSlide {
  id: string | number;
  title: string;
  sub: string;
  g: string; // gradient or image url
  imageUrl?: string;
  badge?: string;
  isActionCard?: boolean;
  actionText?: string;
}

export const DEFAULT_COVERFLOW_SLIDES: CoverflowSlide[] = [
  {
    id: 'dawn-coast',
    title: 'Dawn Coast',
    sub: 'LANDSCAPE',
    g: 'linear-gradient(150deg, #0d9488 0%, #115e59 45%, #042f2e 100%)',
  },
  {
    id: 'wild-petal',
    title: 'Wild Petal',
    sub: 'MACRO',
    g: 'linear-gradient(150deg, #c026d3 0%, #701a75 50%, #2e1065 100%)',
  },
  {
    id: 'aurora-sea',
    title: 'Aurora Sea',
    sub: 'ABSTRACT',
    g: 'linear-gradient(150deg, #2dd4bf 0%, #3b82f6 45%, #581c87 100%)',
  },
  {
    id: 'moonrise',
    title: 'Moonrise',
    sub: 'FEATURED',
    g: 'linear-gradient(150deg, #2dd4bf 0%, #22a89a 45%, #0c3b45 78%)',
  },
  {
    id: 'night-city',
    title: 'Night City',
    sub: 'URBAN',
    g: 'linear-gradient(150deg, #38bdf8 0%, #1e3a8a 45%, #090d16 100%)',
  },
  {
    id: 'solar-flare',
    title: 'Solar Flare',
    sub: 'ENERGY',
    g: 'linear-gradient(150deg, #f43f5e 0%, #a855f7 45%, #1e1b4b 100%)',
  },
  {
    id: 'deep-horizon',
    title: 'Deep Horizon',
    sub: 'COSMIC',
    g: 'linear-gradient(150deg, #06b6d4 0%, #4338ca 45%, #0b0f19 100%)',
  },
];

interface CoverflowStageProps {
  slides?: CoverflowSlide[];
  initialIndex?: number;
  onCardClick?: (slide: CoverflowSlide, index: number) => void;
  className?: string;
  id?: string;
  variant?: 'aurora' | 'brand';
}

export const CoverflowStage: React.FC<CoverflowStageProps> = ({
  slides = DEFAULT_COVERFLOW_SLIDES,
  initialIndex = 3, // Featured 'Moonrise' active by default
  onCardClick,
  className = '',
  id = 'coverflow-stage-wrapper',
  variant = 'aurora',
}) => {
  const [active, setActive] = useState<number>(() => {
    return Math.max(0, Math.min(slides.length - 1, initialIndex));
  });

  const count = slides.length;

  const handlePrev = useCallback(() => {
    setActive((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActive((prev) => Math.min(count - 1, prev + 1));
  }, [count]);

  const handleJump = useCallback((index: number) => {
    setActive(Math.max(0, Math.min(count - 1, index)));
  }, [count]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Determine card position class based on signed distance d = i - active
  const getPositionClass = (index: number) => {
    const d = index - active;
    if (d === 0) return 'cf-pos-0';
    if (d === 1) return 'cf-pos-1';
    if (d === -1) return 'cf-pos-n1';
    if (d === 2) return 'cf-pos-2';
    if (d === -2) return 'cf-pos-n2';
    if (d >= 3) return 'cf-pos-3';
    if (d <= -3) return 'cf-pos-n3';
    return 'cf-hidden';
  };

  return (
    <div id={id} className={`relative select-none ${variant === 'brand' ? 'cf-theme-brand' : ''} ${className}`} dir="ltr">
      {/* 3D Coverflow Stage */}
      <div className="coverflow" id="coverflow">
        {slides.map((slide, i) => {
          const posClass = getPositionClass(i);
          const isFront = i === active;

          return (
            <div
              key={slide.id}
              data-idx={i}
              onClick={() => {
                if (i !== active) {
                  handleJump(i);
                } else if (onCardClick) {
                  onCardClick(slide, i);
                }
              }}
              className={`cf-card ${posClass}`}
              style={{
                background: slide.imageUrl 
                  ? `url(${slide.imageUrl}) center/cover no-repeat` 
                  : slide.g,
              }}
              title={slide.title}
              role="button"
              tabIndex={0}
              aria-label={`${slide.title} - ${slide.sub}`}
            >
              {/* Optional image overlay if photo is provided */}
              {slide.imageUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
              )}

              {/* Top-left radial sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(120% 80% at 30% 20%, rgba(255,255,255,0.18), transparent 60%)',
                }}
              />

              {/* Action Card Custom Layout */}
              {slide.isActionCard ? (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-15 bg-gradient-to-b from-[#15343d]/95 via-[#1E4B57]/95 to-[#0E262C] select-none"
                  dir="rtl"
                >
                  {/* Glowing Icon Circle */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl border transition-transform duration-300 ${
                    isFront ? 'scale-110' : 'scale-100'
                  } ${
                    variant === 'brand'
                      ? 'bg-[#C9A24B] text-[#123038] border-[#C9A24B]/50 shadow-[0_0_25px_rgba(201,162,75,0.35)]'
                      : 'bg-[#2dd4bf] text-[#0b0f14] border-[#2dd4bf]/50 shadow-[0_0_25px_rgba(45,212,191,0.35)]'
                  }`}>
                    <Images className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <EditableText
                    id="home.photos.coverflowActionTitle"
                    as="h3"
                    className="font-vazir text-lg sm:text-xl font-black text-[#EDEAE4] mb-2 leading-tight tracking-tight"
                    defaultText={slide.title}
                  />

                  {/* Subtitle */}
                  <EditableText
                    id="home.photos.coverflowActionSub"
                    as="p"
                    className="font-vazir text-xs text-[#EDEAE4]/75 mb-6 max-w-[210px] leading-relaxed"
                    defaultText={slide.sub}
                  />

                  {/* CTA Button / Tag */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick?.(slide, i);
                    }}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-vazir text-xs font-black shadow-lg transition-all cursor-pointer ${
                      variant === 'brand'
                        ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] shadow-[#C9A24B]/20 hover:brightness-110 active:scale-95'
                        : 'bg-gradient-to-r from-[#2dd4bf] to-[#e879f9] text-[#0b0f14] active:scale-95'
                    }`}
                  >
                    <EditableText
                      id="home.photos.coverflowActionButton"
                      as="span"
                      defaultText={slide.actionText || 'مشاهده تمام تصاویر'}
                    />
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Badge if present */}
                  {slide.badge && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${
                        variant === 'brand'
                          ? 'bg-[#15343d]/90 text-[#C9A24B] border border-[#C9A24B]/40'
                          : 'bg-[#0b0f14]/80 text-[#2dd4bf] border border-[#2dd4bf]/40'
                      }`}>
                        <EditableText
                          id={`coverflow.slide.${slide.id}.badge`}
                          as="span"
                          defaultText={slide.badge}
                        />
                      </span>
                    </div>
                  )}

                  {/* Bottom Gradient Label */}
                  <div
                    className="absolute left-0 right-0 bottom-0 p-[18px_18px_16px] z-10"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(7,10,14,0.94), rgba(7,10,14,0.55) 55%, transparent)',
                    }}
                  >
                    <EditableText
                      id={`coverflow.slide.${slide.id}.sub`}
                      as="div"
                      className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-1 text-white/70"
                      defaultText={slide.sub}
                    />
                    <EditableText
                      id={`coverflow.slide.${slide.id}.title`}
                      as="h3"
                      className="font-display text-[17px] font-bold text-white tracking-normal leading-snug"
                      defaultText={slide.title}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Row: Prev, Dots, Next */}
      <div className="mt-7 flex items-center justify-center gap-6">
        {/* Prev Button */}
        <button
          type="button"
          id="prev"
          onClick={handlePrev}
          disabled={active === 0}
          aria-label="Previous card"
          className={`nav-btn glass text-slate-200 border border-white/10 ${
            active === 0 ? 'opacity-35 cursor-not-allowed hover:scale-100 hover:border-white/10' : ''
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>

        {/* Pill Dots */}
        <div className="flex items-center gap-2.5" id="dots" role="tablist">
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleJump(i)}
                className={`dot ${isActive ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                aria-selected={isActive}
                role="tab"
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          id="next"
          onClick={handleNext}
          disabled={active === count - 1}
          aria-label="Next card"
          className={`nav-btn glass text-slate-200 border border-white/10 ${
            active === count - 1 ? 'opacity-35 cursor-not-allowed hover:scale-100 hover:border-white/10' : ''
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 256 256" fill="currentColor">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
