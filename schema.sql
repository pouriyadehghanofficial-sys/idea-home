-- ====================================================================
-- Cloudflare D1 Database Schema for IDEA HOME / Arasteh Industrial
-- Production SQLite Schema for Serverless Edge Execution
-- ====================================================================

-- 1. Admin Users (Never stores plaintext passwords)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'super_admin',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. System & Site Settings (Key-Value storage for catalog, site info, configs)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 3. Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL
);

-- 4. Products Table (images stores JSON array of ImageKit URL strings)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IRT',
  short_description TEXT,
  full_description TEXT,
  images TEXT NOT NULL, -- JSON array of ImageKit URL strings
  specs TEXT NOT NULL,  -- JSON object of key-value pairs
  in_stock INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 5. Showcase / Slider Items (Stores ImageKit URL and fileId)
CREATE TABLE IF NOT EXISTS slider_items (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,     -- ImageKit URL
  image_key TEXT,         -- ImageKit fileId (for Delete API & asset replacement)
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  badge TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 6. Contact & Inquiry Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  product_name TEXT,
  quantity TEXT,
  date_formatted TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TEXT NOT NULL
);

-- 7. Rate Limits & Brute-force Protection
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  locked_until INTEGER,
  expires_at INTEGER NOT NULL
);

-- Indices for rapid edge queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_slider_order ON slider_items(order_num);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);

-- ====================================================================
-- Initial Factory Seed Data (INSERT OR IGNORE)
-- ====================================================================

-- Seed Categories
INSERT OR IGNORE INTO categories (id, name, description, created_at) VALUES
('living', 'مبلمان و نشیمن', 'انواع کاناپه، مبل راحتی و صندلی تک لوکس', '2026-08-01T00:00:00Z'),
('tables', 'میز جلو مبلی و عسلی', 'میزهای سنگی مرمر، شیشه و استیل طلایی', '2026-08-01T00:00:00Z'),
('lighting', 'روشنایی و آباژور', 'آباژورهای ایستاده، لوستر مدرن و چراغ‌های دکوراتیو', '2026-08-01T00:00:00Z'),
('consoles', 'کنسول و دراور', 'کنسول‌های مدرن روکش چوب طبیعی و پایه‌های متالیک', '2026-08-01T00:00:00Z'),
('dining', 'ناهارخوری و صندلی', 'ست‌های ناهارخوری ۶ و ۸ نفره با پارچه‌های ضدلک', '2026-08-01T00:00:00Z');

-- Seed Catalog Configuration in settings table
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
('catalog_info', '{"id":"cat_main_2026","title":"کاتالوگ جامع محصولات و دستاوردهای صنعتی آراسته","version":"نسخه پاییز و زمستان ۱۴۰۴ (V4.2)","updatedAt":"۱۴۰۴/۰۶/۱۰","fileUrl":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","fileSize":"۲۴.۸ مگابایت","pageCount":68,"description":"شامل تصاویر پروژه‌های اجرا شده، جزئیات فنی دقیق، جدول کالیته رنگ پارچه و چوب، ابعاد فنی و لیست قیمت نمایندگی‌ها."}', '2026-08-01T00:00:00Z');

