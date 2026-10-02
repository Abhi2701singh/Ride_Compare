import React from 'react';
import { ComparisonResult, RideOption } from '../types';
import { Sparkles, TrendingDown, Clock, Zap, Award, ArrowRight } from 'lucide-react';

interface ComparisonBannerProps {
  comparison: ComparisonResult;
  onSelectRide: (ride: RideOption) => void;
}

export const ComparisonBanner: React.FC<ComparisonBannerProps> = ({
  comparison,
  onSelectRide
}) => {
  const { cheapest, fastest, ecoFriendly, maxSavings, lowestFare, highestFare } = comparison;

  if (!cheapest) return null;

  const savingsPercent = highestFare > 0 ? Math.round((maxSavings / highestFare) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-blue-950/30 border border-emerald-500/30 dark:border-emerald-500/20 rounded-3xl p-5 shadow-sm">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500 text-white rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Smart Fare Comparison
              <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Save up to ₹{maxSavings} ({savingsPercent}%)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prices ranged from ₹{lowestFare} to ₹{highestFare} across providers
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Comparison Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Cheapest Ride */}
        {cheapest && (
          <div 
            onClick={() => onSelectRide(cheapest)}
            className="group cursor-pointer bg-white dark:bg-slate-900/90 hover:border-emerald-500 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm transition-all hover:shadow-md active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Cheapest Option
              </span>
              <span className="text-xs text-slate-400 font-medium">ETA {cheapest.etaMinutes}m</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cheapest.providerName} • {cheapest.vehicleName}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{cheapest.fare}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Save ₹{maxSavings}
                </span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>View ride details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* 2. Fastest Arrival */}
        {fastest && (
          <div 
            onClick={() => onSelectRide(fastest)}
            className="group cursor-pointer bg-white dark:bg-slate-900/90 hover:border-blue-500 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm transition-all hover:shadow-md active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Fastest Pickup
              </span>
              <span className="text-xs text-slate-400 font-medium">Arriving soon</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {fastest.providerName} • {fastest.vehicleName}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {fastest.etaMinutes} mins
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  (₹{fastest.fare})
                </span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Quickest ride</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* 3. Green Eco-Friendly (BluSmart EV) */}
        {ecoFriendly && (
          <div 
            onClick={() => onSelectRide(ecoFriendly)}
            className="group cursor-pointer bg-white dark:bg-slate-900/90 hover:border-teal-500 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm transition-all hover:shadow-md active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Eco-Friendly Choice
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Zero Surge</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {ecoFriendly.providerName} • {ecoFriendly.vehicleName}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{ecoFriendly.fare}
                </span>
                <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                  Zero Emission EV
                </span>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Clean mobility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
