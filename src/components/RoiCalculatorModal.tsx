import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Calendar, Zap, ArrowRight } from 'lucide-react';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookDemo: () => void;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenBookDemo,
}) => {
  const [repsCount, setRepsCount] = useState<number>(2);
  const [dealSize, setDealSize] = useState<number>(35000);
  const [closeRate, setCloseRate] = useState<number>(22);

  if (!isOpen) return null;

  // Realistic B2B SDR benchmarks: ~14 qualified meetings per rep/month
  const meetingsPerRepPerMonth = 14;
  const totalMeetingsPerQuarter = repsCount * meetingsPerRepPerMonth * 3;
  const closedDealsPerQuarter = Math.round(totalMeetingsPerQuarter * (closeRate / 100));
  const quarterlyRevenue = closedDealsPerQuarter * dealSize;
  const annualRevenue = quarterlyRevenue * 4;

  // Benchmark estimated cost of RepTeam vs In-House ($130k base + OTE + tools + recruiter fee = ~$180k/rep/yr)
  const inHouseCost = repsCount * 175000;
  const repTeamEstimatedCost = repsCount * 85000;
  const directCostSavings = inHouseCost - repTeamEstimatedCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E4B57]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-[28px] border border-[#EDEAE4]/25 shadow-2xl bg-[#1E4B57]/95 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#EDEAE4]/10 hover:bg-[#EDEAE4]/20 text-[#EDEAE4] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#346D80] flex items-center justify-center text-[#C9A24B]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7FA69C]">
            Interactive Pipeline Model
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-[#EDEAE4] tracking-tight mb-2">
          Calculate Your Pipeline ROI
        </h3>
        <p className="text-xs text-[#EDEAE4]/70 mb-6">
          Adjust the parameters below to see the estimated quarterly pipeline velocity and cost savings using dedicated RepTeam squads.
        </p>

        {/* Inputs */}
        <div className="space-y-5 mb-8">
          {/* Number of Reps Slider */}
          <div className="p-4 rounded-xl bg-[#EDEAE4]/[0.05] border border-[#EDEAE4]/10">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#EDEAE4]">
                Dedicated Squad Size (SDRs / AEs)
              </label>
              <span className="text-base font-extrabold text-[#C9A24B]">
                {repsCount} {repsCount === 1 ? 'Rep' : 'Reps'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={repsCount}
              onChange={(e) => setRepsCount(Number(e.target.value))}
              className="w-full accent-[#C9A24B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#EDEAE4]/50 mt-1">
              <span>1 Rep (Pilot)</span>
              <span>5 Reps (Growth)</span>
              <span>10 Reps (Enterprise)</span>
            </div>
          </div>

          {/* Deal Size Slider */}
          <div className="p-4 rounded-xl bg-[#EDEAE4]/[0.05] border border-[#EDEAE4]/10">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#EDEAE4]">
                Average Contract Value (ACV / Deal Size)
              </label>
              <span className="text-base font-extrabold text-[#7FA69C]">
                ${dealSize.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={120000}
              step={5000}
              value={dealSize}
              onChange={(e) => setDealSize(Number(e.target.value))}
              className="w-full accent-[#7FA69C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#EDEAE4]/50 mt-1">
              <span>$10,000 (Mid-Market)</span>
              <span>$60,000 (Enterprise)</span>
              <span>$120,000+ (Strategic)</span>
            </div>
          </div>

          {/* Close Rate Slider */}
          <div className="p-4 rounded-xl bg-[#EDEAE4]/[0.05] border border-[#EDEAE4]/10">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#EDEAE4]">
                Opportunity to Closed-Won Rate
              </label>
              <span className="text-base font-extrabold text-[#EDEAE4]">
                {closeRate}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              step={1}
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full accent-[#346D80] cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#346D80]/60 to-[#1E4B57] border border-[#EDEAE4]/20 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A24B] block mb-3">
            Estimated Projected Outcomes
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] text-[#EDEAE4]/70 block">Qualified Demos / Qtr</span>
              <span className="text-2xl font-black text-[#EDEAE4]">
                {totalMeetingsPerQuarter}
              </span>
              <span className="text-[10px] text-[#7FA69C] block mt-0.5">
                {meetingsPerRepPerMonth} / rep / mo
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#EDEAE4]/70 block">Closed Deals / Qtr</span>
              <span className="text-2xl font-black text-[#EDEAE4]">
                ~{closedDealsPerQuarter}
              </span>
              <span className="text-[10px] text-[#7FA69C] block mt-0.5">
                at {closeRate}% win rate
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#EDEAE4]/70 block">Projected Added ARR</span>
              <span className="text-2xl font-black text-[#C9A24B]">
                ${annualRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#EDEAE4]/70 block mt-0.5">
                Annual Run-Rate
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#EDEAE4]/15 flex items-center justify-between text-xs">
            <span className="text-[#EDEAE4]/80">Estimated Recruiting & Overhead Saved:</span>
            <span className="font-extrabold text-[#EDEAE4] bg-[#1E4B57] px-2.5 py-1 rounded-lg border border-[#7FA69C]/30">
              ~${directCostSavings.toLocaleString()} / year
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenBookDemo();
            }}
            className="btn-gold w-full sm:flex-1 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Lock In This Squad Model</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#EDEAE4]/20 text-xs font-semibold text-[#EDEAE4] hover:bg-[#EDEAE4]/10 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};