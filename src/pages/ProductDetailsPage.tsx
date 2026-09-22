import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Share2, 
  Check, 
  Layers,
  FileCheck,
  ImageIcon
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../services/storage';
import { ProductCard } from '../components/ProductCard';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';

interface ProductDetailsPageProps {
  product: Product;
  allProducts: Product[];
  onNavigate: (tab: string, productId?: string) => void;
  onOpenOrderModal: (product: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  onNavigate,
  onOpenOrderModal
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const images = (product.images || [])
    .filter(img => !isLegacyMockImage(img))
    .map(img => getOptimizedImageUrl(img));

  // Related products from same category
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappText = encodeURIComponent(
    `با سلام، مایل به استعلام قیمت و ثبت سفارش محصول "${product.name}" با کد "${product.code || product.id}" از کارخانه آراسته هستم.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & back */}
      <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-[#0F4C5C]/60 border-b border-[#0F4C5C]/10 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-[#0F4C5C] transition-colors cursor-pointer">
            صفحه اصلی
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-[#0F4C5C] transition-colors cursor-pointer">
            محصولات
          </button>
          <span>/</span>
          <span className="text-[#0F4C5C] font-semibold">{product.category}</span>
          <span>/</span>
          <span className="text-[#0F4C5C] font-bold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => onNavigate('products')}
          className="text-[#0F4C5C] hover:text-[#C99A3E] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به لیست محصولات</span>
        </button>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Main Large Image */}
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-white border border-[#0F4C5C]/10 shadow-xs relative group flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <ImageIcon className="w-16 h-16 mb-2 text-[#0F4C5C]/20" />
                <span className="text-xs text-gray-400 font-vazir">تصویری برای این محصول ثبت نشده است</span>
              </div>
            )}
            {product.isFeatured && (
              <span className="absolute top-4 right-4 bg-[#C99A3E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>محصول ویژه</span>
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-[#0F4C5C] shadow-xs'
                      : 'border-[#0F4C5C]/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee banner below images */}
          <div className="bg-white border border-[#0F4C5C]/10 p-4 rounded-xl flex items-center justify-around text-xs text-[#0F4C5C] shadow-xs">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#C99A3E]" />
              <span>۳ سال گارانتی کتبی</span>
            </div>
            <div className="w-px h-4 bg-[#0F4C5C]/10"></div>
            <div className="flex items-center gap-2 font-bold">
              <Truck className="w-4 h-4 text-[#C99A3E]" />
              <span>بسته‌بندی ضربه‌گیر صادراتی</span>
            </div>
            <div className="w-px h-4 bg-[#0F4C5C]/10"></div>
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-[#C99A3E]" />
              <span>امکان ابعاد سفارشی</span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0F4C5C] bg-[#0F4C5C]/8 px-3 py-1 rounded-lg">
                {product.category}
              </span>

              {product.code && (
                <span className="text-xs font-latin font-medium text-[#0F4C5C]/60 bg-white px-2.5 py-1 rounded-lg border border-[#0F4C5C]/10">
                  کد: {product.code}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F4C5C] leading-snug tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Stock Status Badge */}
          <div className="flex items-center gap-3">
            {product.inStock ? (
              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                موجود در انبار مرکزی کارخانه (آماده بارگیری)
              </span>
            ) : (
              <span className="bg-[#F0EEEA] text-[#0F4C5C] text-xs font-bold px-3 py-1 rounded-full border border-[#0F4C5C]/15 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-[#0F4C5C]/60" />
                تولید بر اساس سفارش (تحویل ۷ تا ۱۰ روز کاری)
              </span>
            )}

            <button
              onClick={handleShare}
              className="text-xs font-medium text-[#0F4C5C]/70 hover:text-[#0F4C5C] flex items-center gap-1.5 mr-auto cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#0F4C5C]/10 transition-colors"
              title="کپی لینک محصول"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'اشتراک‌گذاری'}</span>
            </button>
          </div>

          {/* Price Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#0F4C5C]/10 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs text-[#0F4C5C]/60 block font-normal">قیمت مصوب واحد تولیدی:</span>
              <span className="text-2xl sm:text-3xl font-black text-[#0F4C5C] tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="text-left text-xs text-[#0F4C5C]/70 bg-[#F8F7F4] px-3 py-1.5 rounded-xl border border-[#0F4C5C]/10">
              <span className="block font-medium">عرضه مستقیم کارخانه</span>
              <span className="block text-[#C99A3E] font-bold mt-0.5">بدون واسطه تجاری</span>
            </div>
          </div>

          {/* Short description */}
          <div className="text-sm text-[#0F4C5C]/80 leading-relaxed bg-white p-4.5 rounded-xl border border-[#0F4C5C]/10 font-normal">
            {product.shortDescription}
          </div>

          {/* Order / Inquiry CTAs */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp direct order */}
              <a
                href={`https://wa.me/989123456789?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>استعلام و مشاوره واتساپ</span>
              </a>

              {/* Instant quote form trigger */}
              <button
                onClick={() => onOpenOrderModal(product)}
                className="bg-[#C99A3E] hover:bg-[#B58832] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs active:scale-98"
              >
                <FileCheck className="w-4 h-4" />
                <span>درخواست پیش‌فاکتور رسمی</span>
              </button>
            </div>

            {/* Direct phone call */}
            <a
              href="tel:02188990011"
              className="w-full bg-[#0F4C5C] hover:bg-[#153D49] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer transition-colors shadow-xs active:scale-98"
            >
              <Phone className="w-4 h-4 text-[#C99A3E]" />
              <span>تماس مستقیم با واحد فروش: ۰۲۱-۸۸۹۹۰۰۱۱ (داخلی ۱۰۳)</span>
            </a>
          </div>

          {/* Technical Specs Summary */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-[#0F4C5C]/10">
              <h3 className="font-bold text-xs text-[#0F4C5C] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C99A3E]" />
                <span>مشخصات فنی و استاندارد ساخت</span>
              </h3>

              <div className="bg-white rounded-xl border border-[#0F4C5C]/10 overflow-hidden text-xs shadow-xs">
                <div className="divide-y divide-[#0F4C5C]/8">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3 hover:bg-[#F8F7F4] transition-colors">
                      <span className="font-bold text-[#0F4C5C] col-span-1">{key}</span>
                      <span className="text-[#0F4C5C]/80 col-span-2">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Description Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0F4C5C]/10 shadow-xs space-y-3">
        <h2 className="text-xl font-bold text-[#0F4C5C] border-b border-[#0F4C5C]/10 pb-3">
          بررسی تخصصی و راهنمای متریال و ارگونومی
        </h2>
        <div className="text-sm text-[#0F4C5C]/80 leading-relaxed text-justify space-y-2 font-normal">
          <p>{product.fullDescription}</p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#A68A6D]/20">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0F4C5C]">
              محصولات مرتبط در دسته‌بندی {product.category}
            </h2>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-semibold text-[#346D80] hover:text-[#0F4C5C] flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده همه</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={(id) => onNavigate('product-details', id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};