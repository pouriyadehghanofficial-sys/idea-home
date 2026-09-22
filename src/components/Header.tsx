import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { EditableText } from './EditableText';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useViewport } from '../context/ViewportContext';
import { useSiteContent } from '../context/ContentContext';

interface HeaderProps {
  onOpenOrderModal: () => void;
  onOpenCatalogModal?: () => void;
  onDownloadPriceList?: () => void;
  onOpenCategoriesPage?: () => void;
  onOpenCompanyPhotosPage?: () => void;
  onOpenHomePage?: () => void;
  isContained?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenOrderModal, 
  onDownloadPriceList, 
  onOpenCategoriesPage,
  onOpenCompanyPhotosPage,
  onOpenHomePage,
  isContained = false 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDesktop, isMobile } = useViewport();
  const { isEditorMode, dir, setActiveEditId, getText } = useSiteContent();
  const ForwardArrow = dir === 'ltr' ? ArrowRight : ArrowLeft;
  const BackChevron = dir === 'ltr' ? ChevronRight : ChevronLeft;

  // Handle scroll detection for dynamic styling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close menu when resized to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const navLinks = [
    { id: 'header.navHome', name: getText('header.navHome', 'خانه'), href: '#hero' },
    { id: 'header.navProducts', name: getText('header.navProducts', 'محصولات'), href: '#products-showcase' },
    { id: 'header.navCategories', name: getText('header.navCategories', 'دسته‌بندی محصولات'), href: '#categories' },
    { id: 'header.navFeatures', name: getText('header.navFeatures', 'استانداردهای تولید'), href: '#features' },
    { id: 'header.navCompanyPhotos', name: getText('header.navCompanyPhotos', 'تصاویر کارخانه و دفتر'), href: '#company-photos' },
    { id: 'header.navFaq', name: getText('header.navFaq', 'سوالات متداول'), href: '#faq' },
    { id: 'header.navCatalog', name: getText('header.navCatalog', 'دریافت کاتالوگ'), href: '#catalog-request' },
    { id: 'header.navPriceList', name: getText('header.navPriceList', 'لیست قیمت'), href: '#price-list' },
    { id: 'header.navContact', name: getText('header.navContact', 'تماس با ما'), href: '#contact' },
  ];

  return (
    <header
      id="main-header"
      className={`${
        isContained
          ? 'sticky top-0 w-full z-20'
          : 'fixed top-0 left-0 right-0 z-50'
      } transition-all duration-300 border-b backdrop-blur-md ${
        isScrolled
          ? 'bg-[#1E4B57]/80 border-[#EDEAE4]/15 shadow-[0_12px_32px_-8px_rgba(8,24,28,0.35)] py-2.5 sm:py-3'
          : 'bg-[#1E4B57]/35 border-[#EDEAE4]/10 shadow-[0_4px_20px_-4px_rgba(8,24,28,0.15)] py-3.5 sm:py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Logo on the start side */}
          <a
            href={isEditorMode ? undefined : '#hero'}
            onClick={(e) => {
              if (onOpenHomePage) {
                e.preventDefault();
                onOpenHomePage();
              } else if (isEditorMode) {
                e.preventDefault();
              }
              closeMobileMenu();
            }}
            className="flex items-center gap-2 group cursor-pointer z-10 shrink-0"
          >
            <Logo variant="header" showText={false} />
          </a>

          {/* Unified Action Controls & Hamburger Menu (Desktop & Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 z-10 shrink-0">
            {/* Wholesale CTA button on desktop & tablet */}
            {!isMobile && (
              <button
                type="button"
                onClick={(e) => {
                  if (isEditorMode) {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveEditId('header.ctaButton');
                    return;
                  }
                  onOpenOrderModal();
                }}
                className="hidden sm:flex btn-gold px-4 py-2 text-xs font-bold rounded-full items-center gap-2 font-vazir shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer whitespace-nowrap shrink-0"
                title={isEditorMode ? 'کلیک برای ویرایش دکمه سفارش عمده' : undefined}
              >
                <EditableText
                  id="header.ctaButton"
                  as="span"
                  className="whitespace-nowrap"
                  defaultText="ثبت سفارش عمده"
                />
                <ForwardArrow className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher variant="header" />

            {/* Hamburger menu toggle button - active for both web/desktop & mobile */}
            <button
              type="button"
              id="header-menu-button"
              onClick={toggleMobileMenu}
              className={`h-10 px-3 sm:px-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer touch-manipulation shadow-sm ${
                mobileMenuOpen
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40 hover:bg-rose-500/30 active:scale-95 ring-2 ring-rose-400/20'
                  : 'bg-[#EDEAE4]/10 text-[#EDEAE4] hover:bg-[#EDEAE4]/20 active:bg-[#EDEAE4]/30'
              }`}
              aria-label={mobileMenuOpen ? getText('header.menuClose', 'بستن منو') : getText('header.menuTitle', 'منوی اصلی سایت')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-5 h-5 text-rose-200 stroke-[2.5]" />
                  <span className="text-xs font-bold font-vazir text-rose-200">{getText('header.menuClose', 'بستن')}</span>
                </>
              ) : (
                <>
                  <Menu className="w-5 h-5 text-[#EDEAE4]" />
                  <span className="text-xs font-bold font-vazir text-[#EDEAE4]">{getText('header.menu', 'منو')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop for one-tap click outside dismissal */}
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeMobileMenu}
              className={`${isContained ? 'absolute' : 'fixed'} inset-0 bg-black/60 backdrop-blur-sm z-40`}
              aria-hidden="true"
            />

            {/* Dropdown Menu Panel - Attached directly beneath the header */}
            <motion.div
              key="mobile-menu-drawer"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 w-full px-3.5 sm:px-6 pt-2 pb-6 z-50"
            >
              <div className="max-w-md sm:max-w-lg mx-auto bg-[#1E4B57] border border-[#EDEAE4]/20 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col max-h-[calc(100vh-100px)] overflow-hidden">
                {/* Drawer Top Header with explicit Close (ضربدر) button */}
                <div className="flex items-center justify-between p-4 sm:px-6 sm:py-4 border-b border-[#EDEAE4]/15 shrink-0 bg-[#1E4B57]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse"></span>
                    <span className="text-xs sm:text-sm font-bold text-[#EDEAE4]/90 font-vazir">{getText('header.menuTitle', 'منوی اصلی آیدیا هوم')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="px-3 py-1.5 rounded-xl bg-[#EDEAE4]/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-[#EDEAE4] hover:text-rose-200 flex items-center gap-1.5 transition-all cursor-pointer text-xs font-vazir"
                    aria-label={getText('header.menuClose', 'بستن منو')}
                    title={getText('header.menuClose', 'بستن منو')}
                  >
                    <X className="w-4 h-4" />
                    <span>{getText('header.menuClose', 'بستن')}</span>
                  </button>
                </div>

                {/* Inner Scroll Container - Strictly clipped within rounded borders */}
                <div className="overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-3 overscroll-contain menu-scroll-container">
                  <nav aria-label="منوی اصلی سایت" className="flex flex-col gap-1 border-b border-[#EDEAE4]/10 pb-3">
                    {navLinks.map((link) => (
                      <a
                        key={link.id}
                        href={isEditorMode ? undefined : (link.id === 'header.navPriceList' ? '#' : link.href)}
                        onClick={(e) => {
                          if (isEditorMode) {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveEditId(link.id);
                            return;
                          }
                          if (link.id === 'header.navCategories' && onOpenCategoriesPage) {
                            e.preventDefault();
                            closeMobileMenu();
                            onOpenCategoriesPage();
                            return;
                          }
                          if (link.id === 'header.navCompanyPhotos' && onOpenCompanyPhotosPage) {
                            e.preventDefault();
                            closeMobileMenu();
                            onOpenCompanyPhotosPage();
                            return;
                          }
                          if (link.id === 'header.navHome' && onOpenHomePage) {
                            e.preventDefault();
                            closeMobileMenu();
                            onOpenHomePage();
                            return;
                          }
                          closeMobileMenu();
                          if (link.id === 'header.navPriceList' && onDownloadPriceList) {
                            e.preventDefault();
                            onDownloadPriceList();
                          } else if (onOpenHomePage && link.href.startsWith('#')) {
                            e.preventDefault();
                            onOpenHomePage();
                            setTimeout(() => {
                              const target = document.querySelector(link.href);
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 120);
                          }
                        }}
                        className="group px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#EDEAE4]/90 hover:text-[#EDEAE4] hover:bg-[#EDEAE4]/10 active:bg-[#EDEAE4]/20 rounded-xl transition-all font-vazir text-start cursor-pointer flex items-center justify-between"
                      >
                        <EditableText
                          id={link.id}
                          as="span"
                          defaultText={link.name}
                        />
                        <BackChevron className="w-4 h-4 text-[#C9A24B]/60 group-hover:text-[#C9A24B] transition-all" />
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Language Switcher Inside Drawer */}
                  <LanguageSwitcher variant="mobile" />

                  <div className="pt-1 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        if (isEditorMode) {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveEditId('header.ctaButton');
                          return;
                        }
                        closeMobileMenu();
                        onOpenOrderModal();
                      }}
                      className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 font-vazir cursor-pointer shadow-lg active:scale-98 transition-all"
                      title={isEditorMode ? 'کلیک برای ویرایش دکمه سفارش عمده' : undefined}
                    >
                      <EditableText
                        id="header.ctaButton"
                        as="span"
                        defaultText="ثبت سفارش عمده"
                      />
                      <ForwardArrow className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};