import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';

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
  'ورود به Coverflow Carousel': 'Enter 3D Carousel',
  'طاهری:': 'Taheri:',
  'طاهری': 'Taheri',
};


const PHRASE_DICTIONARY_AR: Record<string,string> = {
  'ثبت سفارش عمده':'تسجيل طلب بالجملة',
  'ثبت سفارش تلفنی و ارتباط سریع':'طلب هاتفي وتواصل سريع',
  'سفارش تلفنی و ارتباط سریع':'طلب هاتفي وتواصل سريع',
  'همه تصاویر':'جميع الصور',
  'کارخانه و خطوط تولید':'المصنع وخطوط الإنتاج',
  'دفتر مرکزی':'المقر الرئيسي',
  'شوروم دائمی':'المعرض الدائم',
  'شوروم':'المعرض',
  'کارخانه':'المصنع',
  'خطوط تولید کارخانه':'خطوط إنتاج المصنع',
  'مشاهده آلبوم و کاتالوگ':'عرض الألبوم والكتالوج',
  'کاتالوگ رسمی':'الكتالوج الرسمي',
  'دانلود مستقیم کاتالوگ PDF':'تحميل الكتالوج الرسمي (PDF)',
  'بستن':'إغلاق',
  'منو':'القائمة',
  'خانه':'الرئيسية',
  'محصولات':'المنتجات',
  'لیست قیمت':'قائمة الأسعار',
  'تماس با ما':'اتصل بنا',
  'دریافت کاتالوگ':'تحميل الكتالوج',
};


interface ContentContextType {

  content: Record<string,string>;
  draftContent: Record<string,string>;

  isEditorMode:boolean;
  setIsEditorMode:(val:boolean)=>void;

  activeEditId:string|null;
  setActiveEditId:(id:string|null)=>void;

  hoveredEditId:string|null;
  setHoveredEditId:(id:string|null)=>void;


  updateDraftValue:(id:string,value:string)=>void;

  hasUnsavedChanges:boolean;

  isSaving:boolean;

  saveAllChanges:()=>Promise<boolean>;

  resetField:(id:string)=>void;

  resetSection:(sectionKey:string)=>void;

  resetAll:()=>Promise<void>;

  getText:(id:string,fallback?:string)=>string;


  language:SupportedLanguage;

  setLanguage:(lang:SupportedLanguage)=>void;

  dir:'rtl'|'ltr';


  getTextSize:(id:string)=>number;

  setTextSize:(id:string,size:number)=>void;

  updateTextSize:(id:string,delta:number)=>void;


  isFieldDeleted:(id:string)=>boolean;

  toggleFieldDeleted:(id:string)=>void;

  setFieldDeleted:(id:string,deleted:boolean)=>void;


  isContainerDeleted:(id:string)=>boolean;

  toggleContainerDeleted:(id:string)=>void;

  setContainerDeleted:(id:string,deleted:boolean)=>void;

}


const ContentContext =
createContext<ContentContextType|null>(null);



function getInitialLanguage():SupportedLanguage {

  if(typeof window !== 'undefined'){

    try{

      const saved =
      localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if(saved==='en'||saved==='ar'||saved==='fa'){
        return saved;
      }

    }catch{}

  }

  return 'fa';

}



