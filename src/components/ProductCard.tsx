import React, { useState } from 'react';
import { CheckCircle2, ArrowLeft, ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../services/storage';
import { getOptimizedImageUrl, isLegacyMockImage } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const rawImage = product.images?.[0];
  const primaryImage = !isLegacyMockImage(rawImage) ? getOptimizedImageUrl(rawImage) : '';

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-[#0F4C5C]/10 hover:border-[#0F4C5C]/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
    >
      {/* Image container */}
      <div 
        className="relative aspect-4/3 overflow-hidden bg-[#F8F7F4] cursor-pointer flex items-center justify-center"
        onClick={() => onViewDetails(product.id)}
      >
        {primaryImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-1">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <img
              src={primaryImage}
              alt={product.name}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
            <ImageIcon className="w-10 h-10 mb-1 text-[#0F4C5C]/30" />
            <span className="text-[10px] text-gray-400 font-vazir">تصویر در دسترس نیست</span>
          </div>
        )}

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