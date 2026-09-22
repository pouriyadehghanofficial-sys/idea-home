import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Filter, 
  Image as ImageIcon,
  ExternalLink,
  Tag,
  X
} from 'lucide-react';
import { CompanyPhoto } from '../../types';
import { storageService } from '../../services/storage';

export const AdminCompanyPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<CompanyPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'factory' | 'office'>('all');
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; title: string } | null>(null);

  // Modal / Form state for new or edit photo
  const [editingPhoto, setEditingPhoto] = useState<CompanyPhoto | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New photo form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'factory' | 'office'>('factory');
  const [newImageUrl, setNewImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetIdRef = useRef<string | null>(null);

  // Load photos from direct server API
  const loadPhotos = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await storageService.getCompanyPhotos();
      setPhotos(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در بارگذاری تصاویر کارخانه و دفتر از سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Upload or replace image file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('فایل انتخاب شده باید از نوع تصویر باشد.');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const result = await storageService.uploadFile(file, 'uploads');
      if (result.success && result.url) {
        if (replaceTargetIdRef.current) {
          // Replace existing image URL
          const targetId = replaceTargetIdRef.current;
          const updatedList = photos.map((p) =>
            p.id === targetId ? { ...p, url: result.url } : p
          );
          await storageService.saveCompanyPhotos(updatedList);
          setPhotos(updatedList);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        } else if (isNewModalOpen) {
          // Set in modal form
          setNewImageUrl(result.url);
        } else {
          // Add as new photo directly
          const newPhoto: CompanyPhoto = {
            id: `photo_${Date.now()}`,
            url: result.url,
            title: file.name.replace(/\.[^/.]+$/, ''),
            category: 'factory',
            description: '',
            order: photos.length + 1,
            createdAt: new Date().toLocaleDateString('fa-IR')
          };
          const updatedList = [...photos, newPhoto];
          await storageService.saveCompanyPhotos(updatedList);
          setPhotos(updatedList);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        }
      } else {
        setErrorMessage(result.error || 'خطا در بارگذاری تصویر');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در بارگذاری تصویر');
    } finally {
      setUploading(false);
      replaceTargetIdRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Trigger replace
  const triggerReplace = (photoId: string) => {
    replaceTargetIdRef.current = photoId;
    fileInputRef.current?.click();
  };

  // Trigger new upload
  const triggerNewUpload = () => {
    replaceTargetIdRef.current = null;
    fileInputRef.current?.click();
  };

  // Delete photo
  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;
    const { id } = photoToDelete;

    setIsSaving(true);
    setErrorMessage('');
    try {
      await storageService.deleteCompanyPhoto(id);
      const remaining = photos.filter((p) => p.id !== id);
      setPhotos(remaining);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در حذف تصویر از سرور');
    } finally {
      setIsSaving(false);
      setPhotoToDelete(null);
    }
  };

  // Save new photo from modal form
  const handleSaveNewModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      setErrorMessage('لطفاً ابتدا تصویر را آپلود کنید.');
      return;
    }

    setIsSaving(true);
    try {
      const created: CompanyPhoto = {
        id: `photo_${Date.now()}`,
        url: newImageUrl,
        title: newTitle.trim() || 'تصویر مجموعه آراسته',
        category: newCategory,
        description: '',
        order: photos.length + 1,
        createdAt: new Date().toLocaleDateString('fa-IR')
      };

      const updated = [...photos, created];
      await storageService.saveCompanyPhotos(updated);
      setPhotos(updated);
      setIsNewModalOpen(false);
      setNewTitle('');
      setNewImageUrl('');
      setNewCategory('factory');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ثبت تصویر روی سرور');
    } finally {
      setIsSaving(false);
    }
  };

  // Save edited photo info
  const handleSaveEditModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    setIsSaving(true);
    try {
      const updated = photos.map((p) => (p.id === editingPhoto.id ? editingPhoto : p));
      await storageService.saveCompanyPhotos(updated);
      setPhotos(updated);
      setEditingPhoto(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ویرایش اطلاعات تصویر');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1E4B57]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#1E4B57]/10 text-[#1E4B57] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E4B57]">
              مدیریت تصاویر کارخانه و دفتر
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#1E4B57]/70">
            بارگذاری، جایگزینی و حذف تصاویر خطوط تولید کارخانه، دفتر مرکزی و شوروم مرکزی جهت نمایش در صفحه اختصاصی گالری
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerNewUpload}
            disabled={uploading}
            className="px-4 py-2.5 rounded-2xl bg-[#C9A24B] hover:bg-[#b58f3d] text-[#1E4B57] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>آپلود سریع تصویر</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#1E4B57] hover:bg-[#15343d] text-[#EDEAE4] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت با جزئیات</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage('')} className="p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>تغییرات با موفقیت روی سرور ذخیره شد.</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-xs border border-[#1E4B57]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#1E4B57] text-[#EDEAE4]'
                : 'text-[#1E4B57]/70 hover:bg-[#EDEAE4]/40'
            }`}
          >
            همه ({photos.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('factory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'factory'
                ? 'bg-[#1E4B57] text-[#EDEAE4]'
                : 'text-[#1E4B57]/70 hover:bg-[#EDEAE4]/40'
            }`}
          >
            کارخانه و خطوط تولید ({photos.filter((p) => p.category === 'factory').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('office')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'office'
                ? 'bg-[#1E4B57] text-[#EDEAE4]'
                : 'text-[#1E4B57]/70 hover:bg-[#EDEAE4]/40'
            }`}
          >
            دفتر مرکزی و اداری ({photos.filter((p) => p.category === 'office').length})
          </button>
        </div>

        <button
          type="button"
          onClick={loadPhotos}
          className="p-2 text-[#1E4B57]/60 hover:text-[#1E4B57] rounded-xl hover:bg-[#EDEAE4]/40 transition-all"
          title="بارگذاری مجدد از سرور"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Photos */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#1E4B57]/60 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A24B]" />
          <span className="text-sm font-bold">در حال دریافت تصاویر از سرور...</span>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#1E4B57]/10 flex flex-col items-center gap-3">
          <ImageIcon className="w-12 h-12 text-[#1E4B57]/30" />
          <div className="text-base font-bold text-[#1E4B57]">تصویری در این دسته‌بندی یافت نشد</div>
          <p className="text-xs text-[#1E4B57]/60">برای افزودن عکس از دکمه آپلود تصویر استفاده کنید.</p>
          <button
            type="button"
            onClick={triggerNewUpload}
            className="mt-2 px-4 py-2 rounded-xl bg-[#C9A24B] text-[#1E4B57] text-xs font-bold"
          >
            آپلود تصویر جدید
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => {
            const categoryBadge =
              photo.category === 'office'
                ? { label: 'دفتر مرکزی', color: 'bg-blue-100 text-blue-800' }
                : { label: 'کارخانه', color: 'bg-emerald-100 text-emerald-800' };

            return (
              <div
                key={photo.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#1E4B57]/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Box */}
                <div className="relative aspect-4/3 bg-[#EDEAE4]/40 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shadow-xs ${categoryBadge.color}`}>
                      {categoryBadge.label}
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-[#1E4B57]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                    <button
                      type="button"
                      onClick={() => triggerReplace(photo.id)}
                      title="جایگزینی فایل تصویر"
                      className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#1E4B57] transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(photo)}
                      title="ویرایش تیتر عکس"
                      className="p-2 rounded-xl bg-[#C9A24B] hover:bg-[#b58f3d] text-[#1E4B57] transition-all cursor-pointer"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoToDelete({ id: photo.id, title: photo.title })}
                      title="حذف این تصویر"
                      className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer - Clean Title Only */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-[#1E4B57] line-clamp-1">
                    {photo.title || 'تصویر بدون عنوان'}
                  </h3>
                  <a
                    href={photo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1E4B57]/50 hover:text-[#1E4B57] p-1 shrink-0"
                    title="مشاهده سایز اصلی"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Photo with Details */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#1E4B57]/10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E4B57]/10 pb-3">
              <h2 className="text-base font-black text-[#1E4B57] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C9A24B]" />
                افزودن تصویر جدید
              </h2>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 text-[#1E4B57]/50 hover:text-[#1E4B57] rounded-xl hover:bg-[#EDEAE4]/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewModal} className="space-y-4">
              {/* Image Preview / Upload Area */}
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  فایل تصویر *
                </label>
                {newImageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#1E4B57]/20 aspect-16/9 bg-[#EDEAE4]/30">
                    <img src={newImageUrl} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute top-2 left-2 p-1.5 bg-red-600 text-white rounded-xl shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="py-8 rounded-2xl border-2 border-dashed border-[#1E4B57]/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C9A24B] bg-[#EDEAE4]/20 transition-all text-[#1E4B57]/60"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#C9A24B]" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#1E4B57]/40" />
                    )}
                    <span className="text-xs font-bold">
                      {uploading ? 'در حال آپلود...' : 'برای انتخاب و آپلود فایل تصویر کلیک کنید'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  تیتر تصویر *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: خط تولید و فرم‌دهی مفتول"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  دسته‌بندی بخش
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57] bg-white"
                >
                  <option value="factory">کارخانه و خطوط تولید</option>
                  <option value="office">دفتر مرکزی و فضای اداری</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E4B57]/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#1E4B57]/70 hover:bg-[#EDEAE4]/50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newImageUrl}
                  className="px-5 py-2 rounded-xl bg-[#1E4B57] text-[#EDEAE4] hover:bg-[#15343d] text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>ذخیره تصویر</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Photo */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#1E4B57]/10 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E4B57]/10 pb-3">
              <h2 className="text-base font-black text-[#1E4B57] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C9A24B]" />
                ویرایش تیتر تصویر
              </h2>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="p-1.5 text-[#1E4B57]/50 hover:text-[#1E4B57] rounded-xl hover:bg-[#EDEAE4]/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  تیتر تصویر *
                </label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  دسته‌بندی بخش
                </label>
                <select
                  value={editingPhoto.category}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57] bg-white"
                >
                  <option value="factory">کارخانه و خطوط تولید</option>
                  <option value="office">دفتر مرکزی و فضای اداری</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E4B57]/10">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#1E4B57]/70 hover:bg-[#EDEAE4]/50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#1E4B57] text-[#EDEAE4] hover:bg-[#15343d] text-xs font-bold flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>ذخیره تغییرات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#EDEAE4] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-red-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-[#1E4B57]">
                آیا از حذف این تصویر اطمینان دارید؟
              </h3>
              <p className="text-xs text-[#1E4B57]/70 leading-relaxed">
                تصویر «{photoToDelete.title || 'انتخاب شده'}» از لیست تصاویر کارخانه و شرکت حذف خواهد شد.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                disabled={isSaving}
                className="px-4 py-2.5 text-xs font-bold text-[#1E4B57] hover:bg-white/80 rounded-2xl border border-[#1E4B57]/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                disabled={isSaving}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>تایید و حذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
