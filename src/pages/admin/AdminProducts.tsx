import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Sparkles,
  Layers,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Product, Category } from '../../types';
import { formatPrice, storageService } from '../../services/storage';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onAddCategory: (categoryName: string) => Promise<Category>;
  isModalOpenInitially?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onAddCategory,
  isModalOpenInitially = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenInitially);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formNewCategory, setFormNewCategory] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [formPrice, setFormPrice] = useState<number>(10000000);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formCode, setFormCode] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [formSpecs, setFormSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'جنس بدنه', value: 'استیل ضد زنگ ۳۰۴ و چوب راش فرآوری شده' },
    { key: 'پوشش سطح', value: 'رنگ الکترواستاتیک کوره‌ای مقاوم در برابر رطوبت' },
    { key: 'گارانتی', value: '۲۴ ماه ضمانت تعویض کارخانه آیدیا هوم' }
  ]);

  // Preset design imagery
  const presetImages = [
    { label: 'سرویس اکسسوری آشپزخانه', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80' },
    { label: 'استند نظم‌دهنده مدرن', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80' },
    { label: 'سرویس پذیرایی برنجی', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'ظروف چوب و استیل', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80' },
    { label: 'ارگانایزر چندکاره رومیزی', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80' },
    { label: 'ست کفگیر و ملاقه سیلیکونی', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80' }
  ];

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.name || 'لوازم آشپزخانه');
    setIsCreatingNewCategory(false);
    setFormNewCategory('');
    setFormPrice(2500000);
    setFormShortDesc('');
    setFormFullDesc('');
    setFormInStock(true);
    setFormIsFeatured(false);
    setFormCode(`IH-${Math.floor(100 + Math.random() * 900)}`);
    setFormImages([presetImages[0].url]);
    setFormSpecs([
      { key: 'جنس بدنه', value: 'استیل ضد زنگ ۳۰۴ و چوب راش فرآوری شده' },
      { key: 'پوشش سطح', value: 'رنگ الکترواستاتیک کوره‌ای مقاوم در برابر رطوبت' },
      { key: 'گارانتی', value: '۲۴ ماه ضمانت تعویض کارخانه آیدیا هوم' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setIsCreatingNewCategory(false);
    setFormNewCategory('');
    setFormPrice(p.price);
    setFormShortDesc(p.shortDescription || '');
    setFormFullDesc(p.fullDescription || '');
    setFormInStock(p.inStock);
    setFormIsFeatured(!!p.isFeatured);
    setFormCode(p.code || '');
    setFormImages(p.images || []);
    
    const specsArray = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
    setFormSpecs(specsArray.length > 0 ? specsArray : [{ key: 'جنس', value: '' }]);
    setIsModalOpen(true);
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    if (!formImages.includes(url.trim())) {
      setFormImages([...formImages, url.trim()]);
    }
    setFormImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files: File[] = (Array.from(fileList) as File[]).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setImageUploadError('تنها فایل‌های تصویری (JPEG, PNG, WebP) مجاز هستند.');
      return;
    }

    setImageUploadError('');
    setIsUploadingImage(true);
    try {
      const results = await storageService.uploadMultipleFiles(files, 'products');
      const successfulUrls = results.filter((r) => r.success && r.url).map((r) => r.url);
      if (successfulUrls.length > 0) {
        setFormImages((prev) => [...prev, ...successfulUrls]);
      } else {
        setImageUploadError('خطا در بارگذاری تصاویر');
      }
    } catch (err: any) {
      setImageUploadError(err.message || 'خطا در بارگذاری تصاویر');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  const handleAddSpecRow = () => {
    setFormSpecs([...formSpecs, { key: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setFormSpecs(formSpecs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'key' | 'value', val: string) => {
    const updated = [...formSpecs];
    updated[idx][field] = val;
    setFormSpecs(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    try {
      let finalCategory = formCategory;
      if (isCreatingNewCategory && formNewCategory.trim()) {
        const createdCat = await onAddCategory(formNewCategory.trim());
        finalCategory = createdCat.name;
      }

      const specsObj: Record<string, string> = {};
      formSpecs.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specsObj[s.key.trim()] = s.value.trim();
        }
      });

      const productPayload: Product = {
        id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
        name: formName.trim(),
        category: finalCategory,
        price: Number(formPrice),
        currency: 'IRT',
        shortDescription: formShortDesc.trim(),
        fullDescription: formFullDesc.trim() || formShortDesc.trim(),
        images: formImages.length > 0 ? formImages : [presetImages[0].url],
        specs: specsObj,
        inStock: formInStock,
        isFeatured: formIsFeatured,
        code: formCode.trim() || undefined,
        createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      await onSaveProduct(productPayload);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save product failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await onDeleteProduct(id);
    setDeleteConfirmId(null);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = p.name.toLowerCase().includes(q) || 
                    p.code?.toLowerCase().includes(q) || 
                    p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#1E4B57]">مدیریت محصولات کارخانه آیدیا هوم</h2>
          <p className="text-xs text-[#7FA69C] mt-1 font-medium">
            تعریف مدل‌های جدید، به‌روزرسانی قیمت عمده، تصاویر آلبوم و مشخصات کیفی
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] text-[#EDEAE4] px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#346D80]/20 flex items-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#C9A24B]" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#7FA69C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام کالا، کد مدل یا دسته‌بندی..."
            className="w-full pr-10 pl-4 py-2.5 bg-[#EDEAE4]/40 border border-[#7FA69C]/30 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-[#346D80] focus:bg-white text-[#1E4B57] transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-[#1E4B57] shrink-0">دسته‌بندی:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#EDEAE4]/50 border border-[#7FA69C]/30 text-[#1E4B57] text-xs font-bold rounded-2xl px-4 py-2.5 focus:outline-hidden focus:border-[#346D80] cursor-pointer"
          >
            <option value="all">همه دسته‌ها ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table with Frosted Glass styling */}
      <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1E4B57] text-[#EDEAE4]">
              <tr>
                <th className="p-4 font-bold">تصویر</th>
                <th className="p-4 font-bold">نام محصول و کد</th>
                <th className="p-4 font-bold">دسته‌بندی</th>
                <th className="p-4 font-bold">قیمت (تومان)</th>
                <th className="p-4 font-bold">وضعیت انبار</th>
                <th className="p-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E4B57]/10">
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#EDEAE4]/40 transition-colors">
                  <td className="p-4">
                    <img
                      src={p.images?.[0] ? getOptimizedImageUrl(p.images[0], { width: 100, quality: 70 }) : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-[#7FA69C]/30 bg-gray-50"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#1E4B57] text-xs sm:text-sm">{p.name}</div>
                    <div className="text-[11px] text-[#7FA69C] font-mono mt-0.5">
                      {p.code || p.id} {p.isFeatured && <span className="text-[#C9A24B] font-bold mr-1">★ برگزیده</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-[#346D80]/10 text-[#346D80] px-3 py-1 rounded-full font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#96752A]">
                    {formatPrice(p.price)}
                  </td>
                  <td className="p-4">
                    {p.inStock ? (
                      <span className="text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        موجود در انبار
                      </span>
                    ) : (
                      <span className="text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        سفارشی
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-[#346D80] hover:bg-[#346D80]/15 rounded-xl transition-colors cursor-pointer"
                        title="ویرایش محصول"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="حذف محصول"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[#7FA69C] text-xs font-medium">
                    محصولی با معیارهای جستجو پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E4B57]/10 bg-white/50">
            <div className="text-xs text-[#7FA69C]">
              نمایش {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} تا {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProducts.length)} از {filteredProducts.length} محصول
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-[#7FA69C]/30 text-[#1E4B57] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#1E4B57] px-2">
                صفحه {safeCurrentPage} از {totalPages}
              </span>
              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-[#7FA69C]/30 text-[#1E4B57] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#EDEAE4]/95 backdrop-blur-2xl rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-red-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-[#1E4B57]">آیا از حذف این محصول اطمینان دارید؟</h3>
            <p className="text-xs text-[#7FA69C]">
              این عملیات کالا را بلافاصله از انبار و فهرست محصولات سایت خارج خواهد کرد.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 text-xs font-bold text-[#1E4B57] hover:bg-white/80 rounded-2xl border border-white/60 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md transition-colors cursor-pointer"
              >
                تایید و حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#EDEAE4]/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-white/70 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1E4B57] text-[#EDEAE4] p-5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C9A24B]" />
                <h3 className="font-bold text-sm">
                  {editingProduct ? `ویرایش محصول: ${editingProduct.name}` : 'افزودن محصول جدید به کاتالوگ آیدیا هوم'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-[#1E4B57]">
              {/* Product Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                    نام محصول <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: جای مایع ظرفشویی بتنی مدل آریا"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] focus:bg-white text-[#1E4B57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                    کد کالا (مدل)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="IH-204"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] focus:bg-white text-[#1E4B57] font-mono"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-[#1E4B57]">
                      دسته‌بندی <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCategory(!isCreatingNewCategory)}
                      className="text-[11px] text-[#346D80] hover:underline font-bold cursor-pointer"
                    >
                      {isCreatingNewCategory ? 'انتخاب از لیست' : '+ ایجاد دسته جدید'}
                    </button>
                  </div>

                  {isCreatingNewCategory ? (
                    <input
                      type="text"
                      required
                      value={formNewCategory}
                      onChange={(e) => setFormNewCategory(e.target.value)}
                      placeholder="نام دسته‌بندی جدید (مثلا: ظروف پذیرایی سرامیکی)"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-amber-50 border border-amber-300 rounded-2xl text-[#1E4B57]"
                    />
                  ) : (
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                    قیمت واحد تولیدی (تومان) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57] font-mono font-bold"
                  />
                  <span className="text-[11px] text-[#96752A] font-bold block mt-1">
                    معادل: {formatPrice(formPrice)}
                  </span>
                </div>
              </div>

              {/* Toggles: InStock & Featured */}
              <div className="flex items-center gap-6 p-4 bg-white/60 rounded-2xl border border-[#7FA69C]/25">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1E4B57]">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 text-[#346D80] rounded-md"
                  />
                  <span>موجود در انبار کارخانه</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1E4B57]">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#346D80] rounded-md"
                  />
                  <span className="text-[#96752A]">نمایش به عنوان کالای برگزیده در صفحه اصلی</span>
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  توضیحات کوتاه (نمایش در کاتالوگ و کارت کالا) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="خلاصه ویژگی‌های کلیدی در یک یا دو جمله..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B57] mb-1.5">
                  توضیحات کامل و راهنمای سفارش عمده
                </label>
                <textarea
                  rows={3}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="توضیحات تفصیلی در مورد متریال، ابعاد، حداقل تیراژ سفارش و بسته‌بندی..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white/80 border border-[#7FA69C]/30 rounded-2xl focus:outline-hidden focus:border-[#346D80] text-[#1E4B57]"
                ></textarea>
              </div>

              {/* Images Manager */}
              <div className="space-y-3 p-4 bg-white/70 rounded-2xl border border-white/80 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#1E4B57] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#346D80]" />
                    <span>تصاویر محصول</span>
                  </label>
                  <span className="text-[11px] text-[#7FA69C] font-bold">
                    {formImages.length} تصویر فعال
                  </span>
                </div>

                {/* Previews */}
                <div className="flex flex-wrap gap-2.5">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#346D80] group shadow-xs">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}

                  {/* File upload button */}
                  <label className={`w-16 h-16 rounded-2xl border-2 border-dashed border-[#7FA69C]/50 hover:border-[#346D80] bg-white/90 flex flex-col items-center justify-center cursor-pointer transition-colors text-[#346D80] ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] mt-1 font-bold">
                      {isUploadingImage ? 'آپلود...' : 'آپلود عکس'}
                    </span>
                    <input type="file" multiple accept="image/*" disabled={isUploadingImage} onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {imageUploadError && (
                  <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {imageUploadError}
                  </p>
                )}

                {/* Add by URL */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={formImageUrlInput}
                    onChange={(e) => setFormImageUrlInput(e.target.value)}
                    placeholder="یا آدرس مستقیم تصویر (URL) را وارد کنید..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white/90 border border-[#7FA69C]/30 rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage(formImageUrlInput)}
                    className="bg-[#346D80] hover:bg-[#1E4B57] text-white text-xs px-4 py-2 rounded-2xl font-bold transition-colors cursor-pointer"
                  >
                    افزودن
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="pt-2 border-t border-[#1E4B57]/10">
                  <span className="text-[11px] text-[#7FA69C] block mb-1.5 font-bold">
                    پیشنهاد تصاویر منتخب آیدیا هوم:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddImage(preset.url)}
                        className="text-[10px] bg-white border border-[#7FA69C]/30 hover:border-[#346D80] text-[#1E4B57] px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Technical Specs Builder */}
              <div className="space-y-3 p-4 bg-white/70 rounded-2xl border border-white/80 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#1E4B57] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#346D80]" />
                    <span>مشخصات فنی و استانداردهای تولید</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs font-bold text-[#346D80] hover:underline cursor-pointer"
                  >
                    + افزودن سطر جدید
                  </button>
                </div>

                <div className="space-y-2">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                        placeholder="عنوان (مثلا: جنس کلاف)"
                        className="w-1/3 px-3.5 py-2 text-xs bg-white/90 border border-[#7FA69C]/30 rounded-2xl"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        placeholder="مقدار (مثلا: استیل ۳۰۴)"
                        className="flex-1 px-3.5 py-2 text-xs bg-white/90 border border-[#7FA69C]/30 rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#1E4B57]/10 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-[#1E4B57] hover:bg-white/80 rounded-2xl border border-white/60 transition-colors cursor-pointer"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-[#346D80] to-[#1E4B57] hover:from-[#2c5f70] hover:to-[#163842] disabled:opacity-50 text-[#EDEAE4] font-bold text-xs px-6 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>{saving ? 'در حال ذخیره‌سازی...' : 'ذخیره نهایی کالا'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};