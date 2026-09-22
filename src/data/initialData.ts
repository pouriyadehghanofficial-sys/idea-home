import { Product, CatalogInfo, PriceListInfo, ContactMessage, Category, CompanyPhoto } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { 
    id: 'living', 
    name: 'مبلمان و نشیمن', 
    description: 'انواع کاناپه، مبل راحتی و صندلی تک لوکس با استراکچر استیل و چوب مرغوب',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
    ],
    catalogUrl: '/ideahome-catalog.pdf',
    catalogTitle: 'کاتالوگ تخصصی مبلمان و نشیمن',
    catalogSize: '۸.۴ مگابایت',
    catalogUpdatedAt: '۱۴۰۴/۰۶/۱۰'
  },
  { 
    id: 'tables', 
    name: 'میز جلو مبلی و عسلی', 
    description: 'میزهای سنگی مرمر، شیشه و استیل طلایی PVD ضدخش با آبکاری صنعتی',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80'
    ],
    catalogUrl: '/ideahome-catalog.pdf',
    catalogTitle: 'کاتالوگ میزهای جلو مبلی و عسلی مدرن',
    catalogSize: '۵.۶ مگابایت',
    catalogUpdatedAt: '۱۴۰۴/۰۶/۱۰'
  },
  { 
    id: 'lighting', 
    name: 'روشنایی و آباژور', 
    description: 'آباژورهای ایستاده، لوستر مدرن و چراغ‌های دکوراتیو با آلیاژ برنج و استیل',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
    ],
    catalogUrl: '/ideahome-catalog.pdf',
    catalogTitle: 'کاتالوگ سیستم‌های روشنایی و آباژور',
    catalogSize: '۴.۲ مگابایت',
    catalogUpdatedAt: '۱۴۰۴/۰۶/۱۰'
  },
  { 
    id: 'consoles', 
    name: 'کنسول و دراور', 
    description: 'کنسول‌های مدرن روکش چوب طبیعی و پایه‌های متالیک استیل با مقاومت بالا',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    catalogUrl: '/ideahome-catalog.pdf',
    catalogTitle: 'کاتالوگ ست‌های کنسول و دراور لوکس',
    catalogSize: '۶.۱ مگابایت',
    catalogUpdatedAt: '۱۴۰۴/۰۶/۱۰'
  },
  { 
    id: 'dining', 
    name: 'ناهارخوری و صندلی', 
    description: 'ست‌های ناهارخوری ۶ و ۸ نفره با پارچه‌های ضدلک و اسکلت فولادی مستحکم',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580481077195-c328ad4f3879?auto=format&fit=crop&w=800&q=80'
    ],
    catalogUrl: '/ideahome-catalog.pdf',
    catalogTitle: 'کاتالوگ میز و صندلی ناهارخوری',
    catalogSize: '۷.۸ مگابایت',
    catalogUpdatedAt: '۱۴۰۴/۰۶/۱۰'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'کاناپه سه نفره چسترفیلد مدرن مخمل کله‌غازی',
    category: 'مبلمان و نشیمن',
    price: 34500000,
    currency: 'IRT',
    shortDescription: 'کاناپه راحتی لوکس با پارچه مخمل اروپایی رنگ Teal Blue، پایه‌های استیل مات طلایی و اسفنج ۳۵ کیلویی ویژه.',
    fullDescription: 'کاناپه سه نفره چسترفیلد مدرن از پرفروش‌ترین تولیدات است. در ساخت این اثر از کلاف تمام روس خشک‌کن رفته، فوم سرد قالبی با انعطاف بالا و پارچه مخمل ترک نانوشوینده با مقاومت سایشی بالا استفاده شده است. جزئیات لمسه‌دوزی تماماً با دست استادکاران مجرب انجام گرفته و پایه‌های استیل با آبکاری PVD طلایی ضدزنگ جلوه‌ای اشرافی و مدرن ایجاد کرده است.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'کلاف اصلی': 'چوب راش گرجستان و روس خشک‌کن رفته',
      'پارچه': 'مخمل وارداتی درجه یک (رنگ Teal Blue #346D80)',
      'فوم و اسفنج': 'فوم سرد ۳۵ کیلوگرم یولایکس ویژه',
      'پایه': 'استیل ۳۰۴ نگیر با آبکاری طلایی PVD ضدخش',
      'ابعاد': 'طول ۲۳۰ × عمق ۹۲ × ارتفاع ۸۲ سانتی‌متر',
      'گارانتی': '۳۶ ماه ضمانت کتبی کارخانه و ۵ سال خدمات'
    },
    inStock: true,
    isFeatured: true,
    code: 'AR-SOF-101',
    createdAt: '2026-08-15',
    updatedAt: '2026-09-02'
  },
  {
    id: 'prod_002',
    name: 'میز جلو مبلی بیضی سنگ مرمر با پایه استیل برنجی',
    category: 'میز جلو مبلی و عسلی',
    price: 18900000,
    currency: 'IRT',
    shortDescription: 'میز سنتر با صفحه سنگ مرمر طبیعی رگه‌دار نجف‌آباد و استراکچر خمکاری‌شده استیل طلایی ضدخش.',
    fullDescription: 'این میز جلو مبلی با الهام از معماری ارگانیک و سبک مینیمال لوکس طراحی شده است. سنگ مرمر طبیعی با پوشش نانو آب‌گریز صیقل داده شده تا در برابر لکه چای، قهوه و خط و خش حداکثر پایداری را داشته باشد. پایه‌های لوله‌ای استیل با جوشکاری ظریف آرگون و روکش پی‌وی‌دی طلایی-برنجی پیاده‌سازی شده‌اند.',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'صفحه میز': 'سنگ مرمر طبیعی با ضخامت ۲۰ میلی‌متر نانو شده',
      'استراکچر': 'پروفیل استیل ۳۰۴ آنودایز طلایی',
      'قطر و ابعاد': 'طول ۱۲۰ × عرض ۷۰ × ارتفاع ۴۲ سانتی‌متر',
      'وزن': '۳۸ کیلوگرم',
      'گارانتی': '۲ سال گارانتی تعویض صفحه و ماندگاری آبکاری'
    },
    inStock: true,
    isFeatured: true,
    code: 'AR-TBL-204',
    createdAt: '2026-08-20',
    updatedAt: '2026-09-01'
  },
  {
    id: 'prod_003',
    name: 'آباژور ایستاده خمیده دکوراتیو با کلاهک برنجی متالیک',
    category: 'روشنایی و آباژور',
    price: 9800000,
    currency: 'IRT',
    shortDescription: 'آباژور مدرن سالنی با بازوی قوسی قابل تنظیم و کلاهک کاسه‌ای فلزی با پرداخت براق طلایی گرم.',
    fullDescription: 'آباژور قوسی مدل آریا تلفیقی از هنر صنعتی و نورپردازی ملایم است. نور گرم و غیرمستقیم آن فضای سالن پذیرایی، کنج مطالعه یا اتاق مدیریت را بسیار صمیمی و آرامش‌بخش می‌نماید. دارای دیمر لمسی پایی جهت تنظیم شدت روشنایی در ۳ سطح مختلف.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'جنس بدنه': 'آلیاژ برنج با پوشش ترانسپارنت ضدسیاه‌شدگی',
      'نوع سرپیچ': 'E27 استاندارد با پشتیبانی از لامپ‌های هوشمند',
      'کلید کنترل': 'دیمر لمسی پدالی با ۳ درجه نور',
      'ارتفاع کل': '۱۸۵ سانتی‌متر (شعاع پرتاب نور ۹۰ سانتی‌متر)',
      'سیم‌کشی': 'روکش بافت کتان نخی نسوز به طول ۲.۵ متر'
    },
    inStock: true,
    isFeatured: true,
    code: 'AR-LGT-305',
    createdAt: '2026-08-22',
    updatedAt: '2026-09-03'
  },
  {
    id: 'prod_004',
    name: 'صندلی تک‌نفره لانژ با روکش مخمل تیل و کلاف چوب گردو',
    category: 'مبلمان و نشیمن',
    price: 14200000,
    currency: 'IRT',
    shortDescription: 'صندلی راحتی ارگونومیک با زاویه تکیه‌گاه استاندارد، مناسب لابی‌های لوکس و نشیمن‌های مدرن.',
    fullDescription: 'صندلی تک‌نفره لانژ آراسته با تکیه بر اصول ارگونومی نشیمن طراحی شده است. نشیمن‌گاه عمیق و پهن آن احساس در آغوش کشیده شدن را تداعی می‌کند. پارچه مخمل ترک با تراکم ۴۰۰ گرم و بافت ابریشمی در کنار چوب طبیعی گردوی آمریکایی با پوشش روغن گیاهی مونوکوت بلژیک، ظرافتی چشم‌نواز به محیط می‌بخشد.',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c328ad4f3879?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'اسکلت': 'چوب طبیعی گردوی گرید A فرآوری‌شده',
      'پارچه': 'مخمل ژاکارد سبز آبی تیره (Deep Teal)',
      'پوشش چوب': 'روغن ارگانیک گیاهی مات مقاوم در برابر رطوبت',
      'تحمل وزن': '۱۶۰ کیلوگرم با آزمون بارگذاری مداوم',
      'ابعاد': 'عرض ۸۲ × عمق ۸۵ × ارتفاع ۷۸ سانتی‌متر'
    },
    inStock: true,
    isFeatured: false,
    code: 'AR-CHR-109',
    createdAt: '2026-08-25',
    updatedAt: '2026-09-03'
  },
  {
    id: 'prod_005',
    name: 'کنسول مدرن مینیمال چهار درب با روکش چوب طبیعی و پایه‌های برنجی',
    category: 'کنسول و دراور',
    price: 27800000,
    currency: 'IRT',
    shortDescription: 'میز کنسول لوکس چهار درب با لولاهای آرام‌بند بلوم اتریش و دستگیره‌های سفارشی ریخته‌گری برنج.',
    fullDescription: 'کنسول سری نوبل با خطوط تمیز و تقارن هندسی، نقطه کانونی هر سالن پذیرایی خواهد بود. مغزی ام‌دی‌اف وارداتی با تراکم بالا همراه با روکش چوب طبیعی بلوط اروپایی رگه‌راست که با شیارهای عمودی CNC تزیین شده است. بخش داخلی دارای طبقات با ارتفاع قابل تنظیم برای نگهداری ظروف پذیرایی است.',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'جنس بدنه': 'MDF واناچای با روکش چوب بلوط گرید سوپر',
      'یراق‌آلات': 'لولاهای کلیپسی آرام‌بند بلوم اتریش (Bloom)',
      'پایه و دستگیره': 'برنج یکپارچه مات برس‌خورده',
      'ابعاد': 'طول ۱۹۰ × عمق ۴۵ × ارتفاع ۸۵ سانتی‌متر',
      'گارانتی': '۵ سال گارانتی کتبی یراق‌آلات و سازه'
    },
    inStock: true,
    isFeatured: true,
    code: 'AR-CNS-401',
    createdAt: '2026-08-28',
    updatedAt: '2026-09-02'
  },
  {
    id: 'prod_006',
    name: 'ست میز ناهارخوری هشت نفره چوب راش و صندلی‌های بوکله خاکی',
    category: 'ناهارخوری و صندلی',
    price: 49000000,
    currency: 'IRT',
    shortDescription: 'ست ناهارخوری مدرن با صفحه چوب راش سوپر گرجستان و صندلی‌های پارچه تدی بوکله با نشیمن ارگونومیک.',
    fullDescription: 'یک ست کامل و چشمگیر برای گردهمایی‌های خانوادگی و تشریفات. صفحه میز با لبه‌های هلالی نرم و روکش گردوی موج‌دار به همراه ۸ عدد صندلی ناهارخوری با پشتی منحنی که در برگیرنده ستون فقرات است. روکش صندلی‌ها از جنس پارچه بوکله کرم-خاکی ضدلک است که لطافت بی‌نظیری ایجاد می‌کند.',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'تعداد نشیمن': '۸ نفره (شامل ۱ میز + ۸ صندلی ناهارخوری)',
      'چوب ساختار': 'چوب راش گرجستان درجه یک پخته‌شده',
      'پارچه صندلی': 'بوکله اروپایی درجه یک با تکنولوژی ضدلک EasyClean',
      'ابعاد میز': 'طول ۲۱۰ × عرض ۱۰۰ × ارتفاع ۷۶ سانتی‌متر',
      'گارانتی': '۴ سال ضمانت تعویض کارخانه'
    },
    inStock: false,
    isFeatured: false,
    code: 'AR-DIN-502',
    createdAt: '2026-08-30',
    updatedAt: '2026-09-03'
  }
];

