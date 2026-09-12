import React from 'react';
import { Store, ShoppingCart, Building2, PackageCheck, Award, Sparkles, Truck, ShieldCheck } from 'lucide-react';

interface RetailerPartner {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
}

const RETAILER_PARTNERS: RetailerPartner[] = [
  { id: '1', name: 'هایپراستار', type: 'هایپرمارکت‌های سراسری', icon: <ShoppingCart className="w-5 h-5 text-[#C9A24B]" /> },
  { id: '2', name: 'دیجی‌کالا', type: 'بزرگترین فروشگاه اینترنتی', icon: <PackageCheck className="w-5 h-5 text-[#346D80]" /> },
  { id: '3', name: 'فروشگاه‌های رفاه', type: 'زنجیره‌ای کشوری', icon: <Store className="w-5 h-5 text-[#7FA69C]" /> },
  { id: '4', name: 'شهروند', type: 'مراکز خرید پایتخت', icon: <Building2 className="w-5 h-5 text-[#B49A7C]" /> },
  { id: '5', name: 'سرای ایرانی', type: 'هایپرمی و لوازم خانگی', icon: <Sparkles className="w-5 h-5 text-[#C9A24B]" /> },
  { id: '6', name: 'فروشگاه‌های اتکا', type: 'عرضه مستقیم محصولات', icon: <ShieldCheck className="w-5 h-5 text-[#346D80]" /> },
  { id: '7', name: 'مرکز پخش شوش', type: 'بازار تخصصی بلور و پلاستیک', icon: <Truck className="w-5 h-5 text-[#7FA69C]" /> },
  { id: '8', name: 'عمده‌فروشان صالح‌آباد', type: 'شبکه توزیع پلاستیک و آشپزخانه', icon: <Award className="w-5 h-5 text-[#B49A7C]" /> },
];

export const ClientLogos: React.FC = () => {
  // Duplicate for smooth seamless infinite marquee
  const marqueeList = [...RETAILER_PARTNERS, ...RETAILER_PARTNERS];

  return (
    <section className="py-10 border-y border-[#EDEAE4]/10 bg-[#1E4B57]/60 backdrop-blur-sm relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 text-center">
        <p className="text-xs font-bold text-[#7FA69C] font-vazir">
          تأمین‌کننده معتبر فروشگاه‌های زنجیره‌ای، هایپرمارکت‌ها و مراکز پخش عمده سراسر کشور
        </p>
      </div>

      {/* Marquee Wrapper with soft fade gradients on both edges */}
      <div className="relative w-full overflow-hidden">
        {/* Right fade gradient in RTL */}
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#1E4B57] to-transparent z-10 pointer-events-none" />
        {/* Left fade gradient in RTL */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#1E4B57] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee-rtl flex items-center gap-6 py-2">
          {marqueeList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#EDEAE4]/[0.05] border border-[#EDEAE4]/10 hover:border-[#C9A24B]/40 hover:bg-[#EDEAE4]/[0.08] transition-all shrink-0 group cursor-default"
            >
              <div className="p-2 rounded-xl bg-[#1E4B57] border border-[#EDEAE4]/10 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-[#EDEAE4] group-hover:text-[#C9A24B] transition-colors font-vazir">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#7FA69C] font-vazir">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};