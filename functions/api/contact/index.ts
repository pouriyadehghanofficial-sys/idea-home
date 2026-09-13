// Cloudflare Pages Function: /api/contact
// Handles public customer contact inquiries and admin message reading/updating in Central Cloud Storage

import { requireAdmin } from '../_auth';
import { getContactMessages, saveContactMessage, updateMessageStatus, getDatabaseProviderName } from '../_db';

async function sendResendNotification(
  env: Env,
  data: {
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    productName?: string;
    quantity?: string;
  }
) {
  const apiKey = env.RESEND_API_KEY;
  const toEmail = env.NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn('[Resend] Missing API key or notification email');
    return;
  }

  const fromEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
  <div dir="rtl" style="font-family:Tahoma,Arial;background:#f5f7fa;padding:25px">
    <div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:12px">
      
      <h2 style="color:#1E4B57">
        درخواست جدید از سایت آیدیا هوم
      </h2>

      <hr/>

      <p><b>نام:</b> ${data.name}</p>

      <p>
        <b>شماره تماس:</b>
        <a href="tel:${data.phone}">
          ${data.phone}
        </a>
      </p>

      ${
        data.email
          ? `<p><b>ایمیل:</b> ${data.email}</p>`
          : ''
      }

      <p><b>موضوع:</b> ${data.subject}</p>

      ${
        data.productName
          ? `<p><b>محصول:</b> ${data.productName}</p>`
          : ''
      }

      ${
        data.quantity
          ? `<p><b>تعداد:</b> ${data.quantity}</p>`
          : ''
      }

      <div style="
        margin-top:20px;
        padding:15px;
        background:#f8fafc;
        border-right:4px solid #C9A24B;
      ">
        <b>پیام مشتری:</b>
        <p style="white-space:pre-wrap">
          ${data.message}
        </p>
      </div>

    </div>
  </div>
  `;


  try {

    const response = await fetch(
      'https://api.resend.com/emails',
      {
        method:'POST',

        headers:{
          'Authorization':`Bearer ${apiKey}`,
          'Content-Type':'application/json'
        },

        body:JSON.stringify({

          from:fromEmail,

          to:[
            toEmail
          ],

          subject:
          `درخواست جدید سایت - ${data.name}`,

          html

        })
      }
    );


    if(!response.ok){

      const error =
        await response.text();

      console.error(
        '[Resend Error]',
        error
      );

    }


  } catch(error){

    console.error(
      '[Resend Failed]',
      error
    );

  }

}



export const onRequestGet: PagesFunction<Env> = async (context) => {

  const { request, env } = context;


  const auth = await requireAdmin(request, env);

  if (!auth.authenticated) {

    return auth.errorResponse!;

  }


  try {

    const messages =
      await getContactMessages(env);


    return new Response(
      JSON.stringify(messages),
      {
        status:200,

        headers:{
          'Content-Type':'application/json',
          'Cache-Control':'no-store',
          'X-Database-Provider':
          getDatabaseProviderName(env)
        }
      }
    );


  } catch(err:any){

    return new Response(
      JSON.stringify({
        error:
        err.message ||
        'خطا در دریافت پیام‌ها'
      }),
      {
        status:500,
        headers:{
          'Content-Type':'application/json'
        }
      }
    );

  }

};



export const onRequestPost: PagesFunction<Env> = async (context)=>{

  const {
    request,
    env
  } = context;


  try {


    const body =
      await request.json<any>()
      .catch(()=>null);



    if(!body){

      return new Response(
        JSON.stringify({
          error:'اطلاعات ارسالی نامعتبر است.'
        }),
        {
          status:400,
          headers:{
            'Content-Type':'application/json'
          }
        }
      );

    }



    const name =
      (body.name || '').trim();


    const phone =
      (body.phone || '').trim();


    const subject =
      (body.subject || '').trim();


    const message =
      (body.message || '').trim();


    const email =
      (body.email || '').trim() || undefined;



    if(
      !name ||
      !phone ||
      !subject ||
      !message
    ){

      return new Response(
        JSON.stringify({
          error:
          'لطفاً تمامی فیلدهای الزامی را تکمیل کنید.'
        }),
        {
          status:400,
          headers:{
            'Content-Type':'application/json'
          }
        }
      );

    }



    const newMsg =
      await saveContactMessage(
        env,
        {
          name,
          phone,
          email,
          subject,
          message,
          productName:
          body.productName,

          quantity:
          body.quantity
        }
      );



    // ارسال ایمیل بعد از ذخیره موفق
    const emailPromise =
      sendResendNotification(
        env,
        {
          name,
          phone,
          email,
          subject,
          message,
          productName:
          body.productName,

          quantity:
          body.quantity
        }
      );


    if(context.waitUntil){

      context.waitUntil(
        emailPromise
      );

    }else{

      await emailPromise;

    }




    return new Response(
      JSON.stringify({

        success:true,

        message:
        'پیام شما ثبت شد و کارشناسان به زودی تماس خواهند گرفت.',

        id:newMsg.id

      }),
      {
        status:201,

        headers:{
          'Content-Type':'application/json'
        }

      }
    );



  }catch(err:any){


    return new Response(

      JSON.stringify({

        error:
        err.message ||
        'خطا در ثبت پیام'

      }),

      {
        status:500,

        headers:{
          'Content-Type':'application/json'
        }
      }

    );

  }

};



export const onRequestPut: PagesFunction<Env> = async (context)=>{

  const {
    request,
    env
  } = context;



  const auth =
    await requireAdmin(
      request,
      env
    );


  if(!auth.authenticated)
    return auth.errorResponse!;



  try{


    const body =
      await request.json<{
        id:string;
        status:'read'|'unread'
      }>()
      .catch(()=>null);



    if(
      !body ||
      !body.id ||
      !body.status
    ){

      return new Response(
        JSON.stringify({
          error:
          'شناسه پیام و وضعیت الزامی است.'
        }),
        {
          status:400,
          headers:{
            'Content-Type':'application/json'
          }
        }
      );

    }



    const updated =
      await updateMessageStatus(
        env,
        body.id,
        body.status
      );



    return new Response(
      JSON.stringify({
        success:updated
      }),
      {
        status:200,
        headers:{
          'Content-Type':'application/json'
        }
      }
    );


  }catch(err:any){


    return new Response(

      JSON.stringify({

        error:
        err.message ||
        'خطا در بروزرسانی پیام'

      }),

      {
        status:500,

        headers:{
          'Content-Type':'application/json'
        }
      }

    );

  }

};