export const ContentProvider:
React.FC<{children:React.ReactNode}> =
({children})=>{


const [language,setLanguageState] =
useState<SupportedLanguage>(getInitialLanguage);



const [content,setContent] =
useState<Record<string,string>>({});


const [draftContent,setDraftContent] =
useState<Record<string,string>>({});


const [isContentLoaded,setIsContentLoaded] =
useState(false);



const [isEditorMode,setIsEditorMode] =
useState(false);


const [activeEditId,setActiveEditId] =
useState<string|null>(null);


const [hoveredEditId,setHoveredEditId] =
useState<string|null>(null);


const [isSaving,setIsSaving] =
useState(false);



const dir =
language==='en'?'ltr':'rtl';



useEffect(()=>{

 if(typeof document!=='undefined'){

  document.documentElement.dir=dir;
  document.documentElement.lang=language;

 }

},[language,dir]);



useEffect(()=>{

 let mounted=true;


 contentRepository
 .getSiteContent()
 .then((loaded)=>{


  if(
   mounted &&
   loaded &&
   typeof loaded==='object' &&
   Object.keys(loaded).length>0
  ){

    setContent(loaded);

    setDraftContent(loaded);

    setIsContentLoaded(true);

  }


 });


 return ()=>{

  mounted=false;

 };


  const hasUnsavedChanges = useMemo(()=>{

    const allKeys = new Set([
      ...Object.keys(content),
      ...Object.keys(draftContent)
    ]);


    for(const key of allKeys){

      if(
        (content[key] ?? '') !==
        (draftContent[key] ?? '')
      ){

        return true;

      }

    }


    return false;


  },[content,draftContent]);




  const updateDraftValue = useCallback(
    (id:string,value:string)=>{


      const isMeta =
      id.includes('.__') ||
      id.includes(':');


      const key =
      isMeta || language==='fa'
      ? id
      : `${id}:${language}`;



      setDraftContent(prev=>({

        ...prev,

        [key]:value

      }));



    },
    [language]
  );





  const saveAllChanges =
  useCallback(async()=>{


    setIsSaving(true);


    try{


      const merged = {

        ...content,

        ...draftContent

      };


      await contentRepository.saveSiteContent(
        merged
      );


      setContent(merged);

      setDraftContent(merged);


      return true;


    }catch(error){


      console.error(
        'Save failed:',
        error
      );


      throw error;


    }finally{


      setIsSaving(false);


    }


  },[
    content,
    draftContent
  ]);





  const getTextSize =
  useCallback(
    (id:string)=>{


      const source =
      isEditorMode
      ? draftContent
      : content;



      const value =
      source[`${id}.__size`];



      if(value){

        const parsed =
        parseInt(value,10);


        return isNaN(parsed)
        ? 0
        : parsed;

      }


      return 0;


    },
    [
      isEditorMode,
      draftContent,
      content
    ]
  );




  const setTextSize =
  useCallback(
    (id:string,size:number)=>{


      const fixed =
      Math.max(
        -2,
        Math.min(3,size)
      );


      updateDraftValue(
        `${id}.__size`,
        fixed===0
        ? ''
        : String(fixed)
      );


    },
    [
      updateDraftValue
    ]
  );





  const updateTextSize =
  useCallback(
    (id:string,delta:number)=>{


      setTextSize(
        id,
        getTextSize(id)+delta
      );


    },
    [
      getTextSize,
      setTextSize
    ]
  );





  const isFieldDeleted =
  useCallback(
    (id:string)=>{


      const source =
      isEditorMode
      ? draftContent
      : content;



      return (
        source[`${id}.__deleted`]
        === 'true'
      );


    },
    [
      isEditorMode,
      draftContent,
      content
    ]
  );





  const setFieldDeleted =
  useCallback(
    (
      id:string,
      deleted:boolean
    )=>{


      updateDraftValue(
        `${id}.__deleted`,
        deleted
        ? 'true'
        : 'false'
      );


    },
    [
      updateDraftValue
    ]
  );





  const toggleFieldDeleted =
  useCallback(
    (id:string)=>{


      setFieldDeleted(
        id,
        !isFieldDeleted(id)
      );


    },
    [
      isFieldDeleted,
      setFieldDeleted
    ]
  );





  const isContainerDeleted =
  useCallback(
    (id:string)=>{


      const source =
      isEditorMode
      ? draftContent
      : content;



      return (
        source[`${id}.__hide_container`]
        === 'true'
      );


    },
    [
      isEditorMode,
      draftContent,
      content
    ]
  );





  const setContainerDeleted =
  useCallback(
    (
      id:string,
      deleted:boolean
    )=>{


      updateDraftValue(
        `${id}.__hide_container`,
        deleted
        ? 'true'
        : 'false'
      );


    },
    [
      updateDraftValue
    ]
  );





  const toggleContainerDeleted =
  useCallback(
    (id:string)=>{


      setContainerDeleted(
        id,
        !isContainerDeleted(id)
      );


    },
    [
      isContainerDeleted,
      setContainerDeleted
    ]
  );





  const getText =
  useCallback(
    (
      id:string,
      fallback?:string
    ):string=>{


      const source =
      isEditorMode
      ? draftContent
      : content;



      let resolvedId=id;



      if(
        language==='en'
      ){


        const key =
        `${resolvedId}:en`;



        if(
          source[key]
        ){

          return source[key];

        }



        if(
          DEFAULT_CONTENT_EN[resolvedId]
        ){

          return DEFAULT_CONTENT_EN[resolvedId];

        }



        if(
          PHRASE_DICTIONARY_EN[id]
        ){

          return PHRASE_DICTIONARY_EN[id];

        }


      }




      if(
        language==='ar'
      ){


        const key =
        `${resolvedId}:ar`;



        if(
          source[key]
        ){

          return source[key];

        }



        if(
          DEFAULT_CONTENT_AR[resolvedId]
        ){

          return DEFAULT_CONTENT_AR[resolvedId];

        }



        if(
          PHRASE_DICTIONARY_AR[id]
        ){

          return PHRASE_DICTIONARY_AR[id];

        }


      }




      if(
        source[resolvedId] !== undefined
      ){

        return source[resolvedId];

      }



      if(fallback){

        return fallback;

      }



      const def =
      getContentDefinition(
        resolvedId
      );


      return def
      ? def.defaultValue
      : '';



    },
    [
      isEditorMode,
      draftContent,
      content,
      language
    ]
  );






  const value = useMemo(
    ()=>({


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


      getText,


      language,

      setLanguage:(lang:SupportedLanguage)=>{

        setLanguageState(lang);

        localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          lang
        );

      },


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


      resetField:()=>{},

      resetSection:()=>{},

      resetAll:async()=>{}


    }),
    [
      content,
      draftContent,
      isEditorMode,
      activeEditId,
      hoveredEditId,
      hasUnsavedChanges,
      isSaving,
      language,
      dir,
      getText,
      getTextSize,
      setTextSize,
      updateTextSize,
      isFieldDeleted,
      isContainerDeleted
    ]
  );





  if(!isContentLoaded){

    return null;

  }





  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );

};





export const useSiteContent =
():ContentContextType=>{


  const ctx =
  useContext(ContentContext);



  if(!ctx){

    throw new Error(
      'useSiteContent must be used within ContentProvider'
    );

  }



  return ctx;


};

},[]);
