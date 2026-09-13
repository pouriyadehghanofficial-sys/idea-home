import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  FileCheck,
  Phone,
  Send,
  Sparkles,
  Building,
  User,
  Mail,
  MessageSquare
} from 'lucide-react';
import { KitchenProductItem } from '../data/kitchenProducts';

interface OrderModalProps {
  product?: KitchenProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('سفارش عمده');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setNotes(
        `درخواست استعلام قیمت و کاتالوگ برای محصول: ${product.title}`
      );
    } else {
      setNotes('');
    }

    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError('لطفاً نام و شماره همراه را وارد کنید.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const message = {
        name: name.trim(),
        phone: phone.trim(),
        email: undefined,
        subject: inquiryType,
        message: [
          company.trim()
            ? `نام فروشگاه / شرکت / شهر: ${company.trim()}`
            : '',
          `نوع درخواست: ${inquiryType}`,
          notes.trim()
            ? `توضیحات: ${notes.trim()}`
            : '',
          product
            ? `محصول موردنظر: ${product.title}`
            : ''
        ]
          .filter(Boolean)
          .join('\n')
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const contentType =
        response.headers.get('content-type') || '';

      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      } else {
        try {
          const text = await response.text();
          data = text ? { message: text } : null;
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          `ارسال درخواست ناموفق بود (${response.status})`
        );
      }

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();

        setName('');
        setCompany('');
        setPhone('');
        setInquiryType('سفارش عمده');
        setNotes('');
        setError('');
      }, 2500);
    } catch (err) {
      console.error('Contact form submission error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'خطا در ارسال درخواست. لطفاً مجدداً تلاش کنید.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E4B57]/80 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="glass-panel bg-[#1E4B57]/95 border border-[#EDEAE4]/20 rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative text-right">

        {/* Header */}
        <div className="px-4 py-4 sm:p-6 border-b border-[#EDEAE4]/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#EDEAE4]/[0.08] border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B] shrink-0">
              <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-base text-[#EDEAE4] font-vazir whitespace-nowrap">
                درخواست همکاری و استعلام قیمت
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] transition-colors cursor-pointer shrink-0"
            aria-label="بستن"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#7FA69C]/20 border border-[#7FA69C] flex items-center justify-center mx-auto text-[#EDEAE4] shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#C9A24B]" />
              </div>

              <h4 className="text-xl font-bold text-[#EDEAE4] font-vazir">
                درخواست شما با موفقیت ثبت شد!
              </h4>

              <p className="text-xs sm:text-sm text-[#EDEAE4]/80 font-vazir max-w-sm mx-auto leading-relaxed">
                همکاران واحد فروش کارخانه آیدیا هوم ظرف کمتر از ۳۰ دقیقه کاری جهت ارائه لیست قیمت و ارسال کاتالوگ با شما تماس خواهند گرفت.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {product && (
                <div className="p-3.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#C9A24B]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#7FA69C] block font-vazir">
                      کالای انتخاب‌شده:
                    </span>

                    <span className="text-xs font-bold text-[#EDEAE4] font-vazir">
                      {product.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#C9A24B]/20 text-[#C9A24B] border border-[#C9A24B]/30 font-vazir">
                    {product.categoryLabel}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/80 mb-1.5 font-vazir">
                    نام و نام خانوادگی{' '}
                    <span className="text-[#C9A24B]">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="مثال: علی حسینی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-sm text-[#EDEAE4] focus:outline-none focus:border-[#C9A24B] transition-colors font-vazir text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/80 mb-1.5 font-vazir">
                    شماره همراه (واتساپ / تماس){' '}
                    <span className="text-[#C9A24B]">*</span>
                  </label>

                  <input
                    type="tel"
                    required
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-sm text-[#EDEAE4] focus:outline-none focus:border-[#C9A24B] transition-colors font-latin text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/80 mb-1.5 font-vazir">
                    نام فروشگاه / شرکت / شهر
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: پلاسکو نوین - اصفهان"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-sm text-[#EDEAE4] focus:outline-none focus:border-[#C9A24B] transition-colors font-vazir text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EDEAE4]/80 mb-1.5 font-vazir">
                    نوع درخواست
                  </label>

                  <select
                    value={inquiryType}
                    onChange={(e) =>
                      setInquiryType(e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E4B57] border border-[#EDEAE4]/15 text-xs text-[#EDEAE4] focus:outline-none focus:border-[#C9A24B] font-vazir text-right"
                  >
                    <option value="سفارش عمده">
                      سفارش عمده
                    </option>

                    <option value="دریافت کاتالوگ و لیست قیمت روز">
                      دریافت کاتالوگ و لیست قیمت روز
                    </option>

                    <option value="اخذ نمایندگی پخش استانی">
                      اخذ نمایندگی پخش استانی
                    </option>

                    <option value="صادرات و بازرگانی خارجی">
                      صادرات و بازرگانی خارجی
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EDEAE4]/80 mb-1.5 font-vazir">
                  توضیحات و مدل‌های مدنظر
                </label>

                <textarea
                  rows={3}
                  placeholder="تیراژ درخواستی، رنگ‌های مدنظر یا سوالات خود را بنویسید..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/15 text-sm text-[#EDEAE4] focus:outline-none focus:border-[#C9A24B] transition-colors font-vazir text-right resize-none"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-200 font-vazir leading-relaxed">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md font-vazir disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />

                  <span>
                    {submitting
                      ? 'در حال ارسال اطلاعات...'
                      : 'ارسال درخواست استعلام قیمت'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
