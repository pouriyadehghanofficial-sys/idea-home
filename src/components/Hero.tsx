import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { LightRays } from './LightRays';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';

interface HeroProps {
  onOpenOrderModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal }) => {
  const { isMobile } = useViewport();

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('products-showcase') || document.getElementById('features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-20 pb-5 sm:pt-28 sm:pb-6 md:pt-36 md:pb-10 overflow-hidden" 
      dir="rtl"
    >
      {/* Atmospheric WebGL Light Rays with Brand Gold & Teal Colors */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#C9A24B"
          raysSpeed={1.5}
          lightSpread={1.2}
          rayLength={1.8}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.03}
          distortion={0.08}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.95}
          className="opacity-75 md:opacity-85 mix-blend-screen"
        />

        {/* Soft Ambient Depth Glows in Brand Teal & Sage */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#346D80]/20 blur-[150px] animate-blob-1" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-[#7FA69C]/15 blur-[140px] animate-blob-2" />
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#C9A24B]/10 blur-[130px]" />
      </div>

      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="text-center space-y-6 sm:space-y-7 max-w-3xl mx-auto w-full">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDEAE4]/[0.08] border border-[#7FA69C]/30 backdrop-blur-md shadow-sm max-w-full flex-wrap justify-center">
            <EditableText
              id="hero.badgeFactory"
              as="span"
              className="text-xs sm:text-sm font-bold text-[#EDEAE4] font-vazir"
              defaultText="کارخانه تولیدی آیدیا هوم"
            />
            <EditableText
              id="hero.badgeQuality"
              as="span"
              className="text-[11px] font-bold text-[#C9A24B] bg-[#1E4B57] px-2.5 py-0.5 rounded-full border border-[#C9A24B]/30 font-vazir"
              defaultText="کیفیت صادراتی"
            />
          </div>

          {/* Large Persian Headline */}
          <h1 className="text-[26px] min-[380px]:text-[30px] sm:text-[36px] md:text-[44px] font-black text-[#EDEAE4] leading-snug md:leading-tight font-vazir tracking-tight">
            <EditableText
              id="hero.titlePrefix"
              as="span"
              defaultText="آیدیا هوم؛"
              className="inline-block ml-1.5"
            />{' '}
            <EditableText
              id="hero.titleGradient"
              as="span"
              defaultText="همراه همیشگی خانه‌های ایرانی"
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A24B] via-[#7FA69C] to-[#346D80] inline-block"
            />
          </h1>

          {/* Hero Subtitle Description */}
          <EditableText
            id="hero.description"
            as="p"
            multiline
            className="text-sm sm:text-base md:text-lg text-[#EDEAE4]/85 max-w-2xl mx-auto font-vazir leading-7 sm:leading-8 font-normal text-center px-1"
            defaultText="توسعه محصولات کاربردی خانه و آشپزخانه با استانداردهای کیفی، طراحی هدفمند و نگاه به آینده"
          />

          {/* Glass-style CTA Button + Secondary Action */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 w-full ${isMobile ? 'max-w-xs' : 'max-w-lg'} mx-auto`}>
            <button
              onClick={scrollToNextSection}
              className={`btn-glass-hero ${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 sm:gap-3 cursor-pointer group font-vazir active:scale-98 whitespace-nowrap`}
            >
              <EditableText
                id="hero.primaryButton"
                as="span"
                className="whitespace-nowrap"
                defaultText="مشاهده نمونه محصولات"
              />
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A24B] group-hover:-translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              onClick={onOpenOrderModal}
              className={`btn-gold ${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer font-vazir shadow-lg hover:scale-102 active:scale-98 transition-transform whitespace-nowrap`}
            >
              <EditableText
                id="hero.secondaryButton"
                as="span"
                className="whitespace-nowrap"
                defaultText="استعلام قیمت و سفارش"
              />
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Link / Scroll Down Prompt */}
      <div className="w-full flex flex-col items-center justify-center gap-1.5 pt-1 pb-4 sm:pt-2 sm:pb-5 text-[#EDEAE4]/70 hover:text-[#C9A24B] transition-colors cursor-pointer group relative z-10">
        <button 
          onClick={scrollToNextSection}
          className="flex flex-col items-center gap-1 sm:gap-1.5 cursor-pointer focus:outline-none active:scale-95 transition-transform"
          aria-label="مشاهده نمونه محصولات"
        >
          <EditableText
            id="hero.scrollPrompt"
            as="span"
            className="text-[11px] sm:text-xs font-medium font-vazir tracking-wide group-hover:text-[#C9A24B] transition-colors"
            defaultText="ورود به گالری محصولات"
          />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EDEAE4]/[0.06] border border-[#C9A24B]/30 flex items-center justify-center group-hover:border-[#C9A24B] group-hover:bg-[#C9A24B]/10 transition-all shadow-sm">
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A24B] animate-bounce" />
          </div>
        </button>
      </div>

      {/* Atmospheric Bottom Gradient Bridge */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#1E4B57] to-transparent pointer-events-none" />
    </section>
  );
};