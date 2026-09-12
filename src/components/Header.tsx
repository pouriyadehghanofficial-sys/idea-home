import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';
import { useSiteContent } from '../context/ContentContext';

interface HeaderProps {
  onOpenOrderModal: () => void;
  onOpenCatalogModal?: () => void;
  isContained?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrderModal, isContained = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDesktop } = useViewport();
  const { isEditorMode } = useSiteContent();

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

  // Handle Escape key to close mobile menu
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
    { id: 'header.navHome', name: 'خانه', href: '#hero' },
    { id: 'header.navProducts', name: 'محصولات', href: '#products-showcase' },
    { id: 'header.navFeatures', name: 'استانداردهای تولید', href: '#features' },
    { id: 'header.navFaq', name: 'سوالات متداول', href: '#faq' },
    { id: 'header.navCatalog', name: 'دریافت کاتالوگ', href: '#catalog-request' },
    { id: 'header.navContact', name: 'تماس با ما', href: '#contact' },
  ];

  // Determine whether to display mobile or desktop controls
  // In live site, rely on responsive Tailwind breakpoints (flex lg:hidden / hidden lg:flex)
  // In AdminVisualEditor (isContained === true), rely on the simulated viewport mode
  const desktopNavClasses = isContained
    ? (isDesktop ? 'flex' : 'hidden')
    : 'hidden lg:flex';
  const mobileToggleClasses = isContained
    ? (!isDesktop ? 'flex' : 'hidden')
    : 'flex lg:hidden';

  return (
    <header
      id="main-header"
      className={`${
        isContained
          ? 'sticky top-0 w-full z-30'
          : 'fixed top-0 left-0 right-0 z-50'
      } transition-all duration-300 border-b border-transparent ${
        isScrolled
          ? 'bg-[#1E4B57]/85 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(8,24,28,0.35)] py-2.5 sm:py-3'
          : 'bg-[#1E4B57]/20 backdrop-blur-md py-3.5 sm:py-4 md:py-5'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Logo on the start side (right in RTL) */}
          <a
            href={isEditorMode ? undefined : '#hero'}
            onClick={(e) => {
              if (isEditorMode) e.preventDefault();
              closeMobileMenu();
            }}
            className="flex items-center gap-2 group cursor-pointer z-10 shrink-0"
          >
            <Logo variant="header" showText={false} />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className={`${desktopNavClasses} absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-2 bg-[#EDEAE4]/[0.07] backdrop-blur-md px-4 py-2 rounded-full border border-[#EDEAE4]/10 shadow-inner z-10 whitespace-nowrap`}
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={isEditorMode ? undefined : link.href}
                onClick={(e) => {
                  if (isEditorMode) e.preventDefault();
                }}
                className="px-3 xl:px-3.5 py-1.5 text-xs xl:text-sm font-medium text-[#EDEAE4]/85 hover:text-[#EDEAE4] hover:bg-[#EDEAE4]/12 rounded-full transition-all duration-200 cursor-pointer font-vazir whitespace-nowrap shrink-0"
              >
                <EditableText
                  id={link.id}
                  as="span"
                  className="whitespace-nowrap"
                  defaultText={link.name}
                />
              </a>
            ))}
          </nav>

          {/* Desktop Left Action */}
          <div className={`${desktopNavClasses} items-center gap-3 z-10 shrink-0`}>
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="btn-gold px-4 py-2 text-xs font-bold rounded-full flex items-center gap-2 font-vazir shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <EditableText
                id="header.ctaButton"
                as="span"
                className="whitespace-nowrap"
                defaultText="ثبت سفارش عمده"
              />
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* Mobile/Tablet menu toggle button */}
          <div className={`${mobileToggleClasses} items-center gap-2 z-10`}>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="w-10 h-10 rounded-xl bg-[#EDEAE4]/10 text-[#EDEAE4] hover:bg-[#EDEAE4]/20 active:bg-[#EDEAE4]/30 flex items-center justify-center transition-all cursor-pointer touch-manipulation shadow-sm"
              aria-label="منوی اصلی سایت"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#EDEAE4]" />
              ) : (
                <Menu className="w-5 h-5 text-[#EDEAE4]" />
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
              className={
                isContained
                  ? 'fixed inset-0 bg-black/40 backdrop-blur-xs z-30'
                  : 'fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
              }
              aria-hidden="true"
            />

            {/* Dropdown Menu Panel - Attached directly beneath the header */}
            <motion.div
              key="mobile-menu-drawer"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-full left-0 right-0 w-full px-3.5 sm:px-6 pt-2 pb-6 ${
                isContained ? 'z-40' : 'z-50'
              }`}
              dir="rtl"
            >
              <div className="max-w-md mx-auto bg-[#1E4B57] border border-[#EDEAE4]/20 rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col gap-3 max-h-[calc(100vh-100px)] overflow-y-auto">
                <div className="flex flex-col gap-1 border-b border-[#EDEAE4]/10 pb-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={isEditorMode ? undefined : link.href}
                      onClick={(e) => {
                        if (isEditorMode) {
                          e.preventDefault();
                          return;
                        }
                        closeMobileMenu();
                      }}
                      className="px-3.5 py-3 text-sm font-semibold text-[#EDEAE4]/90 hover:text-[#EDEAE4] hover:bg-[#EDEAE4]/10 active:bg-[#EDEAE4]/20 rounded-xl transition-all font-vazir text-right cursor-pointer flex items-center justify-between"
                    >
                      <EditableText
                        id={link.id}
                        as="span"
                        defaultText={link.name}
                      />
                    </a>
                  ))}
                </div>

                <div className="pt-1 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      if (isEditorMode) {
                        e.preventDefault();
                        return;
                      }
                      closeMobileMenu();
                      onOpenOrderModal();
                    }}
                    className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 font-vazir cursor-pointer shadow-lg active:scale-98 transition-all"
                  >
                    <EditableText
                      id="header.ctaButton"
                      as="span"
                      defaultText="ثبت سفارش عمده"
                    />
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};