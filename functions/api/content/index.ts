// Cloudflare Pages Function: /api/content
// Manages website editable text content in Central Cloud Storage (KV, Supabase, D1)

import { requireAdmin } from '../_auth';
import { getSiteContentStore, saveSiteContentStore, resetSiteContentStore, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const content = await getSiteContentStore(env);
    return new Response(JSON.stringify(content), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=15, s-maxage=30',
        'X-Database-Provider': getDatabaseProviderName(env),
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در بارگذاری محتوای سایت' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Enforce admin authentication for editing content
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json<Record<string, string>>().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'اطلاعات ارسالی نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const saved = await saveSiteContentStore(env, body);
    return new Response(JSON.stringify({ success: true, count: Object.keys(saved).length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ذخیره محتوای وب‌سایت' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    await resetSiteContentStore(env);
    return new Response(JSON.stringify({ success: true, message: 'محتوا به حالت پیش‌فرض بازنشانی شد.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در بازنشانی محتوا' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
