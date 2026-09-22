import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  DEFAULT_SITE_CONTENT, 
  DEFAULT_CONTENT_EN, 
  DEFAULT_CONTENT_AR, 
  getContentDefinition, 
  SupportedLanguage 
} from '../data/defaultContent';
import { contentRepository } from '../services/contentRepository';

const LANGUAGE_STORAGE_KEY = 'ideahome_lang';

const PHRASE_DICTIONARY_EN: Record<string, string> = {
  'ثبت سفارش عمده': 'Wholesale Order',
  'ثبت سفارش تلفنی و ارتباط سریع': 'Phone Order & Quick Contact',
  'سفارش تلفنی و ارتباط سریع': 'Phone Order & Quick Contact',
  'همه تصاویر': 'All Photos',
  'کارخانه و خطوط تولید': 'Factory & Production Lines',
  'دفتر مرکزی': 'Headquarters',
  'شوروم دائمی': 'Permanent Showroom',
  'شوروم': 'Showroom',
  'کارخانه': 'Factory',
  'خطوط تولید کارخانه': 'Factory Production Lines',
  'مشاهده آلبوم و کاتالوگ': 'View Album & Catalog',
  'مشاهده در گالری کامل': 'View in Full Gallery',
  'کاتالوگ رسمی': 'Official Catalog',
  'دانلود مستقیم کاتالوگ PDF': 'Download Official Catalog (PDF)',
  'بستن': 'Close',
  'منو': 'Menu',
  'خانه': 'Home',
  'صفحه اصلی': 'Home',
  'دسته‌بندی محصولات': 'Product Categories',
  'تصاویر کارخانه و دفتر': 'Factory & Office Gallery',
  'تصاویر کارخانه و دفتر مرکزی': 'Factory & Headquarters Gallery',
  'محصولات': 'Products',
  'لیست قیمت': 'Price List',
  'استانداردهای تولید': 'Standards',
  'سوالات متداول': 'FAQ',
  'دریافت کاتالوگ': 'Catalog',
  'تماس با ما': 'Contact Us',
  'بازگشت به خانه': 'Back to Home',
  'منوی اصلی آراسته چوب': 'IDEA HOME Menu',
  'منوی اصلی آیدیا هوم': 'IDEA HOME Menu',
  'مبلمان راحتی و مدرن': 'Modern & Casual Living',
  'میزهای عسلی و جلومبلی': 'Coffee & Side Tables',
  'سیستم‌های نورپردازی مدرن': 'Modern Lighting Systems',
  'ست‌های کنسول و آینه': 'Console & Sideboard Sets',
  'میز و صندلی غذاخوری': 'Dining Tables & Chairs',
  'کارخانه تولیدی آیدیا هوم': 'IDEA HOME Manufacturing Plant',
  'ورود به گالری محصولات': 'Enter Product Gallery',
  'مشاهده نمونه محصولات': 'Explore Product Showcase',
  'در حال دریافت تصاویر مجموعه...': 'Loading facility photos...',
  'در حال بارگذاری دسته‌بندی‌های محصولات...': 'Loading product categories...',
  'در حال بارگذاری تصاویر ویترین محصولات...': 'Loading product showcase...',
  'جستجوی دسته‌بندی...': 'Search categories...',
  'تصویر': 'Image',
  'از': 'of',
  'عکس': 'Photo',
  'عکس‌های منتخب کارخانه': 'Selected Factory Photos',
  'خطوط تولید مکانیزه و تزریق': 'Mechanized Production & Injection Lines',
  'انبارش و بسته‌بندی صادراتی': 'Warehousing & Export Packaging Facility',
  'دفتر مرکزی و بخش بازرگانی': 'Headquarters & Commercial Department',
  'شوروم دائمی و گالری محصولات': 'Permanent Showroom & Product Gallery',
  'کنترل کیفیت و آزمایشگاه فنی': 'Quality Control & Technical Testing Lab',
  'ناوگان لجستیک و ارسال عمده': 'Logistics Fleet & Wholesale Distribution',
  'واحد قالب‌سازی و ماشین‌آلات': 'Molding Facility & Advanced Machinery',
  'مشاهده تمام تصاویر': 'View All Photos',
  'مشاهده لندینگ‌پیج ۳D Coverflow (ویترین بصری سه‌بعدی):': 'Experience 3D Coverflow Landing Page:',
  'ورود به Coverflow Carousel': 'Enter 3D Carousel',
  'طاهری:': 'Taheri:',
  'طاهری': 'Taheri',
};

