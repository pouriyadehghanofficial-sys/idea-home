// Cloudflare Pages Function: /api/upload/sign
// Issues cryptographic HMAC-SHA1 signatures for direct browser uploads to ImageKit (Media Library)
// Requires admin authentication; keeps IMAGEKIT_PRIVATE_KEY strictly server-side

import { requireAdmin } from '../_auth';

const ALLOWED_FOLDERS = new Set(['products', 'slider', 'catalog', 'general', 'uploads']);

async function hmacSha1Hex(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce admin authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated) {
    return auth.errorResponse!;
  }

  // 2. Validate ImageKit configuration secrets
  const publicKey = env.IMAGEKIT_PUBLIC_KEY?.trim();
  const privateKey = env.IMAGEKIT_PRIVATE_KEY?.trim();
  const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT?.trim();

  if (!publicKey || !privateKey) {
    return new Response(
      JSON.stringify({
        success: false,
        fallback: true,
        message: 'تنظیمات ImageKit در سرور ثبت نشده است. سیستم به صورت خودکار از ذخیره‌ساز فشرده داخلی استفاده می‌کند.',
        code: 'IMAGEKIT_SECRETS_MISSING'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json<any>().catch(() => ({}));
    let folder = (body.folder || 'products').toString().toLowerCase().trim();
    if (!ALLOWED_FOLDERS.has(folder)) {
      folder = 'products';
    }

    const fullFolder = `/ideahome/${folder}`;
    const token = body.token && typeof body.token === 'string' && body.token.trim()
      ? body.token.trim()
      : crypto.randomUUID();

    // ImageKit expire timestamp in seconds (valid for up to 30 minutes)
    const expire = Math.floor(Date.now() / 1000) + 1800;

    // ImageKit signature = HMAC-SHA1(token + expire, privateKey)
    const signature = await hmacSha1Hex(privateKey, token + expire);

    return new Response(
      JSON.stringify({
        success: true,
        token,
        expire,
        signature,
        publicKey,
        urlEndpoint: urlEndpoint || '',
        folder: fullFolder
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطا در ایجاد امضای احراز هویت ImageKit' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};