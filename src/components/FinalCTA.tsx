import React, { useState } from 'react';
import { Download, Loader2, Check, EyeOff, FileSpreadsheet } from 'lucide-react';
import { getSafeDownloadUrl } from '../utils/catalogDownload';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';
import { useSiteContent } from '../context/ContentContext';

interface FinalCTAProps {
  onOpenOrderModal: () => void;
  catalogUrl?: string;
  onDownloadPriceList?: () => void;
  priceListUrl?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ 
  onOpenOrderModal, 
  catalogUrl,
  onDownloadPriceList,
  priceListUrl,
}) => {
  const { isMobile } = useViewport();
  const { isEditorMode, setActiveEditId, isFieldDeleted, isContainerDeleted } = useSiteContent();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [isDownloadingPriceList, setIsDownloadingPriceList] = useState(false);
  const [priceListSuccess, setPriceListSuccess] = useState(false);

  const isBadgeDeleted = isFieldDeleted('cta.badge');
  const isBadgeContainerDeleted = isContainerDeleted('cta.badge');

  const isDownloadDeleted = isFieldDeleted('cta.downloadButton');
  const isDownloadContainerDeleted = isContainerDeleted('cta.downloadButton');

  const isPriceListDeleted = isFieldDeleted('cta.priceListButton');
  const isPriceListContainerDeleted = isContainerDeleted('cta.priceListButton');

  const handleDownloadCatalog = () => {
    setIsDownloading(true);

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
    } catch (err) {
      console.error('Download failed', err);
    }

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 600);
  };

  const handleDownloadPriceList = () => {
    setIsDownloadingPriceList(true);

    try {
      if (onDownloadPriceList) {
        onDownloadPriceList();
      } else {
        const targetUrl = priceListUrl || '/ideahome-pricelist.pdf';
        const safeUrl = getSafeDownloadUrl(targetUrl, 'pricelist');
        const link = document.createElement('a');
        link.href = safeUrl;
        link.download = 'IdeaHome-PriceList-1404.pdf';
        if (safeUrl.startsWith('http')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download price list failed', err);
    }

    setTimeout(() => {
      setIsDownloadingPriceList(false);
      setPriceListSuccess(true);
      setTimeout(() => setPriceListSuccess(false), 3500);
    }, 600);
  };

  return (
    <section id="catalog-request" className="py-24 relative overflow-hidden scroll-mt-20">
      {/* Anchor for contact-cta */}
      <div id="contact-cta" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main CTA Box with bold gradient using Primary (#346D80) and Dark Teal (#1E4B57) */}
        <div className={`relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#346D80] via-[#2A5C6C] to-[#1E4B57] ${isMobile ? 'p-6' : 'p-6 sm:p-14 lg:p-16'} border border-[#EDEAE4]/20 shadow-[0_25px_60px_rgba(14,38,44,0.6)]`}>
          {/* Ambient Glow Blobs inside container using Sage (#7FA69C) and Gold (#C9A24B) */}
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#7FA69C]/25 blur-[60px] transform-gpu pointer-events-none -z-0" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#C9A24B]/15 blur-[60px] transform-gpu pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Pill tag */}
            {(!isEditorMode && isBadgeDeleted) ? null : isEditorMode && isBadgeDeleted && isBadgeContainerDeleted ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveEditId('cta.badge');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-red-400/70 bg-red-950/40 text-red-200 text-xs cursor-pointer select-none"
                title="نشان کاتالوگ و کادر آن حذف شده‌اند (کلیک برای بازیابی)"
              >
                <EyeOff className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-vazir line-through text-red-300">نشان کاتالوگ (حذف‌شده)</span>
              </div>
            ) : isBadgeContainerDeleted ? (
              <div
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('cta.badge');
                  }
                }}
                className={`inline-flex items-center gap-2 ${
                  isEditorMode
                    ? 'cursor-pointer px-3 py-1 rounded-md border border-dashed border-amber-400/60 bg-amber-950/20'
                    : ''
                }`}
                title={isEditorMode ? 'کادر نشان حذف شده است (کلیک برای ویرایش یا بازیابی کادر)' : undefined}
              >
                <EditableText
                  id="cta.badge"
                  as="span"
                  className="text-xs font-bold text-[#EDEAE4] font-vazir"
                  defaultText="تأمین مستقیم و بی‌واسطه از درب کارخانه"
                />
                {isEditorMode && (
                  <span className="text-[10px] text-amber-300 font-vazir bg-amber-400/20 px-1.5 py-0.5 rounded">
                    [کادر حذف‌شده]
                  </span>
                )}
              </div>
            ) : (
              <div
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('cta.badge');
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEAE4]/10 border border-[#EDEAE4]/20 text-xs font-bold text-[#EDEAE4] backdrop-blur-md font-vazir transition-all ${
                  isEditorMode ? 'cursor-pointer hover:border-[#C9A24B]/70 hover:bg-[#EDEAE4]/20' : ''
                }`}
                title={isEditorMode ? 'کلیک برای ویرایش نشان کاتالوگ' : undefined}
              >
                <EditableText
                  id="cta.badge"
                  as="span"
                  defaultText="تأمین مستقیم و بی‌واسطه از درب کارخانه"
                />
              </div>
            )}

            {/* Motivational Persian Headline */}
            <EditableText
              id="cta.title"
              as="h2"
              className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl lg:text-5xl'} font-extrabold text-[#EDEAE4] leading-[1.3] font-vazir`}
              defaultText="آماده تجهیز فروشگاه خود هستید؟"
            />

            {/* Description */}
            <EditableText
              id="cta.description"
              as="p"
              multiline
              className={`${isMobile ? 'text-xs leading-relaxed' : 'text-base sm:text-lg leading-relaxed'} text-[#EDEAE4]/85 font-normal font-vazir max-w-2xl mx-auto`}
              defaultText="کاتالوگ محصولات و مشخصات فنی را دریافت کنید. واحد فروش آیدیا هوم آماده ثبت سفارش شماست."
            />

            {/* Action Buttons */}
            {(!isEditorMode && isDownloadDeleted && isPriceListDeleted) ? null : (
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row sm:flex-wrap'} items-center justify-center gap-3 sm:gap-4 pt-4`}>
                {/* 1. Catalog Download Button */}
                {(!isEditorMode && isDownloadDeleted) ? null : isEditorMode && isDownloadDeleted && isDownloadContainerDeleted ? (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveEditId('cta.downloadButton');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-dashed border-red-400/60 bg-red-950/40 text-red-200 text-xs cursor-pointer select-none flex items-center gap-1.5"
                    title="دکمه دانلود کاتالوگ و کادر آن حذف شده‌اند (کلیک برای بازیابی)"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs font-vazir line-through text-red-300">دکمه کاتالوگ (حذف‌شده)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (isEditorMode) {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveEditId('cta.downloadButton');
                        return;
                      }
                      handleDownloadCatalog();
                    }}
                    disabled={!isEditorMode && isDownloading}
                    className={`btn-gold ${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98 transition-all font-vazir relative group whitespace-nowrap`}
                    title={isEditorMode ? 'کلیک برای ویرایش دکمه دریافت کاتالوگ' : 'دانلود فایل PDF کاتالوگ محصولات آیدیا هوم'}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#1E4B57] animate-spin shrink-0" />
                        <span>در حال آماده‌سازی و دانلود...</span>
                      </>
                    ) : downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-[#1E4B57] shrink-0" />
                        <span>کاتالوگ با موفقیت دانلود شد</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-[#1E4B57] group-hover:translate-y-0.5 transition-transform shrink-0" />
                        <EditableText
                          id="cta.downloadButton"
                          as="span"
                          className="whitespace-nowrap"
                          defaultText="دریافت کاتالوگ محصولات"
                        />
                        <span className="text-[11px] bg-[#1E4B57]/15 px-2 py-0.5 rounded-md font-normal mr-0.5 shrink-0">
                          PDF
                        </span>
                      </>
                    )}
                  </button>
                )}

                {/* 2. Price List Download Button */}
                {(!isEditorMode && isPriceListDeleted) ? null : isEditorMode && isPriceListDeleted && isPriceListContainerDeleted ? (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveEditId('cta.priceListButton');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-dashed border-red-400/60 bg-red-950/40 text-red-200 text-xs cursor-pointer select-none flex items-center gap-1.5"
                    title="دکمه دریافت لیست قیمت و کادر آن حذف شده‌اند (کلیک برای بازیابی)"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs font-vazir line-through text-red-300">دکمه لیست قیمت (حذف‌شده)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (isEditorMode) {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveEditId('cta.priceListButton');
                        return;
                      }
                      handleDownloadPriceList();
                    }}
                    disabled={!isEditorMode && isDownloadingPriceList}
                    className={`${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold rounded-[18px] bg-gradient-to-r from-[#D4AE57]/20 via-[#C9A24B]/30 to-[#D4AE57]/20 hover:from-[#D4AE57]/35 hover:to-[#C9A24B]/45 text-[#EDEAE4] border border-[#C9A24B]/70 hover:border-[#C9A24B] shadow-lg backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer font-vazir hover:scale-102 active:scale-98 transition-all group whitespace-nowrap`}
                    title={isEditorMode ? 'کلیک برای ویرایش دکمه دریافت لیست قیمت' : 'دانلود فایل PDF لیست قیمت محصولات'}
                  >
                    {isDownloadingPriceList ? (
                      <>
                        <Loader2 className="w-4 h-4 text-[#C9A24B] animate-spin shrink-0" />
                        <span>در حال آماده‌سازی لیست قیمت...</span>
                      </>
                    ) : priceListSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-[#C9A24B] shrink-0" />
                        <span>لیست قیمت با موفقیت دانلود شد</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4 text-[#C9A24B] group-hover:scale-110 transition-transform shrink-0" />
                        <EditableText
                          id="cta.priceListButton"
                          as="span"
                          className="whitespace-nowrap"
                          defaultText="دریافت لیست قیمت محصولات"
                        />
                        <span className="text-[11px] bg-[#C9A24B]/25 text-[#EDEAE4] px-2 py-0.5 rounded-md font-normal mr-0.5 shrink-0 border border-[#C9A24B]/40">
                          PDF
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