export const INITIAL_CATALOG: CatalogInfo = {
  id: 'cat_main_2026',
  title: 'کاتالوگ جامع محصولات و دستاوردهای صنعتی آراسته',
  version: 'نسخه پاییز و زمستان ۱۴۰۴ (V4.2)',
  updatedAt: '۱۴۰۴/۰۶/۱۰',
  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  fileSize: '۲۴.۸ مگابایت',
  pageCount: 68,
  description: 'شامل تصاویر پروژه‌های اجرا شده، جزئیات فنی دقیق، جدول کالیته رنگ پارچه و چوب، ابعاد فنی و لیست قیمت نمایندگی‌ها.'
};

export const INITIAL_PRICE_LIST: PriceListInfo = {
  id: 'price_list_main_2026',
  title: 'لیست قیمت رسمی و شرایط همکاری آیدیا هوم',
  version: 'نسخه معتبر پاییز و زمستان ۱۴۰۴',
  updatedAt: '۱۴۰۴/۰۶/۱۰',
  fileUrl: '/ideahome-pricelist.pdf',
  fileSize: '۳.۲ مگابایت',
  pageCount: 16,
  description: 'جدیدترین لیست قیمت رسمی همکار، مشخصات بسته‌بندی کارتن مادر، کدهای کالا و تخفیف‌های تیراژ کارخانه.'
};

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg_001',
    name: 'مهندس آرش شریفی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    email: 'arash.sharifi@example.com',
    subject: 'استعلام قیمت و سفارشی‌سازی برای پروژه هتل ۵ ستاره',
    message: 'با سلام، برای لابی و سوئیت‌های رویال هتل در کیش به ۴۰ ست کاناپه چسترفیلد و میز جلو مبلی سنگ مرمر با ابعاد سفارشی نیاز داریم. لطفا پیش‌فاکتور رسمی و جدول زمانبندی تولید را ارسال فرمایید.',
    date: '۱۴۰۴/۰۶/۱۲ - ساعت ۱۴:۳۰',
    status: 'unread'
  },
  {
    id: 'msg_002',
    name: 'خانم دکتر مهرنوش صدر',
    phone: '۰۹۱۸۲۲۲۳۳۴۴',
    email: 'm.sadr@example.com',
    subject: 'درخواست نمایندگی انحصاری استان اصفهان',
    message: 'با درود و احترام، دارای نمایشگاه مبلمان به متراژ ۴۵۰ متر مربع در خیابان میرداماد اصفهان هستیم. تمایل داریم شرایط اخذ نمایندگی انحصاری برند شما در اصفهان را بررسی کنیم.',
    date: '۱۴۰۴/۰۶/۱۰ - ساعت ۱۰:۱۵',
    status: 'read'
  }
];

