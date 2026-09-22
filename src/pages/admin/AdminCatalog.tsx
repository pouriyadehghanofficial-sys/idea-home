import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  Save, 
  ExternalLink,
  Sparkles,
  FileText
} from 'lucide-react';
import { CatalogInfo } from '../../types';
import { storageService } from '../../services/storage';

interface AdminCatalogProps {
  catalog: CatalogInfo;
  onUpdateCatalog: (info: Partial<CatalogInfo>) => Promise<void>;
}

export const AdminCatalog: React.FC<AdminCatalogProps> = ({ catalog, onUpdateCatalog }) => {
  const [title, setTitle] = useState(catalog?.title || 'کاتالوگ جامع محصولات و دستاوردهای صنعتی');
  const [version, setVersion] = useState(catalog?.version || 'نسخه جدید ۱۴۰۴');
  const [updatedAt, setUpdatedAt] = useState(catalog?.updatedAt || '۱۴۰۴/۰۶/۱۰');
  const [fileSize, setFileSize] = useState(catalog?.fileSize || '۲۴.۸ مگابایت');
  const [pageCount, setPageCount] = useState(catalog?.pageCount || 68);
  const [description, setDescription] = useState(catalog?.description || '');
  const [fileUrl, setFileUrl] = useState(catalog?.fileUrl || '/ideahome-catalog.pdf');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError('تنها فایل‌های با پسوند PDF برای کاتالوگ مجاز هستند.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('حجم فایل PDF کاتالوگ نمی‌تواند بیش از ۵۰ مگابایت باشد.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadedFileName(file.name);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const calculatedFileSize = `${sizeMB} مگابایت`;
    const today = new Date().toLocaleDateString('fa-IR');
    setFileSize(calculatedFileSize);
    setUpdatedAt(today);

    try {
      const result = await storageService.uploadFile(file, 'catalog', {
        title,
        version,
        oldKey: (catalog as any)?.publicId || ''
      });

      if (result.success && result.url) {
        setFileUrl(result.url);
        // Persist immediately to IndexedDB and parent state so it's live without waiting
        await onUpdateCatalog({
          title,
          version,
          updatedAt: today,
          fileSize: calculatedFileSize,
          pageCount: Number(pageCount),
          description,
          fileUrl: result.url
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        setUploadError(result.error || 'خطا در بارگذاری فایل کاتالوگ');
      }
    } catch (err: any) {
      setUploadError(err.message || 'خطا در آپلود فایل');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUploadError('');
    try {
      await onUpdateCatalog({
        title,
        version,
        updatedAt,
        fileSize,
        pageCount: Number(pageCount),
        description,
        fileUrl
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.error('Catalog save error:', err);
      setUploadError(err.message || 'خطا در ذخیره‌سازی مشخصات کاتالوگ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Link */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto overflow-hidden">
          <h2 className="text-xs sm:text-base md:text-xl font-black text-[#1E4B57] whitespace-nowrap">
            مدیریت کاتالوگ جامع محصولات ایده استیل سازان شریف
          </h2>
        </div>

        <a
          href={catalog.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] text-[#EDEAE4] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#346D80]/20 cursor-pointer active:scale-98"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span>دانلود و مشاهده فایل فعلی</span>
        </a>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>مشخصات کاتالوگ با موفقیت در سیستم به‌روزرسانی شد.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Box & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E4B57] to-[#346D80] text-[#C9A24B] mx-auto flex items-center justify-center shadow-md">
              <BookOpen className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#1E4B57]">فایل فعال کاتالوگ دیجیتال</h3>
              <span className="text-xs text-[#96752A] font-bold block mt-1">{catalog.version}</span>
            </div>

            <div className="bg-[#EDEAE4]/50 backdrop-blur-sm p-4 rounded-2xl text-xs text-right space-y-2.5 text-[#1E4B57] border border-white/60">
              <div className="flex justify-between">
                <span className="text-[#7FA69C] font-medium">تاریخ انتشار:</span>
                <span className="font-bold">{catalog.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7FA69C] font-medium">حجم فایل:</span>
                <span className="font-bold">{catalog.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7FA69C] font-medium">تعداد صفحات:</span>
                <span className="font-bold">{catalog.pageCount} صفحه</span>
              </div>
            </div>

            {/* Drop / Upload Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) {
                  const fakeEvent = {
                    target: { files: [droppedFile], value: '' }
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  handleFileUpload(fakeEvent);
                }
              }}
              className="border-2 border-dashed border-[#7FA69C]/50 hover:border-[#346D80] rounded-2xl p-6 bg-white/70 transition-colors text-center"
            >
              <Upload className="w-8 h-8 text-[#346D80] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#1E4B57] mb-1">
                {uploadedFileName ? `فایل انتخاب‌شده: ${uploadedFileName}` : 'آپلود نسخه جدید فایل PDF'}
              </p>
              <span className="text-[11px] text-[#7FA69C] block mb-3 font-medium">
                حداکثر تا ۵۰ مگابایت (فرمت PDF استاندارد - درگ و دراپ یا انتخاب فایل)
              </span>

              <label className={`bg-[#346D80] hover:bg-[#1E4B57] text-[#EDEAE4] text-xs font-bold px-4 py-2.5 rounded-2xl cursor-pointer shadow-md shadow-[#346D80]/20 inline-block transition-all ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <span>{isUploading ? 'در حال آپلود و ذخیره‌سازی سریع کاتالوگ...' : 'انتخاب فایل از کامپیوتر'}</span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <p className="mt-3 text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Direct URL & Metadata Form */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#1E4B57] border-b border-[#1E4B57]/10 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#346D80]" />
            <span>مشخصات و آدرس دریافت کاتالوگ</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-[#1E4B57]">
            {/* Title & Version Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                  عنوان کاتالوگ
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                  نسخه / ویرایش
                </label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                />
              </div>
            </div>

            {/* Page Count & File Size Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                  تعداد صفحات
                </label>
                <input
                  type="number"
                  min="1"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                  حجم فایل نمایش داده شده
                </label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                توضیحات معرفی کاتالوگ
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحاتی درباره محتویات کاتالوگ و دستاوردهای کارخانه..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
              />
            </div>

            {/* Direct Download URL Input */}
            <div className="bg-[#1E4B57]/5 p-4 rounded-2xl border border-[#346D80]/25 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-black text-[#1E4B57] flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>آدرس و لینک مستقیم دریافت کاتالوگ (Download URL)</span>
                </label>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="IdeaHome-Catalog.pdf"
                    className="text-[11px] font-bold text-[#346D80] hover:text-[#1E4B57] flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <span>تست و بازکردن لینک دانلود</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/ideahome-catalog.pdf یا https://..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#7FA69C]/40 rounded-xl focus:outline-hidden focus:border-[#346D80] focus:ring-2 focus:ring-[#346D80]/20 text-[#1E4B57] font-mono text-left"
                dir="ltr"
              />
            </div>

            <div className="pt-4 border-t border-[#1E4B57]/10 flex justify-end">
              <button
                type="submit"
                disabled={saving || isUploading}
                className="bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] disabled:opacity-50 text-[#EDEAE4] font-bold text-xs px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4 text-[#C9A24B]" />
                <span>{saving ? 'در حال ذخیره‌سازی فوری...' : 'ذخیره مشخصات کاتالوگ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};