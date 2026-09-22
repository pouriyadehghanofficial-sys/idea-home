// Cloudflare Pages Function: /api/company-photos
// Manages Factory and Office photos in Central Cloud Storage

import { requireAdmin } from '../_auth';
import { getCompanyPhotosStore, saveCompanyPhotosStore, saveSingleCompanyPhoto, getDatabaseProviderName } from '../_db';
import { CompanyPhoto } from '../../src/types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const photos = await getCompanyPhotosStore(env);

    return new Response(JSON.stringify(photos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت تصاویر از سرور ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json<any>().catch(() => null);

    if (!body) {
      return new Response(
        JSON.stringify({ error: 'داده ارسالی نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (Array.isArray(body)) {
      const saved = await saveCompanyPhotosStore(env, body as CompanyPhoto[]);
      return new Response(JSON.stringify({ success: true, items: saved }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Database-Provider': getDatabaseProviderName(env)
        }
      });
    }

    const savedSingle = await saveSingleCompanyPhoto(env, body);
    return new Response(JSON.stringify(savedSingle), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ذخیره تصاویر روی سرور' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
