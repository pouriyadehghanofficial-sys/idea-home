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


const PHRASE_DICTIONARY_EN: Record<string,string> = {
  'ثبت سفارش عمده':'Wholesale Order',
  'ثبت سفارش تلفنی و ارتباط سریع':'Phone Order & Quick Contact',
  'سفارش تلفنی و ارتباط سریع':'Phone Order & Quick Contact',
  'همه تصاویر':'All Photos',
  'کارخانه و خطوط تولید':'Factory & Production Lines',
  'دفتر مرکزی':'Headquarters',
  'شوروم دائمی':'Permanent Showroom',
  'شوروم':'Showroom',
  'کارخانه':'Factory',
  'محصولات':'Products',
  'تماس با ما':'Contact Us',
  'دریافت کاتالوگ':'Catalog',
  'خانه':'Home',
  'صفحه اصلی':'Home'
};


const PHRASE_DICTIONARY_AR: Record<string,string> = {
  'ثبت سفارش عمده':'تسجيل طلب بالجملة',
  'ثبت سفارش تلفنی و ارتباط سریع':'طلب هاتفي وتواصل سريع',
  'همه تصاویر':'جميع الصور',
  'کارخانه و خطوط تولید':'المصنع وخطوط الإنتاج',
  'دفتر مرکزی':'المقر الرئيسي',
  'شوروم':'المعرض',
  'کارخانه':'المصنع',
  'محصولات':'المنتجات',
  'تماس با ما':'اتصل بنا',
  'خانه':'الرئيسية'
};


interface ContentContextType {

  content:Record<string,string>;

  draftContent:Record<string,string>;

  isEditorMode:boolean;
  setIsEditorMode:(v:boolean)=>void;

  activeEditId:string|null;
  setActiveEditId:(v:string|null)=>void;

  hoveredEditId:string|null;
  setHoveredEditId:(v:string|null)=>void;


  updateDraftValue:(id:string,value:string)=>void;


  hasUnsavedChanges:boolean;

  isSaving:boolean;


  saveAllChanges:()=>Promise<boolean>;


  resetField:(id:string)=>void;

  resetSection:(key:string)=>void;

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
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );


      if(
        saved==='fa' ||
        saved==='en' ||
        saved==='ar'
      ){

        return saved;

      }


    }catch{}

  }


  return 'fa';

}



