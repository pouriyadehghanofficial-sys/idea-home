// Cloudflare Pages Function: /api/catalog
// Manages digital PDF catalog metadata in Central Cloud Storage (KV, Supabase, Firebase, or D1)

import { requireAdmin } from '../_auth';
import { getCatalogInfo, saveCatalogInfo, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const catalog = await getCatalogInfo(env);

    return new Response(JSON.stringify(catalog), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت اطلاعات کاتالوگ' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json<any>().catch(() => null);
    if (!body || !body.fileUrl) {
      return new Response(
        JSON.stringify({ error: 'آدرس یا فایل کاتالوگ (PDF) الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updated = await saveCatalogInfo(env, body);

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ثبت اطلاعات کاتالوگ در پایگاه داده مرکزی' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};