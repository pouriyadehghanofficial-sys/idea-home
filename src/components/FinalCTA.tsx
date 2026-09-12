import React, { useState } from 'react';
import { PhoneCall, Download, Loader2, Check } from 'lucide-react';
import { getSafeDownloadUrl } from '../utils/catalogDownload';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';

interface FinalCTAProps {
  onOpenOrderModal: () => void;
  catalogUrl?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenOrderModal, catalogUrl }) => {
  const { isMobile } = useViewport();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  return (
    <section id="catalog-request" className="py-24 relative overflow-hidden scroll-mt-20" dir="rtl">
      {/* Anchor for contact-cta */}
      <div id="contact-cta" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main CTA Box with bold gradient using Primary (#346D80) and Dark Teal (#1E4B57) */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#346D80] via-[#2A5C6C] to-[#1E4B57] p-6 sm:p-14 lg:p-16 border border-[#EDEAE4]/20 shadow-[0_25px_60px_rgba(14,38,44,0.6)]">
          {/* Ambient Glow Blobs inside container using Sage (#7FA69C) and Gold (#C9A24B) */}
          <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#7FA69C]/25 blur-[60px] transform-gpu pointer-events-none -z-0" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#C9A24B]/15 blur-[60px] transform-gpu pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEAE4]/10 border border-[#EDEAE4]/20 text-xs font-bold text-[#EDEAE4] backdrop-blur-md font-vazir">
              <EditableText
                id="cta.badge"
                as="span"
                defaultText="تأمین مستقیم و بی‌واسطه از درب کارخانه"
              />
            </div>

            {/* Motivational Persian Headline */}
            <EditableText
              id="cta.title"
              as="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#EDEAE4] leading-[1.3] font-vazir"
              defaultText="آماده تجهیز فروشگاه خود هستید؟"
            />

            {/* Description */}
            <EditableText
              id="cta.description"
              as="p"
              multiline
              className="text-base sm:text-lg text-[#EDEAE4]/85 leading-relaxed font-normal font-vazir max-w-2xl mx-auto"
              defaultText="کاتالوگ محصولات و مشخصات فنی را دریافت کنید. واحد فروش آیدیا هوم آماده ثبت سفارش شماست."
            />

            {/* Two Buttons */}
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center justify-center gap-3 sm:gap-4 pt-4`}>
              {/* Catalog Download Button */}
              <button
                onClick={handleDownloadCatalog}
                disabled={isDownloading}
                className={`btn-gold ${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 active:scale-98 transition-all font-vazir relative group whitespace-nowrap`}
                title="دانلود فایل PDF کاتالوگ محصولات آیدیا هوم"
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
                      id="cta.catalogButton"
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

              {/* Glass / Outline Style Button */}
              <a
                href="#contact"
                className={`${isMobile ? 'w-full' : 'w-full sm:w-auto'} px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold rounded-[18px] bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] border border-[#EDEAE4]/25 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer font-vazir whitespace-nowrap`}
              >
                <PhoneCall className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <EditableText
                  id="cta.contactButton"
                  as="span"
                  className="whitespace-nowrap"
                  defaultText="تماس با مدیران فروش کارخانه"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};