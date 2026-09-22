import React, { useState } from 'react';
import { KITCHEN_PRODUCTS, KitchenProductItem } from '../data/kitchenProducts';
import { ProductIllustration } from './ProductIllustration';
import { Check, ArrowLeft, ShoppingCart, Sparkles, Filter } from 'lucide-react';

interface SolutionsProps {
  onOpenOrderModal: (product?: KitchenProductItem) => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onOpenOrderModal }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'trays', label: 'سینی‌های پلاستیکی' },
    { id: 'scales', label: 'ترازوهای آشپزخانه' },
    { id: 'containers', label: 'ظروف نگهداری مواد غذایی' },
    { id: 'accessories', label: 'سایر لوازم آشپزخانه' },
  ];

  const filteredProducts = KITCHEN_PRODUCTS.filter((prod) => {
    if (activeFilter === 'all') return true;
    return prod.category === activeFilter;
  });

  return (
    <section id="products" className="py-24 relative overflow-hidden bg-[#1E4B57]/40" dir="rtl">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#346D80]/15 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with colored badge above it */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEAE4]/[0.08] border border-[#7FA69C]/30 text-xs font-bold text-[#7FA69C] font-vazir">
            سبد تولیدات کارخانه آیدیا هوم
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#EDEAE4] font-vazir">
            ویترین دسته‌بندی محصولات خانه و آشپزخانه
          </h2>
          <p className="text-base text-[#EDEAE4]/80 leading-relaxed font-vazir font-normal max-w-2xl mx-auto">
            محصولات ما با استفاده از خطوط تزریق پلاستیک تمام‌اتوماتیک و آزمون‌های کنترل کیفی دقیق، جهت توزیع در فروشگاه‌های معتبر و صادرات منطقه‌ای تولید می‌شوند.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer font-vazir ${
                activeFilter === cat.id
                  ? 'bg-[#346D80] text-[#EDEAE4] shadow-md border border-[#7FA69C]/40'
                  : 'bg-[#EDEAE4]/[0.06] text-[#EDEAE4]/75 hover:text-[#EDEAE4] border border-[#EDEAE4]/10 hover:bg-[#EDEAE4]/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="glass-panel glass-panel-hover p-6 rounded-[24px] flex flex-col justify-between border border-[#EDEAE4]/15 relative group"
            >
              <div className="space-y-4">
                {/* Product Illustration Placeholder */}
                <ProductIllustration category={prod.category} title={prod.title} />

                {/* Tag & Badge Row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-bold text-[#7FA69C] bg-[#1E4B57] px-3 py-1 rounded-lg border border-[#7FA69C]/30 font-vazir">
                    {prod.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-[#C9A24B] bg-[#C9A24B]/10 px-2.5 py-1 rounded-lg border border-[#C9A24B]/25 font-vazir">
                    {prod.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#EDEAE4] font-vazir group-hover:text-[#C9A24B] transition-colors text-right">
                  {prod.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#EDEAE4]/75 leading-relaxed font-vazir font-normal text-right">
                  {prod.description}
                </p>

                {/* Specifications Key-Values */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-vazir">
                  {prod.specs.map((sp, idx) => (
                    <div key={idx} className="bg-[#EDEAE4]/[0.04] p-2 rounded-xl border border-[#EDEAE4]/[0.06] text-right">
                      <span className="text-[#7FA69C] block text-[10px]">{sp.label}:</span>
                      <span className="text-[#EDEAE4] font-semibold">{sp.value}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <div className="pt-3 border-t border-[#EDEAE4]/10 space-y-2">
                  <span className="text-[11px] font-bold text-[#EDEAE4]/60 block mb-1.5 font-vazir text-right">
                    ویژگی‌های برجسته محصول:
                  </span>
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#EDEAE4]/85 font-vazir text-right">
                      <Check className="w-3.5 h-3.5 text-[#7FA69C] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-6 mt-6 border-t border-[#EDEAE4]/10">
                <button
                  onClick={() => onOpenOrderModal(prod)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#EDEAE4]/[0.08] hover:bg-[#C9A24B] hover:text-[#1E4B57] text-[#EDEAE4] border border-[#EDEAE4]/20 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-vazir"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>استعلام موجودی و سفارش عمده</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};