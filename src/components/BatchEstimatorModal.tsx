import React, { useState } from 'react';
import { X, Calculator, ArrowLeft, TrendingUp, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';

interface BatchEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderWithDetails: (details: string) => void;
}

export const BatchEstimatorModal: React.FC<BatchEstimatorModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderWithDetails
}) => {
  const [productCategory, setProductCategory] = useState<'trays' | 'scales' | 'containers'>('trays');
  const [cartons, setCartons] = useState<number>(5);

  if (!isOpen) return null;

  // Calculation parameters based on category
  const getProductMeta = () => {
    switch (productCategory) {
      case 'trays':
        return {
          title: 'سینی‌های پلاستیکی تقویت‌شده',
          perCarton: 24,
          unitCostApprox: 95000, // Toman approx
          suggestedRetail: 165000,
        };
      case 'scales':
        return {
          title: 'ترازوهای دقیق دیجیتال آشپزخانه',
          perCarton: 12,
          unitCostApprox: 380000,
          suggestedRetail: 590000,
        };
      case 'containers':
        return {
          title: 'ست‌های ظروف نگهداری ۴ پارچه',
          perCarton: 16,
          unitCostApprox: 210000,
          suggestedRetail: 340000,
        };
    }
  };

  const meta = getProductMeta();
  const totalUnits = cartons * meta.perCarton;
  
  // Volume discount tiers
  let discountPercent = 0;
  if (cartons >= 20) discountPercent = 12;
  else if (cartons >= 10) discountPercent = 8;
  else if (cartons >= 5) discountPercent = 4;

  const totalWholesalePrice = totalUnits * meta.unitCostApprox * (1 - discountPercent / 100);
  const totalRetailRevenue = totalUnits * meta.suggestedRetail;
  const estimatedProfit = totalRetailRevenue - totalWholesalePrice;

  const handleProceedOrder = () => {
    const detailString = `محاسبه استعلام: ${cartons} کارتن (${totalUnits} عدد) از ${meta.title} - تخفیف کارخانه: ${discountPercent}٪`;
    onOpenOrderWithDetails(detailString);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E4B57]/80 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div className="glass-panel bg-[#1E4B57]/95 border border-[#EDEAE4]/20 rounded-[28px] max-w-lg w-full overflow-hidden shadow-2xl relative text-right">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EDEAE4]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDEAE4]/[0.08] border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#EDEAE4] font-vazir">
                محاسبه‌گر تیراژ و سود فروشگاهی
              </h3>
              <p className="text-[11px] text-[#7FA69C] font-vazir">
                تخمین حجم کارتن، تخفیف پلکانی کارخانه و حاشیه سود
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-[#EDEAE4]/85 mb-2 font-vazir">
              انتخاب گروه کالایی:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProductCategory('trays')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-vazir transition-all cursor-pointer ${
                  productCategory === 'trays'
                    ? 'bg-[#346D80] text-[#EDEAE4] border border-[#C9A24B]/50'
                    : 'bg-[#EDEAE4]/[0.06] text-[#EDEAE4]/70 hover:bg-[#EDEAE4]/10'
                }`}
              >
                سینی‌های پلاستیکی
              </button>
              <button
                type="button"
                onClick={() => setProductCategory('scales')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-vazir transition-all cursor-pointer ${
                  productCategory === 'scales'
                    ? 'bg-[#346D80] text-[#EDEAE4] border border-[#C9A24B]/50'
                    : 'bg-[#EDEAE4]/[0.06] text-[#EDEAE4]/70 hover:bg-[#EDEAE4]/10'
                }`}
              >
                ترازوهای دیجیتال
              </button>
              <button
                type="button"
                onClick={() => setProductCategory('containers')}
                className={`py-2 px-3 rounded-xl text-xs font-bold font-vazir transition-all cursor-pointer ${
                  productCategory === 'containers'
                    ? 'bg-[#346D80] text-[#EDEAE4] border border-[#C9A24B]/50'
                    : 'bg-[#EDEAE4]/[0.06] text-[#EDEAE4]/70 hover:bg-[#EDEAE4]/10'
                }`}
              >
                ظروف نگهداری
              </button>
            </div>
          </div>

          {/* Cartons Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#EDEAE4]/85 font-vazir">
                تعداد کارتن درخواستی:
              </span>
              <span className="text-sm font-black text-[#C9A24B] font-vazir px-2.5 py-0.5 rounded-md bg-[#C9A24B]/10 border border-[#C9A24B]/20">
                {cartons} کارتن ({totalUnits} عدد)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={cartons}
              onChange={(e) => setCartons(Number(e.target.value))}
              className="w-full h-2 bg-[#EDEAE4]/20 rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
            />
            <div className="flex justify-between text-[10px] text-[#EDEAE4]/50 font-vazir mt-1">
              <span>۱ کارتن</span>
              <span>۱۰ کارتن (تخفیف ۸٪)</span>
              <span>۵۰ کارتن (تخفیف ۱۲٪)</span>
            </div>
          </div>

          {/* Results Card */}
          <div className="p-4 rounded-2xl bg-[#EDEAE4]/[0.06] border border-[#EDEAE4]/12 space-y-3 font-vazir">
            <div className="flex items-center justify-between text-xs text-[#EDEAE4]/80">
              <span>تعداد کل در کارتن مادر:</span>
              <span className="font-bold text-[#EDEAE4]">{totalUnits} عدد</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#EDEAE4]/80">
              <span>درصد تخفیف تیراژ کارخانه:</span>
              <span className="font-bold text-[#7FA69C]">{discountPercent > 0 ? `${discountPercent}٪ تخفیف نقدی` : 'قیمت پایه کارخانه'}</span>
            </div>
            <div className="pt-2 border-t border-[#EDEAE4]/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7FA69C] block">تخمین سود ناخالص فروشگاه:</span>
                <span className="text-base sm:text-lg font-black text-[#C9A24B]">
                  {Math.round(estimatedProfit).toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-[#7FA69C]/20 text-[#7FA69C]">
                سودآوری حدود ۴۵٪
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleProceedOrder}
            className="btn-gold w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md font-vazir"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ثبت پیش‌فاکتور رسمی برای این تیراژ</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-[#EDEAE4]/60 text-center font-vazir">
            محاسبات فوق تخمینی است و قیمت دقیق با صدور پیش‌فاکتور رسمی توسط واحد فروش اعلام می‌گردد.
          </p>
        </div>

      </div>
    </div>
  );
};