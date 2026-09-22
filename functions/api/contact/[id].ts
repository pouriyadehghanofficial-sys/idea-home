// Cloudflare Pages Function: /api/contact/[id]
// Handles message status updating and deletion in Cloudflare D1

import { requireAdmin } from '../_auth';

export const onRequestPut: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params.id as string;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'پایگاه داده ابری D1 متصل نشده است.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json<{ status?: 'unread' | 'read' }>().catch(() => ({}));
    const newStatus = body.status === 'unread' ? 'unread' : 'read';

    await env.DB
      .prepare('UPDATE contact_messages SET status = ? WHERE id = ?')
      .bind(newStatus, id)
      .run();

    return new Response(
      JSON.stringify({ success: true, id, status: newStatus }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در به‌روزرسانی وضعیت پیام' }),
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

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'پایگاه داده ابری D1 متصل نشده است.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await env.DB.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();

    return new Response(
      JSON.stringify({ success: true, deletedId: id, message: 'پیام با موفقیت حذف شد.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف پیام' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};