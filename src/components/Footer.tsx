import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, Clock } from 'lucide-react';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';

interface FooterProps {
  onOpenOrderModal: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrderModal }) => {
  const { isMobile } = useViewport();

  return (
    <footer id="contact" className="bg-[#1E4B57] text-[#EDEAE4] pt-12 sm:pt-16 pb-12 border-t border-[#EDEAE4]/10 relative overflow-hidden scroll-mt-16 sm:scroll-mt-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Persian layout */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-8 sm:gap-14 mb-12 sm:mb-14 items-start`}>
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4 text-right">
            <a href="#hero" className="inline-block cursor-pointer">
              <Logo variant="footer" />
            </a>

            <EditableText
              id="footer.aboutText"
              as="p"
              multiline
              className="text-xs sm:text-sm text-[#EDEAE4]/75 max-w-xl leading-relaxed font-vazir font-normal"
              defaultText="کارخانه ایده استیل سازان شریف؛ تولیدکننده تخصصی لوازم خانه و آشپزخانه با تمرکز بر کیفیت پایدار، طراحی کاربردی و تولید مستقیم. ما با کنترل فرآیند تولید از مواد اولیه تا محصول نهایی، محصولاتی قابل اعتماد و متناسب با نیاز بازار ارائه میدهیم و امکان تأمین سفارشهای عمده و همکاری با فروشگاه ها و مجموعه های تجاری را فراهم کرده ایم."
            />
          </div>

          {/* Col 2: تماس با ما (Contact) */}
          <div className="space-y-3.5 text-right md:justify-self-end md:mr-auto w-full md:max-w-md">
            <EditableText
              id="footer.contactHeading"
              as="h4"
              className="text-xs font-bold text-[#EDEAE4] font-vazir"
              defaultText="تماس با ما"
            />
            <ul className="space-y-3 text-xs text-[#EDEAE4]/80 font-vazir">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7FA69C] shrink-0" />
                <span className="font-vazir text-xs text-[#EDEAE4]/90 flex items-center gap-2 flex-wrap" dir="rtl">
                  <span className="font-bold text-[#EDEAE4]">طاهری:</span>
                  <a href="tel:09126020027" className="font-vazir tracking-wider hover:text-[#C9A24B] transition-colors" dir="ltr">
                    <EditableText id="footer.phone1" as="span" defaultText="۰۹۱۲۶۰۲۰۰۲۷" />
                  </a>
                  <span className="text-[#EDEAE4]/40">/</span>
                  <a href="tel:09121159732" className="font-vazir tracking-wider hover:text-[#C9A24B] transition-colors" dir="ltr">
                    <EditableText id="footer.phone2" as="span" defaultText="۰۹۱۲۱۱۵۹۷۳۲" />
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7FA69C] shrink-0" />
                <span className="font-latin text-left" dir="ltr">
                  <EditableText id="footer.email" as="span" defaultText="info@idea-home.ir" />
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#B49A7C] shrink-0" />
                <EditableText
                  id="footer.hours"
                  as="span"
                  defaultText="ساعات کاری: شنبه تا چهارشنبه ۸ الی ۱۷:۳۰"
                />
              </li>
            </ul>

            <div className="pt-2 w-full max-w-xs">
              <button
                onClick={onOpenOrderModal}
                className="btn-gold w-full py-2.5 px-4 text-xs font-bold text-center cursor-pointer font-vazir"
              >
                <EditableText
                  id="footer.orderButton"
                  as="span"
                  defaultText="ثبت سفارش تلفنی و ارتباط سریع"
                />
              </button>
            </div>
          </div>

        </div>

        {/* Thin divider line */}
        <div className="border-t border-[#EDEAE4]/10 my-8" />

        {/* Bottom Bar */}
        <div className={`flex flex-col ${isMobile ? 'gap-3 text-center' : 'sm:flex-row justify-between'} items-center gap-4 text-xs text-[#EDEAE4]/60 font-vazir`}>
          <EditableText
            id="footer.copyright"
            as="p"
            className={isMobile ? 'text-center' : 'text-center sm:text-right'}
            defaultText="© ۲۰۲۶ آیدیا هوم. تمامی حقوق محفوظ است."
          />
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-[11px]">
            <EditableText
              id="footer.badge1"
              as="span"
              className="text-[#7FA69C]"
              defaultText="ساخت ایران"
            />
            <span>•</span>
            <EditableText
              id="footer.badge2"
              as="span"
              className="text-[#EDEAE4]/70"
              defaultText="تولید ملی با کیفیت جهانی"
            />
            <span>•</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const previewContainer =
                  document.getElementById('admin-preview-scroll-container') ||
                  document.querySelector('[data-preview-scroll-container="true"]');
                if (previewContainer) {
                  previewContainer.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="hover:text-[#C9A24B] transition-colors cursor-pointer bg-transparent border-none p-0 inline font-vazir"
            >
              بازگشت به بالای صفحه ↑
            </button>
          </div>
        </div>

        {/* AH∞RA Brand Logo & Credit */}
        <div className="mt-5 sm:mt-6 pt-3 flex items-center justify-center">
          <a
            href="https://ahooraai.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 py-0.5 sm:py-1 px-2 sm:px-2.5 transition-all duration-300 select-none"
          >
            {/* 1. بج آیکون بینهایت AH∞RA */}
            <div className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-[6px] sm:rounded-lg bg-gradient-to-tr from-[#0e272f] via-[#143944] to-[#1c4b57] border border-cyan-400/25 shadow-[0_0_8px_rgba(6,182,212,0.18)] group-hover:shadow-[0_0_14px_rgba(6,182,212,0.35)] group-hover:border-cyan-400/40 shrink-0 overflow-hidden transition-all duration-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 drop-shadow-[0_0_4px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_7px_rgba(56,189,248,0.8)] transition-all"
              >
                <path
                  d="M18.1818 7.5C16.1472 7.5 14.3985 8.78385 13.0631 10.4566C12.4332 11.2458 11.5668 12.7542 10.9369 13.5434C9.60149 15.2162 7.8528 16.5 5.81818 16.5 C3.70951 16.5 2 14.4853 2 12C2 9.51472 3.70951 7.5 5.81818 7.5C7.8528 7.5 9.60149 8.78385 10.9369 10.4566C11.5668 11.2458 12.4332 12.7542 13.0631 13.5434C14.3985 15.2162 16.1472 16.5 18.1818 16.5C20.2905 16.5 22 14.4853 22 12C22 9.51472 20.2905 7.5 18.1818 7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* 2. متن طراحی و توسعه */}
            <span className="text-[10px] sm:text-xs text-[#EDEAE4]/55 group-hover:text-[#EDEAE4]/80 transition-colors font-vazir font-normal">
              طراحی و توسعه توسط{' '}
              <span className="font-normal text-white bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#818cf8] bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(56,189,248,0.25)] group-hover:drop-shadow-[0_0_7px_rgba(56,189,248,0.5)] transition-all">
                شرکت نوآوران هوشمند اهورا
              </span>
            </span>
          </a>
        </div>

      </div>
    </footer>
  );
};