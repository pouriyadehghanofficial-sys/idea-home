import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  BookOpen,
  ArrowDownCircle
} from 'lucide-react';
import { CatalogInfo } from '../types';
import { getSafeDownloadUrl } from '../utils/catalogDownload';

interface CatalogPageProps {
  catalog: CatalogInfo;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ catalog }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      // Initiate download or open url
      const safeUrl = catalog.fileUrl ? getSafeDownloadUrl(catalog.fileUrl) : '#';
      const link = document.createElement('a');
      link.href = safeUrl;
      link.download = `Arasteh-Manufacturing-Catalog-${catalog.version}.pdf`;
      if (safeUrl.startsWith('http')) {
        link.target = '_blank';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 1200);
  };

  const chapters = [
    { num: '۰۱', title: 'کاناپه و مبلمان راحتی نشیمن', desc: 'کلاف راش، فوم سرد ۳۵ کیلوگرم و پارچه‌های مخمل اروپایی' },
    { num: '۰۲', title: 'میزهای سنتر سنگ مرمر و استیل', desc: 'سنگ‌های طبیعی رگه‌دار نجف‌آباد و پایه‌های طلایی PVD' },
    { num: '۰۳', title: 'سرویس خواب و کمدهای دیواری', desc: 'طراحی مینیمال با لولاهای بلوم اتریش و آرام‌بند' },
    { num: '۰۴', title: 'صندلی‌های لانژ و مبلمان اداری', desc: 'نشیمن ارگونومیک اداری و پذیرایی VIP' },
    { num: '۰۵', title: 'کالیته پارچه، چرم و رنگ فلزات', desc: 'جدول کامل کد رنگ‌ها، ضخامت‌ها و نمونه‌های بافت' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header banner - Clean Petrol Box */}
      <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs border border-[#0F4C5C]/20 bg-[#0F4C5C] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-8 space-y-5 text-right">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#C99A3E]" />
              <span>نسخه دیجیتال رسمی کارخانه</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {catalog.title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl font-normal">
              {catalog.description}
            </p>

            {/* Meta badges - Clean */}
            <div className="flex flex-wrap gap-2.5 text-xs pt-1">
              <div className="bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Calendar className="w-4 h-4 text-[#C99A3E]" />
                <span>به‌روزرسانی: {catalog.updatedAt}</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <Layers className="w-4 h-4 text-[#C99A3E]" />
                <span>نسخه: {catalog.version}</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <HardDrive className="w-4 h-4 text-[#C99A3E]" />
                <span>حجم: {catalog.fileSize}</span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                <BookOpen className="w-4 h-4 text-[#C99A3E]" />
                <span>صفحات: {catalog.pageCount} صفحه تمام رنگی</span>
              </div>
            </div>

            {/* Download action button */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-[#C99A3E] hover:bg-[#B58832] text-white font-bold px-7 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال آماده‌سازی فایل کاتالوگ...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>دانلود مستقیم کاتالوگ (PDF)</span>
                  </>
                )}
              </button>

              {downloadSuccess && (
                <div className="text-xs bg-emerald-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span className="font-bold">فایل کاتالوگ با موفقیت در دستگاه شما ذخیره شد.</span>
                </div>
              )}
            </div>
          </div>

          {/* Catalog Mockup Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div 
              className="w-64 h-80 rounded-2xl bg-white/10 p-6 text-white border border-white/20 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#C99A3E] transition-all group" 
              onClick={handleDownload}
            >
              <div>
                <div className="flex justify-between items-center border-b border-white/15 pb-3 mb-4">
                  <span className="font-black text-sm tracking-wider text-[#C99A3E] font-latin">ARASTEH</span>
                  <span className="text-[10px] bg-[#C99A3E] px-2 py-0.5 rounded-md font-black text-white">PDF</span>
                </div>
                <h3 className="font-bold text-lg text-white leading-tight">
                  کاتالوگ جامع و لیست قیمت تولیدی
                </h3>
                <p className="text-xs text-white/70 mt-2 font-normal">
                  محصولات سازه‌های فلز، سنگ طبیعی و چوب
                </p>
              </div>

              <div className="border-t border-white/15 pt-3 flex items-center justify-between text-xs text-[#C99A3E] font-bold">
                <span>نسخه ۴.۲ جامع</span>
                <ArrowDownCircle className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Preview */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#C99A3E] block mb-1">
            محتوای فایل دیجیتال
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F4C5C]">
            سرفصل‌ها و بخش‌های مندرج در کاتالوگ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chapters.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#0F4C5C]/10 hover:border-[#0F4C5C]/30 shadow-xs transition-all"
            >
              <div className="text-2xl font-black text-[#C99A3E] mb-2 font-latin">{ch.num}</div>
              <h3 className="font-bold text-base text-[#0F4C5C] mb-1.5">{ch.title}</h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">{ch.desc}</p>
            </div>
          ))}

          {/* Order printed copy card */}
          <div className="bg-white rounded-2xl p-6 border border-[#0F4C5C]/10 flex flex-col justify-between shadow-xs hover:border-[#0F4C5C]/30 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center mb-3">
                <Printer className="w-5 h-5 text-[#C99A3E]" />
              </div>
              <h3 className="font-bold text-base text-[#0F4C5C] mb-1">
                درخواست کاتالوگ چاپی نفیس
              </h3>
              <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
                ویژه دفاتر مهندسی معماری و طراحان دکوراسیون داخلی جهت جلسات پروژه.
              </p>
            </div>
            <a
              href="tel:02188990011"
              className="mt-4 py-2.5 px-4 rounded-xl text-xs font-bold text-[#0F4C5C] bg-[#F8F7F4] hover:bg-[#F0EEEA] border border-[#0F4C5C]/15 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>سفارش تلفنی: ۰۲۱-۸۸۹۹۰۰۱۱</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};