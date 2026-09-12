// Central Content Registry and Default Values for IDEA HOME (آیدیا هوم)
// All editable text elements have stable content IDs and human-readable metadata.

export interface ContentItemDefinition {
  id: string;
  label: string;
  section: string;
  sectionKey: 'header' | 'hero' | 'slider' | 'features' | 'faq' | 'cta' | 'footer';
  type: 'heading' | 'subtitle' | 'paragraph' | 'button' | 'badge' | 'link';
  defaultValue: string;
  description?: string;
}

export const CONTENT_DEFINITIONS: ContentItemDefinition[] = [
  // --- بخش هدر و ناوبری (Header & Navigation) ---
  {
    id: 'header.navHome',
    label: 'منو: خانه',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'خانه',
  },
  {
    id: 'header.navProducts',
    label: 'منو: محصولات',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'محصولات',
  },
  {
    id: 'header.navFeatures',
    label: 'منو: استانداردهای تولید',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'استانداردهای تولید',
  },
  {
    id: 'header.navFaq',
    label: 'منو: سوالات متداول',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'سوالات متداول',
  },
  {
    id: 'header.navCatalog',
    label: 'منو: دریافت کاتالوگ',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'دریافت کاتالوگ',
  },
  {
    id: 'header.navContact',
    label: 'منو: تماس با ما',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'link',
    defaultValue: 'تماس با ما',
  },
  {
    id: 'header.ctaButton',
    label: 'دکمه هدر: ثبت سفارش عمده',
    section: 'هدر و ناوبری',
    sectionKey: 'header',
    type: 'button',
    defaultValue: 'ثبت سفارش عمده',
  },

  // --- بخش اصلی و بنر ورودی (Hero Section) ---
  {
    id: 'hero.badgeFactory',
    label: 'نشان کارخانه (بالای تیتر)',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'badge',
    defaultValue: 'کارخانه تولیدی آیدیا هوم',
  },
  {
    id: 'hero.badgeQuality',
    label: 'نشان کیفیت (کنار نشان کارخانه)',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'badge',
    defaultValue: 'کیفیت صادراتی',
  },
  {
    id: 'hero.titlePrefix',
    label: 'عنوان اصلی: بخش اول',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'heading',
    defaultValue: 'آیدیا هوم؛',
    description: 'کلمات ابتدایی عنوان اصلی صفحه',
  },
  {
    id: 'hero.titleGradient',
    label: 'عنوان اصلی: بخش رنگی و گرادیان',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'heading',
    defaultValue: 'همراه همیشگی خانه‌های ایرانی',
    description: 'متن با رنگ برجسته و گرادیان طلایی-فیروزه‌ای',
  },
  {
    id: 'hero.description',
    label: 'توضیحات معرفی زیر عنوان اصلی',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'paragraph',
    defaultValue: 'توسعه محصولات کاربردی خانه و آشپزخانه با استانداردهای کیفی، طراحی هدفمند و نگاه به آینده',
  },
  {
    id: 'hero.primaryButton',
    label: 'دکمه اصلی هیرو (مشاهده نمونه محصولات)',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'button',
    defaultValue: 'مشاهده نمونه محصولات',
  },
  {
    id: 'hero.secondaryButton',
    label: 'دکمه دوم هیرو (استعلام قیمت و سفارش)',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'button',
    defaultValue: 'استعلام قیمت و سفارش',
  },
  {
    id: 'hero.scrollPrompt',
    label: 'متن راهنمای اسکرول به پایین',
    section: 'بخش اصلی (Hero)',
    sectionKey: 'hero',
    type: 'link',
    defaultValue: 'مشاهده محصولات کارخانه',
  },

  // --- ویترین و اسلایدر محصولات (Product Slider Showcase) ---
  {
    id: 'slider.badge',
    label: 'نشان بالای اسلایدر محصولات',
    section: 'ویترین محصولات',
    sectionKey: 'slider',
    type: 'badge',
    defaultValue: 'ویترین محصولات کارخانه',
  },
  {
    id: 'slider.title',
    label: 'تیتر اسلایدر محصولات',
    section: 'ویترین محصولات',
    sectionKey: 'slider',
    type: 'heading',
    defaultValue: 'مجموعه لوازم خانه و آشپزخانه آیدیا هوم',
  },
  {
    id: 'slider.description',
    label: 'توضیحات زیر تیتر اسلایدر',
    section: 'ویترین محصولات',
    sectionKey: 'slider',
    type: 'paragraph',
    defaultValue: 'تولید شده با مواد اولیه درجه یک بهداشتی (Food Grade)، طراحی ارگونومیک و بالاترین استانداردهای کیفی',
  },
  {
    id: 'slider.catalogCta',
    label: 'دکمه دانلود کاتالوگ در اسلایدر',
    section: 'ویترین محصولات',
    sectionKey: 'slider',
    type: 'button',
    defaultValue: 'دریافت کاتالوگ جامع محصولات (PDF)',
  },

  // --- ویژگی‌ها و استانداردهای تولید (Features & Standards) ---
  {
    id: 'features.badge',
    label: 'نشان بالای بخش ویژگی‌ها',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'مزایای رقابتی آیدیا هوم',
  },
  {
    id: 'features.title',
    label: 'تیتر اصلی استانداردهای مهندسی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'استانداردهای مهندسی در ساخت لوازم خانگی',
  },
  {
    id: 'features.description',
    label: 'توضیحات معرفی استانداردهای تولید',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'در شرکت ایدیا هوم، کیفیت از مرحله تولید آغاز میشود. ما با تکیه بر تجربه، تجهیزات تولید و کنترل دقیق کیفیت، لوازم آشپزخانه را با تمرکز بر کیفیت، طراحی کاربردی و رضایت مشتری تولید میکنیم.',
  },
  // Feature Cards (استانداردها و کارت‌های مزایای رقابتی)
  // Card 1
  {
    id: 'features.card1.tag',
    label: 'کارت ۱: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'تولید مستقیم',
  },
  {
    id: 'features.card1.title',
    label: 'کارت ۱: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'تولید مستقیم در کارخانه',
  },
  {
    id: 'features.card1.desc',
    label: 'کارت ۱: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'کنترل فرآیند تولید از مواد اولیه تا محصول نهایی.',
  },
  {
    id: 'features.card1.highlight',
    label: 'کارت ۱: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'از مواد اولیه تا محصول نهایی',
  },

  // Card 2
  {
    id: 'features.card2.tag',
    label: 'کارت ۲: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'کنترل کیفی',
  },
  {
    id: 'features.card2.title',
    label: 'کارت ۲: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'کیفیت پایدار',
  },
  {
    id: 'features.card2.desc',
    label: 'کارت ۲: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'کنترل کیفیت در مراحل مختلف تولید برای ارائه محصولی قابل اعتماد.',
  },
  {
    id: 'features.card2.highlight',
    label: 'کارت ۲: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'محصولی قابل اعتماد و بادوام',
  },

  // Card 3
  {
    id: 'features.card3.tag',
    label: 'کارت ۳: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'طراحی مدرن',
  },
  {
    id: 'features.card3.title',
    label: 'کارت ۳: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'طراحی کاربردی و مدرن',
  },
  {
    id: 'features.card3.desc',
    label: 'کارت ۳: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'توجه به نیاز مصرف‌کننده و ترکیب زیبایی، کاربرد و دوام.',
  },
  {
    id: 'features.card3.highlight',
    label: 'کارت ۳: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'ترکیب زیبایی، کاربرد و دوام',
  },

  // Card 4
  {
    id: 'features.card4.tag',
    label: 'کارت ۴: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'سفارش عمده',
  },
  {
    id: 'features.card4.title',
    label: 'کارت ۴: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'ظرفیت تولید و سفارش عمده',
  },
  {
    id: 'features.card4.desc',
    label: 'کارت ۴: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'امکان تأمین سفارش‌های عمده برای بازار داخلی و مشتریان تجاری.',
  },
  {
    id: 'features.card4.highlight',
    label: 'کارت ۴: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'تأمین بازار داخلی و تجاری',
  },

  // Card 5
  {
    id: 'features.card5.tag',
    label: 'کارت ۵: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'تولید سفارشی',
  },
  {
    id: 'features.card5.title',
    label: 'کارت ۵: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'همکاری OEM و برند اختصاصی',
  },
  {
    id: 'features.card5.desc',
    label: 'کارت ۵: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'امکان همکاری با برندها و مجموعه‌های تجاری برای تولید محصولات اختصاصی.',
  },
  {
    id: 'features.card5.highlight',
    label: 'کارت ۵: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'تولید اختصاصی برای برندها',
  },

  // Card 6
  {
    id: 'features.card6.tag',
    label: 'کارت ۶: برچسب',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'تعهد و پشتیبانی',
  },
  {
    id: 'features.card6.title',
    label: 'کارت ۶: عنوان',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'heading',
    defaultValue: 'تعهد به مشتری',
  },
  {
    id: 'features.card6.desc',
    label: 'کارت ۶: توضیحات',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'paragraph',
    defaultValue: 'همراهی از مرحله انتخاب محصول تا تولید، بسته‌بندی و تحویل سفارش.',
  },
  {
    id: 'features.card6.highlight',
    label: 'کارت ۶: نکته کلیدی',
    section: 'استانداردها و ویژگی‌ها',
    sectionKey: 'features',
    type: 'badge',
    defaultValue: 'از انتخاب تا تحویل سفارش',
  },

  // --- پرسش‌های متداول (FAQ Section) ---
  {
    id: 'faq.badge',
    label: 'نشان بالای سوالات متداول',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'badge',
    defaultValue: 'راهنمای خرید و همکاری',
  },
  {
    id: 'faq.title',
    label: 'تیتر اصلی سوالات متداول',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: 'پرسش‌های متداول',
  },
  {
    id: 'faq.q1',
    label: 'سوال ۱',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۱. شرکت ایده در چه زمینه‌ای فعالیت می‌کند؟',
  },
  {
    id: 'faq.a1',
    label: 'پاسخ ۱',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'شرکت ایده در زمینه تولید لوازم آشپزخانه فعالیت می‌کند و محصولات متنوعی را با تمرکز بر کیفیت و کاربردی بودن تولید و عرضه می‌کند.',
  },
  {
    id: 'faq.q2',
    label: 'سوال ۲',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۲. آیا شرکت ایده فروش عمده دارد؟',
  },
  {
    id: 'faq.a2',
    label: 'پاسخ ۲',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'بله، شرکت ایده امکان همکاری و تأمین سفارش‌های عمده را برای فروشگاه‌ها، توزیع‌کنندگان و مجموعه‌های تجاری فراهم کرده است.',
  },
  {
    id: 'faq.q3',
    label: 'سوال ۳',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۳. چگونه می‌توانم قیمت محصولات را دریافت کنم؟',
  },
  {
    id: 'faq.a3',
    label: 'پاسخ ۳',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'برای دریافت قیمت، می‌توانید محصول موردنظر و تعداد موردنیاز خود را از طریق راه‌های ارتباطی سایت برای واحد فروش شرکت ایده ارسال کنید.',
  },
  {
    id: 'faq.q4',
    label: 'سوال ۴',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۴. آیا شرکت ایده با فروشگاه‌ها و نمایندگان همکاری می‌کند؟',
  },
  {
    id: 'faq.a4',
    label: 'پاسخ ۴',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'بله، شرکت ایده آماده همکاری با فروشگاه‌ها، نمایندگان فروش و مجموعه‌های تجاری است.',
  },
  {
    id: 'faq.q5',
    label: 'سوال ۵',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۵. محصولات شرکت ایده چگونه کنترل می‌شوند؟',
  },
  {
    id: 'faq.a5',
    label: 'پاسخ ۵',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'محصولات در مراحل مختلف تولید مورد بررسی و کنترل قرار می‌گیرند تا کیفیت محصول نهایی مطابق با استانداردهای تولید شرکت باشد.',
  },
  {
    id: 'faq.q6',
    label: 'سوال ۶',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۶. زمان آماده‌سازی سفارش چقدر است؟',
  },
  {
    id: 'faq.a6',
    label: 'پاسخ ۶',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'زمان آماده‌سازی سفارش با توجه به نوع محصول و حجم سفارش متفاوت است و هنگام ثبت سفارش توسط واحد فروش اعلام می‌شود.',
  },
  {
    id: 'faq.q7',
    label: 'سوال ۷',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'heading',
    defaultValue: '۷. چگونه می‌توانم با شرکت ایده تماس بگیرم؟',
  },
  {
    id: 'faq.a7',
    label: 'پاسخ ۷',
    section: 'پرسش‌های متداول',
    sectionKey: 'faq',
    type: 'paragraph',
    defaultValue: 'برای ارتباط با شرکت ایده می‌توانید از فرم تماس، شماره تلفن یا سایر راه‌های ارتباطی درج‌شده در سایت استفاده کنید.',
  },

  // --- فراخوان اقدام و کاتالوگ (Final CTA & Catalog Section) ---
  {
    id: 'cta.badge',
    label: 'نشان کاتالوگ (بالای باکس تماس)',
    section: 'فراخوان و کاتالوگ (CTA)',
    sectionKey: 'cta',
    type: 'badge',
    defaultValue: 'تأمین مستقیم و بی‌واسطه از درب کارخانه',
  },
  {
    id: 'cta.title',
    label: 'تیتر بزرگ فراخوان پایانی',
    section: 'فراخوان و کاتالوگ (CTA)',
    sectionKey: 'cta',
    type: 'heading',
    defaultValue: 'آماده تجهیز فروشگاه خود هستید؟',
  },
  {
    id: 'cta.description',
    label: 'متن توضیحات کاتالوگ و تماس',
    section: 'فراخوان و کاتالوگ (CTA)',
    sectionKey: 'cta',
    type: 'paragraph',
    defaultValue: 'کاتالوگ محصولات و مشخصات فنی را دریافت کنید.\nواحد فروش آیدیا هوم آماده ثبت سفارش شماست.',
  },
  {
    id: 'cta.downloadButton',
    label: 'متن دکمه دریافت کاتالوگ',
    section: 'فراخوان و کاتالوگ (CTA)',
    sectionKey: 'cta',
    type: 'button',
    defaultValue: 'دریافت کاتالوگ محصولات',
  },
  {
    id: 'cta.contactButton',
    label: 'متن دکمه تماس با مدیران فروش',
    section: 'فراخوان و کاتالوگ (CTA)',
    sectionKey: 'cta',
    type: 'button',
    defaultValue: 'تماس با مدیران فروش کارخانه',
  },

  // --- فوتر و اطلاعات تماس (Footer & Contact) ---
  {
    id: 'footer.description',
    label: 'متن معرفی کارخانه در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'paragraph',
    defaultValue: 'کارخانه ایده استیل سازان شریف؛ تولیدکننده تخصصی لوازم خانه و آشپزخانه با تمرکز بر کیفیت پایدار، طراحی کاربردی و تولید مستقیم. ما با کنترل فرآیند تولید از مواد اولیه تا محصول نهایی، محصولاتی قابل اعتماد و متناسب با نیاز بازار ارائه میدهیم و امکان تأمین سفارشهای عمده و همکاری با فروشگاه ها و مجموعه های تجاری را فراهم کرده ایم.',
  },
  {
    id: 'footer.contactTitle',
    label: 'تیتر بخش تماس در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'heading',
    defaultValue: 'تماس با ما',
  },
  {
    id: 'footer.contactPerson',
    label: 'نام مسئول فروش در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'badge',
    defaultValue: 'طاهری:',
  },
  {
    id: 'footer.contactHours',
    label: 'ساعات کاری در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'paragraph',
    defaultValue: 'ساعات کاری: شنبه تا چهارشنبه ۸ الی ۱۷:۳۰',
  },
  {
    id: 'footer.orderButton',
    label: 'دکمه ثبت سفارش تلفنی در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'button',
    defaultValue: 'ثبت سفارش تلفنی و ارتباط سریع',
  },
  {
    id: 'footer.copyright',
    label: 'متن حق نشر (کپی‌رایت)',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'paragraph',
    defaultValue: '© ۲۰۲۶ آیدیا هوم. تمامی حقوق محفوظ است.',
  },
  {
    id: 'footer.badgeOrigin',
    label: 'نشان اصالت در انتهای فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'badge',
    defaultValue: 'ساخت ایران',
  },
  {
    id: 'footer.badgeSlogan',
    label: 'شعار تولید ملی در انتهای فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'badge',
    defaultValue: 'تولید ملی با کیفیت جهانی',
  },
  {
    id: 'footer.backToTop',
    label: 'دکمه بازگشت به بالا در فوتر',
    section: 'فوتر و اطلاعات تماس',
    sectionKey: 'footer',
    type: 'link',
    defaultValue: 'بازگشت به بالای صفحه ↑',
  },
];

