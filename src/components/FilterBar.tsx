import React from 'react';
import { VehicleCategory, SortOption } from '../types';
import { 
  Car, 
  Bike, 
  Zap, 
  Crown, 
  ArrowUpDown, 
  Wind, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface FilterBarProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  filterOnlyAC: boolean;
  onToggleOnlyAC: () => void;
  filterOnlyEV: boolean;
  onToggleOnlyEV: () => void;
  filterNoSurge: boolean;
  onToggleNoSurge: () => void;
  totalRidesCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  filterOnlyAC,
  onToggleOnlyAC,
  filterOnlyEV,
  onToggleOnlyEV,
  filterNoSurge,
  onToggleNoSurge,
  totalRidesCount
}) => {
  const categories: { id: VehicleCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Rides', icon: <Car className="w-4 h-4" /> },
    { id: 'cab', label: 'Cabs', icon: <Car className="w-4 h-4" /> },
    { id: 'auto', label: 'Auto', icon: <span className="text-sm">🛺</span> },
    { id: 'bike', label: 'Bike', icon: <Bike className="w-4 h-4" /> },
    { id: 'ev', label: 'Electric EV', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
    { id: 'premium', label: 'Premium', icon: <Crown className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {cat.id === 'all' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {totalRidesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sorting & Filter Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="price_asc">Lowest Price (Cheapest)</option>
            <option value="eta_asc">Fastest Pickup (Lowest ETA)</option>
            <option value="duration_asc">Shortest Journey Duration</option>
            <option value="rating_desc">Highest Driver Rating</option>
          </select>
        </div>

        {/* Feature Checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AC Only */}
          <button
            onClick={onToggleOnlyAC}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              filterOnlyAC
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>AC Only</span>
            {filterOnlyAC && <Check className="w-3 h-3 text-sky-600" />}
          </button>

          {/* EV Only */}
          <button
            onClick={onToggleOnlyEV}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              filterOnlyEV
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>100% Electric</span>
            {filterOnlyEV && <Check className="w-3 h-3 text-emerald-600" />}
          </button>

          {/* No Surge Only */}
          <button
            onClick={onToggleNoSurge}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              filterNoSurge
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Surge Only</span>
            {filterNoSurge && <Check className="w-3 h-3 text-purple-600" />}
          </button>
        </div>
      </div>
    </div>
  );
};