export const INITIAL_COMPANY_PHOTOS: CompanyPhoto[] = [
  {
    id: 'photo_01',
    title: 'خط تولید اتوماتیک و دستگاه‌های برش لیزر CNC',
    category: 'factory',
    description: 'تجهیزات برش لیزر و فرم‌دهی ورق و مفتول استنلس استیل با دقت صدم میلیمتر',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    order: 1,
    createdAt: '۱۴۰۴/۰۱/۱۵'
  },
  {
    id: 'photo_02',
    title: 'سالن جوشکاری تخصصی آرگون و پرداختکاری استیل',
    category: 'factory',
    description: 'خط جوش TIG بدون درز و سالن شستشو و پولیش آینه‌ای قطعات',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    order: 2,
    createdAt: '۱۴۰۴/۰۱/۲۰'
  },
  {
    id: 'photo_03',
    title: 'واحد کنترل کیفیت (QC) و آزمایشگاه تست خستگی',
    category: 'factory',
    description: 'آزمون مقاومت سالت اسپری (خوردگی) و تست تحمل بار ریل‌ها و سبدها',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    order: 3,
    createdAt: '۱۴۰۴/۰۲/۰۱'
  },
  {
    id: 'photo_04',
    title: 'سالن مونتاژ و بسته‌بندی تمام مکانیزه',
    category: 'factory',
    description: 'بسته‌بندی ضربه‌گیر ۵ لایه و بارکدگذاری صنعتی جهت ارسال سریع',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    order: 4,
    createdAt: '۱۴۰۴/۰۲/۱۰'
  },
  {
    id: 'photo_05',
    title: 'شوروم دائمی و گالری نمایش محصولات ایده هوم',
    category: 'office',
    description: 'نمایشگاه تخصصی ست‌های اکسسوری و تجهیزات مدرن آشپزخانه و نشیمن',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    order: 5,
    createdAt: '۱۴۰۴/۰۲/۱۵'
  },
  {
    id: 'photo_06',
    title: 'دفتر مرکزی و سالن کنفرانس و مذاکرات بازرگانی',
    category: 'office',
    description: 'محیط تعاملی مهندسی فروش، قراردادهای عمده و پشتیبانی نمایندگی‌ها',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    order: 6,
    createdAt: '۱۴۰۴/۰۲/۲۰'
  },
  {
    id: 'photo_07',
    title: 'دپارتمان تحقیق، توسعه و طراحی صنعتی (R&D)',
    category: 'office',
    description: 'تیم طراحی ارگونومی، نقشه‌کشی سه‌بعدی و شبیه‌سازی مکانیکی محصولات',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    order: 7,
    createdAt: '۱۴۰۴/۰۲/۲۵'
  }
];