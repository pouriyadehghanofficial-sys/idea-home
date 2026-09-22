// Cloudflare Pages Function: /api/company-photos/:id
// Handles DELETE and PUT for a specific company photo

import { requireAdmin } from '../_auth';
import { deleteCompanyPhotoStore, saveSingleCompanyPhoto, getDatabaseProviderName } from '../_db';

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  const id = params.id as string;
  if (!id) {
    return new Response(
      JSON.stringify({ error: 'شناسه تصویر نامعتبر است.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
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

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  const id = params.id as string;
  try {
    const body = await request.json<any>().catch(() => ({}));
    const updated = await saveSingleCompanyPhoto(env, { ...body, id });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Database-Provider': getDatabaseProviderName(env)
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ویرایش تصویر' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
