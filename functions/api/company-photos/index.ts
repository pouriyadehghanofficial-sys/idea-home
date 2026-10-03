// Cloudflare Pages Function: /api/company-photos
// Manages Factory and Office photos in Central Cloud Storage

import { requireAdmin } from '../_auth';
import { getCompanyPhotosStore, saveCompanyPhotosStore, saveSingleCompanyPhoto, deleteCompanyPhotoStore, getDatabaseProviderName } from '../_db';
import { CompanyPhoto } from '../../src/types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const photos = await getCompanyPhotosStore(env);

    return new Response(JSON.stringify(photos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
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

// DELETE /api/company-photos?id=PHOTO_ID  (یا ارسال id در بدنه JSON)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await request.json<any>().catch(() => null);
      if (body && typeof body.id === 'string') id = body.id;
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'شناسه تصویر نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deleted = await deleteCompanyPhotoStore(env, id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ error: 'تصویر یافت نشد یا قبلاً حذف شده است.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف تصویر' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
