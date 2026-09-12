// Cloudflare Pages Function: /api/categories
// Manages product categories in Central Cloud Storage (KV, Supabase, Firebase, or D1)

import { requireAdmin } from '../_auth';
import { getCategories, saveCategory, deleteCategory, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const categories = await getCategories(env);

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10, s-maxage=60',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت دسته‌بندی‌ها از سرور ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const body = await request.json<{ id?: string; name?: string; description?: string }>().catch(() => ({}));
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'نام دسته‌بندی الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const saved = await saveCategory(env, { id: body.id, name, description });

    return new Response(JSON.stringify(saved), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ذخیره دسته‌بندی در پایگاه داده ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || url.searchParams.get('name');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'شناسه یا نام دسته‌بندی جهت حذف الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const success = await deleteCategory(env, id);

    return new Response(
      JSON.stringify({ success, message: 'دسته‌بندی با موفقیت حذف گردید.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف دسته‌بندی' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};