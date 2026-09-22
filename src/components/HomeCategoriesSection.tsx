import React from 'react';
import { Layers, ArrowLeft, ImageIcon, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';

interface HomeCategoriesSectionProps {
  categories: Category[];
  onOpenCategoriesPage: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({
  categories,
  onOpenCategoriesPage,
  onSelectCategory
}) => {
  const { isMobile, isTablet } = useViewport();
  // Take up to 6 categories for a balanced, premium home showcase
  const displayCategories = categories && categories.length > 0 ? categories.slice(0, 6) : [];

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      window.location.hash = '#categories';
      onOpenCategoriesPage();
    }
  };

  return (
    <section 
      id="home-categories-section" 
      className={`${isMobile ? 'py-10 px-4' : 'py-16 sm:py-20 px-4 sm:px-6 lg:px-8'} max-w-7xl mx-auto w-full relative z-10 scroll-mt-16 sm:scroll-mt-20`}
      dir="rtl"
    >
      <div id="categories" className="sr-only -top-20 relative" />
      {/* Section Header */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row md:items-end'} justify-between gap-6 mb-8 sm:mb-12 border-b border-white/10 pb-6`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/30 text-[#C9A24B] text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <EditableText 
              id="home.categories.badge" 
              as="span" 
              defaultText="تنوع و تخصصی‌سازی محصولات" 
            />
          </div>
          <EditableText
            id="home.categories.title"
            as="h2"
            className={`${isMobile ? 'text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-black text-[#EDEAE4] tracking-tight`}
            defaultText="دسته‌بندی‌های تخصصی محصولات آیدیا هوم"
          />
          <EditableText
            id="home.categories.subtitle"
            as="p"
            className="text-xs sm:text-sm text-[#EDEAE4]/70 mt-2 max-w-2xl leading-relaxed"
            defaultText="مجموعه‌ای بی‌نظیر از مبلمان مدرن، میزهای عسلی و جلومبلی، سیستم‌های نورپردازی، کنسول و ست‌های ناهارخوری با استانداردهای مهندسی روز"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {displayCategories.length > 0 ? (
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : isTablet ? 'grid-cols-2 gap-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'}`}>
          {displayCategories.map((category) => {
            const rawImages = category.images || [];
            const validImages = rawImages.filter(img => !isLegacyMockImage(img));
            const primaryImage = validImages[0] ? getOptimizedImageUrl(validImages[0], { width: 600, quality: 75 }) : '';

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative bg-[#15343d] rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A24B]/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#C9A24B]/10 cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Image Showcase */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0E262C] select-none">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={category.name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-4">
                      <ImageIcon className="w-10 h-10 mb-2 text-[#C9A24B]/40" />
                      <span className="text-xs font-vazir text-white/50">{category.name}</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#EDEAE4] group-hover:text-[#C9A24B] transition-colors flex items-center justify-between">
                      <EditableText
                        id={`category.${category.id}.name`}
                        as="span"
                        defaultText={category.name}
                      />
                      <Sparkles className="w-4 h-4 text-[#C9A24B] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>

                    {category.description && (
                      <EditableText
                        id={`category.${category.id}.desc`}
                        as="p"
                        className="text-xs text-[#EDEAE4]/70 mt-2 line-clamp-2 leading-relaxed"
                        defaultText={category.description}
                      />
                    )}
                  </div>

                  {/* Card Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#C9A24B] font-bold">
                    <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <EditableText
                        id="home.categories.cardAction"
                        as="span"
                        defaultText="مشاهده آلبوم و کاتالوگ"
                      />
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#15343d] rounded-2xl border border-white/10 text-[#EDEAE4]/70">
          <EditableText
            id="home.categories.loading"
            as="span"
            defaultText="در حال بارگذاری دسته‌بندی‌های محصولات..."
          />
        </div>
      )}

      {/* Bottom Floating Bar */}
      <div className="mt-10 text-center">
        <button
          onClick={onOpenCategoriesPage}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-[#C9A24B]/15 border border-white/15 hover:border-[#C9A24B]/50 text-[#EDEAE4] hover:text-[#C9A24B] text-xs sm:text-sm font-bold transition-all shadow-sm group cursor-pointer"
        >
          <EditableText
            id="home.categories.exploreFull"
            as="span"
            defaultText="ورود به صفحه کامل دسته‌بندی‌ها و دانلود کاتالوگ‌های اختصاصی"
          />
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>
    </section>
  );
};
