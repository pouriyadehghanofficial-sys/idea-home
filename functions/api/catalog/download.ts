// Cloudflare Pages Function: /api/catalog/download
// Proxies an ImageKit-hosted catalog file through our own domain, so users
// whose network filters or corporate firewalls restrict direct access can still download it.
//
// USAGE (from frontend):
//   /api/catalog/download?url=<encoded ImageKit URL>
//
// Only trusted ImageKit domains are allowed through, preventing open proxy abuse.

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const requestUrl = new URL(request.url);
  const fileUrl = requestUrl.searchParams.get('url');

  if (!fileUrl) {
    return new Response(
      JSON.stringify({ success: false, message: 'پارامتر url الزامی است.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Security: only ever proxy trusted file-hosting domains.
  let parsed: URL;
  try {
    parsed = new URL(fileUrl);
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'آدرس فایل نامعتبر است.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const isImageKit = parsed.hostname === 'ik.imagekit.io' ||
    parsed.hostname === 'upload.imagekit.io' ||
    parsed.hostname.endsWith('.imagekit.io') ||
    parsed.hostname === 'imagekit.io';

  if (!isImageKit) {
    return new Response(
      JSON.stringify({ success: false, message: 'دامنه مجاز نیست.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const upstream = await fetch(fileUrl, {
      cf: {
        cacheTtl: 3600,
        cacheEverything: true
      }
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'دریافت فایل از منبع با خطا مواجه شد.',
          status: upstream.status
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const guessedName = decodeURIComponent(parsed.pathname.split('/').pop() || 'catalog.pdf');
    const contentType = upstream.headers.get('Content-Type') || 'application/octet-stream';

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${guessedName}"`,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, message: 'خطای غیرمنتظره.', error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};