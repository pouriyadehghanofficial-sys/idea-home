// Content Repository for IDEA HOME (آیدیا هوم)
// Strict Server-Side Persistence Authority:
// Admin → API → Persistent Cloud Storage (ImageKit/KV) → GET /api/content → All Browsers

import { DEFAULT_SITE_CONTENT, getContentDefinition } from '../data/defaultContent';
import { idbSet } from './storage';

const LOCAL_CONTENT_KEY = 'arasteh_site_content_db';

export class ContentRepository {

  private inMemoryCache: Record<string, string> | null = null;


  getInitialContentSync(): Record<string, string> {

    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }

    return { ...DEFAULT_SITE_CONTENT };
  }



  async getSiteContent(): Promise<Record<string, string>> {

    try {

      const res = await fetch(`/api/content?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
      });


      if (res.ok) {

        const remoteData = await res.json();

        if (remoteData && typeof remoteData === 'object') {

          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...remoteData,
          };


          this.inMemoryCache = merged;


          try {

            localStorage.setItem(
              LOCAL_CONTENT_KEY,
              JSON.stringify(merged)
            );

            await idbSet(
              LOCAL_CONTENT_KEY,
              merged
            );

          } catch {}


          return merged;
        }
      }


    } catch (err) {

      console.warn(
        'Server fetch failed:',
        err
      );

    }



    try {

      const local = localStorage.getItem(
        LOCAL_CONTENT_KEY
      );


      if (local) {

        const parsed = JSON.parse(local);


        if (
          parsed &&
          typeof parsed === 'object'
        ) {

          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...parsed,
          };


          this.inMemoryCache = merged;

          return merged;
        }
      }


    } catch {}



    return this.inMemoryCache || {
      ...DEFAULT_SITE_CONTENT
    };

  }




  async saveSiteContent(
    newContent: Record<string,string>
  ): Promise<boolean> {


    const token =
      localStorage.getItem('arasteh_auth_token')
      ||
      'local_session_active';



    // گرفتن آخرین نسخه
    // جلوگیری از پاک شدن کل محتوا
    const current =
      await this.getSiteContent();



    // فقط تغییرات جدید اعمال می‌شوند
    const mergedContent = {

      ...current,
      ...newContent

    };



    const res = await fetch(
      '/api/content',
      {

        method:'POST',

        headers:{

          'Content-Type':'application/json',

          'Cache-Control':'no-store',

          'Authorization':
            `Bearer ${token}`

        },


        body:
          JSON.stringify(
            mergedContent
          )

      }
    );



    if (!res.ok) {

      const err =
        await res.json()
        .catch(()=>({}));


      throw new Error(
        err.error ||
        err.message ||
        'خطا در ذخیره محتوا'
      );

    }



    const data =
      await res.json()
      .catch(()=>({}));


    if(data.success === false){

      throw new Error(
        data.error ||
        'ذخیره محتوا تایید نشد'
      );

    }




    // فقط بعد از موفقیت سرور
    this.inMemoryCache =
      mergedContent;



    try {

      localStorage.setItem(
        LOCAL_CONTENT_KEY,
        JSON.stringify(
          mergedContent
        )
      );


      await idbSet(
        LOCAL_CONTENT_KEY,
        mergedContent
      );


    }catch{}



    return true;

  }





  /**
   * حذف یک کلید مشخص
   */
  async deleteContentKey(
    key:string
  ):Promise<boolean>{


    const current =
      await this.getSiteContent();



    delete current[key];


    await this.saveSiteContent(
      current
    );


    return true;

  }





  async resetField(
    id:string
  ):Promise<string>{


    const def =
      getContentDefinition(id);


    const value =
      def
      ?
      def.defaultValue
      :
      '';



    const current =
      await this.getSiteContent();



    current[id] =
      value;



    await this.saveSiteContent(
      current
    );


    return value;

  }





  async resetSection(
    sectionKey:string
  ):Promise<Record<string,string>>{


    const current =
      await this.getSiteContent();


    const {
      CONTENT_DEFINITIONS
    } =
      await import(
        '../data/defaultContent'
      );



    CONTENT_DEFINITIONS
      .filter(
        item =>
          item.sectionKey === sectionKey
      )
      .forEach(
        item=>{

          current[item.id] =
            item.defaultValue;

        }
      );



    await this.saveSiteContent(
      current
    );


    return current;

  }






  async resetAll():
  Promise<Record<string,string>>{


    const token =
      localStorage.getItem(
        'arasteh_auth_token'
      )
      ||
      'local_session_active';



    const res =
      await fetch(
        '/api/content',
        {

          method:'DELETE',

          headers:{

            'Cache-Control':'no-store',

            'Authorization':
              `Bearer ${token}`

          }

        }
      );



    if(!res.ok){

      throw new Error(
        'خطا در بازنشانی محتوا'
      );

    }



    this.inMemoryCache =
      {
        ...DEFAULT_SITE_CONTENT
      };



    try{

      localStorage.removeItem(
        LOCAL_CONTENT_KEY
      );


      await idbSet(
        LOCAL_CONTENT_KEY,
        DEFAULT_SITE_CONTENT
      );


    }catch{}



    return {
      ...DEFAULT_SITE_CONTENT
    };

  }

}



export const contentRepository =
  new ContentRepository();