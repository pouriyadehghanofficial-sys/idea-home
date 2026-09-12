import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Info, 
  X, 
  SlidersHorizontal,
  FileEdit,
  ArrowRight,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  HelpCircle,
  Undo2,
  Trash2
} from 'lucide-react';
import { useSiteContent } from '../../context/ContentContext';
import { 
  CONTENT_DEFINITIONS, 
  CONTENT_SECTION_NAMES, 
  ContentItemDefinition, 
  getContentDefinition 
} from '../../data/defaultContent';
import { Header } from '../../components/Header';
import { Hero } from '../../components/Hero';
import { ProductSlider } from '../../components/ProductSlider';
import { Features } from '../../components/Features';
import { FAQSection } from '../../components/FAQSection';
import { FinalCTA } from '../../components/FinalCTA';
import { Footer } from '../../components/Footer';
import { SliderProduct, CatalogInfo } from '../../types';
import { ViewportProvider } from '../../context/ViewportContext';

interface AdminVisualEditorProps {
  onNavigate: (tab: string) => void;
  sliderProducts?: SliderProduct[];
  catalog?: CatalogInfo;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export const AdminVisualEditor: React.FC<AdminVisualEditorProps> = ({
  onNavigate,
  sliderProducts = [],
  catalog,
}) => {
  const {
    draftContent,
    updateDraftValue,
    activeEditId,
    setActiveEditId,
    hoveredEditId,
    hasUnsavedChanges,
    isSaving,
    saveAllChanges,
    resetField,
    resetSection,
    resetAll,
    setIsEditorMode,
  } = useSiteContent();

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const [viewport, setViewport] = useState<ViewportMode>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 'mobile';
      if (window.innerWidth < 1024) return 'tablet';
    }
    return 'desktop';
  });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<'all' | 'section' | 'item' | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [autoScrollToElement, setAutoScrollToElement] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isRealMobile = windowWidth < 640;
  const isMobileLayout = windowWidth < 1024 || viewport === 'mobile';

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Enable editor mode while inside this component
  useEffect(() => {
    setIsEditorMode(true);
    return () => {
      setIsEditorMode(false);
      setActiveEditId(null);
    };
  }, [setIsEditorMode, setActiveEditId]);

  // When active item changes, open sidebar, focus textarea, and only minimally adjust scroll if obscured
  useEffect(() => {
    if (activeEditId) {
      setIsSidebarCollapsed(false);
      setTimeout(() => {
        if (!isRealMobile && textareaRef.current) {
          try {
            textareaRef.current.focus({ preventScroll: true });
          } catch {
            // fallback for older browsers
            textareaRef.current.focus();
          }
        }
      }, 50);

      if (autoScrollToElement) {
        // Small delay to allow any layout shifts to settle
        const timer = setTimeout(() => {
          const container = document.getElementById('admin-preview-scroll-container');
          if (!container) return;

          const el = container.querySelector(`[data-content-id="${activeEditId}"]`);
          if (!el) return;

          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();

          // Define visible bounds within the container
          const topBuffer = 45; // top bar & hint strip
          const bottomBuffer = isMobileLayout ? Math.min(window.innerHeight * 0.45, 260) : 40;

          const visibleTop = containerRect.top + topBuffer;
          const visibleBottom = containerRect.bottom - bottomBuffer;

          // If the element is already comfortably visible, DO NOT SCROLL!
          const isAlreadyVisible = elRect.top >= visibleTop && elRect.bottom <= visibleBottom;
          if (isAlreadyVisible) {
            return;
          }

          // If obscured, scroll just enough to bring it into view with a 24px margin
          let newScrollTop = container.scrollTop;

          if (elRect.top < visibleTop) {
            // Obscured above
            const diff = visibleTop - elRect.top + 24;
            newScrollTop = Math.max(0, container.scrollTop - diff);
          } else if (elRect.bottom > visibleBottom) {
            // Obscured below
            const diff = elRect.bottom - visibleBottom + 24;
            newScrollTop = container.scrollTop + diff;
          }

          container.scrollTo({
            top: newScrollTop,
            behavior: 'smooth',
          });
        }, 60);

        return () => clearTimeout(timer);
      }
    }
  }, [activeEditId, autoScrollToElement, isMobileLayout, isRealMobile]);

  const activeDef: ContentItemDefinition | undefined = activeEditId
    ? getContentDefinition(activeEditId) || {
        id: activeEditId,
        label: activeEditId.startsWith('features.')
          ? `ویژگی: ${activeEditId.replace('features.', '')}`
          : activeEditId,
        section: 'محتوای وب‌سایت',
        sectionKey: (activeEditId.split('.')[0] as any) || 'features',
        type: 'paragraph',
        defaultValue: draftContent[activeEditId] ?? '',
      }
    : undefined;

  const currentDraftValue = activeEditId ? (draftContent[activeEditId] ?? activeDef?.defaultValue ?? '') : '';

  // Handle Save
  const handleSave = async () => {
    const success = await saveAllChanges();
    if (success) {
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 4000);
    }
  };

  // Smooth scroll to a section inside preview
  const scrollToSection = (sectionId: string) => {
    if (previewContainerRef.current) {
      const el = previewContainerRef.current.querySelector(`#${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#EDEAE4]/40 font-vazir select-none overflow-hidden" dir="rtl">
      
      {/* Top Toolbar */}
      <header className="h-14 sm:h-16 bg-[#1E4B57] text-[#EDEAE4] border-b border-white/10 px-2 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 z-30 shadow-md">
        
        {/* Right side: Title and Section Info */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#346D80] flex items-center justify-center text-[#C9A24B] shadow-inner shrink-0">
            <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black text-[#EDEAE4] flex items-center gap-1.5 whitespace-nowrap">
              <span className="hidden sm:inline">ویرایش محتوای سایت</span>
              <span className="sm:hidden">ویرایشگر</span>
              <span className="hidden md:inline text-[11px] font-normal text-[#EDEAE4]/60">
                (پیش‌نمایش زنده)
              </span>
            </h2>
          </div>
        </div>

        {/* Center: Viewport Switcher Controls (Desktop / Tablet / Mobile) */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-[#0e272f]/60 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md shrink-0">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 sm:px-2.5 md:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-[#346D80] text-white shadow-sm'
                : 'text-[#EDEAE4]/70 hover:text-white hover:bg-white/5'
            }`}
            title="حالت دسکتاپ (عرض ۱۰۰٪)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">دسکتاپ</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 sm:px-2.5 md:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-[#346D80] text-white shadow-sm'
                : 'text-[#EDEAE4]/70 hover:text-white hover:bg-white/5'
            }`}
            title="حالت تبلت (عرض ۷۶۸ پیکسل)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">تبلت</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 sm:px-2.5 md:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-[#346D80] text-white shadow-sm'
                : 'text-[#EDEAE4]/70 hover:text-white hover:bg-white/5'
            }`}
            title="حالت موبایل (عرض ۳۹۰ پیکسل)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">موبایل</span>
          </button>
        </div>

        {/* Left side: Save & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Status Indicator */}
          {saveSuccessNotice ? (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>تغییرات ذخیره شد</span>
            </div>
          ) : hasUnsavedChanges ? (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>تغییرات ذخیره نشده</span>
            </div>
          ) : null}

          {/* Reset Dropdown / Button */}
          <button
            type="button"
            onClick={() => {
              setResetTarget('all');
              setIsResetConfirmOpen(true);
            }}
            className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold flex items-center gap-1 transition-all border border-white/15 cursor-pointer active:scale-98"
            title="بازگردانی به متن‌های پیش‌فرض کارخانه"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span className="hidden lg:inline">بازنشانی پیش‌فرض</span>
          </button>

          {/* Main Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-98 ${
              hasUnsavedChanges
                ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38e3a] text-[#1E4B57] hover:brightness-105 ring-2 ring-[#C9A24B]/40'
                : 'bg-white/15 text-[#EDEAE4]/50 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#1E4B57] border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره{hasUnsavedChanges ? '*' : ''}</span>
              </>
            )}
          </button>

          {/* Help button */}
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs transition-colors cursor-pointer"
            title="راهنمای کار با ویرایشگر تصویری"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Toggle Sidebar Collapse (only on desktop where sidebar exists) */}
          {!isMobileLayout && (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'نمایش پنل ویرایش' : 'بستن پنل ویرایش'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace: Split into Live Preview Area + Side Editor Drawer */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        
        {/* 1. LIVE PREVIEW CONTAINER */}
        <div
          id="admin-preview-scroll-container"
          data-preview-scroll-container="true"
          className={`flex-1 overflow-y-auto overflow-x-auto bg-[#143944]/70 pb-28 sm:pb-36 flex flex-col items-center justify-start relative transition-all duration-300 ${
            !isMobileLayout && !isSidebarCollapsed ? 'lg:pl-[420px] p-2 sm:p-4 md:p-6' : 'p-0 sm:p-4'
          }`}
        >
          
          {/* Viewport Frame */}
          <div
            ref={previewContainerRef}
            style={{
              width:
                isRealMobile
                  ? '100%'
                  : viewport === 'desktop'
                  ? '100%'
                  : viewport === 'tablet'
                  ? '768px'
                  : '390px',
              maxWidth: '100%',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className={`bg-[#1E4B57] text-[#EDEAE4] shadow-2xl relative flex flex-col transition-all shrink-0 mb-12 sm:mb-16 w-full ${
              viewport !== 'desktop' && !isRealMobile
                ? 'rounded-3xl border-8 border-[#0e272f] ring-1 ring-white/15 my-2 sm:my-4'
                : 'rounded-none sm:rounded-2xl border-0 sm:border sm:border-white/10 my-0 sm:my-1'
            }`}
          >
            {/* If Mobile/Tablet simulated on Desktop: Device top notch header bar */}
            {viewport !== 'desktop' && !isRealMobile && (
              <div className="bg-[#0e272f] text-[#EDEAE4]/50 py-1.5 px-4 text-[11px] flex justify-between items-center select-none shrink-0 border-b border-white/5">
                <span className="font-mono">۹:۴۱</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span>حالت {viewport === 'tablet' ? 'تبلت (۷۶۸px)' : 'موبایل (۳۹۰px)'}</span>
                </div>
              </div>
            )}

            {/* Hint Overlay Strip when hover */}
            <div className="bg-[#0e272f]/80 backdrop-blur-md text-[#C9A24B] text-[11px] py-1 px-3 text-center border-b border-[#C9A24B]/20 flex items-center justify-center gap-2 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>روی هر متن در صفحه کلیک کنید تا بلافاصله در پنل ویرایش باز شود</span>
            </div>

            {/* ACTUAL Public Website Components with Real-time Content */}
            <ViewportProvider forcedViewport={viewport}>
              <div className="flex-1 flex flex-col relative w-full overflow-x-clip">
                {/* Header */}
                <Header
                  onOpenOrderModal={() => {}}
                  onOpenCatalogModal={() => {}}
                  isContained={true}
                />

                <main className="flex-1 relative z-10 w-full">
                  {/* Hero */}
                  <Hero onOpenOrderModal={() => {}} />

                  {/* Product Slider Showcase */}
                  <ProductSlider
                    onOpenOrderModal={() => {}}
                    items={sliderProducts}
                    catalogUrl={catalog?.fileUrl}
                  />

                  {/* Features */}
                  <Features onOpenOrderModal={() => {}} />

                  {/* FAQ */}
                  <FAQSection />

                  {/* Final CTA */}
                  <FinalCTA
                    onOpenOrderModal={() => {}}
                    catalogUrl={catalog?.fileUrl}
                  />
                </main>

                {/* Footer */}
                <Footer
                  onOpenOrderModal={() => {}}
                  onOpenAdminLogin={() => onNavigate('admin-login')}
                />
              </div>
            </ViewportProvider>

            {/* If Mobile/Tablet: Device bottom home indicator bar */}
            {viewport !== 'desktop' && (
              <div className="bg-[#0e272f] py-2.5 flex justify-center items-center shrink-0 border-t border-white/5">
                <div className="w-28 h-1 bg-white/30 rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* 2. FLOATING SIDEBAR / BOTTOM SHEET EDITOR PANEL */}

        {/* Mobile/Compact: Slim guidance pill at bottom when nothing is selected, so screen is never blocked */}
        {isMobileLayout && !activeDef && (
          <div className="fixed bottom-4 inset-x-4 z-30 flex justify-center pointer-events-none">
            <div className="bg-[#0e272f]/95 backdrop-blur-md text-[#EDEAE4] text-xs py-2 px-4 rounded-full shadow-2xl border border-[#C9A24B]/40 flex items-center gap-2 pointer-events-auto select-none animate-in fade-in duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
              <span>برای ویرایش، روی هر متنی در پیش‌نمایش ضربه بزنید</span>
            </div>
          </div>
        )}

        {/* Mobile/Compact: Bottom Sheet editor that only covers the bottom half and never blocks the text being edited */}
        {isMobileLayout && activeDef && (
          <aside
            style={{
              transform: isSidebarCollapsed ? 'translateY(120%)' : 'translateY(0)',
              opacity: isSidebarCollapsed ? 0 : 1,
              pointerEvents: isSidebarCollapsed ? 'none' : 'auto',
            }}
            className="fixed inset-x-2 sm:inset-x-4 bottom-2 z-50 max-w-lg mx-auto w-auto max-h-[48vh] bg-white/98 backdrop-blur-2xl rounded-3xl border border-gray-200 shadow-[0_-15px_40px_rgba(0,0,0,0.35)] flex flex-col transition-all duration-300 overflow-hidden font-vazir select-none animate-in slide-in-from-bottom-6 duration-300"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-2 shrink-0" />

            {/* Panel Top Header */}
            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/90 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-[#7FA69C] block">
                  بخش: {CONTENT_SECTION_NAMES[activeDef.sectionKey]}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#1E4B57] truncate">
                  {activeDef.label}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateDraftValue(activeDef.id, '')}
                  className="text-[11px] text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                  title="پاک کردن متن این کادر"
                >
                  پاک کردن
                </button>
                <button
                  type="button"
                  onClick={() => resetField(activeDef.id)}
                  className="text-[11px] text-[#C9A24B] hover:text-[#96752A] font-bold px-2 py-1 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                  title="بازگردانی این متن به حالت کارخانه‌ای"
                >
                  پیش‌فرض
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditId(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  title="بستن ویرایش این مورد"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div className="p-3.5 overflow-y-auto space-y-3 flex-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={currentDraftValue}
                  onChange={(e) => updateDraftValue(activeDef.id, e.target.value)}
                  rows={3}
                  placeholder="متن جدید را اینجا تایپ کنید..."
                  className="w-full p-3 rounded-2xl border border-gray-300 focus:border-[#346D80] focus:ring-2 focus:ring-[#346D80]/20 text-xs sm:text-sm font-vazir text-gray-800 leading-relaxed outline-none transition-all resize-none select-text bg-white shadow-inner"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>
                  تعداد کاراکتر: <strong className="font-mono text-gray-700">{currentDraftValue.length}</strong>
                </span>
                {activeDef.defaultValue !== currentDraftValue ? (
                  <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    تغییر یافته (پیش‌نمایش زنده)
                  </span>
                ) : (
                  <span className="text-gray-400 text-[10px]">مطابق با پیش‌فرض</span>
                )}
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98 ${
                    hasUnsavedChanges
                      ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38e3a] text-[#1E4B57] hover:brightness-105 ring-2 ring-[#C9A24B]/30'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره این تغییر'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEditId(null)}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-all cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Desktop Floating Sidebar (active on large screens and desktop viewport) */}
        {!isMobileLayout && (
          <aside
            style={{
              transform: isSidebarCollapsed ? 'translateX(-120%)' : 'translateX(0)',
              opacity: isSidebarCollapsed ? 0 : 1,
              pointerEvents: isSidebarCollapsed ? 'none' : 'auto',
            }}
            className="fixed left-3 sm:left-6 top-16 sm:top-20 z-40 w-[350px] sm:w-[390px] max-h-[calc(100vh-5.5rem)] bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_20px_50px_rgba(14,39,47,0.25)] flex flex-col transition-all duration-300 overflow-hidden font-vazir select-none"
          >
            {/* Panel Top Header: Active Item Title or Selection State */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#7FA69C] block">
                  {activeDef ? `بخش: ${CONTENT_SECTION_NAMES[activeDef.sectionKey]}` : 'پنل ویرایش سریع متن'}
                </span>
                <h3 className="text-xs sm:text-sm font-black text-[#1E4B57] truncate">
                  {activeDef ? activeDef.label : 'روی هر متنی برای ویرایش کلیک کنید'}
                </h3>
              </div>

              {activeDef && (
                <button
                  type="button"
                  onClick={() => setActiveEditId(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer shrink-0"
                  title="بستن ویرایش این مورد"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Panel Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {activeDef ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-[#1E4B57] flex items-center gap-1.5">
                      <span>متن ویرایش‌پذیر</span>
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">
                        {activeDef.id}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateDraftValue(activeDef.id, '')}
                        className="text-[11px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                        title="پاک کردن متن این کادر"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>پاک کردن</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => resetField(activeDef.id)}
                        className="text-[11px] text-[#C9A24B] hover:text-[#96752A] font-bold flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-amber-50"
                        title="بازگردانی این متن به حالت کارخانه‌ای"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>پیش‌فرض</span>
                      </button>
                    </div>
                  </div>

                  {/* Multiline textarea that grows with content */}
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={currentDraftValue}
                      onChange={(e) => updateDraftValue(activeDef.id, e.target.value)}
                      rows={currentDraftValue.length > 80 ? 5 : 3}
                      placeholder="متن جدید را اینجا تایپ کنید..."
                      className="w-full p-3.5 pl-9 rounded-2xl border border-gray-300 focus:border-[#346D80] focus:ring-2 focus:ring-[#346D80]/20 text-xs sm:text-sm font-vazir text-gray-800 leading-relaxed outline-none transition-all resize-y select-text bg-white shadow-inner"
                      dir="rtl"
                    />
                    {currentDraftValue && (
                      <button
                        type="button"
                        onClick={() => updateDraftValue(activeDef.id, '')}
                        className="absolute left-2.5 top-2.5 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="پاک کردن متن"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Character Counter & Info */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                    <span>تعداد کاراکتر: <strong className="font-mono text-gray-700">{currentDraftValue.length}</strong></span>
                    {activeDef.defaultValue !== currentDraftValue ? (
                      <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        تغییر یافته (پیش‌نمایش زنده)
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px]">مطابق با پیش‌فرض</span>
                    )}
                  </div>

                  {activeDef.description && (
                    <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                      💡 {activeDef.description}
                    </p>
                  )}

                  {/* Quick Save & Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving || !hasUnsavedChanges}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-98 ${
                        hasUnsavedChanges
                          ? 'bg-gradient-to-r from-[#C9A24B] to-[#b38e3a] text-[#1E4B57] hover:brightness-105 ring-2 ring-[#C9A24B]/30'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره این تغییر'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveEditId(null)}
                      className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E4B57]/5 via-[#346D80]/10 to-[#C9A24B]/10 border border-[#7FA69C]/25 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#1E4B57] text-[#C9A24B] flex items-center justify-center mx-auto shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black text-[#1E4B57]">
                      روی هر متنی در سایت کلیک کنید
                    </h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      با کلیک روی هر کلمه یا تیتر در پیش‌نمایش سایت، کادر ویرایش سریع آن بلافاصله باز می‌شود و می‌توانید متن را ویرایش یا پاک کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Floating trigger button on left if collapsed to re-open easily (desktop only) */}
        {!isMobileLayout && isSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed left-4 top-20 sm:top-24 z-40 px-3.5 py-2.5 rounded-2xl bg-[#1E4B57] text-[#C9A24B] shadow-2xl border border-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer font-vazir"
            title="نمایش پنل ویرایش متن"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-bold text-white hidden sm:inline">پنل ویرایش</span>
            {activeDef && (
              <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-pulse" />
            )}
          </button>
        )}

      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 text-right animate-in zoom-in-95 font-vazir">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-gray-900">
                بازگردانی متن‌ها به حالت کارخانه‌ای
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                آیا مطمئن هستید که می‌خواهید تمام تغییرات متن‌های وب‌سایت را لغو کرده و متن‌های پیش‌فرض اولیه را بازگردانید؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await resetAll();
                  setIsResetConfirmOpen(false);
                  setSaveSuccessNotice(true);
                  setTimeout(() => setSaveSuccessNotice(false), 3000);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98"
              >
                بله، بازنشانی همه
              </button>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide / Help Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 space-y-4 text-right animate-in zoom-in-95 font-vazir">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-[#1E4B57] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                <span>راهنمای کار با ویرایشگر تصویری سایت</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <strong className="text-[#1E4B57] block font-black">۱. کلیک مستقیم روی متن‌ها:</strong>
                <p>
                  در کادر پیش‌نمایش سایت، موس خود را روی هر متن ببرید تا هایلایت شود. با یک کلیک، کادر ویرایش آن در پنل سمت چپ فعال می‌گردد.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <strong className="text-[#1E4B57] block font-black">۲. مشاهده لحظه‌ای (Real-time):</strong>
                <p>
                  هر کلمه‌ای که در کادر ویرایش تایپ می‌کنید بلافاصله در پیش‌نمایش سایت اعمال و ظاهر می‌شود.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <strong className="text-[#1E4B57] block font-black">۳. آزمودن حالت موبایل و تبلت:</strong>
                <p>
                  با دکمه‌های بالای صفحه می‌توانید پیش‌نمایش را روی دسکتاپ، تبلت و موبایل تغییر دهید تا از تناسب ظاهری متون در همه سایزها مطمئن شوید.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <strong className="text-[#1E4B57] block font-black">۴. ذخیره دائمی:</strong>
                <p>
                  تغییرات شما تا زمانی که دکمه طلایی <span className="font-bold text-[#C9A24B]">ذخیره تغییرات</span> را نزنید موقت هستند؛ با زدن این دکمه تغییرات در سایت عمومی اعمال و ماندگار می‌شوند.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1E4B57] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
