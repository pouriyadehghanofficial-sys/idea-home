// Cloudflare Pages Function: /api/contact
// Handles public customer contact inquiries and admin message reading/updating in Central Cloud Storage

import { requireAdmin } from '../_auth';
import { getContactMessages, saveContactMessage, updateMessageStatus, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication to read messages
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const messages = await getContactMessages(env);

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت پیام‌ها از سرور ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json<any>().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'اطلاعات ارسالی نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const subject = (body.subject || '').trim();
    const message = (body.message || '').trim();
    const email = (body.email || '').trim() || undefined;

    if (!name || !phone || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'لطفاً تمامی فیلدهای الزامی (نام، شماره تماس، موضوع و پیام) را تکمیل فرمایید.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newMsg = await saveContactMessage(env, {
      name,
      phone,
      email,
      subject,
      message,
      productName: body.productName,
      quantity: body.quantity
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'پیام و استعلام شما با موفقیت ثبت شد و کارشناسان کارخانه به زودی با شما تماس خواهند گرفت.',
        id: newMsg.id
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ثبت پیام در سرور' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const body = await request.json<{ id: string; status: 'read' | 'unread' }>().catch(() => null);
    if (!body || !body.id || !body.status) {
      return new Response(JSON.stringify({ error: 'شناسه پیام و وضعیت الزامی است.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updated = await updateMessageStatus(env, body.id, body.status);
    return new Response(JSON.stringify({ success: updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'خطا در به‌روزرسانی پیام' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};