import React, { useState } from 'react';
import { 
  Cloud, 
  Terminal, 
  Database, 
  HardDrive, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';

export const CloudflareGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: '۱. اتصال پروژه به مخزن GitHub',
      desc: 'سورس‌کد پروژه آیدیا هوم را در یک ریپازیتوری جدید در گیت‌هاب قرار دهید.',
      code: `# گام‌های آماده‌سازی و ارسال به گیت‌هاب
git init
git add .
git commit -m "feat: initial commit - IDEA HOME Web App"
git branch -M main
git remote add origin https://github.com/YOUR_USER/ideahome-mfg.git
git push -u origin main`
    },
    {
      id: 2,
      title: '۲. ساخت پروژه در Cloudflare Pages',
      desc: 'وارد داشبورد کلودفلر شده و از بخش Workers & Pages پروژه جدید بسازید.',
      code: `1. به آدرس https://dash.cloudflare.com وارد شوید.
2. از منوی سمت چپ به مسیر Workers & Pages > Overview بروید.
3. دکمه "Create application" و سپس زبانه "Pages" را انتخاب کنید.
4. "Connect to Git" را بزنید و ریپازیتوری ideahome-mfg را انتخاب نمایید.`
    },
    {
      id: 3,
      title: '۳. تنظیمات بیلد (Build Settings)',
      desc: 'مشخصات کامپایل پروژه در کلودفلر پیجز:',
      code: `Framework preset: Vite
Build command: npm run build
Build output directory: dist
Node.js Version: 18 یا بالاتر (NODE_VERSION=18)`
    },
    {
      id: 4,
      title: '۴. پایگاه داده مرکزی ابری (Cloudflare KV یا Supabase - بدون نیاز به کارت اعتباری)',
      desc: 'برای اینکه محصولات و کاتالوگ در تمام گوشی‌ها و لپ‌تاپ‌ها یکسان دیده شوند، یکی از این گزینه‌های رایگان بدون کارت اعتباری را متصل کنید:',
      code: `# گزینه ۱ (ساده‌ترین و سریع‌ترین): Cloudflare KV رایگان
# در منوی Workers & Pages > KV یک Namespace به نام PRODUCTS_KV بسازید.
# سپس در پروژه Pages خود به Settings > Functions > KV namespace bindings بروید و اضافه کنید:
# Variable name: PRODUCTS_KV
# KV namespace: فضایی که ساختید را انتخاب کنید.

# گزینه ۲: اتصال به Supabase (رایگان)
# متغیرهای محیطی زیر را در Settings > Environment variables پروژه Pages ثبت کنید:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your_service_role_secret_key

# گزینه ۳: Firebase Firestore
# FIREBASE_PROJECT_ID=your-project-id`
    },
    {
      id: 5,
      title: '۵. تنظیم مخزن ابری ImageKit برای تصاویر و کاتالوگ (Signed Uploads)',
      desc: 'ذخیره‌سازی بهینه ابری در کتابخانه رسانه ImageKit با آپلود مستقیم از مرورگر و امضای امن سرور (HMAC-SHA1):',
      code: `# در سایت imagekit.io رایگان ثبت‌نام کنید و در داشبورد، مقادیر Developer options را کپی کنید:
# URL-endpoint, Public Key, Private Key

# سپس در داشبورد کلودفلر (Pages > Settings > Environment variables) یا از طریق Wrangler به عنوان Secret ذخیره کنید:
npx wrangler pages secret put IMAGEKIT_PUBLIC_KEY
npx wrangler pages secret put IMAGEKIT_PRIVATE_KEY
npx wrangler pages secret put IMAGEKIT_URL_ENDPOINT`
    },
    {
      id: 6,
      title: '۶. احراز هویت ادمین با متغیرهای محیطی (بدون وابستگی به دیتابیس)',
      desc: 'تنظیم نام کاربری و رمز عبور مستقیم در متغیرهای محیطی Cloudflare Pages:',
      code: `# در داشبورد کلودفلر (Pages > Settings > Environment variables) متغیرهای زیر را ثبت کنید:
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=ideahome_secret_jwt_token_2025`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E4B57] to-[#346D80] p-7 rounded-3xl text-white shadow-lg border border-white/20">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Cloud className="w-7 h-7 text-[#C9A24B]" />
          </div>
          <div>
            <h2 className="text-xl font-black">راهنمای استقرار در Cloudflare Pages</h2>
            <p className="text-xs text-[#EDEAE4]/85 mt-1">
              مراحل کامل اتصال به گیت‌هاب، ایجاد دیتابیس ابری (KV / Supabase بدون کارت اعتباری) و تنظیم مخزن رسانه‌ای ImageKit
            </p>
          </div>
        </div>
      </div>

      {/* Cloudflare advantages cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#346D80]/15 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-[#346D80]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#1E4B57] block text-sm">Cloudflare KV</span>
            <span className="text-[#7FA69C] mt-0.5 block">ذخیره ابری توزیع‌شده با پاسخگویی زیر ۵۰ میلی‌ثانیه</span>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#C9A24B]/15 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5 text-[#96752A]" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#1E4B57] block text-sm">ImageKit Media CDN</span>
            <span className="text-[#7FA69C] mt-0.5 block">آپلود مستقیم و امن تصاویر و کاتالوگ با CDN پرسرعت و بهینه‌سازی خودکار</span>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-white/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#1E4B57] block text-sm">Pages Functions</span>
            <span className="text-[#7FA69C] mt-0.5 block">توابع Serverless API بدون هزینه نگهداری سرور فیزیکی</span>
          </div>
        </div>
      </div>

      {/* Accordion of Steps */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isOpen = expandedStep === step.id;
          return (
            <div
              key={step.id}
              className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedStep(isOpen ? null : step.id)}
                className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#EDEAE4]/30 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1E4B57]">{step.title}</h3>
                  <p className="text-xs text-[#7FA69C] mt-1 font-medium">{step.desc}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#346D80] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#7FA69C] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-5 sm:p-6 pt-0 border-t border-[#1E4B57]/10 space-y-3">
                  <div className="relative mt-3">
                    <pre className="bg-[#1E4B57] text-[#EDEAE4] p-5 rounded-2xl text-xs font-mono overflow-x-auto dir-ltr leading-relaxed shadow-inner">
                      {step.code}
                    </pre>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(step.code, `step-${step.id}`)}
                      className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="کپی در کلیپ‌بورد"
                    >
                      {copiedCode === `step-${step.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400 font-bold">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-[10px] text-gray-300 font-bold">کپی</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};