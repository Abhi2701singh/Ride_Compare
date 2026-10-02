import React, { useState } from 'react';
import { RideOption } from '../types';
import { 
  Users, 
  Wind, 
  Zap, 
  Star, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Info,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface RideCardProps {
  ride: RideOption;
  onBook: (ride: RideOption) => void;
  isCheapest?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onBook, isCheapest }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getVehicleEmoji = (cat: string) => {
    switch (cat) {
      case 'e-rickshaw': return '⚡🛺';
      case 'bike': return '🏍️';
      case 'auto': return '🛺';
      case 'ev': return '🔋🚗';
      case 'premium': return '✨🚘';
      default: return '🚗';
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all hover:shadow-lg ${
      isCheapest 
        ? 'border-emerald-500/80 dark:border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md' 
        : 'border-slate-200/90 dark:border-slate-800 shadow-sm'
    }`}>
      {/* Top Tag Header if any */}
      <div className="px-5 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Provider Badge */}
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${ride.providerBg} shadow-sm tracking-wide`}>
            {ride.providerName}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {ride.vehicleModel}
          </span>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {ride.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                tag === 'Cheapest'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : tag === 'Fastest Pickup'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : tag === '100% Electric'
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : tag === 'Zero Surge'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Vehicle Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner border border-slate-200 dark:border-slate-700 shrink-0">
            {getVehicleEmoji(ride.category)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {ride.vehicleName}
              </h4>
              {ride.isElectric && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  EV
                </span>
              )}
            </div>

            {/* Capacity & AC & Rating details */}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5" />
                {ride.capacity} seat{ride.capacity > 1 ? 's' : ''}
              </span>
              {ride.acAvailable && (
                <span className="flex items-center gap-1 font-medium text-sky-600 dark:text-sky-400">
                  <Wind className="w-3.5 h-3.5" />
                  AC
                </span>
              )}
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {ride.rating}
                <span className="text-slate-400 font-normal">({ride.ratingCount})</span>
              </span>
            </div>

            {/* ETA and trip duration */}
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Clock className="w-3.5 h-3.5" />
                Pickup in {ride.etaMinutes} mins
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>~{ride.durationMinutes} min trip</span>
            </div>
          </div>
        </div>

        {/* Right: Fare & Booking CTA */}
        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="text-left md:text-right">
            <div className="flex items-baseline gap-1.5 md:justify-end">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ₹{ride.fare}
              </span>
              {ride.originalFare && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{ride.originalFare}
                </span>
              )}
            </div>

            {/* Surge or Flat tag */}
            <div className="text-[11px] font-medium">
              {ride.surgeMultiplier > 1.0 ? (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 md:justify-end">
                  <ShieldAlert className="w-3 h-3" />
                  {ride.surgeMultiplier}x Surge Applied
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 md:justify-end">
                  <ShieldCheck className="w-3 h-3" />
                  Standard Fare
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View breakdown toggle */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Show fare calculation breakdown"
            >
              <Info className="w-3.5 h-3.5" />
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => onBook(ride)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                isCheapest
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-slate-900/10'
              }`}
            >
              <span>Book Ride</span>
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Fare Breakdown Accordion */}
      {showBreakdown && (
        <div className="px-5 pb-4 pt-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80 rounded-b-3xl text-xs animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Fare Estimation Breakdown ({ride.distanceKm} km)
            </span>
            <a
              href={ride.deepLink}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Open in {ride.providerName} App
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-2">
            <div>
              <p className="text-slate-400 text-[11px]">Base Fare</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">₹{ride.breakdown.baseFare}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Distance Fare</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">₹{ride.breakdown.distanceFare}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Time / Traffic</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">₹{ride.breakdown.timeFare}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Taxes & Fees</p>
              <p className="font-bold text-slate-800 dark:text-slate-200">₹{ride.breakdown.tollAndTaxes}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {ride.cancellationPolicy}
            </span>
            <span>Total Estimated: <strong className="text-slate-900 dark:text-white">₹{ride.fare}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
