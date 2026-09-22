// Cloudflare Pages Function: /api/contact
// Handles public customer contact inquiries and admin message reading/updating.

import { requireAdmin } from '../_auth';
import {
  getContactMessages,
  saveContactMessage,
  updateMessageStatus,
  getDatabaseProviderName,
} from '../_db';

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  productName?: string;
  quantity?: string;
}

/**
 * Send a notification email through Resend.
 *
 * IMPORTANT:
 * This function throws when Resend fails.
 * The caller must await it before returning success.
 */
async function sendResendNotification(
  env: Env,
  data: ContactFormData
): Promise<void> {
  const apiKey = env.RESEND_API_KEY;
  const toEmail = env.NOTIFICATION_EMAIL;

  if (!apiKey) {
    throw new Error(
      'RESEND_API_KEY در تنظیمات Cloudflare تعریف نشده است.'
    );
  }

  if (!toEmail) {
    throw new Error(
      'NOTIFICATION_EMAIL در تنظیمات Cloudflare تعریف نشده است.'
    );
  }

  const fromEmail =
    env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const emailSubject =
    `درخواست جدید همکاری و استعلام قیمت - ${data.name}`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7f6;
  font-family:Tahoma,Arial,sans-serif;
  color:#1e293b;
">

  <div style="padding:30px 15px;">

    <div style="
      max-width:650px;
      margin:0 auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      border:1px solid #e2e8f0;
    ">

      <div style="
        background:#1E4B57;
        color:#ffffff;
        padding:24px;
        text-align:center;
      ">

        <h2 style="
          margin:0;
          font-size:20px;
        ">
          درخواست همکاری و استعلام قیمت جدید
        </h2>

        <p style="
          margin:8px 0 0;
          font-size:13px;
          opacity:.9;
        ">
          ثبت شده از طریق وب‌سایت آیدیا هوم
        </p>

      </div>

      <div style="padding:25px;">

        <table style="
          width:100%;
          border-collapse:collapse;
          font-size:14px;
        ">

          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
              width:35%;
            ">
              نام و نام خانوادگی
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
            ">
              ${escapeHtml(data.name)}
            </td>
          </tr>

          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
            ">
              شماره تماس
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              direction:ltr;
              text-align:right;
            ">

              <a
                href="tel:${escapeHtml(data.phone)}"
                style="
                  color:#0284c7;
                  text-decoration:none;
                  font-weight:bold;
                "
              >
                ${escapeHtml(data.phone)}
              </a>

            </td>
          </tr>

          ${
            data.email
              ? `
          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
            ">
              ایمیل
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
            ">
              ${escapeHtml(data.email)}
            </td>
          </tr>
          `
              : ''
          }

          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
            ">
              موضوع
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
            ">
              ${escapeHtml(data.subject)}
            </td>
          </tr>

          ${
            data.productName
              ? `
          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
            ">
              محصول
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
            ">
              ${escapeHtml(data.productName)}
            </td>
          </tr>
          `
              : ''
          }

          ${
            data.quantity
              ? `
          <tr>
            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
              font-weight:bold;
            ">
              تعداد
            </td>

            <td style="
              padding:12px 0;
              border-bottom:1px solid #e2e8f0;
            ">
              ${escapeHtml(data.quantity)}
            </td>
          </tr>
          `
              : ''
          }

        </table>

        <div style="
          margin-top:25px;
          padding:18px;
          background:#f8fafc;
          border-right:4px solid #C9A24B;
          border-radius:6px;
        ">

          <div style="
            font-weight:bold;
            margin-bottom:10px;
          ">
            پیام مشتری
          </div>

          <div style="
            white-space:pre-wrap;
            line-height:1.8;
          ">
            ${escapeHtml(data.message)}
          </div>

        </div>

      </div>

      <div style="
        background:#f1f5f9;
        padding:15px;
        text-align:center;
        font-size:12px;
        color:#64748b;
      ">
        این ایمیل به صورت خودکار از وب‌سایت آیدیا هوم ارسال شده است.
      </div>

    </div>

  </div>

</body>
</html>
`;

  try {
    console.log('[Resend] Sending notification email', {
      toEmail,
      fromEmail,
    });

    const response = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: emailSubject,
          html: htmlBody,
        }),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        '[Resend Error]',
        response.status,
        responseText
      );

      throw new Error(
        `Resend API خطا داد (${response.status}).`
      );
    }

    let resendResult: any = null;

    try {
      resendResult = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      // Resend normally returns JSON.
      // A successful HTTP status is still considered successful.
    }

    console.log(
      '[Resend] Email accepted successfully',
      {
        id: resendResult?.id || null,
      }
    );

  } catch (error) {
    console.error(
      '[Resend Error]',
      error instanceof Error
        ? error.message
        : error
    );

    throw error instanceof Error
      ? error
      : new Error('ارسال ایمیل از طریق Resend انجام نشد.');
  }
}


/**
 * Escape user-provided text before inserting it into HTML email.
 */
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


/**
 * GET /api/contact
 * Admin only.
 */
export const onRequestGet: PagesFunction<Env> = async (
  context
) => {

  const { request, env } = context;

  const auth = await requireAdmin(
    request,
    env
  );

  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {

    const messages =
      await getContactMessages(env);

    return new Response(
      JSON.stringify(messages),
      {
        status: 200,

        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'no-store',

          'X-Database-Provider':
            getDatabaseProviderName(env),
        },
      }
    );

  } catch (err: any) {

    return new Response(
      JSON.stringify({
        error:
          err?.message ||
          'خطا در دریافت پیام‌ها از سرور ابری',
      }),
      {
        status: 500,

        headers: {
          'Content-Type':
            'application/json',
        },
      }
    );

  }
};


/**
 * POST /api/contact
 * Public customer form.
 */
export const onRequestPost: PagesFunction<Env> = async (
  context
) => {

  const { request, env } = context;

  try {

    const body =
      await request
        .json<any>()
        .catch(() => null);

    if (!body) {

      return new Response(
        JSON.stringify({
          error:
            'اطلاعات ارسالی نامعتبر است.',
        }),
        {
          status: 400,

          headers: {
            'Content-Type':
              'application/json',
          },
        }
      );

    }

    const name =
      String(body.name || '').trim();

    const phone =
      String(body.phone || '').trim();

    const subject =
      String(body.subject || '').trim();

    const message =
      String(body.message || '').trim();

    const email =
      String(body.email || '').trim() ||
      undefined;

    if (
      !name ||
      !phone ||
      !subject ||
      !message
    ) {

      return new Response(
        JSON.stringify({
          error:
            'لطفاً تمامی فیلدهای الزامی (نام، شماره تماس، موضوع و پیام) را تکمیل فرمایید.',
        }),
        {
          status: 400,

          headers: {
            'Content-Type':
              'application/json',
          },
        }
      );

    }

    const productName =
      body.productName
        ? String(body.productName).trim()
        : undefined;

    const quantity =
      body.quantity
        ? String(body.quantity).trim()
        : undefined;


    /*
     * 1. Save the customer's request.
     */
    const newMsg =
      await saveContactMessage(
        env,
        {
          name,
          phone,
          email,
          subject,
          message,
          productName,
          quantity,
        }
      );


    /*
     * 2. Send email notification and WAIT for Resend.
     *
     * IMPORTANT:
     * We intentionally do NOT use context.waitUntil()
     * here because the API must know whether Resend
     * actually accepted the email before returning success.
     */
    await sendResendNotification(
      env,
      {
        name,
        phone,
        email,
        subject,
        message,
        productName,
        quantity,
      }
    );


    /*
     * 3. Only return success after Resend succeeds.
     */
    return new Response(
      JSON.stringify({
        success: true,

        message:
          'پیام و استعلام شما با موفقیت ثبت شد و کارشناسان کارخانه به زودی با شما تماس خواهند گرفت.',

        id: newMsg.id,
      }),
      {
        status: 201,

        headers: {
          'Content-Type':
            'application/json',
        },
      }
    );

  } catch (err: any) {

    console.error(
      '[Contact API Error]',
      err
    );

    return new Response(
      JSON.stringify({
        success: false,

        error:
          err?.message ||
          'خطا در ثبت پیام یا ارسال ایمیل. لطفاً دوباره تلاش کنید.',
      }),
      {
        status: 500,

        headers: {
          'Content-Type':
            'application/json',
        },
      }
    );

  }
};


/**
 * PUT /api/contact
 * Admin only - update message status.
 */
export const onRequestPut: PagesFunction<Env> = async (
  context
) => {

  const { request, env } = context;

  const auth =
    await requireAdmin(
      request,
      env
    );

  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {

    const body =
      await request
        .json<{
          id: string;
          status: 'read' | 'unread';
        }>()
        .catch(() => null);

    if (
      !body ||
      !body.id ||
      !body.status
    ) {

      return new Response(
        JSON.stringify({
          error:
            'شناسه پیام و وضعیت الزامی است.',
        }),
        {
          status: 400,

          headers: {
            'Content-Type':
              'application/json',
          },
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
        success: updated,
      }),
      {
        status: 200,

        headers: {
          'Content-Type':
            'application/json',
        },
      }
    );

  } catch (err: any) {

    return new Response(
      JSON.stringify({
        error:
          err?.message ||
          'خطا در به‌روزرسانی پیام',
      }),
      {
        status: 500,

        headers: {
          'Content-Type':
            'application/json',
        },
      }
    );

  }
};