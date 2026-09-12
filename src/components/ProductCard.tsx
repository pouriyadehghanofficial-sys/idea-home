import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../services/storage';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-[#0F4C5C]/10 hover:border-[#0F4C5C]/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
    >
      {/* Image container */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-[#F8F7F4] cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Minimal Category Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#0F4C5C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
            {product.category}
          </span>
        </div>

        {/* Code badge if available */}
        {product.code && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/95 text-[#0F4C5C] text-[10px] font-mono font-latin font-bold px-2 py-0.5 rounded-md border border-black/5">
              {product.code}
            </span>
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>آماده سفارش با ۳۶ ماه ضمانت</span>
          </div>

          <h3 
            onClick={() => onViewDetails(product.id)}
            className="font-bold text-[#0F4C5C] text-base leading-snug hover:text-[#346D80] cursor-pointer transition-colors line-clamp-1 mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#0F4C5C]/70 line-clamp-2 leading-relaxed mb-4 font-normal">
            {product.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-[#0F4C5C]/8 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-[10px] text-[#A68A6D] block">قیمت تولیدی:</span>
            <span className="text-base font-black text-[#C99A3E] tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(product.id)}
            className="bg-[#0F4C5C] hover:bg-[#163E48] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>مشخصات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};