const PHRASE_DICTIONARY_AR: Record<string, string> = {
  'ثبت سفارش عمده': 'تسجيل طلب بالجملة',
  'ثبت سفارش تلفنی و ارتباط سریع': 'طلب هاتفي وتواصل سريع',
  'سفارش تلفنی و ارتباط سریع': 'طلب هاتفي وتواصل سريع',
  'همه تصاویر': 'جميع الصور',
  'کارخانه و خطوط تولید': 'المصنع وخطوط الإنتاج',
  'دفتر مرکزی': 'المقر الرئيسي',
  'شوروم دائمی': 'المعرض الدائم',
  'شوروم': 'المعرض',
  'کارخانه': 'المصنع',
  'خطوط تولید کارخانه': 'خطوط إنتاج المصنع',
  'مشاهده آلبوم و کاتالوگ': 'عرض الألبوم والكتالوج',
  'مشاهده در گالری کامل': 'عرض في المعرض الكامل',
  'کاتالوگ رسمی': 'الكتالوج الرسمي',
  'دانلود مستقیم کاتالوگ PDF': 'تحميل الكتالوج الرسمي (PDF)',
  'بستن': 'إغلاق',
  'منو': 'القائمة',
  'خانه': 'الرئيسية',
  'صفحه اصلی': 'الرئيسية',
  'دسته‌بندی محصولات': 'فئات المنتجات',
  'تصاویر کارخانه و دفتر': 'معرض المصنع والمقر',
  'تصاویر کارخانه و دفتر مرکزی': 'صور المصنع والمقر الرئيسي',
  'محصولات': 'المنتجات',
  'لیست قیمت': 'قائمة الأسعار',
  'استانداردهای تولید': 'معايير الإنتاج',
  'سوالات متداول': 'الأسئلة الشائعة',
  'دریافت کاتالوگ': 'تحميل الكتالوج',
  'تماس با ما': 'اتصل بنا',
  'بازگشت به خانه': 'العودة للرئيسية',
  'منوی اصلی آراسته چوب': 'قائمة آيديا هوم',
  'منوی اصلی آیدیا هوم': 'قائمة آيديا هوم',
  'مبلمان راحتی و مدرن': 'أثاث الصالون والمعيشة العصري',
  'میزهای عسلی و جلومبلی': 'طاولات القهوة والخدمة',
  'سیستم‌های نورپردازی مدرن': 'أنظمة الإضاءة العصرية',
  'ست‌های کنسول و آینه': 'طاولات وأطقم الكونسول',
  'میز و صندلی غذاخوری': 'طاولات وكراسي تناول الطعام',
  'کارخانه تولیدی آیدیا هوم': 'مصنع آيديا هوم للإنتاج الصناعي',
  'ورود به گالری محصولات': 'الدخول لمعرض المنتجات',
  'مشاهده نمونه محصولات': 'مشاهدة نماذج المنتجات',
  'در حال دریافت تصاویر مجموعه...': 'جارٍ تحميل صور المنشأة...',
  'در حال بارگذاری دسته‌بندی‌های محصولات...': 'جارٍ تحميل فئات المنتجات...',
  'در حال بارگذاری تصاویر ویترین محصولات...': 'جارٍ تحميل صور معرض المنتجات...',
  'جستجوی دسته‌بندی...': 'البحث في الفئات...',
  'تصویر': 'الصورة',
  'از': 'من',
  'عکس': 'صورة',
  'عکس‌های منتخب کارخانه': 'صور مختارة من المصنع',
  'خطوط تولید مکانیزه و تزریق': 'خطوط الإنتاج الآلية وحقن البلاستيك',
  'انبارش و بسته‌بندی صادراتی': 'صالات التخزين والتغليف التصديري',
  'دفتر مرکزی و بخش بازرگانی': 'المقر الرئيسي والإدارة التجارية',
  'شوروم دائمی و گالری محصولات': 'صالة العرض الدائمة ومعرض المنتجات',
  'کنترل کیفیت و آزمایشگاه فنی': 'مختبر مراقبة الجودة والفحص الفني',
  'ناوگان لجستیک و ارسال عمده': 'أسطول النقل اللوجستي وشحن طلبيات الجملة',
  'واحد قالب‌سازی و ماشین‌آلات': 'صالة تصنيع القوالب والآلات المتطورة',
  'مشاهده تمام تصاویر': 'عرض جميع الصور',
  'مشاهده لندینگ‌پیج ۳D Coverflow (ویترین بصری سه‌بعدی):': 'استكشف صفحة الهبوط ثلاثية الأبعاد (Coverflow):',
  'ورود به Coverflow Carousel': 'الدخول للعرض ثلاثي الأبعاد',
  'طاهری:': 'طاهري:',
  'طاهری': 'طاهري',
};

