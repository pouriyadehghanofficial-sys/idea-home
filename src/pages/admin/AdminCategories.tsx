import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  AlertCircle, 
  Loader2, 
  FolderPlus,
  RefreshCw,
  X
} from 'lucide-react';
import { Category } from '../../types';
import { storageService } from '../../services/storage';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh?: () => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories: initialCategories, onRefresh }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategories[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'category' | 'catalog' | 'image';
    targetId?: string;
    targetName?: string;
    targetIndex?: number;
  }>({
    isOpen: false,
    type: 'category'
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageIndexRef = useRef<number | null>(null);
  const catalogInputRef = useRef<HTMLInputElement>(null);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  const handleSelectCategory = (id: string) => {
    setSelectedCatId(id);
    setErrorMessage('');
    setSaveSuccess(false);
  };

  const handleUpdateActiveCat = (field: keyof Category, value: any) => {
    if (!activeCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === activeCategory.id ? { ...c, [field]: value } : c))
    );
  };

  // Add new category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setErrorMessage('نام دسته‌بندی الزامی است.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        images: [],
        catalogUrl: '',
        catalogTitle: `کاتالوگ ${newCatName.trim()}`,
        catalogSize: '',
        catalogUpdatedAt: new Date().toLocaleDateString('fa-IR')
      };

      const saved = await storageService.saveCategory(newCat);
      setCategories((prev) => [...prev, saved]);
      setSelectedCatId(saved.id);
      setIsCreatingNew(false);
      setNewCatName('');
      setNewCatDesc('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ثبت دسته‌بندی جدید');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger Delete Modals
  const requestDeleteCategory = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'category',
      targetId: id,
      targetName: name
    });
  };

  const requestDeleteCatalog = () => {
    if (!activeCategory) return;
    setDeleteModal({
      isOpen: true,
      type: 'catalog',
      targetId: activeCategory.id,
      targetName: activeCategory.catalogTitle || `کاتالوگ ${activeCategory.name}`
    });
  };

  const requestDeleteImage = (index: number) => {
    setDeleteModal({
      isOpen: true,
      type: 'image',
      targetIndex: index,
      targetName: `تصویر شماره ${index + 1}`
    });
  };

  // Execute Confirmed Delete Operation
  const confirmAndExecuteDelete = async () => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      if (deleteModal.type === 'category' && deleteModal.targetId) {
        const idToDelete = deleteModal.targetId;
        await storageService.deleteCategory(idToDelete);
        const remaining = categories.filter((c) => c.id !== idToDelete);
        setCategories(remaining);
        if (selectedCatId === idToDelete) {
          setSelectedCatId(remaining[0]?.id || '');
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        if (onRefresh) await onRefresh();
      } else if (deleteModal.type === 'catalog' && activeCategory) {
        const updatedCat: Category = {
          ...activeCategory,
          catalogUrl: '',
          catalogSize: '',
          catalogUpdatedAt: ''
        };
        await storageService.saveCategory(updatedCat);
        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        if (onRefresh) await onRefresh();
      } else if (deleteModal.type === 'image' && activeCategory && deleteModal.targetIndex !== undefined) {
        const indexToRemove = deleteModal.targetIndex;
        const currentImages = activeCategory.images || [];
        const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
        const updatedCat = { ...activeCategory, images: updatedImages };
        await storageService.saveCategory(updatedCat);
        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        if (onRefresh) await onRefresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در انجام عملیات حذف');
    } finally {
      setIsSaving(false);
      setDeleteModal({ isOpen: false, type: 'category' });
    }
  };

  // Save changes to current category
  const handleSaveActiveCategory = async () => {
    if (!activeCategory) return;
    setIsSaving(true);
    setErrorMessage('');
    try {
      await storageService.saveCategory(activeCategory);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ذخیره‌سازی دسته‌بندی روی سرور');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload or replace category image
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCategory) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('فایل انتخاب شده باید از نوع تصویر باشد.');
      return;
    }

    setUploadingImage(true);
    setErrorMessage('');

    try {
      const result = await storageService.uploadFile(file, 'products');
      if (result.success && result.url) {
        const currentImages = activeCategory.images || [];
        let updatedImages: string[];

        if (replaceImageIndexRef.current !== null && replaceImageIndexRef.current >= 0) {
          // Replace specific image
          updatedImages = [...currentImages];
          updatedImages[replaceImageIndexRef.current] = result.url;
        } else {
          // Add new image
          updatedImages = [...currentImages, result.url];
        }

        const updatedCat = { ...activeCategory, images: updatedImages };
        await storageService.saveCategory(updatedCat);

        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
        );

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(result.error || 'خطا در آپلود تصویر');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در آپلود تصویر');
    } finally {
      setUploadingImage(false);
      replaceImageIndexRef.current = null;
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Remove category image
  const handleRemoveImage = async (indexToRemove: number) => {
    if (!activeCategory) return;
    const currentImages = activeCategory.images || [];
    const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
    const updatedCat = { ...activeCategory, images: updatedImages };

    setIsSaving(true);
    try {
      await storageService.saveCategory(updatedCat);
      setCategories((prev) =>
        prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در حذف تصویر');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger replace image
  const triggerReplaceImage = (index: number) => {
    replaceImageIndexRef.current = index;
    imageInputRef.current?.click();
  };

  // Upload or replace category catalog file
  const handleCatalogFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCategory) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('فایل انتخابی برای کاتالوگ دسته‌بندی باید فرمت PDF باشد.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('حجم فایل PDF نمی‌تواند بیش از ۵۰ مگابایت باشد.');
      return;
    }

    setUploadingCatalog(true);
    setErrorMessage('');

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const calculatedFileSize = `${sizeMB} مگابایت`;
    const today = new Date().toLocaleDateString('fa-IR');

    try {
      const result = await storageService.uploadFile(file, 'catalog', {
        title: activeCategory.catalogTitle || `کاتالوگ ${activeCategory.name}`,
        category: activeCategory.name
      });

      if (result.success && result.url) {
        const updatedCat: Category = {
          ...activeCategory,
          catalogUrl: result.url,
          catalogTitle: activeCategory.catalogTitle || `کاتالوگ اختصاصی ${activeCategory.name}`,
          catalogSize: calculatedFileSize,
          catalogUpdatedAt: today
        };

        await storageService.saveCategory(updatedCat);

        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
        );

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(result.error || 'خطا در بارگذاری فایل کاتالوگ دسته‌بندی');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در آپلود کاتالوگ');
    } finally {
      setUploadingCatalog(false);
      if (catalogInputRef.current) catalogInputRef.current.value = '';
    }
  };

  // Remove category catalog file
  const handleRemoveCatalog = async () => {
    if (!activeCategory) return;
    if (!window.confirm(`آیا از حذف فایل کاتالوگ دسته‌بندی «${activeCategory.name}» اطمینان دارید؟`)) return;

    const updatedCat: Category = {
      ...activeCategory,
      catalogUrl: '',
      catalogSize: '',
      catalogUpdatedAt: ''
    };

    setIsSaving(true);
    try {
      await storageService.saveCategory(updatedCat);
      setCategories((prev) =>
        prev.map((c) => (c.id === activeCategory.id ? updatedCat : c))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در حذف فایل کاتالوگ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={catalogInputRef}
        onChange={handleCatalogFileChange}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1E4B57]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#1E4B57]/10 text-[#1E4B57] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E4B57]">
              مدیریت دسته‌بندی‌های محصولات
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#1E4B57]/70">
            افزودن، ویرایش و حذف دسته‌بندی‌ها، بارگذاری تصاویر نمونه و مدیریت فایل کاتالوگ PDF اختصاصی هر دسته‌بندی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-4 py-2.5 rounded-2xl bg-[#C9A24B] hover:bg-[#b58f3d] text-[#1E4B57] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-98"
          >
            <FolderPlus className="w-4 h-4" />
            <span>افزودن دسته‌بندی جدید</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* New Category Modal/Inline Form */}
      {isCreatingNew && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#C9A24B]/40 animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#1E4B57] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#C9A24B]" />
              تعریف دسته‌بندی جدید
            </h2>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="p-1.5 text-[#1E4B57]/50 hover:text-[#1E4B57] rounded-xl hover:bg-[#EDEAE4]/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  نام دسته‌بندی *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="مثال: سبدهای سوپرمارکتی ریلی"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  توضیح کوتاه دسته‌بندی
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="مثال: انواع ارگانایزرها و سبدهای چندمنظوره با استیل ۳۰۴ ضدزنگ"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#1E4B57]/70 hover:bg-[#EDEAE4]/50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#1E4B57] text-[#EDEAE4] hover:bg-[#15343d] text-xs font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>ذخیره دسته‌بندی</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Layout: Categories List (Sidebar/Pills) + Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories List Navigator */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#1E4B57]/10">
            <h2 className="text-sm font-black text-[#1E4B57] mb-3 flex items-center justify-between">
              <span>لیست دسته‌بندی‌ها</span>
              <span className="text-xs bg-[#1E4B57]/10 px-2 py-0.5 rounded-full font-bold">
                {categories.length} دسته‌بندی
              </span>
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCatId;
                const imagesCount = cat.images?.length || 0;
                const hasCatalog = !!cat.catalogUrl;

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#1E4B57] text-[#EDEAE4] border-[#1E4B57] shadow-sm'
                        : 'bg-white hover:bg-[#EDEAE4]/30 text-[#1E4B57] border-[#1E4B57]/10'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm truncate">{cat.name}</div>
                      <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-[#EDEAE4]/70' : 'text-[#1E4B57]/60'}`}>
                        {cat.description || 'بدون توضیح'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                          isSelected ? 'bg-white/15 text-[#EDEAE4]' : 'bg-[#1E4B57]/5 text-[#1E4B57]/80'
                        }`}>
                          <ImageIcon className="w-3 h-3" />
                          {imagesCount} تصویر
                        </span>
                        {hasCatalog && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                            isSelected ? 'bg-[#C9A24B] text-[#1E4B57]' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            <FileText className="w-3 h-3" />
                            کاتالوگ
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        requestDeleteCategory(cat.id, cat.name);
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 border ${
                        isSelected
                          ? 'border-white/15 text-red-300 hover:text-white hover:bg-red-600 hover:border-red-600'
                          : 'border-red-100 hover:border-red-500 text-red-500 hover:text-white hover:bg-red-600 shadow-2xs'
                      }`}
                      title={`حذف دسته‌بندی «${cat.name}»`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Category Editor Panel */}
        <div className="lg:col-span-8 space-y-6">
          {activeCategory ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#1E4B57]/10 space-y-6">
              {/* Category Info Form */}
              <div>
                <div className="flex items-center justify-between border-b border-[#1E4B57]/10 pb-4 mb-5">
                  <h3 className="text-base font-black text-[#1E4B57] flex items-center gap-2">
                    <span>مشخصات دسته‌بندی:</span>
                    <span className="text-[#C9A24B]">{activeCategory.name}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleSaveActiveCategory}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-[#1E4B57] hover:bg-[#15343d] text-[#EDEAE4] text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>ذخیره تغییرات</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                      عنوان دسته‌بندی
                    </label>
                    <input
                      type="text"
                      value={activeCategory.name}
                      onChange={(e) => handleUpdateActiveCat('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm font-bold text-[#1E4B57]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                      توضیحات و کاربرد
                    </label>
                    <input
                      type="text"
                      value={activeCategory.description || ''}
                      onChange={(e) => handleUpdateActiveCat('description', e.target.value)}
                      placeholder="توضیح کوتاه برای نمایش در کاتالوگ و صفحه دسته‌بندی‌ها"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#1E4B57]/20 focus:border-[#C9A24B] outline-none text-sm text-[#1E4B57]"
                    />
                  </div>
                </div>
              </div>

              {/* Category Images Management */}
              <div className="border-t border-[#1E4B57]/10 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="text-sm font-black text-[#1E4B57] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#C9A24B]" />
                      تصاویر محصولات این دسته‌بندی ({activeCategory.images?.length || 0})
                    </h4>
                    <p className="text-xs text-[#1E4B57]/60 mt-0.5">
                      تصاویر در گالری محصولات این دسته‌بندی نمایش داده خواهند شد.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => {
                      replaceImageIndexRef.current = null;
                      imageInputRef.current?.click();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1E4B57]/10 hover:bg-[#1E4B57]/20 text-[#1E4B57] text-xs font-bold flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>آپلود تصویر جدید</span>
                  </button>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(activeCategory.images || []).map((imgUrl, index) => (
                    <div
                      key={index}
                      className="group relative rounded-2xl overflow-hidden border border-[#1E4B57]/15 bg-[#EDEAE4]/30 aspect-square flex flex-col justify-between"
                    >
                      <img
                        src={imgUrl}
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Image Action Overlay */}
                      <div className="absolute inset-0 bg-[#1E4B57]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => triggerReplaceImage(index)}
                          title="جایگزینی این تصویر"
                          className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#1E4B57] transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeleteImage(index)}
                          title="حذف تصویر"
                          className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                        #{index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Empty state upload card */}
                  {(!activeCategory.images || activeCategory.images.length === 0) && (
                    <div
                      onClick={() => {
                        replaceImageIndexRef.current = null;
                        imageInputRef.current?.click();
                      }}
                      className="col-span-full py-10 rounded-2xl border-2 border-dashed border-[#1E4B57]/20 flex flex-col items-center justify-center gap-2 text-[#1E4B57]/60 hover:text-[#1E4B57] hover:border-[#C9A24B] cursor-pointer transition-all bg-[#EDEAE4]/20"
                    >
                      <ImageIcon className="w-8 h-8 text-[#1E4B57]/40" />
                      <span className="text-xs font-bold">هنوز تصویری برای این دسته‌بندی بارگذاری نشده است</span>
                      <span className="text-[11px] text-[#C9A24B] font-bold">کلیک کنید تا اولین تصویر را آپلود نمایید</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Catalog Management */}
              <div className="border-t border-[#1E4B57]/10 pt-6">
                <div className="mb-4">
                  <h4 className="text-sm font-black text-[#1E4B57] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C9A24B]" />
                    کاتالوگ PDF اختصاصی دسته‌بندی
                  </h4>
                  <p className="text-xs text-[#1E4B57]/60 mt-0.5">
                    فایل PDF اختصاصی مربوط به این دسته‌بندی جهت دانلود مشتریان و خریداران عمده
                  </p>
                </div>

                {activeCategory.catalogUrl ? (
                  <div className="p-4 rounded-2xl bg-[#EDEAE4]/40 border border-[#1E4B57]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-[#1E4B57] truncate">
                          {activeCategory.catalogTitle || `کاتالوگ ${activeCategory.name}`}
                        </div>
                        <div className="text-xs text-[#1E4B57]/60 flex items-center gap-3 mt-1 font-mono">
                          {activeCategory.catalogSize && <span>حجم: {activeCategory.catalogSize}</span>}
                          {activeCategory.catalogUpdatedAt && <span>تاریخ: {activeCategory.catalogUpdatedAt}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <a
                        href={activeCategory.catalogUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDEAE4] text-[#1E4B57] border border-[#1E4B57]/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>مشاهده PDF</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => catalogInputRef.current?.click()}
                        disabled={uploadingCatalog}
                        className="px-3 py-1.5 rounded-xl bg-[#C9A24B] hover:bg-[#b58f3d] text-[#1E4B57] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>جایگزینی فایل</span>
                      </button>
                      <button
                        type="button"
                        onClick={requestDeleteCatalog}
                        disabled={isSaving}
                        className="p-2.5 rounded-xl text-red-600 hover:text-white hover:bg-red-600 active:scale-95 border border-red-200 hover:border-red-600 transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
                        title="حذف فایل کاتالوگ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => catalogInputRef.current?.click()}
                    className="py-8 px-4 rounded-2xl border-2 border-dashed border-[#1E4B57]/20 flex flex-col items-center justify-center gap-2 text-[#1E4B57]/60 hover:text-[#1E4B57] hover:border-[#C9A24B] cursor-pointer transition-all bg-[#EDEAE4]/20"
                  >
                    {uploadingCatalog ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[#C9A24B]" />
                    ) : (
                      <Upload className="w-8 h-8 text-[#1E4B57]/40" />
                    )}
                    <span className="text-xs font-bold">
                      {uploadingCatalog ? 'در حال آپلود فایل کاتالوگ...' : 'برای این دسته‌بندی هنوز کاتالوگ اختصاصی ثبت نشده است'}
                    </span>
                    <span className="text-[11px] text-[#C9A24B] font-bold">
                      جهت انتخاب و آپلود فایل PDF کاتالوگ کلیک کنید (حداکثر ۵۰ مگابایت)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#1E4B57]/10 text-[#1E4B57]/60">
              دسته‌بندی‌ای برای ویرایش انتخاب نشده است.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#EDEAE4] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-red-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-[#1E4B57]">
                {deleteModal.type === 'category'
                  ? `آیا از حذف دسته‌بندی «${deleteModal.targetName}» اطمینان دارید؟`
                  : deleteModal.type === 'catalog'
                  ? `آیا از حذف کاتالوگ «${deleteModal.targetName}» اطمینان دارید؟`
                  : `آیا از حذف «${deleteModal.targetName}» اطمینان دارید؟`}
              </h3>
              <p className="text-xs text-[#1E4B57]/70 leading-relaxed">
                {deleteModal.type === 'category'
                  ? 'این دسته‌بندی و اطلاعات کاتالوگ و تصاویر مربوط به آن حذف خواهند شد.'
                  : deleteModal.type === 'catalog'
                  ? 'فایل PDF اختصاصی از این دسته‌بندی حذف خواهد شد.'
                  : 'این تصویر از آلبوم این دسته‌بندی حذف خواهد شد.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, type: 'category' })}
                disabled={isSaving}
                className="px-4 py-2.5 text-xs font-bold text-[#1E4B57] hover:bg-white/80 rounded-2xl border border-[#1E4B57]/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmAndExecuteDelete}
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
