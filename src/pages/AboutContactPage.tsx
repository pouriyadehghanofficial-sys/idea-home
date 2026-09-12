import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Award, 
  ShieldCheck,
  Factory
} from 'lucide-react';
import { storageService } from '../services/storage';

export const AboutContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('لطفاً نام، شماره تماس و متن پیام را وارد فرمایید.');
      return;
    }

    setSubmitting(true);
    try {
      await storageService.submitMessage({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        subject: formData.subject.trim() || 'استعلام و تماس عمومی',
        message: formData.message.trim()
      });

      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch {
      setErrorMsg('خطا در ارسال پیام. لطفاً مجدداً تلاش نمایید.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Factory Intro Banner - Clean Petrol Box */}
      <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs border border-[#0F4C5C]/20 bg-[#0F4C5C] text-white">
        <div className="relative z-10 max-w-3xl space-y-4 text-right">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#C99A3E]" />
            <span>درباره صنایع تولیدی آراسته</span>
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            بیش از یک دهه نوآوری و کیفیت در ساخت سازه‌های مدرن
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed text-justify font-normal">
            صنایع تولیدی آراسته با هدف خودکفایی در تولید مبلمان و اکسسوری‌های مدرن با استانداردهای صادراتی فعالیت خود را در شهرک صنعتی چهاردانگه تهران آغاز نمود. هم‌اکنون این مجموعه با وسعت بیش از ۴۵۰۰ متر مربع فضای کارگاهی، میزبان خطوط مجهز برش لیزر، جوشکاری دقیق، آبکاری تحت خلأ و رویه‌کوبی تخصصی است.
          </p>
        </div>
      </div>

      {/* Production Facilities / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#0F4C5C]/10 shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center">
            <Factory className="w-5 h-5 text-[#C99A3E]" />
          </div>
          <h3 className="font-bold text-base text-[#0F4C5C]">فضای تولیدی ۴۵۰۰ متری</h3>
          <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
            شامل دپارتمان‌های فلزکاری لیزر، فرز CNC، رنگ الکترواستاتیک، سالن رویه‌کوبی و انبار متریال.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#0F4C5C]/10 shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center">
            <Users className="w-5 h-5 text-[#C99A3E]" />
          </div>
          <h3 className="font-bold text-base text-[#0F4C5C]">بیش از ۸۵ پرسنل متخصص</h3>
          <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
            تیم مهندسین مکانیک، طراحان صنعتی و استادکاران زبده درودگری و آبکاری فلزات.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#0F4C5C]/10 shadow-xs space-y-3">
          <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center">
            <Award className="w-5 h-5 text-[#C99A3E]" />
          </div>
          <h3 className="font-bold text-base text-[#0F4C5C]">استاندارد ISO 9001:2015</h3>
          <p className="text-xs text-[#0F4C5C]/70 leading-relaxed font-normal">
            کنترل کیفی چندمرحله‌ای متریال‌ها، مقاومت اسکلت، پایداری رنگ و ۳۶ ماه گارانتی کتبی.
          </p>
        </div>
      </div>

      {/* Contact Form & Factory Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form - Clean White Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#0F4C5C]/10 shadow-xs space-y-5">
          <div>
            <span className="text-xs font-bold text-[#C99A3E] block mb-1">
              پاسخگویی مستقیم مهندسی
            </span>
            <h2 className="text-2xl font-black text-[#0F4C5C]">
              فرم استعلام و ثبت سفارش پروژه
            </h2>
            <p className="text-xs text-[#0F4C5C]/65 mt-1 font-normal">
              پیام شما مستقیماً در سامانه ثبت شده و کارشناسان فروش ظرف ۲ ساعت کاری با شما تماس می‌گیرند.
            </p>
          </div>

          {submitSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>پیام شما با موفقیت ثبت شد. با تشکر از اعتماد شما به کارخانه آراسته.</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: مهندس رادپور"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] text-[#0F4C5C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  شماره تلفن همراه <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] text-[#0F4C5C] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  پست الکترونیک (اختیاری)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="info@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] text-[#0F4C5C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                  موضوع درخواست
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="مثال: استعلام تیراژ مبل یا میز"
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] text-[#0F4C5C] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
                متن پیام یا مشخصات پروژه <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="تعداد مورد نظر، مدل یا ابعاد سفارشی پروژه خود را شرح دهید..."
                className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] text-[#0F4C5C] transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#0F4C5C] hover:bg-[#163E48] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors active:scale-98"
            >
              {submitting ? (
                <span>در حال ارسال پیام...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#C99A3E]" />
                  <span>ارسال پیام به واحد مهندسی فروش</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Factory Contact Info Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#0F4C5C] text-white p-6 sm:p-8 rounded-2xl border border-[#0F4C5C]/20 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-white border-b border-white/10 pb-3">
              اطلاعات تماس و نشانی کارخانه
            </h3>

            <div className="space-y-4 text-xs font-normal">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#C99A3E]" />
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">آدرس کارخانه:</span>
                  <span className="text-white/80 leading-relaxed">
                    تهران، بزرگراه آیت‌الله سعیدی، شهرک صنعتی چهاردانگه، خیابان ۲۴، پلاک ۷۸
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#C99A3E]" />
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">تلفن‌های تماس مستقیم:</span>
                  <span className="text-white/90 block font-latin font-medium">۰۲۱-۸۸۹۹۰۰۱۱ (۱۰ خط مستقیم)</span>
                  <span className="text-white/90 block font-latin font-medium">۰۹۱۲۳۴۵۶۷۸۹ (واحد مشاوره)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#C99A3E]" />
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">پست الکترونیک رسمی:</span>
                  <span className="text-white/80 font-latin">info@arasteh-mfg.ir</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#C99A3E]" />
                </div>
                <div>
                  <span className="font-bold text-white block mb-0.5">ساعات کاری و پذیرش:</span>
                  <span className="text-white/80 block">شنبه تا چهارشنبه: ۸:۳۰ الی ۱۸:۰۰</span>
                  <span className="text-white/80 block">پنج‌شنبه‌ها: ۸:۳۰ الی ۱۴:۰۰</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-white/85">
              <span className="font-bold text-[#C99A3E] block mb-1">امکان بازدید از خط تولید:</span>
              هماهنگی بازدید از مراحل ساخت کلاف و آبکاری برای کارفرمایان پروژه‌ها میسر می‌باشد.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};