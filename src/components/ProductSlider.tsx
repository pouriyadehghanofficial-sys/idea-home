import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Download
} from 'lucide-react';
import { SliderProduct } from '../types';
import { DEFAULT_SLIDER_PRODUCTS } from '../data/sliderProducts';
import { getSafeDownloadUrl } from '../utils/catalogDownload';
import { EditableText } from './EditableText';

export { DEFAULT_SLIDER_PRODUCTS as SLIDER_PRODUCTS };

interface ProductSliderProps {
  onOpenOrderModal?: (product?: any) => void;
  items?: SliderProduct[];
  catalogUrl?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  onOpenOrderModal,
  items,
  catalogUrl
}) => {
  const productsList = items && items.length > 0 ? items : DEFAULT_SLIDER_PRODUCTS;
  const totalItems = productsList.length;

  // Index from 0 to totalItems (0..totalItems-1 are products, totalItems is the final catalog slide)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Guard against out of bounds if items count decreased
  const safeIndex = currentIndex > totalItems ? 0 : currentIndex;
  const isLastProduct = safeIndex === totalItems - 1;
  const isEndCard = safeIndex === totalItems;

  // Scroll to bottom catalog request section
  const handleScrollToCatalog = () => {
    const catalogElement = 
      document.getElementById('catalog-request') || 
      document.getElementById('contact-cta') || 
      document.getElementById('contact');

    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Temporary highlight pulse
      catalogElement.classList.add('ring-4', 'ring-[#C9A24B]/60', 'transition-all');
      setTimeout(() => {
        catalogElement.classList.remove('ring-4', 'ring-[#C9A24B]/60');
      }, 2500);
    }
  };

  const handleDownloadDirect = () => {
    try {
      const targetUrl = catalogUrl || '/ideahome-catalog.pdf';
      const safeUrl = getSafeDownloadUrl(targetUrl);
      const link = document.createElement('a');
      link.href = safeUrl;
      link.download = 'IdeaHome-Catalog-1404.pdf';
      if (safeUrl.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
    handleScrollToCatalog();
  };

  // Next slide: move forward
  const handleNext = () => {
    if (safeIndex < totalItems) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Previous slide: move backward
  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(totalItems);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, totalItems]);

  // Preload all slider images to ensure instant display on fast scroll and navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      productsList.forEach((item) => {
        if (item.image) {
          const img = new Image();
          img.src = item.image;
        }
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [productsList]);

  const currentProduct = !isEndCard && productsList[safeIndex] ? productsList[safeIndex] : null;

  return (
    <section 
      id="products-showcase" 
      className="pt-12 pb-16 md:pt-16 md:pb-24 relative overflow-hidden bg-gradient-to-b from-[#1E4B57] via-[#1A414B] to-[#1E4B57] scroll-mt-16 sm:scroll-mt-20" 
      dir="rtl"
    >
      {/* Seamless Atmospheric Lighting Bridge connecting downward from Hero's Light Rays */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none -z-10 overflow-hidden">
        {/* Soft golden light beam continuing from hero */}
        <div className="absolute -top-24 right-1/2 translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#C9A24B]/18 via-[#7FA69C]/10 to-transparent blur-[90px] rounded-full" />
        {/* Ambient Teal & Sage side blooms */}
        <div className="absolute top-10 right-10 w-[380px] h-[380px] bg-[#346D80]/20 blur-[130px] rounded-full" />
        <div className="absolute top-10 left-10 w-[380px] h-[380px] bg-[#7FA69C]/15 blur-[130px] rounded-full" />
      </div>

      {/* Elegant luminous bridge divider between Hero and Gallery */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-center pointer-events-none">
        <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#C9A24B]/35 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Minimal Connected Header */}
        <div className="text-center mb-8">
          <EditableText
            id="slider.title"
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-[#EDEAE4] font-vazir tracking-tight"
            defaultText="مجموعه لوازم خانه و آشپزخانه آیدیا هوم"
          />
        </div>

        {/* Slideshow Container with Left & Right Arrows positioned ON the image */}
        <div className="relative max-w-4xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(14,38,44,0.8),0_0_50px_rgba(201,162,75,0.12)] border border-[#C9A24B]/25 bg-[#123038] aspect-[16/11] sm:aspect-[16/10] md:aspect-[16/9] flex items-center justify-center select-none group">
          
          {/* RIGHT ARROW: Positioned directly on the right edge of the photo */}
          <button
            onClick={handlePrev}
            className="absolute right-2 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-black/55 hover:bg-[#C9A24B] text-white hover:text-[#1E4B57] backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl active:scale-95 group-hover:bg-black/75"
            aria-label="عکس قبلی"
            title="عکس قبلی"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
          </button>

          {/* LEFT ARROW: Positioned directly on the left edge of the photo */}
          <button
            onClick={handleNext}
            className="absolute left-2 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full bg-black/55 hover:bg-[#C9A24B] text-white hover:text-[#1E4B57] backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl active:scale-95 group-hover:bg-black/75"
            aria-label="عکس بعدی"
            title="عکس بعدی"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
          </button>

          {/* Slides Content: Product Slide (1 to totalItems) */}
          {!isEndCard && currentProduct && (
            <div key={currentProduct.id} className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-300">
              
              {/* Product Photo */}
              <img 
                src={currentProduct.image} 
                alt={currentProduct.title || `محصول ${safeIndex + 1} آیدیا هوم`}
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
              />

              {/* Bottom Subtle Overlay with Photo Counter */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-4 px-4 sm:px-8 z-20 flex items-center justify-end">
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-[#EDEAE4] font-vazir">
                  عکس <strong className="text-[#C9A24B]">{safeIndex + 1}</strong> از <strong>{totalItems}</strong>
                </div>
              </div>
            </div>
          )}

          {/* End Slide (Slide 11): Download catalog button only */}
          {isEndCard && (
            <div className="relative w-full h-full p-4 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#1E4B57] via-[#173B44] to-[#0E262C] animate-in zoom-in-95 duration-300 z-10">
              <button
                onClick={handleDownloadDirect}
                className="btn-gold px-3.5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 md:py-4 text-xs sm:base md:text-lg font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3 rounded-xl shadow-[0_10px_25px_rgba(201,162,75,0.4)] hover:scale-105 active:scale-98 transition-transform cursor-pointer font-vazir max-w-[calc(100%-88px)] sm:max-w-none"
              >
                <Download className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0" />
                <EditableText
                  id="slider.catalogCta"
                  as="span"
                  className="truncate sm:whitespace-nowrap"
                  defaultText="دریافت کاتالوگ جامع محصولات (PDF)"
                />
              </button>
            </div>
          )}

        </div>

        {/* Minimal Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {productsList.map((p, idx) => (
            <button
              key={p.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === safeIndex
                  ? 'w-7 bg-[#C9A24B]'
                  : 'w-2 bg-[#EDEAE4]/25 hover:bg-[#EDEAE4]/50'
              }`}
              aria-label={`عکس ${idx + 1}`}
              title={p.title}
            />
          ))}
          <button
            onClick={() => setCurrentIndex(totalItems)}
            className={`h-2 transition-all rounded-full cursor-pointer ${
              isEndCard
                ? 'w-7 bg-[#7FA69C]'
                : 'w-2 bg-[#7FA69C]/40 hover:bg-[#7FA69C]'
            }`}
            aria-label="کاتالوگ محصولات"
            title="دانلود کاتالوگ تمام محصولات"
          />
        </div>

      </div>
    </section>
  );
};