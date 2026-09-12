import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storage';
import { AdminUser } from '../../types';
import { Logo } from '../../components/Logo';

interface AdminLoginProps {
  onSuccess?: (user: AdminUser) => void;
  onLoginSuccess?: (user: AdminUser) => void;
  onBackToHome?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  onLoginSuccess,
  onBackToHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCallback = (user: AdminUser) => {
    if (onSuccess) {
      onSuccess(user);
    } else if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('لطفاً نام کاربری و رمز عبور را وارد فرمایید.');
      return;
    }

    setLoading(true);

    try {
      const res = await storageService.login(username, password);
      if (res.success) {
        const user = storageService.getCurrentAdmin();
        handleCallback(user || {
          username: username.trim(),
          name: 'مدیر ارشد آیدیا هوم (IDEA HOME)',
          role: 'super_admin'
        });
      } else {
        setErrorMessage(res.message || 'نام کاربری یا رمز عبور وارد شده نادرست است.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage('خطا در احراز هویت. لطفاً مجدداً بررسی فرمایید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-[#1E4B57] via-[#163842] to-[#0F2830] flex items-center justify-center px-4 py-12 select-none relative overflow-hidden font-vazir"
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#346D80]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Glassmorphic Card */}
        <div className="bg-[#EDEAE4]/95 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/60 space-y-6">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <Logo variant="hero" showText={false} />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#1E4B57] tracking-tight">
              ورود مدیران آیدیا هوم
            </h1>
          </div>

          {/* Error message alert */}
          {errorMessage && (
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                نام کاربری
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pr-10 pl-4 py-3 bg-white/80 backdrop-blur-sm border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-[#346D80] focus:bg-white text-[#1E4B57] font-mono transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                کلمه عبور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-11 py-3 bg-white/80 backdrop-blur-sm border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-[#346D80] focus:bg-white text-[#1E4B57] font-mono transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7FA69C] hover:text-[#1E4B57] transition-colors cursor-pointer p-1"
                  title={showPassword ? 'مخفی کردن' : 'نمایش'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] text-[#EDEAE4] rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all shadow-md shadow-[#346D80]/20 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <span>در حال اعتبارسنجی...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                  <span>ورود امن به پنل مدیریت</span>
                </>
              )}
            </button>
          </form>

          {/* Footer action: Back to public site */}
          {onBackToHome && (
            <div className="pt-3 border-t border-[#1E4B57]/10 text-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 text-xs text-[#346D80] hover:text-[#1E4B57] font-bold transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به وب‌سایت اصلی</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};