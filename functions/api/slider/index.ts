// Cloudflare Pages Function: /api/slider
// Manages showcase slider items in Central Cloud Storage (KV, Supabase, Firebase, or D1)

import { requireAdmin } from '../_auth';
import { getSliderItems, saveSliderItems, getDatabaseProviderName } from '../_db';
import { SliderProduct } from '../../src/types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const includeInactive = url.searchParams.get('all') === 'true';

  try {
    const items = await getSliderItems(env, includeInactive);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10, s-maxage=30',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در دریافت اسلایدهای ویترین' }),
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
        JSON.stringify({ error: 'اطلاعات اسلایدر ارسالی نامعتبر است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let itemsToSave: SliderProduct[];
    if (Array.isArray(body)) {
      itemsToSave = body;
    } else {
      const current = await getSliderItems(env, true);
      const existingIdx = current.findIndex(it => String(it.id) === String(body.id));
      if (existingIdx >= 0) {
        current[existingIdx] = { ...current[existingIdx], ...body };
      } else {
        current.push(body);
      }
      itemsToSave = current;
    }

    const saved = await saveSliderItems(env, itemsToSave);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'اسلایدها با موفقیت در پایگاه داده ابری ذخیره شدند.',
        items: saved
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
      JSON.stringify({ error: err.message || 'خطا در ذخیره اسلایدر در پایگاه داده ابری' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};