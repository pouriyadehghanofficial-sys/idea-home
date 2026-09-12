// Cloudflare Pages Function: /api/products
// Manages product listings and creation in Central Cloud Storage (KV, Supabase, Firebase, or D1)

import { requireAdmin } from '../_auth';
import { getProducts, saveProduct, getDatabaseProviderName } from '../_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    const products = await getProducts(env);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=5, s-maxage=15',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت لیست محصولات از پایگاه داده ابری' }),
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
    const body = await request.json<any>().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'داده ارسالی نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = (body.name || '').trim();
    const category = (body.category || '').trim();
    const price = Number(body.price);

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'نام محصول الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!category) {
      return new Response(
        JSON.stringify({ error: 'دسته‌بندی محصول الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (isNaN(price) || price < 0) {
      return new Response(
        JSON.stringify({ error: 'قیمت محصول باید یک عدد معتبر و مثبت باشد.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const savedProduct = await saveProduct(env, body);

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ثبت اطلاعات محصول در پایگاه داده ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};