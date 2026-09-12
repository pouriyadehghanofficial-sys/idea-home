import React, { useState } from 'react';
import { 
  Key, 
  Lock, 
  User, 
  Download, 
  RefreshCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  Save,
  ShieldCheck
} from 'lucide-react';
import { AdminUser, Product, Category, CatalogInfo, ContactMessage } from '../../types';

interface AdminSettingsProps {
  currentUser: AdminUser;
  products: Product[];
  categories: Category[];
  catalog: CatalogInfo;
  messages: ContactMessage[];
  onResetData: () => Promise<void>;
  onUpdateAdminProfile: (username: string, password?: string) => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentUser,
  products,
  categories,
  catalog,
  messages,
  onResetData,
  onUpdateAdminProfile
}) => {
  const [username, setUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'رمز عبور جدید و تکرار آن یکسان نیستند.', type: 'error' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setPasswordMsg({ text: 'رمز عبور باید حداقل ۶ کاراکتر باشد.', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateAdminProfile(username, newPassword || undefined);
      setPasswordMsg({ text: 'مشخصات کاربری و رمز عبور با موفقیت به‌روزرسانی شد.', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordMsg({ text: 'خطا در ثبت تغییرات امنیتی.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      platform: 'IDEA HOME Management Suite',
      products,
      categories,
      catalog,
      messages
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idea-home-database-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await onResetData();
      setShowResetConfirm(false);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs">
        <h2 className="text-xl font-black text-[#1E4B57]">تنظیمات امنیتی و پشتیبان‌گیری</h2>
        <p className="text-xs text-[#7FA69C] mt-1 font-medium">
          مدیریت رمز عبور مدیر، دانلود فایل پشتیبان JSON از پایگاه داده و بازنشانی داده‌های کاتالوگ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Credentials Form */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#1E4B57]/10 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#346D80]/15 text-[#346D80] flex items-center justify-center">
              <Key className="w-4 h-4 text-[#C9A24B]" />
            </div>
            <h3 className="font-bold text-sm text-[#1E4B57]">تغییر نام کاربری و رمز عبور مدیر</h3>
          </div>

          {passwordMsg && (
            <div className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 font-bold animate-in fade-in ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-800'
                : 'bg-red-50/90 border border-red-200 text-red-700'
            }`}>
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-[#1E4B57]">
            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                نام کاربری ورود
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-white/80 border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm text-[#1E4B57] font-mono focus:outline-hidden focus:border-[#346D80] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                رمز عبور جدید (اختیاری)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر..."
                  className="w-full pr-10 pl-4 py-2.5 bg-white/80 border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm text-[#1E4B57] focus:outline-hidden focus:border-[#346D80] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                تکرار رمز عبور جدید
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="تکرار رمز عبور جدید..."
                  className="w-full pr-10 pl-4 py-2.5 bg-white/80 border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm text-[#1E4B57] focus:outline-hidden focus:border-[#346D80] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] text-[#EDEAE4] font-bold text-xs px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4 text-[#C9A24B]" />
                <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره مشخصات امنیتی'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Database & Backup Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Backup Box */}
          <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#346D80]/15 text-[#346D80] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#1E4B57]">پشتیبان‌گیری کامل از اطلاعات</h3>
            </div>
            <p className="text-xs text-[#7FA69C] leading-relaxed">
              شما می‌توانید تمام محصولات، دسته‌بندی‌ها، مشخصات کاتالوگ و پیام‌های دریافتی را در قالب فایل استاندارد JSON دانلود نمایید.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full bg-[#1E4B57] hover:bg-[#346D80] text-white text-xs font-bold py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-[#C9A24B]" />
              <span>دانلود فایل پشتیبان (JSON Backup)</span>
            </button>
          </div>

          {/* Reset Box */}
          <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-red-200/60 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                <RefreshCcw className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm">بازنشانی به داده‌های پیش‌فرض کارخانه</h3>
            </div>
            <p className="text-xs text-[#7FA69C] leading-relaxed">
              در صورت تمایل به بازگشت به ۶ محصول اولیه آیدیا هوم، می‌توانید از این گزینه استفاده فرمایید.
            </p>

            {showResetConfirm ? (
              <div className="space-y-3 p-4 bg-red-50/90 rounded-2xl border border-red-200">
                <span className="text-xs font-bold text-red-700 block">
                  آیا اطمینان دارید؟ تغییرات فعلی جایگزین خواهند شد.
                </span>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={resetting}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {resetting ? 'در حال بازنشانی...' : 'بله، بازنشانی شود'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-white text-[#1E4B57] text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold py-3 rounded-2xl transition-colors cursor-pointer"
              >
                بازنشانی داده‌ها به حالت اولیه کارخانه
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};