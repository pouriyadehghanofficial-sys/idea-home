import React from 'react';
import { Factory, ShieldCheck, Palette, Boxes, Handshake, Truck, Check, ArrowDownLeft } from 'lucide-react';
import { EditableText } from './EditableText';
import { useViewport } from '../context/ViewportContext';

interface KitchenFeature {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  highlight: string;
}

const KITCHEN_FEATURES: KitchenFeature[] = [
  {
    id: '1',
    icon: <Factory className="w-6 h-6 text-[#C9A24B]" />,
    tag: 'تولید مستقیم',
    title: 'تولید مستقیم در کارخانه',
    description: 'کنترل فرآیند تولید از مواد اولیه تا محصول نهایی.',
    highlight: 'از مواد اولیه تا محصول نهایی'
  },
  {
    id: '2',
    icon: <ShieldCheck className="w-6 h-6 text-[#7FA69C]" />,
    tag: 'کنترل کیفی',
    title: 'کیفیت پایدار',
    description: 'کنترل کیفیت در مراحل مختلف تولید برای ارائه محصولی قابل اعتماد.',
    highlight: 'محصولی قابل اعتماد و بادوام'
  },
  {
    id: '3',
    icon: <Palette className="w-6 h-6 text-[#C9A24B]" />,
    tag: 'طراحی مدرن',
    title: 'طراحی کاربردی و مدرن',
    description: 'توجه به نیاز مصرف‌کننده و ترکیب زیبایی، کاربرد و دوام.',
    highlight: 'ترکیب زیبایی، کاربرد و دوام'
  },
  {
    id: '4',
    icon: <Boxes className="w-6 h-6 text-[#C9A24B]" />,
    tag: 'سفارش عمده',
    title: 'ظرفیت تولید و سفارش عمده',
    description: 'امکان تأمین سفارش‌های عمده برای بازار داخلی و مشتریان تجاری.',
    highlight: 'تأمین بازار داخلی و تجاری'
  },
  {
    id: '5',
    icon: <Handshake className="w-6 h-6 text-[#7FA69C]" />,
    tag: 'تولید سفارشی',
    title: 'همکاری OEM و برند اختصاصی',
    description: 'امکان همکاری با برندها و مجموعه‌های تجاری برای تولید محصولات اختصاصی.',
    highlight: 'تولید اختصاصی برای برندها'
  },
  {
    id: '6',
    icon: <Truck className="w-6 h-6 text-[#C9A24B]" />,
    tag: 'تعهد و پشتیبانی',
    title: 'تعهد به مشتری',
    description: 'همراهی از مرحله انتخاب محصول تا تولید، بسته‌بندی و تحویل سفارش.',
    highlight: 'از انتخاب تا تحویل سفارش'
  }
];

interface FeaturesProps {
  onOpenOrderModal: () => void;
}

export const Features: React.FC<FeaturesProps> = () => {
  const { isMobile, isTablet } = useViewport();
  const gridColsClass = isMobile
    ? 'grid-cols-1'
    : isTablet
    ? 'grid-cols-2'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-24 relative overflow-hidden scroll-mt-16 sm:scroll-mt-20" dir="rtl">
      <div id="about" className="absolute -top-24" />
      {/* Subtle Background Glow Blobs */}
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#346D80]/15 blur-[70px] transform-gpu pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-[#7FA69C]/15 blur-[70px] transform-gpu pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#EDEAE4]/[0.08] border border-[#7FA69C]/30 text-xs font-bold text-[#7FA69C] font-vazir">
            <EditableText
              id="features.badge"
              as="span"
              defaultText="مزایای رقابتی آیدیا هوم"
            />
          </div>
          <EditableText
            id="features.title"
            as="h2"
            className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-[#EDEAE4] font-vazir leading-tight block"
            defaultText="استانداردهای مهندسی در ساخت لوازم خانگی"
          />
          <EditableText
            id="features.description"
            as="p"
            multiline
            className="text-xs sm:text-base text-[#EDEAE4]/80 leading-relaxed font-vazir font-normal max-w-2xl mx-auto block"
            defaultText="در شرکت ایدیا هوم، کیفیت از مرحله تولید آغاز میشود. ما با تکیه بر تجربه، تجهیزات تولید و کنترل دقیق کیفیت، لوازم آشپزخانه را با تمرکز بر کیفیت، طراحی کاربردی و رضایت مشتری تولید میکنیم."
          />
        </div>

        {/* Grid of Glassmorphism Cards */}
        <div className={`grid ${gridColsClass} gap-4 sm:gap-6 lg:gap-8`}>
          {KITCHEN_FEATURES.map((item, idx) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover p-5 sm:p-6 lg:p-7 rounded-[20px] sm:rounded-[22px] flex flex-col justify-between group cursor-default transition-all duration-300 relative"
            >
              <div>
                {/* Icon & Tag Row */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EDEAE4]/[0.08] border border-[#EDEAE4]/15 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#C9A24B]/50 transition-all duration-300 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-[#7FA69C] bg-[#1E4B57] px-2.5 py-1 sm:px-3 rounded-full border border-[#7FA69C]/20 font-vazir inline-flex items-center shrink-0">
                    <EditableText
                      id={`features.card${idx + 1}.tag`}
                      as="span"
                      className="inline-block"
                      defaultText={item.tag}
                    />
                  </span>
                </div>

                {/* Card Title */}
                <EditableText
                  id={`features.card${idx + 1}.title`}
                  as="h3"
                  className="text-base sm:text-lg lg:text-xl font-bold text-[#EDEAE4] mb-2 sm:mb-3 block group-hover:text-[#C9A24B] transition-colors font-vazir text-right leading-snug"
                  defaultText={item.title}
                />

                {/* Card Description */}
                <EditableText
                  id={`features.card${idx + 1}.desc`}
                  as="p"
                  multiline
                  className="text-xs sm:text-sm text-[#EDEAE4]/75 leading-relaxed font-vazir font-normal text-right block mb-4"
                  defaultText={item.description}
                />
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-4 mt-auto border-t border-[#EDEAE4]/10 flex items-center justify-between text-xs text-[#7FA69C] font-semibold group-hover:text-[#EDEAE4] transition-colors font-vazir gap-2">
                <span className="flex items-center gap-1.5 min-w-0">
                  <Check className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                  <EditableText
                    id={`features.card${idx + 1}.highlight`}
                    as="span"
                    className="inline-block font-semibold text-[11px] sm:text-xs truncate sm:overflow-visible"
                    defaultText={item.highlight}
                  />
                </span>
                <ArrowDownLeft className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all text-[#C9A24B] shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};