export const ContentProvider:
React.FC<{children:React.ReactNode}>
=
({children})=>{


const [language,setLanguageState] =
useState<SupportedLanguage>(
  getInitialLanguage
);


const [content,setContent] =
useState<Record<string,string>>(
 {...DEFAULT_SITE_CONTENT}
);


const [draftContent,setDraftContent] =
useState<Record<string,string>>(
 {...DEFAULT_SITE_CONTENT}
);



const [isEditorMode,setIsEditorMode] =
useState(false);


const [activeEditId,setActiveEditId] =
useState<string|null>(null);


const [hoveredEditId,setHoveredEditId] =
useState<string|null>(null);


const [isSaving,setIsSaving] =
useState(false);



const dir =
language==='en'
?'ltr'
:'rtl';



useEffect(()=>{

 if(typeof document!=='undefined'){

  document.documentElement.dir=dir;

  document.documentElement.lang=language;

 }

},[dir,language]);



useEffect(()=>{

 let mounted=true;


 contentRepository
 .getSiteContent()
 .then((loaded)=>{


  if(
   mounted &&
   loaded &&
   typeof loaded==='object'
  ){

   setContent(loaded);

   setDraftContent(loaded);

  }


 });


 return ()=>{

  mounted=false;

 };


},[]);



const setLanguage =
useCallback(
(lang:SupportedLanguage)=>{


 setLanguageState(lang);


 try{

  localStorage.setItem(
   LANGUAGE_STORAGE_KEY,
   lang
  );

 }catch{}



},
[]
);



const updateDraftValue =
useCallback(
(id:string,value:string)=>{


 setDraftContent(prev=>({

  ...prev,

  [id]:value

 }));


},
[]
);



const hasUnsavedChanges =
useMemo(()=>{


const keys =
new Set([
 ...Object.keys(content),
 ...Object.keys(draftContent)
]);


for(const key of keys){

 if(
  content[key] !==
  draftContent[key]
 ){

  return true;

 }

}


return false;


},[
content,
draftContent
]);



const saveAllChanges =
useCallback(
async()=>{


setIsSaving(true);


try{


const merged={

 ...content,

 ...draftContent

};


await contentRepository.saveSiteContent(
 merged
);


setContent(merged);

setDraftContent(merged);


return true;


}
finally{


setIsSaving(false);


}



},
[
content,
draftContent
]
);


const resetField =
useCallback(
(id:string)=>{


setDraftContent(prev=>{

 const updated={
  ...prev
 };


 const def =
 getContentDefinition(id);


 updated[id] =
 def
 ? def.defaultValue
 : '';


 updated[`${id}.__size`] = '';

 updated[`${id}.__deleted`] = 'false';

 updated[`${id}.__hide_container`] = 'false';


 return updated;


});


},
[]
);



const resetSection =
useCallback(
async(sectionKey:string)=>{


const {
 CONTENT_DEFINITIONS
}
=
await import(
'../data/defaultContent'
);


setDraftContent(prev=>{


const updated={
 ...prev
};


CONTENT_DEFINITIONS
.filter(
 item=>item.sectionKey===sectionKey
)
.forEach(item=>{


 updated[item.id]=
 item.defaultValue;


 delete updated[
 `${item.id}.__size`
 ];


 delete updated[
 `${item.id}.__deleted`
 ];


 delete updated[
 `${item.id}.__hide_container`
 ];


});


return updated;


});


},
[]
);



const resetAll =
useCallback(
async()=>{


const res =
await contentRepository.resetAll();


setContent(res);

setDraftContent(res);

setActiveEditId(null);


},
[]
);



const getTextSize =
useCallback(
(id:string)=>{


const source =
isEditorMode
?draftContent
:content;


const value =
source[
 `${id}.__size`
];


if(!value){

 return 0;

}


const parsed =
parseInt(
 value,
10
);


return isNaN(parsed)
?0
:parsed;


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


const clamped =
Math.max(
-2,
Math.min(
3,
size
)
);


updateDraftValue(
 `${id}.__size`,
 clamped===0
 ?''
 :String(clamped)
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
setTextSize,
getTextSize
]
);



const isFieldDeleted =
useCallback(
(id:string)=>{


const source =
isEditorMode
?draftContent
:content;


return (
 source[
 `${id}.__deleted`
 ]
 ==='true'
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
(id:string,deleted:boolean)=>{


updateDraftValue(
 `${id}.__deleted`,
 deleted
 ?'true'
 :'false'
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
?draftContent
:content;


return (
 source[
 `${id}.__hide_container`
 ]
 ==='true'
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
(id:string,deleted:boolean)=>{


updateDraftValue(
 `${id}.__hide_container`,
 deleted
 ?'true'
 :'false'
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
(id:string,fallback?:string)=>{


const source =
isEditorMode
?draftContent
:content;



if(
 Object.prototype.hasOwnProperty.call(
  source,
  id
 )
){

 return source[id];

}



if(language==='en'){

 if(DEFAULT_CONTENT_EN[id]){

  return DEFAULT_CONTENT_EN[id];

 }


 if(PHRASE_DICTIONARY_EN[id]){

  return PHRASE_DICTIONARY_EN[id];

 }

}



if(language==='ar'){

 if(DEFAULT_CONTENT_AR[id]){

  return DEFAULT_CONTENT_AR[id];

 }


 if(PHRASE_DICTIONARY_AR[id]){

  return PHRASE_DICTIONARY_AR[id];

 }

}



if(fallback){

 return fallback;

}



const def =
getContentDefinition(id);


return def
?def.defaultValue
:'';


},
[
isEditorMode,
draftContent,
content,
language
]
);



const value =
useMemo(
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

setContainerDeleted


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
isFieldDeleted,
isContainerDeleted
]
);



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
