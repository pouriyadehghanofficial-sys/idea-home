# راهنمای استقرار پروژه روی Cloudflare Pages (با KV و R2)
# Cloudflare Pages Deployment Guide (Functions + KV + R2)

این سند مراحل گام‌به‌گام راه‌اندازی و دیپلوی وب‌سایت معرفی محصولات تولیدی به همراه پنل ادمین روی زیرساخت لبه (Edge) کلودفلر را تشریح می‌کند.

---

## ۱. پیش‌نیازها
1. حساب کاربری در [Cloudflare](https://dash.cloudflare.com)
2. نصب Node.js (نسخه ۱۸ به بالا)
3. نصب ابزار خط فرمان کلودفلر (Wrangler):
   ```bash
   npm install -g wrangler
   # یا اجرای مستقیم با npx
   ```
4. لاگین به حساب کلودفلر در ترمینال:
   ```bash
   npx wrangler login
   ```

---

## ۲. ایجاد KV Namespace برای دیتابیس محصولات و پیام‌ها
برای ذخیره محصولات، دسته‌بندی‌ها، مشخصات کاتالوگ و پیام‌های مشتریان در فضای کلید-مقدار (KV):

```bash
# ایجاد فضای پروداکشن
npx wrangler kv:namespace create PRODUCTS_KV

# ایجاد فضای پیش‌نمایش تستی (اختیاری)
npx wrangler kv:namespace create PRODUCTS_KV --preview
```

خروجی این دستور شناسه‌هایی شبیه به `id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"` به شما می‌دهد. این شناسه‌ها را در فایل `wrangler.toml` کپی کنید:

```toml
[[kv_namespaces]]
binding = "PRODUCTS_KV"
id = "شناسه_دریافتی_از_دستور_بالا"
preview_id = "شناسه_پیش_نمایش_اختیاری"
```

> **نکته از طریق داشبورد:** همچنین می‌توانید از منوی `Storage & Databases` > `KV` در داشبورد کلودفلر یک Namespace با عنوان `PRODUCTS_KV` ایجاد کرده و در بخش تنظیمات Pages > Settings > Functions > KV namespace bindings آن را به بایندینگ `PRODUCTS_KV` متصل نمایید.

---

## ۳. راه‌اندازی مخزن فایل ImageKit (Media Library - Signed Uploads)
جهت ذخیره‌سازی ابری امن و بهینه فایل‌ها و کاتالوگ، این پروژه از سرویس ImageKit با روش **Signed Uploads** (آپلود مستقیم و امن از کلاینت با امضای دیجیتال سرور) استفاده می‌کند.

در داشبورد ImageKit (بخش Developer options) مقادیر زیر را دریافت کنید:
- `URL-endpoint`
- `Public Key`
- `Private Key`

سپس این مقادیر را به صورت Secret در Cloudflare Pages تنظیم فرمایید (Private Key هرگز در کلاینت یا فرانت‌اند قرار نمی‌گیرد):

```bash
npx wrangler pages secret put IMAGEKIT_PUBLIC_KEY --project-name arasteh-manufacturing
npx wrangler pages secret put IMAGEKIT_PRIVATE_KEY --project-name arasteh-manufacturing
npx wrangler pages secret put IMAGEKIT_URL_ENDPOINT --project-name arasteh-manufacturing
```

---

## ۴. تنظیم متغیرهای امنیتی و کلمات عبور (Secrets)
هیچ‌گاه رمز عبور ادمین یا کلید JWT را به صورت متن خام در گیت کامیت نکنید. این مقادیر را از طریق Secretهای امنیتی تنظیم کنید:

### روش ۱: با دستور Wrangler
```bash
# تنظیم نام پروژه Pages (مثلاً arasteh-manufacturing)
npx wrangler pages project create arasteh-manufacturing

# تنظیم رمز عبور اولیه ادمین
npx wrangler pages secret put ADMIN_PASSWORD --project-name arasteh-manufacturing
# ترمینال از شما مقدار رمز را می‌پرسد (مثلاً: admin123 یا رمز قوی دلخواه شما)

# تنظیم کلید رمزنگاری توکن‌های ورود ادمین (JWT)
npx wrangler pages secret put JWT_SECRET --project-name arasteh-manufacturing
# یک رشته تصادفی و طولانی وارد کنید (مثلاً: a89f7b2c91d4e680bf25c34e19)
```

### روش ۲: از طریق داشبورد کلودفلر
1. به پروژه Pages خود در داشبورد بروید.
2. وارد تب **Settings** > **Environment variables** شوید.
3. متغیرهای زیر را در بخش **Production** اضافه و گزینه **Encrypt** را علامت بزنید:
   - `ADMIN_USERNAME`: `admin` (یا نام کاربری دلخواه)
   - `ADMIN_PASSWORD`: رمز عبور دلخواه (به‌صورت Secret)
   - `JWT_SECRET`: یک کلید طولانی و امن (به‌صورت Secret)

---

## ۵. بیلد و دیپلوی پروژه

### ساخت فایل‌های استاتیک فرانت‌اند:
```bash
npm run build
```
این دستور خروجی بهینه‌سازی‌شده را در پوشه `dist/` ایجاد می‌کند.

### دیپلوی مستقیم به Cloudflare Pages:
```bash
npx wrangler pages deploy dist --project-name arasteh-manufacturing
```

پس از چند ثانیه، آدرس سایت زنده اختصاصی شما (مانند `https://arasteh-manufacturing.pages.dev`) ارائه خواهد شد.

### اتصال از طریق GitHub / GitLab (روش خودکار CI/CD):
اگر سورس‌کد در ریپازیتوری گیت‌هاب قرار دارد:
1. در داشبورد کلودفلر به **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** بروید.
2. ریپازیتوری را انتخاب کرده و تنظیمات زیر را وارد کنید:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. در تب Functions و Environment variables متغیرهای KV، R2 و Secretها را متصل کنید.
4. با هر `git push` به شاخه `main`، پروژه به‌صورت خودکار مجدداً بیلد و دیپلوی می‌شود.

---

## ۶. مشخصات فنی معماری پیاده‌سازی شده

- **سرو مستقیم و امن فایل‌ها از طریق ImageKit:**
  فایل‌ها مستقیماً با امضای امن سرور (HMAC-SHA1) از طریق اندپوینت `/api/upload/sign` به ImageKit آپلود و از طریق CDN جهانی آن سرو می‌شوند. فایل‌های قدیمی نیز با API حذف ImageKit جهت بهینه‌سازی حجم رایگان مدیریت می‌گردند.
- **امنیت احراز هویت (Auth):**
  - رمزهای عبور با الگوریتم استاندارد **PBKDF2 (SHA-256) با ۱۰,۰۰۰ تکرار و Salt اختصاصی** هش می‌شوند.
  - پس از اولین لاگین موفق با رمز اولیه، رمز به‌صورت خودکار هش شده و در KV ذخیره می‌گردد.
  - توکن‌های احراز هویت با الگوریتم **HMAC-SHA256 (JWT)** با انقضای ۷ روز تولید می‌شوند.
  - **سیستم ضد Brute-force:** قفل خودکار ۱۵ دقیقه‌ای پس از ۵ بار تلاش ناموفق برای هر IP در KV ثبت می‌گردد.
- **اعتبارسنجی و سقف حجم فایل‌ها:**
  - فرمت‌های مجاز تصاویر محصول: JPG, PNG, WEBP, SVG (حداکثر ۱۰ مگابایت)
  - فرمت مجاز کاتالوگ: فقط PDF (حداکثر ۵۰ مگابایت)
  - فرم تماس با ما دارای فیلد تله‌گذاری مخفی (Honeypot) و Rate Limit پنج پیام در ۱۰ دقیقه است.
