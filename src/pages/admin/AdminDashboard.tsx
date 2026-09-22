import React from 'react';
import { 
  FileEdit,
  Sliders,
  Layers,
  Building2,
  BookOpen,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';
import { Product, ContactMessage } from '../../types';

interface AdminDashboardProps {
  products: Product[];
  messages: ContactMessage[];
  categoriesCount: number;
  onNavigate: (tab: string, productId?: string) => void;
  onOpenNewProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate
}) => {
  const quickLinks = [
    {
      id: 'admin-visual-editor',
      title: 'ویرایش محتوای سایت',
      desc: 'ویرایش مستقیم متن‌ها، عناوین، شعارها، دکمه‌ها و المان‌های ظاهری با پیش‌نمایش گرافیکی زنده',
      icon: FileEdit,
      action: () => onNavigate('admin-visual-editor'),
      gradient: 'from-[#1E4B57] to-[#346D80]',
      colorText: 'text-[#1E4B57]',
      accentBg: 'bg-[#1E4B57]/10 text-[#1E4B57]',
    },
    {
      id: 'admin-slider',
      title: 'ویترین و اسلایدر تصاویر',
      desc: 'تنظیم و بارگذاری تصاویر ویترین چرخان، بنرهای اسلایدر صفحه اصلی و اولویت نمایش اسلایدها',
      icon: Sliders,
      action: () => onNavigate('admin-slider'),
      gradient: 'from-[#C9A24B] to-[#96752A]',
      colorText: 'text-[#96752A]',
      accentBg: 'bg-[#C9A24B]/15 text-[#96752A]',
    },
    {
      id: 'admin-categories',
      title: 'دسته‌بندی‌های محصولات',
      desc: 'مدیریت و سازماندهی دسته‌بندی‌ها، افزودن، ویرایش و مرتب‌سازی گروه‌های مختلف محصولات کارخانه',
      icon: Layers,
      action: () => onNavigate('admin-categories'),
      gradient: 'from-[#346D80] to-[#1E4B57]',
      colorText: 'text-[#346D80]',
      accentBg: 'bg-[#346D80]/15 text-[#346D80]',
    },
    {
      id: 'admin-company-photos',
      title: 'تصاویر کارخانه و دفتر',
      desc: 'گالری عکس‌های خط تولید، محیط اداری، ماشین‌آلات مدرن و استانداردهای صنعتی کارخانه',
      icon: Building2,
      action: () => onNavigate('admin-company-photos'),
      gradient: 'from-[#7FA69C] to-[#1E4B57]',
      colorText: 'text-[#1E4B57]',
      accentBg: 'bg-[#7FA69C]/20 text-[#1E4B57]',
    },
    {
      id: 'admin-catalog',
      title: 'مدیریت کاتالوگ PDF',
      desc: 'بارگذاری، به‌روزرسانی و دانلود فایل کاتالوگ رسمی و جامع محصولات کارخانه',
      icon: BookOpen,
      action: () => onNavigate('admin-catalog'),
      gradient: 'from-[#C9A24B] to-[#b8913d]',
      colorText: 'text-[#96752A]',
      accentBg: 'bg-[#C9A24B]/15 text-[#96752A]',
    },
    {
      id: 'admin-price-list',
      title: 'مدیریت لیست قیمت PDF',
      desc: 'بارگذاری، به‌روزرسانی و انتشار آخرین نگارش فایل لیست قیمت رسمی برای خریداران عمده',
      icon: FileSpreadsheet,
      action: () => onNavigate('admin-price-list'),
      gradient: 'from-[#1E4B57] to-[#7FA69C]',
      colorText: 'text-[#1E4B57]',
      accentBg: 'bg-[#1E4B57]/10 text-[#1E4B57]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="pb-3 border-b border-[#1E4B57]/10">
        <h2 className="text-xl sm:text-2xl font-black text-[#1E4B57]">
          پیشخوان مدیریت
        </h2>
      </div>

      {/* 6 Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="group bg-white/85 hover:bg-white backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-13 h-13 rounded-2xl ${item.accentBg} group-hover:bg-[#1E4B57] group-hover:text-[#C9A24B] flex items-center justify-center transition-all duration-300 shrink-0 shadow-xs`}>
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#EDEAE4]/50 group-hover:bg-[#1E4B57] group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 text-[#7FA69C] group-hover:text-[#C9A24B] group-hover:-translate-x-0.5 transition-all" />
                </div>
              </div>

              <div>
                <h3 className="font-black text-base text-[#1E4B57] group-hover:text-[#346D80] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7FA69C] mt-2 line-clamp-3 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E4B57]/10 flex items-center justify-between text-xs font-bold text-[#346D80] group-hover:text-[#1E4B57]">
                <span>ورود به بخش</span>
                <span className="text-[11px] text-[#C9A24B] group-hover:translate-x-[-4px] transition-transform">←</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};