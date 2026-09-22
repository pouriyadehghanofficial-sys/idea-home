// Cloudflare Pages Function: /api/products/[id]
// Handles single product retrieval, updating, and deletion in Central Cloud Storage (KV, Supabase, Firebase, or D1)

import { requireAdmin } from '../_auth';
import { getProductById, saveProduct, deleteProduct, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env, 'id'> = async (context) => {
  const { params, env } = context;
  const id = params.id as string;

  try {
    const product = await getProductById(env, id);

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'محصولی با این شناسه یافت نشد.', code: 'NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت مشخصات محصول' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPut: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params.id as string;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const updates = await request.json<any>().catch(() => null);
    if (!updates) {
      return new Response(
        JSON.stringify({ error: 'اطلاعات ارسالی برای ویرایش نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existing = await getProductById(env, id);
    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'محصول جهت ویرایش یافت نشد.', code: 'NOT_FOUND' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updated = await saveProduct(env, { ...updates, id });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در به‌روزرسانی محصول در سرور ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestDelete: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params.id as string;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const success = await deleteProduct(env, id);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'محصولی با این شناسه برای حذف یافت نشد.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        deletedId: id,
        message: 'محصول با موفقیت از پایگاه داده مرکزی ابری حذف گردید.'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Database-Provider': getDatabaseProviderName(env)
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف محصول از پایگاه داده ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};