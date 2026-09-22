import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { EditableText } from './EditableText';

interface KitchenFAQ {
  question: string;
  answer: string;
}

const KITCHEN_FAQS: KitchenFAQ[] = [
  {
    question: '۱. شرکت ایده در چه زمینه‌ای فعالیت می‌کند؟',
    answer: 'شرکت ایده در زمینه تولید لوازم آشپزخانه فعالیت می‌کند و محصولات متنوعی را با تمرکز بر کیفیت و کاربردی بودن تولید و عرضه می‌کند.'
  },
  {
    question: '۲. آیا شرکت ایده فروش عمده دارد؟',
    answer: 'بله، شرکت ایده امکان همکاری و تأمین سفارش‌های عمده را برای فروشگاه‌ها، توزیع‌کنندگان و مجموعه‌های تجاری فراهم کرده است.'
  },
  {
    question: '۳. چگونه می‌توانم قیمت محصولات را دریافت کنم؟',
    answer: 'برای دریافت قیمت، می‌توانید محصول موردنظر و تعداد موردنیاز خود را از طریق راه‌های ارتباطی سایت برای واحد فروش شرکت ایده ارسال کنید.'
  },
  {
    question: '۴. آیا شرکت ایده با فروشگاه‌ها و نمایندگان همکاری می‌کند؟',
    answer: 'بله، شرکت ایده آماده همکاری با فروشگاه‌ها، نمایندگان فروش و مجموعه‌های تجاری است.'
  },
  {
    question: '۵. محصولات شرکت ایده چگونه کنترل می‌شوند؟',
    answer: 'محصولات در مراحل مختلف تولید مورد بررسی و کنترل قرار می‌گیرند تا کیفیت محصول نهایی مطابق با استانداردهای تولید شرکت باشد.'
  },
  {
    question: '۶. زمان آماده‌سازی سفارش چقدر است؟',
    answer: 'زمان آماده‌سازی سفارش با توجه به نوع محصول و حجم سفارش متفاوت است و هنگام ثبت سفارش توسط واحد فروش اعلام می‌شود.'
  },
  {
    question: '۷. چگونه می‌توانم با شرکت ایده تماس بگیرم؟',
    answer: 'برای ارتباط با شرکت ایده می‌توانید از فرم تماس، شماره تلفن یا سایر راه‌های ارتباطی درج‌شده در سایت استفاده کنید.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-24 relative overflow-hidden bg-[#1E4B57]/60 border-t border-[#EDEAE4]/10 scroll-mt-16 sm:scroll-mt-20">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-[#346D80]/15 blur-[60px] transform-gpu pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-14 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#EDEAE4]/[0.08] border border-[#7FA69C]/30 text-xs font-bold text-[#7FA69C] font-vazir">
            <EditableText
              id="faq.badge"
              as="span"
              defaultText="راهنمای خرید و همکاری"
            />
          </div>
          <EditableText
            id="faq.title"
            as="h2"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#EDEAE4] font-vazir"
            defaultText="پرسش‌های متداول"
          />
        </div>

        <div className="space-y-3 sm:space-y-4">
          {KITCHEN_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#EDEAE4]/[0.12] border-[#C9A24B]/50 shadow-lg'
                    : 'border-[#EDEAE4]/10 hover:border-[#EDEAE4]/25'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-4 sm:p-6 text-right flex items-center justify-between gap-3 sm:gap-4 cursor-pointer"
                >
                  <span className="font-bold text-xs sm:text-base text-[#EDEAE4] font-vazir text-right">
                    <EditableText
                      id={`faq.q${idx + 1}`}
                      as="span"
                      defaultText={faq.question}
                    />
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EDEAE4]/10 flex items-center justify-center text-[#EDEAE4] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#C9A24B] text-[#1E4B57]' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#EDEAE4]/85 leading-relaxed font-vazir font-normal border-t border-[#EDEAE4]/10 text-right">
                    <EditableText
                      id={`faq.a${idx + 1}`}
                      as="div"
                      multiline
                      defaultText={faq.answer}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};