interface ContentContextType {
  content: Record<string, string>;
  draftContent: Record<string, string>;
  isEditorMode: boolean;
  setIsEditorMode: (val: boolean) => void;
  activeEditId: string | null;
  setActiveEditId: (id: string | null) => void;
  hoveredEditId: string | null;
  setHoveredEditId: (id: string | null) => void;
  updateDraftValue: (id: string, value: string) => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  saveAllChanges: () => Promise<boolean>;
  resetField: (id: string) => void;
  resetSection: (sectionKey: string) => void;
  resetAll: () => Promise<void>;
  getText: (id: string, fallback?: string) => string;

  // Multilingual System
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: 'rtl' | 'ltr';

  // Text Size Management
  getTextSize: (id: string) => number;
  setTextSize: (id: string, size: number) => void;
  updateTextSize: (id: string, delta: number) => void;

  // Text Deletion Management
  isFieldDeleted: (id: string) => boolean;
  toggleFieldDeleted: (id: string) => void;
  setFieldDeleted: (id: string, deleted: boolean) => void;

  // Container Deletion Management
  isContainerDeleted: (id: string) => boolean;
  toggleContainerDeleted: (id: string) => void;
  setContainerDeleted: (id: string, deleted: boolean) => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

function getInitialLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'ar' || saved === 'fa') {
        return saved;
      }
    } catch {}
  }
  return 'fa';
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);
  const [content, setContent] = useState<Record<string, string>>(() => ({ ...DEFAULT_SITE_CONTENT }));
  const [draftContent, setDraftContent] = useState<Record<string, string>>(() => ({ ...DEFAULT_SITE_CONTENT }));
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [hoveredEditId, setHoveredEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const dir: 'rtl' | 'ltr' = language === 'en' ? 'ltr' : 'rtl';

  // Synchronize document dir and lang attributes without layout flashes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
    }
  }, [language, dir]);

  // Update language and persist to localStorage
  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      } catch {}
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLang === 'en' ? 'ltr' : 'rtl';
      document.documentElement.lang = newLang;
    }
  }, []);

  // Background check for fresh remote updates from server
  useEffect(() => {
    let isMounted = true;
    contentRepository.getSiteContent().then((loaded) => {
      if (isMounted && loaded && typeof loaded === 'object' && Object.keys(loaded).length > 0) {
        setContent(loaded);
        setDraftContent(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    const draftKeys = Object.keys(draftContent);
    const contentKeys = Object.keys(content);
    const allKeys = new Set([...draftKeys, ...contentKeys]);
    for (const key of allKeys) {
      if ((draftContent[key] ?? '') !== (content[key] ?? '')) {
        return true;
      }
    }
    return false;
  }, [draftContent, content]);

  // Update a single draft value in real-time
  const updateDraftValue = useCallback((id: string, value: string) => {
    const isMetaField =
      id.includes('.__') ||
      id.includes(':');

    const key =
      isMetaField || language === 'fa'
        ? id
        : `${id}:${language}`;

    setDraftContent((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [language]);

  // Save all drafted changes to persistence
  const saveAllChanges = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);

    try {
      const mergedContent = {
        ...content,
        ...draftContent,
      };

      await contentRepository.saveSiteContent(mergedContent);

      setContent(mergedContent);
      setDraftContent(mergedContent);

      return true;

    } catch (e) {
      console.error('Failed to save content changes:', e);
      throw e;

    } finally {
      setIsSaving(false);
    }
  }, [content, draftContent]);

  // Reset a specific field to factory default for current language & reset size/deletion
  const resetField = useCallback((id: string) => {
    setDraftContent((prev) => {
      const updated = { ...prev };
      
      if (language === 'en') {
        const enDefault = DEFAULT_CONTENT_EN[id] || '';
        updated[`${id}:en`] = enDefault;
      } else if (language === 'ar') {
        const arDefault = DEFAULT_CONTENT_AR[id] || '';
        updated[`${id}:ar`] = arDefault;
      } else {
        const def = getContentDefinition(id);
        updated[id] = def ? def.defaultValue : '';
      }
      
      updated[`${id}.__size`] = '';
      updated[`${id}.__deleted`] = 'false';
      updated[`${id}.__hide_container`] = 'false';
      return updated;
    });
  }, [language]);

  // Reset an entire section to factory defaults
  const resetSection = useCallback(async (sectionKey: string) => {
    const { CONTENT_DEFINITIONS } = await import('../data/defaultContent');
    const items = CONTENT_DEFINITIONS.filter((item) => item.sectionKey === sectionKey);
    setDraftContent((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        if (language === 'en') {
          updated[`${item.id}:en`] = DEFAULT_CONTENT_EN[item.id] || '';
        } else if (language === 'ar') {
          updated[`${item.id}:ar`] = DEFAULT_CONTENT_AR[item.id] || '';
        } else {
          updated[item.id] = item.defaultValue;
        }
        delete updated[`${item.id}.__size`];
        delete updated[`${item.id}.__deleted`];
        delete updated[`${item.id}.__hide_container`];
      });
      return updated;
    });
  }, [language]);

  // Reset everything to factory defaults
  const resetAll = useCallback(async () => {
    const res = await contentRepository.resetAll();
    setContent(res);
    setDraftContent(res);
    setActiveEditId(null);
  }, []);

  // Text Size Helpers
  const getTextSize = useCallback(
    (id: string): number => {
      const source = isEditorMode ? draftContent : content;
      const sizeVal = source[`${id}.__size`];
      if (sizeVal !== undefined && sizeVal !== '') {
        const parsed = parseInt(sizeVal, 10);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    },
    [isEditorMode, draftContent, content]
  );

  const setTextSize = useCallback(
    (id: string, size: number) => {
      const clamped = Math.max(-2, Math.min(3, size));
      updateDraftValue(`${id}.__size`, clamped === 0 ? '' : String(clamped));
    },
    [updateDraftValue]
  );

  const updateTextSize = useCallback(
    (id: string, delta: number) => {
      const current = getTextSize(id);
      setTextSize(id, current + delta);
    },
    [getTextSize, setTextSize]
  );

  // Text Deletion Helpers
  const isFieldDeleted = useCallback(
    (id: string): boolean => {
      const source = isEditorMode ? draftContent : content;
      return source[`${id}.__deleted`] === 'true';
    },
    [isEditorMode, draftContent, content]
  );

  const setFieldDeleted = useCallback(
    (id: string, deleted: boolean) => {
      updateDraftValue(`${id}.__deleted`, deleted ? 'true' : 'false');
    },
    [updateDraftValue]
  );

  const toggleFieldDeleted = useCallback(
    (id: string) => {
      const deleted = isFieldDeleted(id);
      setFieldDeleted(id, !deleted);
    },
    [isFieldDeleted, setFieldDeleted]
  );

  // Container / Frame Deletion Helpers
  const isContainerDeleted = useCallback(
    (id: string): boolean => {
      const source = isEditorMode ? draftContent : content;
      return source[`${id}.__hide_container`] === 'true';
    },
    [isEditorMode, draftContent, content]
  );

  const setContainerDeleted = useCallback(
    (id: string, deleted: boolean) => {
      updateDraftValue(`${id}.__hide_container`, deleted ? 'true' : 'false');
    },
    [updateDraftValue]
  );

  const toggleContainerDeleted = useCallback(
    (id: string) => {
      const deleted = isContainerDeleted(id);
      setContainerDeleted(id, !deleted);
    },
    [isContainerDeleted, setContainerDeleted]
  );

  // Read current display text based on active language and editor/public mode
  const getText = useCallback(
    (id: string, fallback?: string): string => {
      const source = isEditorMode ? draftContent : content;

      // Handle cta.catalogButton / cta.downloadButton alias seamlessly
      let resolvedId = id;
      if (id === 'cta.catalogButton' && source['cta.catalogButton'] === undefined && source['cta.downloadButton'] !== undefined) {
        resolvedId = 'cta.downloadButton';
      } else if (id === 'cta.downloadButton' && source['cta.downloadButton'] === undefined && source['cta.catalogButton'] !== undefined) {
        resolvedId = 'cta.catalogButton';
      }

      if (language === 'en') {
        const localizedKey = `${resolvedId}:en`;
        if (source[localizedKey] !== undefined && source[localizedKey].trim() !== '') {
          return source[localizedKey];
        }
        if (DEFAULT_CONTENT_EN[resolvedId] !== undefined) {
          return DEFAULT_CONTENT_EN[resolvedId];
        }
        if (DEFAULT_CONTENT_EN[id] !== undefined) {
          return DEFAULT_CONTENT_EN[id];
        }
        // Check phrase dictionary for key, fallback, or persian default
        if (PHRASE_DICTIONARY_EN[id] !== undefined) {
          return PHRASE_DICTIONARY_EN[id];
        }
        if (fallback && PHRASE_DICTIONARY_EN[fallback] !== undefined) {
          return PHRASE_DICTIONARY_EN[fallback];
        }
        if (source[resolvedId] && PHRASE_DICTIONARY_EN[source[resolvedId]] !== undefined) {
          return PHRASE_DICTIONARY_EN[source[resolvedId]];
        }
        const def = getContentDefinition(resolvedId) || getContentDefinition(id);
        if (def?.defaultValue && PHRASE_DICTIONARY_EN[def.defaultValue] !== undefined) {
          return PHRASE_DICTIONARY_EN[def.defaultValue];
        }
      } else if (language === 'ar') {
        const localizedKey = `${resolvedId}:ar`;
        if (source[localizedKey] !== undefined && source[localizedKey].trim() !== '') {
          return source[localizedKey];
        }
        if (DEFAULT_CONTENT_AR[resolvedId] !== undefined) {
          return DEFAULT_CONTENT_AR[resolvedId];
        }
        if (DEFAULT_CONTENT_AR[id] !== undefined) {
          return DEFAULT_CONTENT_AR[id];
        }
        // Check phrase dictionary for key, fallback, or persian default
        if (PHRASE_DICTIONARY_AR[id] !== undefined) {
          return PHRASE_DICTIONARY_AR[id];
        }
        if (fallback && PHRASE_DICTIONARY_AR[fallback] !== undefined) {
          return PHRASE_DICTIONARY_AR[fallback];
        }
        if (source[resolvedId] && PHRASE_DICTIONARY_AR[source[resolvedId]] !== undefined) {
          return PHRASE_DICTIONARY_AR[source[resolvedId]];
        }
        const def = getContentDefinition(resolvedId) || getContentDefinition(id);
        if (def?.defaultValue && PHRASE_DICTIONARY_AR[def.defaultValue] !== undefined) {
          return PHRASE_DICTIONARY_AR[def.defaultValue];
        }
      }

      // Default Persian language lookup
      if (Object.prototype.hasOwnProperty.call(source, resolvedId)) {
        return source[resolvedId];
      }
      if (fallback !== undefined) {
        return fallback;
      }
      const def = getContentDefinition(resolvedId) || getContentDefinition(id);
      return def ? def.defaultValue : '';
    },
    [isEditorMode, draftContent, content, language]
  );

  const value = useMemo(
    () => ({
      content,
      draftContent,
      isEditorMode,
      setIsEditorMode,
      activeEditId,
      setActiveEditId,
      hoveredEditId,
      setHoveredEditId,
      updateDraftValue,
      hasUnsavedChanges,
      isSaving,
      saveAllChanges,
      resetField,
      resetSection,
      resetAll,
      getText,
      language,
      setLanguage,
      dir,
      getTextSize,
      setTextSize,
      updateTextSize,
      isFieldDeleted,
      toggleFieldDeleted,
      setFieldDeleted,
      isContainerDeleted,
      toggleContainerDeleted,
      setContainerDeleted,
    }),
    [
      content,
      draftContent,
      isEditorMode,
      activeEditId,
      hoveredEditId,
      updateDraftValue,
      hasUnsavedChanges,
      isSaving,
      saveAllChanges,
      resetField,
      resetSection,
      resetAll,
      getText,
      language,
      setLanguage,
      dir,
      getTextSize,
      setTextSize,
      updateTextSize,
      isFieldDeleted,
      toggleFieldDeleted,
      setFieldDeleted,
      isContainerDeleted,
      toggleContainerDeleted,
      setContainerDeleted,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useSiteContent = (): ContentContextType => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a ContentProvider');
  }
  return ctx;
};
