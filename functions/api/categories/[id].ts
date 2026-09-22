// Cloudflare Pages Function: /api/categories/[id]
import { requireAdmin } from '../_auth';
import { deleteCategory } from '../_db';

export const onRequestDelete: PagesFunction<Env, 'id'> = async (context) => {
  const { params, request, env } = context;
  const id = params.id as string;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) return auth.errorResponse!;

  try {
    const success = await deleteCategory(env, id);
    return new Response(JSON.stringify({ success, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'خطا در حذف دسته‌بندی' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};