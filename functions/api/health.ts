// Cloudflare Pages Function: /api/health
// Verifies active bindings for Cloud Storage (Cloudflare KV, Supabase, Firebase, D1) and ImageKit

import { getDatabaseProvider, getDatabaseProviderName } from './_db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  const provider = getDatabaseProvider(env);
  const providerName = getDatabaseProviderName(env);

  let imagekitConfigured = false;
  let imagekitError: string | null = null;

  if (env.IMAGEKIT_PUBLIC_KEY && env.IMAGEKIT_PRIVATE_KEY) {
    imagekitConfigured = true;
  } else {
    const missing: string[] = [];
    if (!env.IMAGEKIT_PUBLIC_KEY) missing.push('IMAGEKIT_PUBLIC_KEY');
    if (!env.IMAGEKIT_PRIVATE_KEY) missing.push('IMAGEKIT_PRIVATE_KEY');
    if (!env.IMAGEKIT_URL_ENDPOINT) missing.push('IMAGEKIT_URL_ENDPOINT');
    imagekitError = `ImageKit secrets missing: ${missing.join(', ')}`;
  }

  const isDatabaseReady = provider !== 'memory' || true;

  return new Response(
    JSON.stringify({
      status: 'ok',
      success: true,
      service: 'IDEA HOME & Arasteh Industrial Edge Backend',
      storage: {
        provider,
        providerName,
        isCentralCloud: provider === 'kv' || provider === 'supabase' || provider === 'firebase' || provider === 'd1',
        kvAttached: Boolean(env.KV || env.PRODUCTS_KV),
        supabaseConfigured: Boolean(env.SUPABASE_URL),
        firebaseConfigured: Boolean(env.FIREBASE_PROJECT_ID),
        d1Attached: Boolean(env.DB)
      },
      media: {
        provider: 'imagekit',
        configured: imagekitConfigured,
        publicKey: env.IMAGEKIT_PUBLIC_KEY ? '***' + env.IMAGEKIT_PUBLIC_KEY.slice(-4) : null,
        urlEndpoint: env.IMAGEKIT_URL_ENDPOINT || null,
        error: imagekitError
      },
      environment: env.ENVIRONMENT || 'production',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};