// Helper to construct initial dictionary
export const DEFAULT_SITE_CONTENT: Record<string, string> = CONTENT_DEFINITIONS.reduce(
  (acc, item) => {
    acc[item.id] = item.defaultValue;
    return acc;
  },
  {} as Record<string, string>
);

export const CONTENT_SECTION_NAMES: Record<ContentItemDefinition['sectionKey'], string> = {
  header: 'هدر و ناوبری',
  hero: 'بخش اصلی (Hero)',
  slider: 'ویترین محصولات',
  features: 'استانداردها و ویژگی‌ها',
  faq: 'پرسش‌های متداول',
  cta: 'فراخوان و کاتالوگ (CTA)',
  footer: 'فوتر و اطلاعات تماس',
};

export function getContentDefinition(id: string): ContentItemDefinition | undefined {
  const direct = CONTENT_DEFINITIONS.find((item) => item.id === id);
  if (direct) return direct;

  if (id.startsWith('features.item')) {
    const cardId = id.replace('features.item', 'features.card');
    return CONTENT_DEFINITIONS.find((item) => item.id === cardId);
  }
  if (id.startsWith('features.card')) {
    const itemId = id.replace('features.card', 'features.item');
    return CONTENT_DEFINITIONS.find((item) => item.id === itemId);
  }
  return undefined;
}

export function getDefinitionsBySection(sectionKey: ContentItemDefinition['sectionKey']): ContentItemDefinition[] {
  return CONTENT_DEFINITIONS.filter((item) => item.sectionKey === sectionKey);
}
