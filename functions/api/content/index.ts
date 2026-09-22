// Cloudflare Pages Function: /api/content
// IDEA HOME - Persistent Website Content API
// Storage: ImageKit JSON / KV Adapter

import { requireAdmin } from '../_auth';

import {
  getSiteContentStore,
  saveSiteContentStore,
  resetSiteContentStore,
  deleteSiteContentKey,
  getDatabaseProviderName
} from '../_db';


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};


// ===============================
// GET CONTENT
// ===============================

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {

  try {

    const content = await getSiteContentStore(env);


    return new Response(
      JSON.stringify(content),
      {
        status:200,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json',
          'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma':'no-cache',
          'X-Database-Provider':getDatabaseProviderName(env)
        }
      }
    );


  } catch(err:any){

    return new Response(
      JSON.stringify({
        error:err.message || 'خطا در دریافت محتوا'
      }),
      {
        status:500,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json'
        }
      }
    );

  }

};




// ===============================
// SAVE / UPDATE CONTENT
// ===============================

export const onRequestPost: PagesFunction<Env> = async ({request,env})=>{


  const auth = await requireAdmin(request,env);

  if(!auth.authenticated){
    return auth.errorResponse!;
  }



  try{


    const body =
      await request.json<Record<string,string>>()
      .catch(()=>null);



    if(!body || typeof body !== 'object'){

      return new Response(
        JSON.stringify({
          error:'داده نامعتبر است'
        }),
        {
          status:400,
          headers:{
            ...corsHeaders,
            'Content-Type':'application/json'
          }
        }
      );

    }



    /*
      مهم:
      فقط کلیدهای ارسال شده تغییر می‌کنند.
      بقیه محتوا حفظ می‌شود.
    */


    const saved =
      await saveSiteContentStore(
        env,
        body
      );



    return new Response(
      JSON.stringify({
        success:true,
        count:Object.keys(saved).length,
        saved
      }),
      {
        status:200,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json',
          'Cache-Control':'no-store'
        }
      }
    );


  }catch(err:any){


    return new Response(
      JSON.stringify({
        error:err.message || 'خطا در ذخیره محتوا'
      }),
      {
        status:500,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json'
        }
      }
    );

  }

};





// ===============================
// DELETE SINGLE CONTENT KEY
// حذف یک کادر یا متن خاص
// ===============================

export const onRequestDelete: PagesFunction<Env> = async ({request,env})=>{


  const auth = await requireAdmin(request,env);

  if(!auth.authenticated){
    return auth.errorResponse!;
  }



  try{


    const url = new URL(request.url);


    const key =
      url.searchParams.get('key');



    // اگر کلید داده شد فقط همان حذف شود
    if(key){


      await deleteSiteContentKey(
        env,
        key
      );


      return new Response(
        JSON.stringify({
          success:true,
          deleted:key
        }),
        {
          status:200,
          headers:{
            ...corsHeaders,
            'Content-Type':'application/json'
          }
        }
      );

    }



    // اگر کلید نبود ریست کامل

    await resetSiteContentStore(env);


    return new Response(
      JSON.stringify({
        success:true,
        message:'تمام محتوا پاک شد'
      }),
      {
        status:200,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json'
        }
      }
    );



  }catch(err:any){


    return new Response(
      JSON.stringify({
        error:err.message || 'خطا در حذف محتوا'
      }),
      {
        status:500,
        headers:{
          ...corsHeaders,
          'Content-Type':'application/json'
        }
      }
    );

  }

};