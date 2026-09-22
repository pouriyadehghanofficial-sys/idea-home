import React, { useState, useEffect } from 'react';
import { 
  Sliders,
  BookOpen, 
  FileSpreadsheet,
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronLeft,
  FileEdit,
  Layers,
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminUser } from '../../types';
import { Logo } from '../../components/Logo';

interface AdminLayoutProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: AdminUser;
  onLogout: () => void;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  isGuide?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onLogout,
  unreadMessagesCount,
  children
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile drawer when window resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const menuItems: MenuItem[] = [
    { id: 'admin-visual-editor', label: 'ویرایش محتوای سایت', icon: FileEdit },
    { id: 'admin-slider', label: 'ویترین و اسلایدر تصاویر', icon: Sliders },
    { id: 'admin-categories', label: 'دسته‌بندی‌های محصولات', icon: Layers },
    { id: 'admin-company-photos', label: 'تصاویر کارخانه و دفتر', icon: Building2 },
    { id: 'admin-catalog', label: 'مدیریت کاتالوگ PDF', icon: BookOpen },
    { id: 'admin-price-list', label: 'مدیریت لیست قیمت PDF', icon: FileSpreadsheet },
  ];

  const isDashboard = currentTab === 'admin-dashboard';
  const isVisualEditor = currentTab === 'admin-visual-editor';

  return (
    <div dir="rtl" className="min-h-screen bg-[#EDEAE4]/50 flex flex-col font-vazir text-[#1E4B57]">
      {/* Top Glassmorphic Navigation Header */}
      <header className="bg-[#1E4B57]/95 backdrop-blur-xl text-white border-b border-white/15 sticky top-0 z-40 shadow-sm">
        <div className={`${isVisualEditor ? 'max-w-[1800px]' : 'max-w-7xl'} mx-auto px-2.5 sm:px-6 lg:px-8`}>
          <div className="flex justify-between items-center h-14 sm:h-20 gap-1.5 sm:gap-4">
            {/* Brand / Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
              {/* Only show menu toggle button when NOT on dashboard */}
              {!isDashboard && (
                <button
                  type="button"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white backdrop-blur-md transition-all flex items-center justify-center shrink-0 cursor-pointer touch-manipulation shadow-xs"
                  aria-label="منوی ادمین"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              )}

              <div 
                className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer select-none shrink-0"
                onClick={() => onNavigate('admin-dashboard')}
                title="رفتن به پیشخوان مدیریت"
              >
                <Logo variant="header" showText={false} />
                <div className="min-w-0">
                  <h1 className="font-black text-xs sm:text-base text-[#EDEAE4] whitespace-nowrap">
                    <span className="hidden md:inline">پنل مدیریت کارخانه ایده استیل سازان شریف</span>
                    <span className="md:hidden">پنل مدیریت</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Quick Back to Dashboard Button when NOT on dashboard */}
            {!isDashboard && (
              <button
                type="button"
                onClick={() => onNavigate('admin-dashboard')}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-[11px] sm:text-xs font-bold transition-all border border-white/15 cursor-pointer shadow-xs active:scale-98 shrink-0"
                title="بازگشت به پیشخوان مدیریت"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span className="hidden sm:inline">بازگشت به پیشخوان</span>
                <span className="sm:hidden">پیشخوان</span>
              </button>
            )}

            {/* Actions & Current User */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs bg-white/10 hover:bg-white/20 text-[#EDEAE4] p-2 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 transition-all border border-white/15 backdrop-blur-md shadow-xs cursor-pointer active:scale-98 shrink-0"
                title="مشاهده ظاهر عمومی وب‌سایت"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span className="hidden md:inline font-bold">مشاهده سایت</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="text-xs bg-red-600/80 hover:bg-red-600 text-white p-2 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 transition-all shadow-xs border border-red-400/20 backdrop-blur-md cursor-pointer active:scale-98 shrink-0"
                title="خروج از حساب مدیریت"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline font-bold">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Mobile/Tablet Navigation Drawer (only when NOT on dashboard) */}
      <AnimatePresence>
        {mobileOpen && !isDashboard && (
          <>
            {/* Backdrop */}
            <motion.div
              key="admin-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] lg:hidden"
              aria-hidden="true"
            />

            {/* Floating Menu Drawer */}
            <motion.div
              key="admin-menu-panel"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 sm:top-20 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-md p-2 sm:p-4 z-[100] lg:hidden"
              dir="rtl"
            >
              <div className="bg-[#1E4B57] border border-white/20 rounded-3xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] space-y-3">
                {/* Header info */}
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#346D80] text-[#C9A24B] flex items-center justify-center shadow-inner">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block">بخش‌های مدیریت آیدیا هوم</span>
                      <span className="text-[11px] text-[#EDEAE4]/75 block">انتخاب کنید تا وارد بخش شوید</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="بستن منو"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Back to Dashboard Button in Mobile Drawer */}
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('admin-dashboard');
                    setMobileOpen(false);
                  }}
                  className="w-full text-right px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between transition-all cursor-pointer bg-white/10 hover:bg-white/20 text-[#EDEAE4] border border-white/15"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-[#C9A24B]" />
                    <span>پیشخوان مدیریت</span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#C9A24B]" />
                </button>

                {/* Navigation Menu Links */}
                <nav className="space-y-1.5 pt-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full text-right px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#C9A24B] text-[#1E4B57] shadow-md shadow-[#C9A24B]/30'
                            : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E4B57]' : 'text-[#C9A24B]'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-[#1E4B57]' : 'text-white/40'}`} />
                      </button>
                    );
                  })}
                </nav>

                {/* Bottom Quick Actions */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate('home');
                      setMobileOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#EDEAE4] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-white/15 cursor-pointer active:scale-98"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>مشاهده سایت</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-red-400/20 cursor-pointer active:scale-98"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout Content Area */}
      {isVisualEditor ? (
        <div className="flex-1 w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
          <main className="w-full h-full flex-1 flex flex-col min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
      ) : isDashboard ? (
        /* Exception: In dashboard, do NOT show the menu/sidebar at all */
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <main className="w-full space-y-6">
            {children}
          </main>
        </div>
      ) : (
        /* In all other admin sections, the menu is shown */
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-sm border border-white/80 space-y-2 sticky top-28">
              
              {/* Back to Dashboard Navigation Link */}
              <button
                type="button"
                onClick={() => onNavigate('admin-dashboard')}
                className="w-full p-3 rounded-2xl bg-gradient-to-br from-[#1E4B57]/5 to-[#346D80]/10 border border-[#7FA69C]/25 flex items-center justify-between gap-3 cursor-pointer hover:bg-white transition-all group"
                title="بازگشت به پیشخوان مدیریت"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-[#1E4B57] text-[#C9A24B] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-right">
                    <span className="text-xs font-black text-[#1E4B57] block truncate">پیشخوان مدیریت</span>
                    <span className="text-[10px] text-[#7FA69C] block font-medium group-hover:text-[#346D80]">بازگشت به منوی اصلی</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-[#7FA69C] group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Navigation Menu Links */}
              <nav className="space-y-1.5 pt-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#346D80] text-white shadow-md shadow-[#346D80]/20'
                          : item.isGuide
                          ? 'text-[#C9A24B] hover:bg-[#C9A24B]/10 hover:text-[#96752A]'
                          : 'text-[#1E4B57] hover:bg-white/90 hover:text-[#346D80]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A24B]' : 'text-current'}`} />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        <ChevronLeft className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content View Container */}
          <main className="lg:col-span-9 space-y-6">
            {children}
          </main>
        </div>
      )}

      {/* Bottom Brand Bar (AH∞RA Credit) */}
      {!isVisualEditor && (
        <footer className="mt-auto py-3 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#1E4B57] text-[#EDEAE4]">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
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
              <span className="text-[10px] sm:text-xs text-[#EDEAE4]/70 group-hover:text-[#EDEAE4] transition-colors font-vazir font-normal">
                طراحی و توسعه توسط{' '}
                <span className="font-normal text-white bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#818cf8] bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(56,189,248,0.25)] group-hover:drop-shadow-[0_0_7px_rgba(56,189,248,0.5)] transition-all">
                  شرکت نوآوران هوشمند اهورا
                </span>
              </span>
            </a>
          </div>
        </footer>
      )}
    </div>
  );
};