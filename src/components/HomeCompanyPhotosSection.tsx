import React, { useState } from 'react';
import { Factory, Building2, ArrowLeft, Eye, X, ImageIcon, CheckCircle2 } from 'lucide-react';
import { CompanyPhoto } from '../types';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';
import { CoverflowStage, CoverflowSlide, DEFAULT_COVERFLOW_SLIDES } from './CoverflowStage';

interface HomeCompanyPhotosSectionProps {
  photos: CompanyPhoto[];
  onOpenCompanyPhotosPage: () => void;
}

export const HomeCompanyPhotosSection: React.FC<HomeCompanyPhotosSectionProps> = ({
  photos,
  onOpenCompanyPhotosPage
}) => {
  const { isMobile, isTablet } = useViewport();
  const [activePhoto, setActivePhoto] = useState<CompanyPhoto | null>(null);
  const [viewMode] = useState<'coverflow' | 'grid'>('coverflow');

  // Filter valid photos
  const validPhotos = (photos || []).filter(p => !isLegacyMockImage(p.url));

  // Display top 6 photos on home page for grid view
  const displayPhotos = validPhotos.slice(0, 6);

  // Base coverflow slides from photos or defaults
  const baseSlides: CoverflowSlide[] = validPhotos.length >= 3
    ? validPhotos.slice(0, 6).map((p, idx) => ({
        id: p.id || `photo-${idx}`,
        title: p.title,
        sub: p.category === 'factory' ? 'خط تولید و کارخانه' : 'دفتر مرکزی و شوروم',
        imageUrl: getOptimizedImageUrl(p.url, { width: 600, quality: 80 }),
        g: 'linear-gradient(150deg, #1E4B57 0%, #15343d 50%, #0E262C 100%)',
      }))
    : [
        {
          id: 'slide-1',
          title: 'خط برش لیزر و CNC دقیق',
          sub: 'تولید صنعتی',
          g: 'linear-gradient(150deg, #346D80 0%, #1E4B57 50%, #0E262C 100%)',
          badge: 'تولید',
        },
        {
          id: 'slide-2',
          title: 'خط رنگ پودری الکترواستاتیک',
          sub: 'پوشش‌دهی مقاوم',
          g: 'linear-gradient(150deg, #1E4B57 0%, #15343d 50%, #0a1b20 100%)',
        },
        {
          id: 'slide-3',
          title: 'مونتاژ تخصصی مبلمان مدرن',
          sub: 'استاندارد کیفی',
          g: 'linear-gradient(150deg, #7FA69C 0%, #1E4B57 50%, #0E262C 100%)',
        },
        {
          id: 'slide-4',
          title: 'شوروم مرکزی و سالن نمایش',
          sub: 'دفتر مرکزی',
          g: 'linear-gradient(150deg, #C9A24B 0%, #8A6E2E 50%, #1E4B57 100%)',
        },
        {
          id: 'slide-5',
          title: 'واحد کنترل کیفیت و بسته‌بندی',
          sub: 'QC & PACKAGING',
          g: 'linear-gradient(150deg, #346D80 0%, #1E4B57 50%, #0E262C 100%)',
        },
        {
          id: 'slide-6',
          title: 'سالن اتوماسیون جوشکاری آرگون',
          sub: 'فناوری فلزات',
          g: 'linear-gradient(150deg, #1E4B57 0%, #346D80 50%, #0E262C 100%)',
        },
      ];

  // Start slide (left end in coverflow): "مشاهده تمام تصاویر"
  const viewAllStartSlide: CoverflowSlide = {
    id: 'view-all-photos-start-slide',
    title: 'مشاهده تمام تصاویر',
    sub: 'گالری کامل کارخانه، خطوط تولید و شوروم',
    g: 'linear-gradient(150deg, #15343d 0%, #1E4B57 50%, #0E262C 100%)',
    badge: 'گالری کامل',
    isActionCard: true,
    actionText: 'مشاهده تمام تصاویر',
  };

  // Final slide (right end in coverflow): "مشاهده تمام تصاویر"
  const viewAllEndSlide: CoverflowSlide = {
    id: 'view-all-photos-end-slide',
    title: 'مشاهده تمام تصاویر',
    sub: 'گالری کامل کارخانه، خطوط تولید و شوروم',
    g: 'linear-gradient(150deg, #15343d 0%, #1E4B57 50%, #0E262C 100%)',
    badge: 'گالری کامل',
    isActionCard: true,
    actionText: 'مشاهده تمام تصاویر',
  };

  const coverflowSlides: CoverflowSlide[] = [viewAllStartSlide, ...baseSlides, viewAllEndSlide];

  const handleCardClick = (photo: CompanyPhoto) => {
    setActivePhoto(photo);
  };

  return (
    <section 
      id="home-company-photos-section" 
      className="relative w-full py-16 sm:py-24 bg-[#1E4B57] text-[#EDEAE4] overflow-hidden border-y border-white/10 scroll-mt-16 sm:scroll-mt-20"
      dir="rtl"
    >
      <div id="company-photos" className="sr-only -top-20 relative" />
      {/* Brand Subtle Atmosphere Layer */}
      <div 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #7FA69C 0%, #346D80 45%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute -bottom-24 right-10 w-[500px] h-[300px] rounded-full blur-3xl opacity-15"
        style={{ background: 'radial-gradient(circle, #C9A24B 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="mb-10 border-b border-white/10 pb-8">
          <div>
            <EditableText
              id="home.photos.title"
              as="h2"
              className="font-vazir text-2xl sm:text-3xl lg:text-4xl font-black text-[#EDEAE4] tracking-tight leading-tight"
              defaultText="گالری سه‌بعدی کارخانه و خطوط پیشرفته تولید"
            />
            <EditableText
              id="home.photos.subtitle"
              as="p"
              className="mt-2 text-xs sm:text-sm text-[#EDEAE4]/75 max-w-2xl leading-relaxed"
              defaultText="مشاهده عمق واقعی توانمندی صنعتی، خطوط رنگ پودری الکترواستاتیک و شوروم با زاویه سه‌بعدی و کیفیت مهندسی آیدیا هوم."
            />
          </div>
        </div>



        {/* VIEW MODE 1: REAL 3D COVERFLOW STAGE IN BRAND THEME */}
        {viewMode === 'coverflow' ? (
          <div className="relative py-4">
            {/* Center glow behind stage in warm gold/brand tone */}
            <div className="pointer-events-none absolute inset-x-0 bottom-12 mx-auto h-24 max-w-2xl rounded-[100%] bg-[#C9A24B]/15 blur-3xl" />

            <CoverflowStage
              slides={coverflowSlides}
              initialIndex={Math.floor(coverflowSlides.length / 2)}
              variant="brand"
              onCardClick={(slide) => {
                if (slide.id === 'view-all-photos-slide' || slide.isActionCard) {
                  onOpenCompanyPhotosPage();
                  return;
                }
                const foundPhoto = validPhotos.find(p => p.id === slide.id || p.title === slide.title);
                if (foundPhoto) {
                  setActivePhoto(foundPhoto);
                } else if (slide.imageUrl) {
                  setActivePhoto({
                    id: String(slide.id),
                    title: slide.title,
                    url: slide.imageUrl,
                    category: 'factory',
                    description: slide.sub,
                  });
                }
              }}
            />
          </div>
        ) : (
          /* VIEW MODE 2: CLASSIC GRID CARDS */
          displayPhotos.length > 0 ? (
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : isTablet ? 'grid-cols-2 gap-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'}`}>
              {displayPhotos.map((photo) => {
                const isFactory = photo.category === 'factory';
                const optimizedUrl = getOptimizedImageUrl(photo.url, { width: 600, quality: 75 });

                return (
                  <div
                    key={photo.id}
                    onClick={() => handleCardClick(photo)}
                    className="group relative bg-[#15343d] rounded-2xl overflow-hidden border border-white/10 hover:border-[#C9A24B]/60 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
                  >
                    {/* Image Frame */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-[#0E262C] select-none">
                      {optimizedUrl ? (
                        <img
                          src={optimizedUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-4">
                          <ImageIcon className="w-10 h-10 mb-2 text-[#C9A24B]/40" />
                          <span className="text-xs font-vazir text-[#EDEAE4]/70">{photo.title}</span>
                        </div>
                      )}

                      {/* Category Pill Tag */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md border text-[11px] font-bold shadow-sm flex items-center gap-1.5 ${
                          isFactory
                            ? 'bg-[#123038]/85 border-[#C9A24B]/40 text-[#C9A24B]'
                            : 'bg-[#15343d]/85 border-[#7FA69C]/40 text-[#7FA69C]'
                        }`}>
                          {isFactory ? <Factory className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          <span>{isFactory ? 'کارخانه و تولید' : 'دفتر و شوروم'}</span>
                        </span>
                      </div>

                      {/* Quick Preview Hover */}
                      <div className="absolute inset-0 bg-[#0E262C]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                        <span className="p-3 rounded-full bg-[#C9A24B] text-[#123038] shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <Eye className="w-5 h-5" />
                        </span>
                        <span className="text-xs font-bold font-vazir bg-black/70 px-3 py-1.5 rounded-lg border border-white/20 text-[#EDEAE4]">
                          مشاهده بزرگنمایی
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-[#15343d] via-transparent to-transparent opacity-90" />
                    </div>

                    {/* Photo Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <EditableText
                          id={`companyPhoto.${photo.id}.title`}
                          as="h3"
                          className="text-base sm:text-lg font-bold text-[#EDEAE4] group-hover:text-[#C9A24B] transition-colors leading-snug"
                          defaultText={photo.title}
                        />

                        {photo.description && (
                          <EditableText
                            id={`companyPhoto.${photo.id}.description`}
                            as="p"
                            className="text-xs text-[#EDEAE4]/70 mt-2 line-clamp-2 leading-relaxed"
                            defaultText={photo.description}
                          />
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#EDEAE4]/70">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B]" />
                          <EditableText
                            id="home.photos.qualityBadge"
                            as="span"
                            defaultText="استاندارد کیفی تأیید شده"
                          />
                        </span>
                        <span className="text-[#C9A24B] font-bold group-hover:underline flex items-center gap-1">
                          <EditableText
                            id="home.photos.viewAction"
                            as="span"
                            defaultText="مشاهده"
                          />
                          <ArrowLeft className="w-3 h-3" />
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
                id="home.photos.emptyMessage"
                as="span"
                defaultText="تصویری در این دسته‌بندی یافت نشد."
              />
            </div>
          )
        )}

        {/* Bottom Action */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenCompanyPhotosPage}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#C9A24B]/20 group cursor-pointer"
          >
            <EditableText
              id="home.photos.viewAllButton"
              as="span"
              defaultText="مشاهده تمام تصاویر کارخانه در صفحه اختصاصی"
            />
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div 
              className="bg-[#15343d] border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#C9A24B] font-bold block mb-0.5">
                    {activePhoto.category === 'factory' ? 'کارخانه و خطوط تولید' : 'دفتر مرکزی و شوروم'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#EDEAE4]">
                    {activePhoto.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#EDEAE4] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image */}
              <div className="p-2 sm:p-4 bg-[#0E262C]/70 flex items-center justify-center max-h-[60vh] overflow-hidden">
                <img
                  src={getOptimizedImageUrl(activePhoto.url)}
                  alt={activePhoto.title}
                  className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#123038]">
                <p className="text-xs sm:text-sm text-[#EDEAE4]/80 leading-relaxed text-center sm:text-right">
                  {activePhoto.description || 'تصویر ثبت شده از مراحل تولید صنعتی و استانداردهای کیفی آیدیا هوم.'}
                </p>
                <button
                  onClick={() => {
                    setActivePhoto(null);
                    onOpenCompanyPhotosPage();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] text-xs font-black hover:brightness-110 active:scale-95 transition-all whitespace-nowrap cursor-pointer shrink-0"
                >
                  <span>مشاهده در گالری کامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
