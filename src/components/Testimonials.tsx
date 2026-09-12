import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Quote, Star, TrendingUp, CheckCircle } from 'lucide-react';

interface KitchenTestimonial {
  id: string;
  clientName: string;
  role: string;
  companyOrCity: string;
  quote: string;
  metric: string;
  metricLabel: string;
}

const KITCHEN_TESTIMONIALS: KitchenTestimonial[] = [
  {
    id: 't1',
    clientName: 'حاج محمود صادقی',
    role: 'مدیر پخش بلور و پلاستیک صادقی',
    companyOrCity: 'بازار بزرگ شوش، تهران',
    quote: 'بیش از سه سال است که سینی‌های مجلسی و ظروف فریزری آیدیا هوم را در تیراژ چند هزارتایی توزیع می‌کنیم. کیفیت تزریق، شفافیت متریال و مقاومت کفی سینی‌ها به قدری بالاست که حتی یک مورد مرجوعی شکستگی نداشته‌ایم. بسته‌بندی کارتنی محکم و تحویل به‌موقع کارخانه، خیال ما را از تأمین بازار راحت کرده است.',
    metric: '+۴۵٪',
    metricLabel: 'رشد فروش فصلی و رضایت همکاران'
  },
  {
    id: 't2',
    clientName: 'مهندس فرشاد نوری',
    role: 'سرپرست تأمین کالای خانه و آشپزخانه',
    companyOrCity: 'مجموعه فروشگاه‌های زنجیره‌ای هایپر',
    quote: 'ترازوهای دیجیتال آیدیا هوم به دلیل دقت یک گرم و کالیبراسیون استاندارد در کنار طراحی شیشه سکوریت، یکی از پرفروش‌ترین اقلام غرفه لوازم خانگی ما بوده است. پشتیبانی فنی و گارانتی معتبر کارخانه باعث شده مشتریان نهایی با اعتماد کامل خرید کنند.',
    metric: '۱۰۰٪',
    metricLabel: 'انطباق با استانداردهای فودگرید'
  },
  {
    id: 't3',
    clientName: 'زهرا میرزایی',
    role: 'مدرس قنادی و صاحب استودیو کیک',
    companyOrCity: 'اصفهان',
    quote: 'برای پخت کیک و شیرینی حساس، دقت ترازو حیاتی است. ترازوی دیجیتال آیدیا هوم با کاسه مدرج جداشونده و دکمه پارسنگ سریع، سرعت و نظم کارگاه ما را دوبرابر کرد. همچنین ظروف نگهداری هوابند آیدیا هوم مواد اولیه گران‌قیمت ما را تا ماه‌ها کاملاً تازه و ترد نگه می‌دارد.',
    metric: '۱۸ ماه',
    metricLabel: 'گارانتی تعویض و خدمات مطمئن'
  },
  {
    id: 't4',
    clientName: 'علیرضا بهرامی',
    role: 'مدیر بازرگانی و صادرات لوازم خانه',
    companyOrCity: 'مشهد مقدس',
    quote: 'تولیدات سینی و ارگانایزرهای آیدیا هوم به دلیل وزن سبک، بسته‌بندی فشرده و طراحی عامه‌پسند، استقبال کم‌نظیری در کشورهای همسایه به ویژه عراق و عمان داشته است. قیمت مستقیم کارخانه قدرت رقابت بالایی به ما در بازارهای صادراتی می‌دهد.',
    metric: '+۱۲۰ هزار',
    metricLabel: 'محصول صادرشده در سال جاری'
  }
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % KITCHEN_TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + KITCHEN_TESTIMONIALS.length) % KITCHEN_TESTIMONIALS.length);
  };

  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const current = KITCHEN_TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden" dir="rtl">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#346D80]/20 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#C9A24B]/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEAE4]/[0.08] border border-[#7FA69C]/30 text-xs font-bold text-[#7FA69C] font-vazir">
            تجربه خریداران و شرکای تجاری
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#EDEAE4] font-vazir">
            اعتماد بنکداران، هایپرمارکت‌ها و مصرف‌کنندگان
          </h2>
          <p className="text-base text-[#EDEAE4]/80 leading-relaxed font-vazir font-normal max-w-2xl mx-auto">
            روایت همکاران عمده‌فروش، مدیران بازرگانی و خریداران گرامی درباره دوام، دقت و خدمات کارخانه تولیدی آیدیا هوم.
          </p>
        </div>

        {/* Featured Testimonial Slider Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8 sm:p-12 rounded-[28px] border border-[#EDEAE4]/20 shadow-[0_20px_50px_rgba(14,38,44,0.5)] relative">
            
            {/* Top Row: Quote Icon & 5 Stars */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EDEAE4]/[0.08] border border-[#EDEAE4]/15 flex items-center justify-center text-[#C9A24B]">
                <Quote className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C9A24B] text-[#C9A24B]" />
                ))}
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-base sm:text-xl font-medium text-[#EDEAE4] leading-relaxed mb-8 font-vazir text-right">
              «{current.quote}»
            </blockquote>

            {/* Author Info & Impact Metric */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#EDEAE4]/10">
              <div className="flex items-center gap-4 text-right">
                {/* Avatar Initial Badge */}
                <div className="w-13 h-13 rounded-2xl bg-[#346D80] border border-[#EDEAE4]/20 flex items-center justify-center font-bold text-sm text-[#EDEAE4] shadow-md font-vazir">
                  {current.clientName.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#EDEAE4] font-vazir flex items-center gap-1.5">
                    <span>{current.clientName}</span>
                    <CheckCircle className="w-4 h-4 text-[#7FA69C]" />
                  </h4>
                  <p className="text-xs text-[#7FA69C] font-vazir">
                    {current.role}
                  </p>
                  <span className="text-[11px] font-semibold text-[#EDEAE4]/70 font-vazir block mt-0.5">
                    {current.companyOrCity}
                  </span>
                </div>
              </div>

              {/* Verified Metric Badge */}
              <div className="p-4 rounded-2xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/10 text-right flex sm:flex-col items-center sm:items-start justify-between sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-[#7FA69C] font-bold font-vazir">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>شاخص ارزیابی</span>
                </div>
                <div className="text-2xl font-black text-[#C9A24B] font-vazir">
                  {current.metric}
                </div>
                <span className="text-[11px] text-[#EDEAE4]/75 font-vazir">
                  {current.metricLabel}
                </span>
              </div>
            </div>

            {/* Navigation Buttons and Dots */}
            <div className="flex items-center justify-between pt-8 mt-6 border-t border-[#EDEAE4]/10">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {KITCHEN_TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? 'w-8 bg-[#C9A24B]'
                        : 'w-2 bg-[#EDEAE4]/20 hover:bg-[#EDEAE4]/40'
                    }`}
                    aria-label={`اسلاید ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next/Prev Buttons (RTL adjusted: right chevron goes to prev, left chevron goes to next) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] border border-[#EDEAE4]/10 transition-colors cursor-pointer"
                  aria-label="نظر قبلی"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] border border-[#EDEAE4]/10 transition-colors cursor-pointer"
                  aria-label="نظر بعدی"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};