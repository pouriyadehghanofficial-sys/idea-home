// Cloudflare Pages Function: /api/auth/password
// Securely updates admin username or password in Cloudflare D1 with PBKDF2 hashing

import { hashPassword, requireAdmin, verifyPassword } from '../_auth';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Enforce Admin Authentication
  const auth = await requireAdmin(request, env);
  if (!auth.authenticated || !auth.user) {
    return auth.errorResponse!;
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ error: 'پایگاه داده ابری D1 به این پروژه متصل نیست.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json<{
      oldPassword?: string;
      newPassword?: string;
      newUsername?: string;
      name?: string;
    }>().catch(() => ({}));

    const { oldPassword, newPassword, newUsername, name } = body;
    const currentUsername = auth.user.sub.toLowerCase();

    // 2. Fetch current admin record from D1
    const currentAdmin = await env.DB
      .prepare('SELECT id, username, password_hash, name, role FROM admin_users WHERE LOWER(username) = ?')
      .bind(currentUsername)
      .first<{ id: string; username: string; password_hash: string; name: string; role: string }>();

    let adminId = currentAdmin?.id;
    let storedHash = currentAdmin?.password_hash;

    // If admin not yet in D1, verify against ADMIN_PASSWORD env
    if (!currentAdmin) {
      const envPass = env.ADMIN_PASSWORD;
      if (!envPass) {
        return new Response(
          JSON.stringify({ error: 'حساب کاربری ادمین در پایگاه داده یافت نشد.' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      storedHash = envPass;
      adminId = `admin_${Date.now()}`;
    }

    // 3. Verify old password if changing password
    if (newPassword) {
      if (!oldPassword) {
        return new Response(
          JSON.stringify({ error: 'لطفاً رمز عبور فعلی را وارد نمایید.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const isOldValid = await verifyPassword(oldPassword, storedHash!);
      if (!isOldValid) {
        return new Response(
          JSON.stringify({ error: 'رمز عبور فعلی وارد شده نادرست است.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ error: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      storedHash = await hashPassword(newPassword);
    }

    const targetUsername = (newUsername?.trim() || currentUsername).toLowerCase();
    const targetName = name?.trim() || currentAdmin?.name || 'مدیر ارشد آیدیا هوم';
    const now = new Date().toISOString();

    // 4. Save updated credentials to D1
    if (currentAdmin) {
      await env.DB
        .prepare(
          'UPDATE admin_users SET username = ?, password_hash = ?, name = ?, updated_at = ? WHERE id = ?'
        )
        .bind(targetUsername, storedHash, targetName, now, adminId)
        .run();
    } else {
      await env.DB
        .prepare(
          'INSERT INTO admin_users (id, username, password_hash, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .bind(adminId, targetUsername, storedHash, targetName, 'super_admin', now, now)
        .run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'اطلاعات ادمین و رمز عبور با موفقیت به‌روزرسانی شد.',
        user: {
          username: targetUsername,
          role: 'super_admin',
          name: targetName
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'خطای غیرمنتظره در تغییر اطلاعات ادمین' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};