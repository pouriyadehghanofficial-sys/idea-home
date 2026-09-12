import React from 'react';
import { 
  Package, 
  Layers, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  ArrowLeft, 
  Cloud, 
  Eye, 
  Sparkles,
  TrendingUp,
  Clock,
  Sliders,
  BookOpen
} from 'lucide-react';
import { Product, ContactMessage } from '../../types';
import { formatPrice } from '../../services/storage';

interface AdminDashboardProps {
  products: Product[];
  messages: ContactMessage[];
  categoriesCount: number;
  onNavigate: (tab: string, productId?: string) => void;
  onOpenNewProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  messages,
  categoriesCount,
  onNavigate,
  onOpenNewProduct
}) => {
  const inStockCount = products.filter(p => p.inStock).length;
  const unreadMessages = messages.filter(m => m.status === 'unread');
  const recentProducts = products.slice(0, 4);
  const recentMessages = messages.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner with Glass Accent */}
      <div className="bg-gradient-to-r from-[#1E4B57] via-[#275b69] to-[#346D80] rounded-3xl p-6 sm:p-8 text-[#EDEAE4] shadow-lg shadow-[#1E4B57]/15 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#C9A24B]/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C9A24B] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>سامانه پایش کارخانه آیدیا هوم</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            داشبورد مدیریت خط تولید و سفارشات عمده
          </h2>
          <p className="text-xs sm:text-sm text-[#EDEAE4]/80 mt-1 max-w-xl font-medium">
            گزارش لحظه‌ای موجودی انبار، آلبوم محصولات، کاتالوگ رسمی و پیام‌های استعلام از سراسر کشور
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('admin-slider')}
            className="bg-white/15 hover:bg-white/25 text-[#EDEAE4] px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xs border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>مدیریت عکس‌های ویترین</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewProduct}
            className="bg-[#C9A24B] hover:bg-[#b8913d] text-[#1E4B57] px-4 py-2.5 rounded-2xl font-black text-xs shadow-md shadow-[#C9A24B]/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن محصول جدید</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid in Frosted Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-[#346D80]/15 text-[#346D80] flex items-center justify-center font-bold shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7FA69C] block font-medium">کل محصولات</span>
            <span className="text-2xl font-black text-[#1E4B57]">{products.length}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 text-[#96752A] flex items-center justify-center font-bold shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7FA69C] block font-medium">دسته‌بندی‌ها</span>
            <span className="text-2xl font-black text-[#1E4B57]">{categoriesCount}</span>
          </div>
        </div>

        {/* In-Stock Products */}
        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7FA69C] block font-medium">موجود در انبار</span>
            <span className="text-2xl font-black text-emerald-700">{inStockCount}</span>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-white/85 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-2xl bg-[#346D80]/15 text-[#1E4B57] flex items-center justify-center font-bold relative shrink-0">
            <MessageSquare className="w-6 h-6" />
            {unreadMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse border-2 border-white"></span>
            )}
          </div>
          <div>
            <span className="text-xs text-[#7FA69C] block font-medium">استعلام‌های جدید</span>
            <span className="text-2xl font-black text-[#1E4B57]">{unreadMessages.length}</span>
          </div>
        </div>
      </div>

      {/* Cloudflare Storage & Sync Status Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E4B57] to-[#346D80] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Cloud className="w-5 h-5 text-[#C9A24B]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E4B57] flex items-center gap-2">
              <span>پایگاه داده ابری مرکزی (Cloudflare KV / Supabase + ImageKit)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                متصل به سرور مرکزی
              </span>
            </h4>
            <p className="text-xs text-[#7FA69C] mt-0.5">
              تمامی محصولات، دسته‌بندی‌ها و کاتالوگ از طریق API سمت سرور ذخیره می‌شوند و بین تمام دستگاه‌ها و مرورگرها همگام هستند.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('admin-cloudflare')}
          className="text-xs font-bold text-[#346D80] hover:text-[#1E4B57] bg-white hover:bg-[#EDEAE4]/50 px-4 py-2.5 rounded-2xl border border-[#7FA69C]/30 shadow-xs shrink-0 transition-colors cursor-pointer"
        >
          مشاهده مستندات اتصال
        </button>
      </div>

      {/* Grid of Recent Products & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-7 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E4B57]/10 pb-3">
            <h3 className="font-black text-sm text-[#1E4B57] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#346D80]" />
              <span>آخرین محصولات اضافه شده</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('admin-products')}
              className="text-xs font-bold text-[#346D80] hover:text-[#1E4B57] flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده و ویرایش همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1E4B57]/10 text-xs">
            {recentProducts.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1E4B57] truncate text-xs sm:text-sm">{p.name}</h4>
                    <span className="text-[11px] text-[#7FA69C] block">{p.category}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="font-bold text-[#96752A] block">{formatPrice(p.price)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    p.inStock 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.inStock ? 'موجود در انبار' : 'تولید سفارشی'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E4B57]/10 pb-3">
            <h3 className="font-black text-sm text-[#1E4B57] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#346D80]" />
              <span>آخرین استعلام‌ها و پیام‌ها</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('admin-messages')}
              className="text-xs font-bold text-[#346D80] hover:text-[#1E4B57] flex items-center gap-1 cursor-pointer"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {recentMessages.length > 0 ? (
              recentMessages.map((m) => (
                <div 
                  key={m.id} 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    m.status === 'unread' 
                      ? 'bg-[#346D80]/10 border-[#346D80]/30 shadow-xs' 
                      : 'bg-[#EDEAE4]/40 border-white/70'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#1E4B57]">{m.name}</span>
                    <span className="text-[10px] text-[#7FA69C]">{m.date.split('-')[0]}</span>
                  </div>
                  <p className="text-[#1E4B57]/80 line-clamp-2 text-[11px] leading-relaxed">
                    {m.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#7FA69C] text-xs">
                هیچ پیامی در صندوق دریافت وجود ندارد.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};