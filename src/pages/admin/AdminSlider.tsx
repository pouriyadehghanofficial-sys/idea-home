import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  Images,
  Loader2,
  Sparkles
} from 'lucide-react';
import { SliderProduct } from '../../types';
import { DEFAULT_SLIDER_PRODUCTS } from '../../data/sliderProducts';
import { storageService } from '../../services/storage';

interface AdminSliderProps {
  items: SliderProduct[];
  onSave: (items: SliderProduct[]) => Promise<void>;
}

export const AdminSlider: React.FC<AdminSliderProps> = ({ items: initialItems, onSave }) => {
  const [items, setItems] = useState<SliderProduct[]>(
    initialItems && initialItems.length > 0 ? initialItems : DEFAULT_SLIDER_PRODUCTS
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ completed: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Update a specific field of an item
  const handleUpdateItem = (index: number, field: keyof SliderProduct, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setItems(updated);
  };

  // Move slide up in order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setItems(updated);
  };

  // Move slide down in order
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setItems(updated);
  };

  // Delete a slide (decrease count)
  const handleDelete = (index: number) => {
    if (items.length <= 1) {
      alert('حداقل یک تصویر باید در اسلایدر باقی بماند.');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Add a new slide (increase count)
  const handleAddNewSlide = () => {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newSlide: SliderProduct = {
      id: nextId,
      code: '',
      title: '',
      category: '',
      badge: '',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1200&auto=format&fit=crop&q=85'
    };
    setItems([...items, newSlide]);
  };

  // Dedicated Batch Upload for 10+ images at once with auto-compression
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = (Array.from(fileList) as File[]).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      alert('لطفاً فایل‌های تصویری معتبر (JPG, PNG, WebP) انتخاب فرمایید.');
      return;
    }

    setIsBatchUploading(true);
    setBatchProgress({ completed: 0, total: files.length });

    try {
      const uploadResults = await storageService.uploadMultipleFiles(
        files,
        'slider',
        (done, total) => {
          setBatchProgress({ completed: done, total });
        }
      );

      const successfulUploads = uploadResults.filter((r) => r.success && r.url);
      if (successfulUploads.length > 0) {
        const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
        const newSlides: SliderProduct[] = successfulUploads.map((up, idx) => ({
          id: nextId + idx,
          code: `IH-SL-${nextId + idx}`,
          title: `تصویر ویترین جدید ${nextId + idx}`,
          category: 'محصولات آیدیا هوم',
          badge: '',
          image: up.url,
          imageKey: up.key,
          active: true,
          order: items.length + idx + 1
        }));

        const combined = [...items, ...newSlides];
        setItems(combined);
        await onSave(combined);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage('فایلی برای افزودن به اسلایدر یافت نشد.');
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      setErrorMessage(err?.message || 'خطا در بارگذاری همزمان تصاویر.');
    } finally {
      setIsBatchUploading(false);
      setBatchProgress(null);
      e.target.value = '';
    }
  };

  // Handle uploading slide image(s) from individual card
  const handleImageFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = (Array.from(fileList) as File[]).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      alert('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب فرمایید.');
      return;
    }

    // Single image chosen: replace this slide's image
    if (files.length === 1) {
      const file = files[0];
      setUploadingIndex(index);
      try {
        const oldKey = items[index]?.imageKey;
        const res = await storageService.uploadFile(file, 'slider', { oldKey: oldKey || '' });
        if (res.success && res.url) {
          const updated = [...items];
          updated[index] = {
            ...updated[index],
            image: res.url,
            imageKey: res.key
          };
          setItems(updated);
        } else {
          alert(res.error || 'خطا در بارگذاری تصویر.');
        }
      } catch (err: any) {
        alert(err.message || 'خطا در بارگذاری تصویر.');
      } finally {
        setUploadingIndex(null);
        e.target.value = '';
      }
      return;
    }

    // Multiple images (e.g. 10 files) chosen at once:
    // Update the current slide with the 1st photo and append the rest as new slides!
    setIsBatchUploading(true);
    setBatchProgress({ completed: 0, total: files.length });
    try {
      const uploadResults = await storageService.uploadMultipleFiles(
        files,
        'slider',
        (done, total) => setBatchProgress({ completed: done, total })
      );

      const successfulUploads = uploadResults.filter((r) => r.success && r.url);
      if (successfulUploads.length > 0) {
        const updated = [...items];
        updated[index] = {
          ...updated[index],
          image: successfulUploads[0].url,
          imageKey: successfulUploads[0].key
        };

        let nextId = Math.max(...updated.map((i) => i.id)) + 1;
        const extraSlides: SliderProduct[] = successfulUploads.slice(1).map((up, idx) => ({
          id: nextId + idx,
          code: `IH-SL-${nextId + idx}`,
          title: `تصویر ویترین جدید ${nextId + idx}`,
          category: 'محصولات آیدیا هوم',
          badge: '',
          image: up.url,
          imageKey: up.key,
          active: true,
          order: updated.length + idx + 1
        }));

        const finalCombined = [...updated, ...extraSlides];
        setItems(finalCombined);
        await onSave(finalCombined);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'خطا در بارگذاری تصاویر.');
    } finally {
      setIsBatchUploading(false);
      setBatchProgress(null);
      e.target.value = '';
    }
  };

  // Reset to default 10 factory images
  const handleResetToDefaults = () => {
    if (window.confirm('آیا مایلید تمام اسلایدها به ۱۰ تصویر و تنظیمات پیش‌فرض کارخانه بازنشانی شوند؟')) {
      setItems(DEFAULT_SLIDER_PRODUCTS);
    }
  };

  // Save changes to storage and parent state
  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      await onSave(items);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving slider products:', err);
      setErrorMessage(err?.message || 'خطا در ذخیره‌سازی تغییرات.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Error notification banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-rose-500 hover:text-rose-800 text-xs font-bold underline cursor-pointer"
          >
            بستن
          </button>
        </div>
      )}

      {/* Top Banner & Action Controls */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto overflow-hidden">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <h2 className="text-xs sm:text-base md:text-xl font-black text-[#1E4B57] whitespace-nowrap">
              مدیریت تصاویر ویترین و اسلایدر محصولات
            </h2>
            <span className="px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-[#C9A24B]/20 text-[#96752A] border border-[#C9A24B]/40 whitespace-nowrap shrink-0">
              {items.length} تصویر فعال
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Batch Upload Multi-Images Button */}
          <label className="bg-gradient-to-r from-[#C9A24B] to-[#96752A] hover:brightness-105 text-[#1E4B57] px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-[#C9A24B]/20 cursor-pointer active:scale-98">
            <Images className="w-4 h-4 text-[#1E4B57]" />
            <span>{isBatchUploading ? 'در حال آپلود چندگانه...' : 'آپلود چند عکس همزمان (۱۰+ عکس)'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isBatchUploading}
              onChange={handleBatchUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleAddNewSlide}
            className="bg-[#346D80] hover:bg-[#285767] text-[#EDEAE4] px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#346D80]/20 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#C9A24B]" />
            <span>افزودن اسلاید تک</span>
          </button>
        </div>
      </div>

      {/* Batch Upload Progress Banner */}
      {isBatchUploading && batchProgress && (
        <div className="bg-[#1E4B57] text-[#EDEAE4] p-4 sm:p-5 rounded-2xl border border-[#C9A24B]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-[#C9A24B] animate-spin shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                <span>در حال پردازش و بارگذاری پرسرعت تصاویر ({batchProgress.completed} از {batchProgress.total})</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C9A24B]/20 text-[#C9A24B] font-bold">
                  {Math.round((batchProgress.completed / Math.max(1, batchProgress.total)) * 100)}%
                </span>
              </div>
              <div className="text-[11px] text-[#EDEAE4]/70 mt-1">
                تصاویر به صورت هوشمند فشرده شده و با حداکثر سرعت در ویترین ذخیره می‌شوند.
              </div>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div 
              className="bg-gradient-to-r from-[#C9A24B] to-[#e7cb8a] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(batchProgress.completed / Math.max(1, batchProgress.total)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تغییرات اسلایدر و تصاویر ویترین با موفقیت ذخیره شد و در صفحه اصلی سایت به روزرسانی گردید.</span>
        </div>
      )}

      {/* Slides Cards List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={item.id || index}
            className="bg-white/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/80 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Image Preview & Upload Controls */}
              <div className="w-full lg:w-72 shrink-0 space-y-3">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#1E4B57] border border-[#1E4B57]/20 shadow-inner group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback placeholder if broken URL
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1200&auto=format&fit=crop&q=85';
                    }}
                  />
                  {/* Slide number badge */}
                  <span className="absolute top-2.5 right-2.5 bg-[#1E4B57]/90 text-[#EDEAE4] text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-md shadow-sm border border-white/15">
                    اسلاید {index + 1} از {items.length}
                  </span>
                </div>

                {/* Upload from file button */}
                <div className="space-y-1.5">
                  <label className="w-full py-2 px-3 rounded-xl bg-[#EDEAE4]/80 hover:bg-[#EDEAE4] border border-[#7FA69C]/40 text-[#1E4B57] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                    {uploadingIndex === index ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#346D80] animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#346D80]" />
                    )}
                    <span>
                      {uploadingIndex === index ? 'در حال بهینه‌سازی و آپلود...' : 'انتخاب عکس (تکی یا چندتایی)'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploadingIndex === index || isBatchUploading}
                      onChange={(e) => handleImageFileUpload(index, e)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#7FA69C] block text-center">
                    می‌توانید همزمان ۱۰ یا بیشتر عکس انتخاب فرمایید
                  </span>
                </div>
              </div>

              {/* Form Fields for this Slide */}
              <div className="flex-1 w-full space-y-4 text-[#1E4B57]">
                {/* Direct Image URL input */}
                <div>
                  <label className="block text-xs font-bold text-[#1E4B57] mb-1">
                    آدرس مستقیم تصویر (Image URL / لینک عکس)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => handleUpdateItem(index, 'image', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-xs bg-white/90 border border-[#7FA69C]/30 rounded-xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57] font-mono"
                    />
                    {item.image && (
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-[#EDEAE4] hover:bg-[#EDEAE4]/80 text-[#1E4B57] rounded-xl text-xs font-bold flex items-center justify-center shrink-0"
                        title="مشاهده تصویر در اندازه اصلی"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Row Actions: Reorder & Delete */}
                <div className="pt-2 border-t border-[#1E4B57]/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-[#EDEAE4]/70 hover:bg-[#EDEAE4] disabled:opacity-30 text-[#1E4B57] transition-colors cursor-pointer"
                      title="انتقال به بالا (نمایش زودتر)"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                      className="p-1.5 rounded-lg bg-[#EDEAE4]/70 hover:bg-[#EDEAE4] disabled:opacity-30 text-[#1E4B57] transition-colors cursor-pointer"
                      title="انتقال به پایین (نمایش دیرتر)"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-[#7FA69C] mr-2">
                      ترتیب: {index + 1}
                    </span>

                    {/* Active / Inactive Toggle */}
                    <label className="flex items-center gap-1.5 text-xs text-[#1E4B57] font-bold cursor-pointer mr-3 px-2.5 py-1 rounded-lg bg-white/60 border border-[#1E4B57]/10 hover:bg-white transition-colors">
                      <input
                        type="checkbox"
                        checked={item.active !== false}
                        onChange={(e) => handleUpdateItem(index, 'active', e.target.checked)}
                        className="rounded text-[#346D80] focus:ring-[#346D80] w-3.5 h-3.5"
                      />
                      <span>{item.active !== false ? 'فعال در ویترین' : 'غیرفعال'}</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="حذف این عکس از اسلایدر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف از اسلایدر</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save Trigger */}
      <div className="p-4 bg-white/85 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs flex justify-between items-center">
        <span className="text-xs text-[#7FA69C] font-medium">
          مجموعاً {items.length} اسلاید در نوبت نمایش ویترین محصولات قرار دارد.
        </span>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-gradient-to-r from-[#C9A24B] to-[#96752A] hover:brightness-105 text-[#1E4B57] px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-[#C9A24B]/30 cursor-pointer active:scale-98 disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#1E4B57]" />
          <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره نهایی تمام تغییرات اسلایدر'}</span>
        </button>
      </div>
    </div>
  );
};