import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Download, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Eye, 
  X,
  Phone,
  Send,
  Sparkles
} from 'lucide-react';
import { Category } from '../types';
import { storageService } from '../services/storage';
import { EditableText } from '../components/EditableText';
import { useSiteContent } from '../context/ContentContext';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';

interface CategoriesPageProps {
  onBackToHome?: () => void;
  onSelectCategory?: (categoryName: string) => void;
  selectedCategoryId?: string;
  onOpenOrderModal?: (product?: any) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ 
  onBackToHome, 
  onSelectCategory,
  selectedCategoryId,
  onOpenOrderModal
}) => {
  const { getText, dir, isEditorMode, setActiveEditId } = useSiteContent();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Slideshow Gallery Modal state
  const [activeGallery, setActiveGallery] = useState<{
    category: Category;
    index: number;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await storageService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          const matched = selectedCategoryId 
            ? data.find(c => c.id === selectedCategoryId || c.name === selectedCategoryId) 
            : null;
          setSelectedCategory(matched || data[0]);

          if (selectedCategoryId) {
            setTimeout(() => {
              const el = document.getElementById(`cat-${selectedCategoryId}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-4', 'ring-[#C9A24B]/50');
                setTimeout(() => el.classList.remove('ring-4', 'ring-[#C9A24B]/50'), 2000);
              }
            }, 300);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [selectedCategoryId]);

  // Keyboard navigation for gallery modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeGallery) return;
      const images = activeGallery.category.images || [];
      const hasCatalog = !!activeGallery.category.catalogUrl;
      const totalSlides = images.length + (hasCatalog ? 1 : 0);

      if (e.key === 'Escape') {
        setActiveGallery(null);
      } else if (e.key === 'ArrowLeft') {
        // Next slide in RTL
        setActiveGallery(prev => prev ? { ...prev, index: (prev.index + 1) % totalSlides } : null);
      } else if (e.key === 'ArrowRight') {
        // Prev slide in RTL
        setActiveGallery(prev => prev ? { ...prev, index: (prev.index - 1 + totalSlides) % totalSlides } : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGallery]);

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      cat.name.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    );
  });

  const openLightbox = (category: Category, index: number) => {
    setActiveGallery({ category, index });
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeGallery) return;
    const images = activeGallery.category.images || [];
    const hasCatalog = !!activeGallery.category.catalogUrl;
    const totalSlides = images.length + (hasCatalog ? 1 : 0);
    setActiveGallery({ ...activeGallery, index: (activeGallery.index + 1) % totalSlides });
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeGallery) return;
    const images = activeGallery.category.images || [];
    const hasCatalog = !!activeGallery.category.catalogUrl;
    const totalSlides = images.length + (hasCatalog ? 1 : 0);
    setActiveGallery({ ...activeGallery, index: (activeGallery.index - 1 + totalSlides) % totalSlides });
  };

  return (
    <div className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb, Title & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#EDEAE4]/70 font-bold mb-1">
              {onBackToHome ? (
                <button
                  type="button"
                  onClick={(e) => {
                    if (isEditorMode) {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveEditId('categories.breadcrumbHome');
                      return;
                    }
                    onBackToHome();
                  }}
                  className="hover:text-[#EDEAE4] transition-colors cursor-pointer"
                >
                  <EditableText id="categories.breadcrumbHome" as="span" defaultText="صفحه اصلی" />
                </button>
              ) : (
                <a href="/" className="hover:text-[#EDEAE4] transition-colors">
                  <EditableText id="categories.breadcrumbHome" as="span" defaultText="صفحه اصلی" />
                </a>
              )}
              <ChevronLeft className="w-4 h-4 text-[#C9A24B]" />
              <EditableText
                id="categories.breadcrumbCurrent"
                as="span"
                className="text-[#C9A24B]"
                defaultText="دسته‌بندی‌های محصولات"
              />
            </div>
            <EditableText
              id="categories.pageTitle"
              as="h1"
              className="text-xl sm:text-2xl font-black text-[#EDEAE4]"
              defaultText="دسته‌بندی محصولات و کاتالوگ‌های اختصاصی"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Compact Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getText('categories.searchPlaceholder', 'جستجوی دسته‌بندی...')}
                className="w-44 sm:w-56 pl-8 pr-9 py-2 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/15 focus:border-[#C9A24B] outline-none text-xs backdrop-blur-xs"
              />
              <Search className="w-4 h-4 text-white/60 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {onBackToHome && (
              <button
                type="button"
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('categories.backButton');
                    return;
                  }
                  onBackToHome();
                }}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold border border-white/15 flex items-center gap-2 transition-all shadow-xs cursor-pointer backdrop-blur-xs"
                title={isEditorMode ? 'کلیک برای ویرایش متن بازگشت به خانه' : undefined}
              >
                <ChevronLeft className="w-4 h-4 rotate-180 text-[#C9A24B]" />
                <EditableText id="categories.backButton" as="span" defaultText="بازگشت به خانه" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Presentation */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#EDEAE4]/20 border-t-[#C9A24B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-[#EDEAE4]">{getText('categories.loading', 'در حال بارگذاری دسته‌بندی‌های محصولات...')}</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-[#15343d] rounded-3xl p-12 text-center border border-white/10 space-y-3">
            <Layers className="w-12 h-12 text-[#EDEAE4]/30 mx-auto" />
            <EditableText id="categories.emptyTitle" as="h3" className="text-base font-bold text-[#EDEAE4]" defaultText="دسته‌بندی با مشخصات وارد شده یافت نشد" />
            <EditableText id="categories.emptyDesc" as="p" className="text-xs text-[#EDEAE4]/60" defaultText="لطفاً واژه جستجو را تغییر دهید یا دکمه پاک‌سازی را فشار دهید." />
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-[#C9A24B] text-[#1E4B57] text-xs font-bold cursor-pointer"
            >
              <EditableText id="categories.viewAllButton" as="span" defaultText="مشاهده همه دسته‌بندی‌ها" />
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => {
              const images = (category.images || [])
                .filter(url => !isLegacyMockImage(url))
                .map(url => getOptimizedImageUrl(url));
              const hasCatalog = !!category.catalogUrl;

              return (
                <div
                  key={category.id}
                  id={`cat-${category.id}`}
                  className="bg-[#15343d] rounded-3xl p-6 sm:p-8 shadow-sm border border-white/10 transition-all hover:border-[#C9A24B]/50 space-y-6"
                >
                  {/* Clean Category Header */}
                  <div className="border-b border-white/10 pb-5">
                    <div>
                      <EditableText
                        id={`category.${category.id}.name`}
                        as="h2"
                        className="text-xl sm:text-2xl font-black text-[#EDEAE4]"
                        defaultText={getText(`category.${category.id}.name`, category.name)}
                      />
                      {category.description && (
                        <EditableText
                          id={`category.${category.id}.desc`}
                          as="p"
                          className="text-xs sm:text-sm text-[#EDEAE4]/70 mt-1 max-w-2xl leading-relaxed"
                          defaultText={getText(`category.${category.id}.desc`, category.description)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Images & Catalog Gallery Grid */}
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Product Images */}
                      {images.map((imgUrl, imgIdx) => (
                        <div
                          key={imgIdx}
                          onClick={() => openLightbox(category, imgIdx)}
                          className="group relative aspect-square rounded-2xl overflow-hidden bg-black/20 border border-white/10 cursor-pointer shadow-2xs hover:shadow-lg hover:border-[#C9A24B]/40 transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`${category.name} ${imgIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[#1E4B57]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <span className="p-2.5 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform">
                              <Eye className="w-5 h-5" />
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                            #{imgIdx + 1}
                          </div>
                        </div>
                      ))}

                      {/* Catalog Card beside the photos (opens as the last slide in gallery) */}
                      {hasCatalog && (
                        <div
                          onClick={() => openLightbox(category, images.length)}
                          className="group relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-[#C9A24B]/20 via-[#15343d] to-[#0e272e] border border-[#C9A24B]/40 hover:border-[#C9A24B] cursor-pointer shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center p-4 text-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                            <Download className="w-6 h-6" />
                          </div>
                          <EditableText
                            id={`category.${category.id}.catalogTitle`}
                            as="h4"
                            className="text-xs font-black text-[#EDEAE4] line-clamp-2 px-1"
                            defaultText={category.catalogTitle || `کاتالوگ ${category.name}`}
                          />
                        </div>
                      )}
                    </div>

                    {images.length === 0 && !hasCatalog && (
                      <div className="py-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-xs text-[#EDEAE4]/50">
                        <EditableText
                          id="categories.noImagesOrCatalog"
                          as="span"
                          defaultText="تصویر یا کاتالوگی برای این دسته‌بندی بارگذاری نشده است."
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Interactive Lightbox Slideshow Modal */}
      {activeGallery && (() => {
        const currentCategory = activeGallery.category;
        const images = currentCategory.images || [];
        const hasCatalog = !!currentCategory.catalogUrl;
        const totalSlides = images.length + (hasCatalog ? 1 : 0);
        const currentIndex = activeGallery.index;
        const isCatalogSlide = hasCatalog && currentIndex === images.length;
        const currentImage = !isCatalogSlide ? images[currentIndex] : null;

        return (
          <div
            onClick={() => setActiveGallery(null)}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in"
          >
            {/* Top Bar: Category Info, Slide Counter & Close */}
            <div 
              className="w-full max-w-5xl flex items-center justify-between text-[#EDEAE4] z-10 pb-2 border-b border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#C9A24B]">
                  {getText(`category.${currentCategory.id}.name`, currentCategory.name)}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs text-[#EDEAE4]/80 font-mono">
                  {isCatalogSlide ? (
                    <span className="text-[#C9A24B] font-bold">{getText('categories.officialCatalog', 'کاتالوگ رسمی')}</span>
                  ) : (
                    `${getText('categories.slideCounter', 'تصویر')} ${currentIndex + 1} ${getText('categories.of', 'از')} ${totalSlides}`
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenOrderModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGallery(null);
                      onOpenOrderModal({ title: `${currentCategory.name} - تصویر ${currentIndex + 1}` });
                    }}
                    className="btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer font-vazir shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{getText('categories.orderWholesale', 'ثبت سفارش عمده')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveGallery(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title={getText('categories.close', 'بستن')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Slide Content Area */}
            <div 
              className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button (Right side in RTL) */}
              {totalSlides > 1 && (
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#C9A24B] hover:text-[#1E4B57] text-white border border-white/20 transition-all cursor-pointer backdrop-blur-xs shadow-lg group"
                  title={getText('categories.prevSlide', 'قبلی')}
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}

              {/* Slide Content: Image or Catalog Slide */}
              {!isCatalogSlide && currentImage ? (
                <div className="relative max-w-full max-h-[72vh] flex items-center justify-center">
                  <img
                    src={currentImage}
                    alt={`${currentCategory.name} ${currentIndex + 1}`}
                    className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-xl backdrop-blur-xs font-mono">
                    #{currentIndex + 1}
                  </div>
                </div>
              ) : (
                /* The Dedicated Last Slide: Catalog Download Presentation */
                <div className="w-full max-w-xl bg-linear-to-b from-[#15343d] to-[#0c1f24] border-2 border-[#C9A24B] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-3xl bg-[#C9A24B]/20 text-[#C9A24B] border-2 border-[#C9A24B]/40 flex items-center justify-center mx-auto shadow-xl">
                    <Download className="w-10 h-10 animate-bounce" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#EDEAE4] mb-2">
                      {getText(`category.${currentCategory.id}.catalogTitle`, currentCategory.catalogTitle || `کاتالوگ رسمی ${currentCategory.name}`)}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#EDEAE4]/75 max-w-md mx-auto leading-relaxed">
                      {getText(`category.${currentCategory.id}.desc`, currentCategory.description || '')}
                    </p>
                  </div>

                  {/* Action Button: Direct Download */}
                  <div className="flex items-center justify-center pt-2">
                    <a
                      href={currentCategory.catalogUrl}
                      download={`${currentCategory.name}-catalog.pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#C9A24B] hover:bg-[#b58f3d] text-[#1E4B57] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-103 cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      <span>{getText('categories.downloadCatalogPdf', 'دانلود مستقیم کاتالوگ PDF')}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Next Button (Left side in RTL) */}
              {totalSlides > 1 && (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#C9A24B] hover:text-[#1E4B57] text-white border border-white/20 transition-all cursor-pointer backdrop-blur-xs shadow-lg group"
                  title={getText('categories.nextSlide', 'بعدی')}
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>

            {/* Bottom Slide Indicators */}
            {totalSlides > 1 && (
              <div 
                className="w-full max-w-2xl flex items-center justify-center gap-1.5 py-2 overflow-x-auto z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {Array.from({ length: totalSlides }).map((_, sIdx) => {
                  const isThisCatalog = hasCatalog && sIdx === images.length;
                  const isCurrent = sIdx === currentIndex;

                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => setActiveGallery({ ...activeGallery, index: sIdx })}
                      className={`transition-all rounded-full cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'w-8 h-3 bg-[#C9A24B]'
                          : isThisCatalog
                          ? 'w-4 h-3 bg-red-400/60 hover:bg-red-400'
                          : 'w-3 h-3 bg-white/25 hover:bg-white/50'
                      }`}
                      title={isThisCatalog ? 'اسلاید کاتالوگ' : `تصویر ${sIdx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

