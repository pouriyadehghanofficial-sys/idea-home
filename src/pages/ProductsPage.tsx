import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Check, RefreshCw, X } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  onViewDetails: (productId: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  initialCategory,
  onViewDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'featured'>('newest');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category check
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Stock check
      if (onlyInStock && !product.inStock) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription?.toLowerCase().includes(q);
        const matchesCode = product.code?.toLowerCase().includes(q);
        const matchesCat = product.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCode && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategory, onlyInStock, searchQuery, sortBy]);

  const allCategoryNames = useMemo(() => {
    const list = categories.map(c => c.name);
    // Also include any unique categories from actual products
    products.forEach(p => {
      if (p.category && !list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [categories, products]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyInStock(false);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & description */}
      <div className="border-b border-[#0F4C5C]/10 pb-6">
        <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#0F4C5C]/15 shadow-xs mb-3">
          <span className="w-2 h-2 rounded-full bg-[#C99A3E]"></span>
          <span className="text-[#0F4C5C] font-semibold text-xs">
            کاتالوگ خط تولید صنایع آراسته
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F4C5C]">
          آرشیو و معرفی محصولات تولیدی
        </h1>
        <p className="text-sm text-[#0F4C5C]/75 mt-2 font-normal">
          تمام محصولات مستقیماً در کارخانه آراسته طراحی و تولید می‌شوند و بدون واسطه با قیمت مصوب شرکتی به دست مشتریان می‌رسند.
        </p>
      </div>

      {/* Filter and search toolbar - Clean, Minimalist */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#0F4C5C]/10 space-y-4">
        {/* Top search & sorts */}
        <div className="flex flex-col md:flex-row items-center gap-3.5">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A68A6D] absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام مدل، کد محصول یا مشخصات فنی..."
              className="w-full pr-11 pl-10 py-2.5 bg-[#F8F7F4] border border-[#0F4C5C]/15 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#0F4C5C] focus:bg-white transition-all text-[#0F4C5C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-[#0F4C5C] shrink-0 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C99A3E]" />
              <span>مرتب‌سازی:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F8F7F4] border border-[#0F4C5C]/15 text-[#0F4C5C] text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-[#0F4C5C] cursor-pointer"
            >
              <option value="newest">جدیدترین مدل‌ها</option>
              <option value="featured">محصولات ویژه</option>
              <option value="price-asc">ارزان‌ترین قیمت</option>
              <option value="price-desc">گران‌ترین قیمت</option>
            </select>

            {/* In stock toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                onlyInStock
                  ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                  : 'bg-[#F8F7F4] text-[#0F4C5C] border-[#0F4C5C]/15 hover:border-[#0F4C5C]/30'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${onlyInStock ? 'bg-white border-white' : 'border-[#A68A6D]'}`}>
                {onlyInStock && <Check className="w-3 h-3 text-[#0F4C5C]" />}
              </div>
              <span>فقط موجود در کارخانه</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-3 border-t border-[#0F4C5C]/8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'bg-[#F8F7F4] text-[#0F4C5C] hover:bg-[#F0EEEA] border border-[#0F4C5C]/10'
            }`}
          >
            همه محصولات ({products.length})
          </button>

          {allCategoryNames.map((catName) => {
            const count = products.filter(p => p.category === catName).length;
            const isSelected = selectedCategory === catName;
            return (
              <button
                key={catName}
                onClick={() => setSelectedCategory(catName)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F4C5C] text-white shadow-xs'
                    : 'bg-[#F8F7F4] text-[#0F4C5C] hover:bg-[#F0EEEA] border border-[#0F4C5C]/10'
                }`}
              >
                {catName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-[#A68A6D] px-1">
        <span className="font-medium">نمایش {filteredProducts.length} محصول از مجموع {products.length} محصول تولیدی</span>
        {(searchQuery || selectedCategory !== 'all' || onlyInStock) && (
          <button
            onClick={clearFilters}
            className="text-[#346D80] hover:text-[#0F4C5C] font-bold flex items-center gap-1.5 cursor-pointer bg-white/70 px-3 py-1 rounded-full border border-white shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>پاک کردن فیلترها</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/90 space-y-4 shadow-[0_12px_36px_-10px_rgba(15,76,92,0.06)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0EEEA] flex items-center justify-center text-[#A68A6D]">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-black text-lg text-[#0F4C5C]">
            هیچ محصولی با فیلترهای انتخابی یافت نشد
          </h3>
          <p className="text-xs text-[#A68A6D] max-w-md mx-auto leading-relaxed font-light">
            لطفاً عبارت جستجو یا دسته‌بندی انتخابی را تغییر دهید، یا تمام فیلترها را برای مشاهده محصولات اولیه بازنشانی فرمایید.
          </p>
          <button
            onClick={clearFilters}
            className="btn-gold px-6 py-2.5 text-xs cursor-pointer"
          >
            نمایش تمامی محصولات
          </button>
        </div>
      )}
    </div>
  );
};