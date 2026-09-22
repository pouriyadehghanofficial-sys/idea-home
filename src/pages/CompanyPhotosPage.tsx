import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Eye, 
  X,
  Factory,
  Store,
  Send,
  Phone,
  Sparkles
} from 'lucide-react';
import { CompanyPhoto } from '../types';
import { storageService } from '../services/storage';
import { EditableText } from '../components/EditableText';
import { useSiteContent } from '../context/ContentContext';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';

interface CompanyPhotosPageProps {
  onBackToHome?: () => void;
  onOpenOrderModal?: () => void;
}

export const CompanyPhotosPage: React.FC<CompanyPhotosPageProps> = ({ 
  onBackToHome,
  onOpenOrderModal
}) => {
  const { getText, isEditorMode, setActiveEditId } = useSiteContent();
  const [photos, setPhotos] = useState<CompanyPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhoto, setActivePhoto] = useState<CompanyPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'factory' | 'office' | 'showroom'>('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const data = await storageService.getCompanyPhotos();
        const validPhotos = data.filter(p => !isLegacyMockImage(p.url));
        setPhotos(validPhotos);
      } catch (err) {
        console.error('Error fetching company photos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const factoryCount = photos.filter(p => p.category === 'factory').length;
  const officeCount = photos.filter(p => p.category === 'office').length;
  const showroomCount = photos.filter(p => p.category === 'showroom').length;

  const filteredPhotos = photos.filter(photo => {
    if (selectedCategory === 'all') return true;
    return photo.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-[#1E4B57] text-[#EDEAE4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Back */}
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
                      setActiveEditId('companyPhotos.breadcrumbHome');
                      return;
                    }
                    onBackToHome();
                  }}
                  className="hover:text-[#EDEAE4] transition-colors cursor-pointer"
                >
                  <EditableText id="companyPhotos.breadcrumbHome" as="span" defaultText="صفحه اصلی" />
                </button>
              ) : (
                <a href="/" className="hover:text-[#EDEAE4] transition-colors">
                  <EditableText id="companyPhotos.breadcrumbHome" as="span" defaultText="صفحه اصلی" />
                </a>
              )}
              <ChevronLeft className="w-4 h-4 text-[#C9A24B]" />
              <EditableText
                id="companyPhotos.breadcrumbCurrent"
                as="span"
                className="text-[#C9A24B]"
                defaultText="تصاویر کارخانه و دفتر"
              />
            </div>
            <EditableText
              id="companyPhotos.pageTitle"
              as="h1"
              className="text-xl sm:text-2xl font-black text-[#EDEAE4]"
              defaultText="تصاویر کارخانه و دفتر مرکزی ایده استیل سازان شریف"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {onOpenOrderModal && (
              <button
                type="button"
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('companyPhotos.orderWholesale');
                    return;
                  }
                  onOpenOrderModal();
                }}
                className="btn-gold px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md font-vazir shrink-0 hover:scale-102 active:scale-98 transition-all"
                title={isEditorMode ? 'کلیک برای ویرایش متن ثبت سفارش عمده' : undefined}
              >
                <Send className="w-3.5 h-3.5" />
                <EditableText
                  id="companyPhotos.orderWholesale"
                  as="span"
                  defaultText="ثبت سفارش عمده"
                />
              </button>
            )}

            {onOpenOrderModal && (
              <button
                type="button"
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('companyPhotos.orderPhone');
                    return;
                  }
                  onOpenOrderModal();
                }}
                className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold border border-white/15 flex items-center gap-2 cursor-pointer transition-all font-vazir shrink-0"
                title={isEditorMode ? 'کلیک برای ویرایش متن ثبت سفارش تلفنی' : undefined}
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                <EditableText
                  id="companyPhotos.orderPhone"
                  as="span"
                  defaultText="ثبت سفارش تلفنی و ارتباط سریع"
                />
              </button>
            )}

            {onBackToHome && (
              <button
                type="button"
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('companyPhotos.backButton');
                    return;
                  }
                  onBackToHome();
                }}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold border border-white/15 flex items-center gap-2 transition-all shadow-xs cursor-pointer backdrop-blur-xs"
                title={isEditorMode ? 'کلیک برای ویرایش متن بازگشت به خانه' : undefined}
              >
                <ChevronLeft className="w-4 h-4 rotate-180 text-[#C9A24B]" />
                <EditableText id="companyPhotos.backButton" as="span" defaultText="بازگشت به خانه" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        {!loading && photos.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                if (isEditorMode) {
                  setActiveEditId('companyPhotos.allPhotos');
                }
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] shadow-md shadow-[#C9A24B]/20 font-black'
                  : 'bg-[#15343d] text-[#EDEAE4]/80 hover:bg-[#15343d]/80 hover:text-[#EDEAE4] border border-white/10'
              }`}
            >
              <EditableText id="companyPhotos.allPhotos" as="span" defaultText="همه تصاویر" />
              <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                selectedCategory === 'all' ? 'bg-[#123038]/20 text-[#123038]' : 'bg-white/10 text-[#EDEAE4]/70'
              }`}>
                {photos.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isEditorMode) {
                  setActiveEditId('companyPhotos.factoryLines');
                }
                setSelectedCategory('factory');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'factory'
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] shadow-md shadow-[#C9A24B]/20 font-black'
                  : 'bg-[#15343d] text-[#EDEAE4]/80 hover:bg-[#15343d]/80 hover:text-[#EDEAE4] border border-white/10'
              }`}
            >
              <Factory className="w-4 h-4" />
              <EditableText id="companyPhotos.factoryLines" as="span" defaultText="کارخانه و خطوط تولید" />
              {factoryCount > 0 && (
                <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                  selectedCategory === 'factory' ? 'bg-[#123038]/20 text-[#123038]' : 'bg-white/10 text-[#EDEAE4]/70'
                }`}>
                  {factoryCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isEditorMode) {
                  setActiveEditId('companyPhotos.office');
                }
                setSelectedCategory('office');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'office'
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] shadow-md shadow-[#C9A24B]/20 font-black'
                  : 'bg-[#15343d] text-[#EDEAE4]/80 hover:bg-[#15343d]/80 hover:text-[#EDEAE4] border border-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <EditableText id="companyPhotos.office" as="span" defaultText="دفتر مرکزی" />
              {officeCount > 0 && (
                <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                  selectedCategory === 'office' ? 'bg-[#123038]/20 text-[#123038]' : 'bg-white/10 text-[#EDEAE4]/70'
                }`}>
                  {officeCount}
                </span>
              )}
            </button>

            {showroomCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (isEditorMode) {
                    setActiveEditId('companyPhotos.showroom');
                  }
                  setSelectedCategory('showroom');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === 'showroom'
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38a3a] text-[#123038] shadow-md shadow-[#C9A24B]/20 font-black'
                    : 'bg-[#15343d] text-[#EDEAE4]/80 hover:bg-[#15343d]/80 hover:text-[#EDEAE4] border border-white/10'
                }`}
              >
                <Store className="w-4 h-4" />
                <EditableText id="companyPhotos.showroom" as="span" defaultText="شوروم دائمی" />
                <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                  selectedCategory === 'showroom' ? 'bg-[#123038]/20 text-[#123038]' : 'bg-white/10 text-[#EDEAE4]/70'
                }`}>
                  {showroomCount}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#EDEAE4]/20 border-t-[#C9A24B] rounded-full animate-spin mx-auto mb-4" />
            <EditableText
              id="companyPhotos.loading"
              as="p"
              className="text-sm font-bold text-[#EDEAE4]"
              defaultText="در حال دریافت تصاویر مجموعه..."
            />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-[#15343d] rounded-3xl p-12 text-center border border-white/10 space-y-3">
            <Building2 className="w-12 h-12 text-[#EDEAE4]/30 mx-auto" />
            <EditableText id="companyPhotos.emptyTitle" as="h3" className="text-base font-bold text-[#EDEAE4]" defaultText="هیچ تصویری در این دسته‌بندی یافت نشد" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, idx) => {
              const badgeId =
                photo.category === 'office'
                  ? 'companyPhotos.badgeOffice'
                  : photo.category === 'showroom'
                  ? 'companyPhotos.badgeShowroom'
                  : 'companyPhotos.badgeFactory';
              const badgeDefault =
                photo.category === 'office'
                  ? 'دفتر مرکزی'
                  : photo.category === 'showroom'
                  ? 'شوروم دائمی'
                  : 'خطوط تولید کارخانه';
              const categoryColor =
                photo.category === 'office'
                  ? 'bg-blue-900/80 text-blue-200 border-blue-700/60'
                  : photo.category === 'showroom'
                  ? 'bg-amber-900/80 text-amber-200 border-amber-700/60'
                  : 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60';

              return (
                <div
                  key={photo.id || idx}
                  onClick={() => setActivePhoto(photo)}
                  className="group bg-[#15343d] rounded-3xl overflow-hidden border border-white/10 shadow-sm hover:shadow-2xl hover:border-[#C9A24B]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-4/3 overflow-hidden bg-black/20">
                    <img
                      src={getOptimizedImageUrl(photo.url)}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border backdrop-blur-xs shadow-xs ${categoryColor}`}>
                        <EditableText id={badgeId} as="span" defaultText={badgeDefault} />
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#1E4B57]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                      <span className="p-3 rounded-2xl bg-white/20 text-white group-hover:scale-110 transition-transform">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Caption & Info - Title Only */}
                  <div className="p-3.5 flex-1 flex flex-col justify-center">
                    <EditableText
                      id={`companyPhoto.${photo.id || idx}.title`}
                      as="h3"
                      className="text-sm font-bold text-[#EDEAE4] line-clamp-1 group-hover:text-[#C9A24B] transition-colors"
                      defaultText={getText(`companyPhoto.${photo.id || idx}.title`, photo.title)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#15343d] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A24B]/30 flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#EDEAE4]">
                  {getText(`companyPhoto.${activePhoto.id}.title`, activePhoto.title)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="p-2 sm:p-4 bg-black/40 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={getOptimizedImageUrl(activePhoto.url)}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#1E4B57] flex flex-wrap items-center justify-between gap-3 text-xs text-[#EDEAE4]/80">
              <span className="px-2.5 py-1 rounded-full bg-[#C9A24B] text-[#1E4B57] font-bold text-[10px]">
                {activePhoto.category === 'office'
                  ? getText('companyPhotos.office', 'دفتر مرکزی')
                  : activePhoto.category === 'showroom'
                  ? getText('companyPhotos.showroom', 'شوروم')
                  : getText('companyPhotos.factoryLines', 'کارخانه')}
              </span>

              {onOpenOrderModal && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePhoto(null);
                      onOpenOrderModal();
                    }}
                    className="btn-gold px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer font-vazir shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{getText('companyPhotos.orderWholesale', 'ثبت سفارش عمده')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePhoto(null);
                      onOpenOrderModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all font-vazir"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{getText('companyPhotos.orderPhone', 'سفارش تلفنی و ارتباط سریع')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
