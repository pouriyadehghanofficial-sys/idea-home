// Cloudflare Pages Function: /api/auth/me
// Returns current authenticated admin user profile verified against signed JWT

import { requireAdmin } from '../_auth';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const auth = await requireAdmin(request, env);
  if (!auth.authenticated || !auth.user) {
    return auth.errorResponse!;
  }

  return new Response(
    JSON.stringify({
      authenticated: true,
      user: {
        username: auth.user.sub,
        name: auth.user.name || 'مدیر ارشد آیدیا هوم',
        role: auth.user.role
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache'
      }
    }
  );
};