-- Seed Slider Products
INSERT OR IGNORE INTO slider_items (id, image, image_key, title, description, category, badge, order_num, active, created_at, updated_at) VALUES
('1', 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1200&auto=format&fit=crop&q=85', NULL, 'سینی مستطیل مجلسی دسته پیوسته طرح ماربل', 'کد IH-101', 'سینی‌های پلاستیکی', 'پرفروش‌ترین', 1, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('2', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=85', NULL, 'سینی بیضی دسته طلایی لوکس مجلسی', 'کد IH-102', 'سینی‌های پلاستیکی', 'طرح لوکس', 2, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('3', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&auto=format&fit=crop&q=85', NULL, 'سینی چای‌خوری دونفره و چهارنفره فانتزی', 'کد IH-103', 'سینی‌های پلاستیکی', 'رنگ‌بندی متنوع', 3, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('4', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200&auto=format&fit=crop&q=85', NULL, 'ترازوی دیجیتال صفحه شیشه‌ای سکوریت دقیق', 'کد IH-201', 'ترازوهای آشپزخانه', 'دقت ۱ گرم', 4, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('5', 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=1200&auto=format&fit=crop&q=85', NULL, 'ترازوی دیجیتال کاسه‌دار مدرج قنادی و شیرینی‌پزی', 'کد IH-202', 'ترازوهای آشپزخانه', 'کاسه مدرج', 5, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('6', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&auto=format&fit=crop&q=85', NULL, 'ست ۴ عددی ظروف نگهدارنده قفل‌دار ضدهوا و سوپاپ‌دار', 'کد IH-301', 'ظروف نگهداری مواد غذایی', 'بدون BPA', 6, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('7', 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1200&auto=format&fit=crop&q=85', NULL, 'بانکه و ظرف ارگانایزر مستطیل حبوبات و یخچال', 'کد IH-302', 'ظروف نگهداری مواد غذایی', 'چیدمان مدولار', 7, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('8', 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=1200&auto=format&fit=crop&q=85', NULL, 'سبد نظم‌دهنده و آبکش تاشو سیلیکونی چندمنظوره', 'کد IH-401', 'اکسسوری و نظم‌دهنده‌ها', 'تاشو و کم‌جا', 8, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('9', 'https://images.unsplash.com/photo-1584269600486-1d16c7cf6d3b?w=1200&auto=format&fit=crop&q=85', NULL, 'سرویس سطل پدالی و فرچه بهداشتی لوکس آشپزخانه', 'کد IH-501', 'اکسسوری و نظم‌دهنده‌ها', 'پدال روان', 9, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
('10', 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&auto=format&fit=crop&q=85', NULL, 'بطری آب کریستالی و جاآبی درب سوپاپ‌دار نشکن', 'کد IH-601', 'ظروف نگهداری مواد غذایی', 'نشکن و شفاف', 10, 1, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z');

-- Seed Factory Products
INSERT OR IGNORE INTO products (id, name, category, price, currency, short_description, full_description, images, specs, in_stock, is_featured, code, created_at, updated_at) VALUES
(
  'prod_001',
  'کاناپه سه نفره چسترفیلد مدرن مخمل کله‌غازی',
  'مبلمان و نشیمن',
  34500000,
  'IRT',
  'کاناپه راحتی لوکس با پارچه مخمل اروپایی رنگ Teal Blue، پایه‌های استیل مات طلایی و اسفنج ۳۵ کیلویی ویژه.',
  'کاناپه سه نفره چسترفیلد مدرن از پرفروش‌ترین تولیدات است. در ساخت این اثر از کلاف تمام روس خشک‌کن رفته، فوم سرد قالبی با انعطاف بالا و پارچه مخمل ترک نانوشوینده با مقاومت سایشی بالا استفاده شده است. جزئیات لمسه‌دوزی تماماً با دست استادکاران مجرب انجام گرفته و پایه‌های استیل با آبکاری PVD طلایی ضدزنگ جلوه‌ای اشرافی و مدرن ایجاد کرده است.',
  '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"]',
  '{"کلاف اصلی":"چوب راش گرجستان و روس خشک‌کن رفته","پارچه":"مخمل وارداتی درجه یک (رنگ Teal Blue #346D80)","فوم و اسفنج":"فوم سرد ۳۵ کیلوگرم یولایکس ویژه","پایه":"استیل ۳۰۴ نگیر با آبکاری طلایی PVD ضدخش","ابعاد":"طول ۲۳۰ × عمق ۹۲ × ارتفاع ۸۲ سانتی‌متر","گارانتی":"۳۶ ماه ضمانت کتبی کارخانه و ۵ سال خدمات"}',
  1,
  1,
  'AR-SOF-101',
  '2026-08-15',
  '2026-09-02'
),
(
  'prod_002',
  'میز جلو مبلی بیضی سنگ مرمر با پایه استیل برنجی',
  'میز جلو مبلی و عسلی',
  18900000,
  'IRT',
  'میز سنتر با صفحه سنگ مرمر طبیعی رگه‌دار نجف‌آباد و استراکچر خمکاری‌شده استیل طلایی ضدخش.',
  'این میز جلو مبلی با الهام از معماری ارگانیک و سبک مینیمال لوکس طراحی شده است. سنگ مرمر طبیعی با پوشش نانو آب‌گریز صیقل داده شده تا در برابر لکه چای، قهوه و خط و خش حداکثر پایداری را داشته باشد. پایه‌های لوله‌ای استیل با جوشکاری ظریف آرگون و روکش پی‌وی‌دی طلایی-برنجی پیاده‌سازی شده‌اند.',
  '["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80"]',
  '{"صفحه میز":"سنگ مرمر طبیعی با ضخامت ۲۰ میلی‌متر نانو شده","استراکچر":"پروفیل استیل ۳۰۴ آنودایز طلایی","قطر و ابعاد":"طول ۱۲۰ × عرض ۷۰ × ارتفاع ۴۲ سانتی‌متر","وزن":"۳۸ کیلوگرم","گارانتی":"۲ سال گارانتی تعویض صفحه و ماندگاری آبکاری"}',
  1,
  1,
  'AR-TBL-204',
  '2026-08-20',
  '2026-09-01'
),
(
  'prod_003',
  'آباژور ایستاده مدرن برنجی با حباب‌های اپالین مات',
  'روشنایی و آباژور',
  9800000,
  'IRT',
  'آباژور قدی کنار مبلی با بدنه تمام برنجی برس خورده، سه شعله نور غیرمستقیم ملایم و سنگینی وزنه تعادل.',
  'نورپردازی گرم و چشم‌نواز این آباژور ایستاده، فضایی صمیمی و آرامش‌بخش در دکوراسیون پذیرایی و نشیمن ایجاد می‌کند. حباب‌های شیشه‌ای دست‌ساز سه‌لایه با پخش یکنواخت نور، مانع از خیرگی چشم می‌شوند. کلید دیمردار لمسی نصب‌شده روی کابل، امکان تنظیم پیوسته شدت نور از ۱۰ تا ۱۰۰ درصد را فراهم می‌سازد.',
  '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80"]',
  '{"متریال بدنه":"برنج خالص با کوتینگ محافظ ضدکدرشدگی","حباب‌ها":"شیشه مات اپالین دست‌ساز سه‌لایه","نوع سرپیچ":"۳ عدد سرپیچ استاندارد E27 استاندارد CE","ارتفاع":"۱۶۵ سانتی‌متر","قطر پایه سنگین":"۳۲ سانتی‌متر"}',
  1,
  0,
  'AR-LGT-305',
  '2026-08-22',
  '2026-08-22'
),
(
  'prod_004',
  'کنسول چهار درب مدرن با روکش چوب گردوی آمریکایی',
  'کنسول و دراور',
  27800000,
  'IRT',
  'کنسول دکوراتیو با شیارهای عمودی CNC شده روی درب‌ها، پایه‌های مخفی استیل و یراق‌آلات بلوم اتریش.',
  'کنسول چهار درب با تلفیق هنر نجاری سنتی و تکنولوژی ماشین‌کاری دقیق تولید شده است. روکش طبیعی چوب گردو با رگه‌های متقارن بوک‌مچ شده، روغنی کاملاً گیاهی و ضدآب از برند مونوکوت دارد. لولاهای آرام‌بند بلوم با تحمل وزن بالا و بازشوی نرم، استفاده روزمره را بسیار لذت‌بخش می‌کند.',
  '["https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"]',
  '{"روکش چوب":"گردوی آمریکایی با فینیش سوپر مات","یراق‌آلات":"بلوم (Blum) اتریش مجهز به ضربه‌گیر آرام‌بند","ابعاد":"طول ۱۸۰ × عمق ۴۵ × ارتفاع ۸۰ سانتی‌متر","طبقات داخلی":"۲ طبقه مجزا با امکان تنظیم ارتفاع"}',
  1,
  1,
  'AR-CNS-410',
  '2026-08-25',
  '2026-09-02'
),
(
  'prod_005',
  'ست میز ناهارخوری ۸ نفره چوب راش با صندلی‌های بوکله',
  'ناهارخوری و صندلی',
  56000000,
  'IRT',
  'میز ناهارخوری ارگانیک با لبه‌های زنده سوپر لوکس، ۸ عدد صندلی ارگونومیک با پارچه بوکله کرم وارداتی.',
  'این ست مجلل ناهارخوری شاهکار مهندسی چوب است. صفحه میز با ضخامت ۴ سانتی‌متر از اسلب‌های یکدست چوب راش خشک‌کن با اتصالات نامرئی بیسکوئیت و تنون شکل گرفته است. نشیمن صندلی‌ها کاملاً متناسب با آناتومی بدن انحنا یافته تا در طول دورهمی‌های طولانی، نهایت راحتی را به همراه داشته باشد.',
  '["https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80"]',
  '{"تعداد نشیمن":"۸ نفره (شامل ۱ میز + ۸ صندلی ناهارخوری)","چوب ساختار":"چوب راش گرجستان درجه یک پخته‌شده","پارچه صندلی":"بوکله اروپایی درجه یک با تکنولوژی ضدلک EasyClean","ابعاد میز":"طول ۲۱۰ × عرض ۱۰۰ × ارتفاع ۷۶ سانتی‌متر","گارانتی":"۴ سال ضمانت تعویض کارخانه"}',
  0,
  0,
  'AR-DIN-502',
  '2026-08-30',
  '2026-09-03'
);