// Cloudflare Pages Function: /api/upload/destroy
// Deletes media assets from ImageKit Media Library via official API
// Uses server-side HTTP Basic Auth with IMAGEKIT_PRIVATE_KEY

import { requireAdmin } from '../_auth';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  const privateKey = env.IMAGEKIT_PRIVATE_KEY?.trim();

  if (!privateKey) {
    return new Response(
      JSON.stringify({ error: 'تنظیمات ImageKit در سرور یافت نشد.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json<any>().catch(() => ({}));
    const fileId = (body.fileId || body.file_id || body.public_id || body.key || '').trim();

    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'شناسه فایل (fileId) جهت حذف الزامی است.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = 'Basic ' + btoa(`${privateKey}:`);
    const deleteUrl = `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`;

    const ikResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    });

    const isSuccess = ikResponse.ok || ikResponse.status === 404;

    return new Response(
      JSON.stringify({
        success: isSuccess,
        fileId: fileId,
        message: isSuccess ? 'فایل با موفقیت از سرور ImageKit حذف شد.' : 'خطا در حذف فایل از ImageKit'
      }),
      {
        status: isSuccess ? 200 : ikResponse.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف فایل از ImageKit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};