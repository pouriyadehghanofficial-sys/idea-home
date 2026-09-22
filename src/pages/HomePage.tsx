import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Cpu, 
  Factory, 
  Palette,
  CheckCircle2,
  PhoneCall,
  ChevronLeft
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../services/storage';

interface HomePageProps {
  products: Product[];
  onNavigate: (tab: string, productId?: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  products, 
  onNavigate,
  onSelectCategory 
}) => {
  const featuredProducts = products.filter(p => p.isFeatured);
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const heroProduct = displayFeatured[activeHeroIndex] || displayFeatured[0];

  const categories = [
    { name: 'مبلمان و نشیمن', count: products.filter(p => p.category === 'مبلمان و نشیمن').length, desc: 'کلاف روس و متریال صادراتی' },
    { name: 'میز جلو مبلی و عسلی', count: products.filter(p => p.category === 'میز جلو مبلی و عسلی').length, desc: 'ترکیب سنگ طبیعی و استیل PVD' },
    { name: 'روشنایی و آباژور', count: products.filter(p => p.category === 'روشنایی و آباژور').length, desc: 'طراحی نئومدرن و نورپردازی ملایم' },
    { name: 'کنسول و دراور', count: products.filter(p => p.category === 'کنسول و دراور').length, desc: 'یراق‌آلات بلوم و روکش طبیعی' },
    { name: 'ناهارخوری و صندلی', count: products.filter(p => p.category === 'ناهارخوری و صندلی').length, desc: 'ارگونومی استاندارد و دوام بالا' }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Hero Section - Clean, spacious, uncluttered */}
      <section className="pt-8 sm:pt-14 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text column */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-right">
              <div className="inline-flex items-center gap-2 self-start bg-white px-3.5 py-1.5 rounded-full border border-[#0F4C5C]/15 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C99A3E]"></span>
                <span className="text-[#0F4C5C] font-semibold text-xs">
                  تولید صنعتی • استانداردهای بین‌المللی • ۳۶ ماه ضمانت کتبی
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black text-[#0F4C5C] leading-[1.25] tracking-tight">
                تمایز در کیفیت ساخت،<br />
                <span className="text-[#346D80]">
                  استاندارد در تولید صنعتی
                </span>
              </h1>

              <p className="text-[#0F4C5C]/80 text-base sm:text-lg leading-[1.9] max-w-xl font-normal">
                صنایع تولیدی آراسته، مجری تخصصی مجموعه‌های مبلمان مدرن، سازه‌های ترکیبی استیل ضد زنگ و سنگ طبیعی با فناوری برش لیزر و آبکاری خلأ PVD در ایران است.
              </p>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onNavigate('products')}
                  className="bg-[#0F4C5C] hover:bg-[#163E48] text-white font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-98"
                >
                  <span>مشاهده کاتالوگ محصولات</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('about')}
                  className="bg-white hover:bg-[#F0EEEA] text-[#0F4C5C] font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base border border-[#0F4C5C]/20 hover:border-[#0F4C5C]/40 flex items-center gap-2.5 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <PhoneCall className="w-4 h-4 text-[#C99A3E]" />
                  <span>مشاوره و استعلام مستقیم</span>
                </button>
              </div>

              {/* Stats strip - Minimalist & Airy */}
              <div className="pt-6">
                <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-[#0F4C5C]/10 shadow-xs">
                  <div className="text-center sm:text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#0F4C5C] tracking-tight block font-latin">+150</span>
                    <span className="text-xs text-[#0F4C5C]/70 font-medium mt-0.5 block">مدل در خط تولید</span>
                  </div>
                  
                  <div className="text-center sm:text-right border-x border-[#0F4C5C]/10 px-3 sm:px-5">
                    <span className="text-2xl sm:text-3xl font-black text-[#0F4C5C] tracking-tight block font-latin">98%</span>
                    <span className="text-xs text-[#0F4C5C]/70 font-medium mt-0.5 block">رضایت کارفرمایان</span>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-2xl sm:text-3xl font-black text-[#C99A3E] tracking-tight block font-latin">36</span>
                    <span className="text-xs text-[#0F4C5C]/70 font-medium mt-0.5 block">ماه گارانتی کتبی</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Showcase Frame - Clean, high visual impact, zero clutter */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#0F4C5C]/12 shadow-sm flex flex-col space-y-4">
                
                {/* Image showcase */}
                <div 
                  className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F0EEEA] cursor-pointer group"
                  onClick={() => onNavigate('product-details', heroProduct.id)}
                >
                  <img
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#0F4C5C] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {heroProduct.category}
                    </span>
                  </div>

                  {/* Code Pill */}
                  {heroProduct.code && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-[#0F4C5C] text-[11px] font-mono font-latin font-bold px-2.5 py-1 rounded-lg border border-black/5">
                        {heroProduct.code}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
                    <span className="text-xs font-light text-white/80 block mb-0.5">محصول برگزیده کارخانه</span>
                    <h3 className="font-bold text-base sm:text-lg drop-shadow-xs">{heroProduct.name}</h3>
                  </div>
                </div>

                {/* Specs and Price line */}
                <div className="flex justify-between items-center px-1 pt-1">
                  <div>
                    <span className="text-[11px] text-[#A68A6D] block">قیمت مصوب تولیدی:</span>
                    <span className="text-lg sm:text-xl font-black text-[#C99A3E]">
                      {formatPrice(heroProduct.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('product-details', heroProduct.id)}
                    className="px-4 py-2 bg-[#0F4C5C]/10 hover:bg-[#0F4C5C] text-[#0F4C5C] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>بررسی مشخصات فنی</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Minimalist interactive product switcher */}
                {displayFeatured.length > 1 && (
                  <div className="pt-2 border-t border-[#0F4C5C]/10">
                    <span className="text-[11px] text-[#A68A6D] font-medium block mb-2 text-right">
                      انتخاب مدل جهت پیش‌نمایش سریع:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {displayFeatured.slice(0, 4).map((p, idx) => {
                        const isSelected = idx === activeHeroIndex;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setActiveHeroIndex(idx)}
                            className={`relative aspect-4/3 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20 scale-102'
                                : 'border-[#0F4C5C]/10 opacity-70 hover:opacity-100'
                            }`}
                            title={p.name}
                          >
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Grid - Minimalist, Airy & Clean */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#C99A3E] block mb-1">
              تنوع در تولیدات صنعتی
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F4C5C]">
              دسته‌بندی‌های تخصصی خط تولید
            </h2>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-bold text-[#0F4C5C] hover:text-[#346D80] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>مشاهده همه محصولات ({products.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.name);
                onNavigate('products');
              }}
              className="bg-white rounded-2xl p-5 border border-[#0F4C5C]/10 hover:border-[#0F4C5C]/30 shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F0EEEA] group-hover:bg-[#0F4C5C] text-[#0F4C5C] group-hover:text-white transition-colors flex items-center justify-center font-bold mb-3 text-sm font-latin">
                  0{idx + 1}
                </div>
                <h3 className="font-extrabold text-base text-[#0F4C5C] group-hover:text-[#346D80] transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#0F4C5C]/60 leading-relaxed font-normal">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#0F4C5C]/8 flex items-center justify-between">
                <span className="text-xs text-[#A68A6D] font-medium">
                  {cat.count} مدل تولیدی
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-[#0F4C5C]/40 group-hover:text-[#0F4C5C] group-hover:-translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section - Crisp & Uncluttered */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#C99A3E] block mb-1">
              منتخب پرطرفدارترین‌ها
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F4C5C]">
              محصولات برگزیده و آماده تحویل
            </h2>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2 bg-white border border-[#0F4C5C]/15 hover:border-[#0F4C5C]/30 text-[#0F4C5C] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>مشاهده فهرست کامل</span>
            <ArrowLeft className="w-4 h-4 text-[#346D80]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayFeatured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(id) => onNavigate('product-details', id)}
            />
          ))}
        </div>
      </section>

      {/* Engineering Standards & Factory Advantages (Clean Corporate Presentation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#0F4C5C]/10 shadow-xs">
          <div className="max-w-3xl mb-10 text-right">
            <span className="text-xs font-bold text-[#C99A3E] block mb-1.5">
              استانداردهای مهندسی تولید
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F4C5C] leading-tight">
              چرا تولیدات آراسته انتخاب اول طراحان و پروژه‌هاست؟
            </h2>
            <p className="text-sm sm:text-base text-[#0F4C5C]/75 mt-3 leading-relaxed font-normal">
              ما کیفیت را فدای قیمت نمی‌کنیم؛ بهره‌گیری از خطوط برش لیزر فایبر، آبکاری خلأ و کلاف‌های استاندارد تضمین دوام محصولات ماست.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1 */}
            <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#0F4C5C]/8 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 text-[#C99A3E]" />
              </div>
              <h3 className="font-bold text-base text-[#0F4C5C]">برش لیزر فایبر و CNC</h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
                برشکاری دقیق ورق‌ها و پروفیل‌های استیل بدون کوچکترین پلیسه و با بالاترین تقارن هندسی.
              </p>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#0F4C5C]/8 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold">
                <Palette className="w-5 h-5 text-[#C99A3E]" />
              </div>
              <h3 className="font-bold text-base text-[#0F4C5C]">آبکاری خلأ PVD تیتانیوم</h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
                پوشش‌دهی فلزات با رنگ‌های طلایی، رزگلد و دودی با ثبات رنگ قطعی در برابر رطوبت و شوینده‌ها.
              </p>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#0F4C5C]/8 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#C99A3E]" />
              </div>
              <h3 className="font-bold text-base text-[#0F4C5C]">۳۶ ماه گارانتی کتبی</h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
                تمامی اتصالات، فوم‌های سرد و اسکلت شامل کارت گارانتی رسمی هولوگرام‌دار کارخانه هستند.
              </p>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-2xl bg-[#F8F7F4] border border-[#0F4C5C]/8 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold">
                <Factory className="w-5 h-5 text-[#C99A3E]" />
              </div>
              <h3 className="font-bold text-base text-[#0F4C5C]">سفارش‌سازی مستقیم پروژه</h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
                امکان تغییر کالیته پارچه، ضخامت سنگ و تولید تیراژ برای هتل‌ها، دفاتر و مجتمع‌های مسکونی.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Download & Consultation Banner - Clean Petrol Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 text-white bg-[#0F4C5C] shadow-sm flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-right max-w-2xl">
            <span className="text-xs font-bold text-[#C99A3E] block">
              نسخه دیجیتال رسمی ۱۴۰۴
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              دریافت کاتالوگ جامع محصولات و مشخصات فنی کارخانه
            </h2>
            <p className="text-sm text-[#F8F7F4]/80 leading-relaxed font-normal">
              کاتالوگ دیجیتال شامل تصاویر تمامی مدل‌ها، جدول رنگ‌بندی کالیته پارچه‌ها، ابعاد دقیق مهندسی و راهنمای سفارش اختصاصی می‌باشد.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-[#C99A3E] hover:bg-[#B58832] text-white font-bold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>دانلود نسخه PDF کاتالوگ</span>
            </button>

            <button
              onClick={() => onNavigate('about')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#C99A3E]" />
              <span>استعلام تلفنی و تماس</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};