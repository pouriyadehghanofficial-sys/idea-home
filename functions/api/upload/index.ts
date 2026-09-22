// Cloudflare Pages Function: /api/upload/index.ts
// Handles file deletion and server-side PDF uploads via ImageKit Media Library API

import { requireAdmin } from '../_auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) return auth.errorResponse!;

  const privateKey = env.IMAGEKIT_PRIVATE_KEY?.trim();

  if (!privateKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'تنظیمات ImageKit در سرور پیکربندی نشده است.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'درخواست باید از نوع multipart/form-data باشد.'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const incoming = await request.formData();
    const file = incoming.get('file');

    if (!file || !(file instanceof Blob || typeof (file as any).arrayBuffer === 'function')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'فایل ارسال نشده است.'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const fileSize = (file as Blob).size || 0;
    if (fileSize > 50 * 1024 * 1024) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'حجم فایل نباید بیشتر از 50 مگابایت باشد.'
        }),
        {
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const fileName =
      (incoming.get('fileName') as string) ||
      (file as any).name ||
      'IdeaHome-Catalog.pdf';

    const requestedFolder = incoming.get('folder') as string;
    const isPrice = fileName.toLowerCase().includes('price');
    const isCatalog = fileName.toLowerCase().includes('catalog');
    const folder = requestedFolder || (isPrice ? '/ideahome/price-list' : isCatalog ? '/ideahome/catalog' : '/ideahome/uploads');

    // Upload binary file directly to ImageKit
    // Avoid base64 conversion because it increases memory usage and CPU time
    
    const uploadForm = new FormData();
    
    uploadForm.append(
      'file',
      file instanceof Blob
        ? file
        : new Blob([await (file as any).arrayBuffer()])
    );
    
    uploadForm.append('fileName', fileName);
    uploadForm.append('folder', folder);
    uploadForm.append('useUniqueFileName', 'true');

    const authHeader = 'Basic ' + btoa(`${privateKey}:`);

    const imageKitResponse = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        headers: {
          Authorization: authHeader
        },
        body: uploadForm
      }
    );

    const responseText = await imageKitResponse.text();

    let imageKitData: any = {};
    try {
      imageKitData = JSON.parse(responseText);
    } catch {
      imageKitData = { raw: responseText };
    }

    if (!imageKitResponse.ok || !imageKitData?.url) {
      console.error(
        'IMAGEKIT SERVER UPLOAD ERROR:',
        imageKitResponse.status,
        imageKitData
      );

      return new Response(
        JSON.stringify({
          success: false,
          error: 'آپلود فایل در ImageKit ناموفق بود.',
          details: imageKitData
        }),
        {
          status: imageKitResponse.status || 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('CATALOG SERVER UPLOAD SUCCESS:', imageKitData.url);

    return new Response(
      JSON.stringify({
        success: true,
        url: imageKitData.url,
        fileId: imageKitData.fileId || '',
        publicId: imageKitData.fileId || '',
        key: imageKitData.fileId || '',
        name: imageKitData.name || fileName,
        size: imageKitData.size || fileSize
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('CATALOG SERVER UPLOAD ERROR:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'خطا در آپلود کاتالوگ.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
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

  const privateKey = env.IMAGEKIT_PRIVATE_KEY?.trim();

  if (!privateKey) {
    return new Response(
      JSON.stringify({ error: 'تنظیمات ImageKit در سرور پیکربندی نشده است.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(request.url);
    let fileId = url.searchParams.get('fileId') || url.searchParams.get('file_id') || url.searchParams.get('key') || url.searchParams.get('public_id');

    if (!fileId) {
      const body = await request.json<any>().catch(() => ({}));
      fileId = body.fileId || body.file_id || body.key || body.public_id;
    }

    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'شناسه فایل (fileId) الزامی است.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = 'Basic ' + btoa(`${privateKey}:`);
    const deleteUrl = `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`;

    const ikRes = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader
      }
    });

    const isSuccess = ikRes.ok || ikRes.status === 404;

    return new Response(
      JSON.stringify({
        success: isSuccess,
        fileId: fileId,
        message: isSuccess ? 'فایل با موفقیت از سرور ImageKit حذف شد.' : 'خطا در حذف فایل از ImageKit'
      }),
      { status: isSuccess ? 200 : ikRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در حذف فایل از ImageKit' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
