// Cloudflare Pages Function: /api/auth/login
// Server-side authentication verifying against Cloudflare D1 with PBKDF2 hashing,
// JWT session generation, and brute-force mitigation

import {
  checkBruteForce,
  clearFailedLogin,
  createAdminToken,
  hashPassword,
  recordFailedLogin,
  verifyPassword,
  SHARED_JWT_SECRET
} from '../_auth';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Extract client IP for rate limiting / brute-force protection
  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1';

  try {
    // 1. Check brute force lockout
    const bruteForceCheck = await checkBruteForce(clientIp, env.DB);
    if (!bruteForceCheck.allowed) {
      const minutesLeft = Math.ceil((bruteForceCheck.remainingSeconds || 900) / 60);
      return new Response(
        JSON.stringify({
          success: false,
          message: `تعداد تلاش‌های ناموفق بیش از حد مجاز بود. لطفاً ${minutesLeft} دقیقه دیگر تلاش فرمایید.`,
          code: 'RATE_LIMITED'
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '900' }
        }
      );
    }

    // 2. Parse request
    const body = await request.json<{ username?: string; password?: string }>().catch(() => ({}));
    const username = (body.username || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'لطفاً نام کاربری و رمز عبور را وارد نمایید.',
          code: 'BAD_REQUEST'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Authenticate directly against Environment Variables (ADMIN_USERNAME & ADMIN_PASSWORD) or D1
    let authenticatedUser: { id: string; username: string; name: string; role: string } | null = null;

    const expectedEnvUser = (env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const expectedEnvPass = env.ADMIN_PASSWORD;

    // Check direct Environment Variables first (works without D1, 100% free)
    if (expectedEnvPass && username === expectedEnvUser && password === expectedEnvPass) {
      authenticatedUser = {
        id: 'admin_env',
        username: expectedEnvUser,
        name: 'مدیر ارشد آیدیا هوم',
        role: 'super_admin'
      };
    } else if (env.DB) {
      // Optional fallback: Check against Cloudflare D1 if configured
      try {
        const dbUser = await env.DB
          .prepare('SELECT id, username, password_hash, name, role FROM admin_users WHERE LOWER(username) = ?')
          .bind(username)
          .first<{ id: string; username: string; password_hash: string; name: string; role: string }>();

        if (dbUser) {
          const isPasswordValid = await verifyPassword(password, dbUser.password_hash);
          if (isPasswordValid) {
            authenticatedUser = {
              id: dbUser.id,
              username: dbUser.username,
              name: dbUser.name,
              role: dbUser.role
            };

            // If stored password was plain or legacy format, migrate to secure PBKDF2 in D1
            if (!dbUser.password_hash.startsWith('pbkdf2:')) {
              const newHash = await hashPassword(password);
              await env.DB
                .prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?')
                .bind(newHash, new Date().toISOString(), dbUser.id)
                .run();
            }
          }
        }
      } catch (err) {
        console.error('D1 admin_users lookup error:', err);
      }
    }

    // 4. If credentials failed
    if (!authenticatedUser) {
      await recordFailedLogin(clientIp, env.DB);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'نام کاربری یا رمز عبور وارد شده نادرست است.',
          code: 'INVALID_CREDENTIALS'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Successful login: Clear failed attempts
    await clearFailedLogin(clientIp, env.DB);

    // 6. Sign secure JWT Token (7 days expiration)
    const jwtSecret = env.JWT_SECRET || SHARED_JWT_SECRET;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = await createAdminToken(
      {
        sub: authenticatedUser.username,
        role: authenticatedUser.role,
        name: authenticatedUser.name,
        iat: nowSeconds,
        exp: nowSeconds + 7 * 24 * 60 * 60
      },
      jwtSecret
    );

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: {
          username: authenticatedUser.username,
          name: authenticatedUser.name,
          role: authenticatedUser.role
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `arasteh_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'خطای غیرمنتظره در سرور' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};