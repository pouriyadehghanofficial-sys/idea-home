# 🚀 راهنمای گام‌به‌گام استقرار (Deploy) روی پلن رایگان Cloudflare Pages

این پروژه به گونه‌ای معماری شده است که هم در حالت **پیش‌نمایش محلی (Local Demo)** به صورت مستقل با `localStorage` و تمام ویژگی‌های تعاملی کار می‌کند، و هم با استفاده از **Cloudflare Pages + Functions + KV + R2** بدون نیاز به حتی یک ریال هزینه یا سرور اختصاصی به صورت کاملاً حرفه‌ای و بدون وقفه (Serverless) مستقر می‌شود.

---

## 📑 فهرست مراحل استقرار

1. پیش‌نیازها و نصب ابزار Cloudflare CLI (Wrangler)
2. ساخت حساب رایگان و لاگین
3. ساخت KV Namespace برای ذخیره‌سازی داده‌های محصولات
4. ساخت R2 Bucket برای آپلود عکس‌ها و کاتالوگ PDF
5. تنظیم متغیرهای محیطی و رمز عبور ادمین
6. بیلد و دیپلوی پروژه با یک دستور
7. اتصال دامنه اختصاصی و گواهی SSL رایگان

---

### مرحله ۱: پیش‌نیازها

مطمئن شوید Node.js نسخه ۱۸ یا بالاتر روی سیستم شما نصب است.

```bash
# نصب یا فراخوانی ابزار رسمی کلودفلر
npm install -g wrangler
# یا استفاده مستقیم با npx wrangler
```

---

### مرحله ۲: اتصال به اکانت Cloudflare

در ترمینال دستور زیر را بزنید تا پنجره مرورگر باز شود و دسترسی تایید گردد:

```bash
npx wrangler login
```

---

### مرحله ۳: ساخت پایگاه داده KV (رایگان)

برای ذخیره محصولات، دسته‌بندی‌ها، پیام‌های مشتریان و اطلاعات کاتالوگ:

```bash
# ساخت نیم‌اسپیس پروداکشن
npx wrangler kv:namespace create PRODUCTS_KV

# ساخت نیم‌اسپیس برای تست محلی (اختیاری)
npx wrangler kv:namespace create PRODUCTS_KV --preview
```

پس از اجرای دستور، شناسه‌های `id` تولید شده را در فایل `wrangler.toml` کپی کنید:

```toml
[[kv_namespaces]]
binding = "PRODUCTS_KV"
id = "شناسه_دریافت_شده"
preview_id = "شناسه_پریویو_دریافت_شده"
```

> **روش جایگزین از داشبورد گرافیکی Cloudflare:**
> ۱. وارد پنل Cloudflare شوید و به بخش **Storage & Databases > KV** بروید.
> ۲. دکمه **Create a Namespace** را بزنید و نام آن را `PRODUCTS_KV` بگذارید.
> ۳. در تنظیمات پروژه Pages خود در بخش **Settings > Functions > KV namespace bindings** نام متغیر را `PRODUCTS_KV` و مقدار را به این نیم‌اسپیس متصل کنید.

---

### مرحله ۴: تنظیم فضای ابری ImageKit برای عکس‌ها و کاتالوگ (Signed Uploads)

سیستم ذخیره‌سازی رسانه به صورت یکپارچه از کتابخانه رسانه **ImageKit** پشتیبانی می‌کند:

۱. در سایت [ImageKit](https://imagekit.io) رایگان ثبت‌نام کنید.
۲. از داشبورد در بخش **Developer options** مقادیر `URL-endpoint`, `Public Key`, `Private Key` را دریافت کنید.
۳. در پروژه Cloudflare Pages در بخش **Settings > Environment variables** مقادیر را به عنوان Secret ثبت کنید:

```bash
npx wrangler pages secret put IMAGEKIT_PUBLIC_KEY
npx wrangler pages secret put IMAGEKIT_PRIVATE_KEY
npx wrangler pages secret put IMAGEKIT_URL_ENDPOINT
```

---

### مرحله ۵: تنظیم متغیرهای امنیتی و رمز ادمین

در داشبورد Cloudflare Pages در بخش **Settings > Environment variables** یا با ترمینال مقادیر زیر را ثبت کنید:

| نام متغیر | نوع | مقدار پیشنهادی | توضیح |
|---|---|---|---|
| `ADMIN_USERNAME` | Plaintext | `admin` | نام کاربری ورود به پنل ادمین |
| `ADMIN_PASSWORD` | Secret | رمز دلخواه شما (مثلا `P@ssw0rd2026`) | رمز عبور ایمن ورود ادمین |
| `JWT_SECRET` | Secret | یک رشته تصادفی و طولانی | کلید امضای نشست‌های ادمین |
| `IMAGEKIT_PUBLIC_KEY` | Secret | کلید عمومی ImageKit | کلید مجاز برای آپلود امن مرورگر |
| `IMAGEKIT_PRIVATE_KEY` | Secret | کلید محرمانه Private Key | جهت امضای دیجیتال سرور و مدیریت فایل‌ها (هرگز به کلاینت ارسال نمی‌شود) |
| `IMAGEKIT_URL_ENDPOINT` | Plaintext/Secret | آدرس اختصاصی https://ik.imagekit.io/your_id | آدرس CDN اختصاصی اکانت شما در ImageKit |

با دستور Wrangler:
```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name arasteh-manufacturing
npx wrangler pages secret put JWT_SECRET --project-name arasteh-manufacturing
```

---

### مرحله ۶: بیلد و دیپلوی مستقیم به Cloudflare Pages

```bash
# ۱. ساخت فایل‌های نهایی بهینه‌شده
npm run build

# ۲. انتشار مستقیم روی Cloudflare Pages
npx wrangler pages deploy dist --project-name arasteh-manufacturing
```

پس از پایان، یک آدرس اختصاصی رایگان مانند زیر به شما تحویل داده می‌شود:
`https://arasteh-manufacturing.pages.dev`

---

### مرحله ۷: اتصال دامنه اختصاصی (اختیاری)

۱. در پنل Cloudflare Pages به بخش **Custom domains** بروید.
۲. دکمه **Set up a custom domain** را بزنید و دامنه خود (مثلاً `arasteh-factory.ir` یا `com`) را وارد کنید.
۳. کلودفلر به طور خودکار رکورد DNS و **گواهی SSL امن (HTTPS)** معتبر را طی چند ثانیه صادر می‌کند.

---

### اطلاعات کاربری پیش‌فرض اولیه
- **آدرس ورود ادمین**: `/admin/login`
- **نام کاربری**: `admin`
- **رمز عبور پیش‌فرض اولیه**: `admin123`
*(پس از اولین ورود، می‌توانید از بخش «تنظیمات حساب» رمز را تغییر دهید)*