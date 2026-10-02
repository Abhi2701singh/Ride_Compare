import React, { useState, useEffect, useRef } from 'react';
import { LocationPoint } from '../types';
import { searchLocationSuggestions } from '../services/mapService';
import { CITIES, CityPreset } from '../data/popularLocations';
import { 
  MapPin, 
  Navigation, 
  ArrowUpDown, 
  Search, 
  Clock, 
  Sparkles, 
  Compass,
  X,
  Loader2
} from 'lucide-react';

interface SearchPanelProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  onUpdatePickup: (loc: LocationPoint) => void;
  onUpdateDestination: (loc: LocationPoint) => void;
  onSwapLocations: () => void;
  onSearch: () => void;
  isSearching: boolean;
  distanceKm: number;
  durationMinutes: number;
  selectedCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  pickup,
  destination,
  onUpdatePickup,
  onUpdateDestination,
  onSwapLocations,
  onSearch,
  isSearching,
  distanceKm,
  durationMinutes,
  selectedCity,
  onSelectCity
}) => {
  const [pickupText, setPickupText] = useState(pickup.name);
  const [destText, setDestText] = useState(destination.name);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationPoint[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationPoint[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'dest' | null>(null);
  const [detectingGps, setDetectingGps] = useState(false);
  const [isTypingLoading, setIsTypingLoading] = useState(false);

  const pickupContainerRef = useRef<HTMLDivElement>(null);
  const destContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync internal text state with parent props
  useEffect(() => {
    setPickupText(pickup.shortName || pickup.name);
  }, [pickup]);

  useEffect(() => {
    setDestText(destination.shortName || destination.name);
  }, [destination]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickupContainerRef.current &&
        !pickupContainerRef.current.contains(e.target as Node) &&
        destContainerRef.current &&
        !destContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Pickup input typing with fast debounce
  const handlePickupChange = (val: string) => {
    setPickupText(val);
    setActiveDropdown('pickup');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length >= 2) {
      setIsTypingLoading(true);
      debounceTimerRef.current = setTimeout(async () => {
        const results = await searchLocationSuggestions(val);
        setPickupSuggestions(results);
        setIsTypingLoading(false);
      }, 150);
    } else {
      setPickupSuggestions(selectedCity.locations.slice(0, 4));
      setIsTypingLoading(false);
    }
  };

  // Handle Destination input typing with fast debounce
  const handleDestChange = (val: string) => {
    setDestText(val);
    setActiveDropdown('dest');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length >= 2) {
      setIsTypingLoading(true);
      debounceTimerRef.current = setTimeout(async () => {
        const results = await searchLocationSuggestions(val);
        setDestSuggestions(results);
        setIsTypingLoading(false);
      }, 150);
    } else {
      setDestSuggestions(selectedCity.locations.slice(2, 6));
      setIsTypingLoading(false);
    }
  };

  // Handle GPS location detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: LocationPoint = {
          name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          shortName: 'My Current Location',
          lat: latitude,
          lng: longitude
        };
        onUpdatePickup(loc);
        setPickupText('My Current Location');
        setDetectingGps(false);
        setActiveDropdown(null);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setDetectingGps(false);
        alert('Could not detect location. Please allow GPS permission in your browser.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200/90 dark:border-slate-800 transition-all">
      {/* Header City Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 font-bold text-base">
            🗺️
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
              Select Pickup & Destination
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Type 2-3 letters to see instant suggestions
            </p>
          </div>
        </div>

        {/* Metro City Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedCity.id === city.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Group with Central Swap Button */}
      <div className="relative flex flex-col gap-2.5">
        {/* Pickup Field */}
        <div ref={pickupContainerRef} className="relative">
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              PICKUP LOCATION (कहाँ से जाना है)
            </span>
            {isTypingLoading && activeDropdown === 'pickup' && (
              <span className="text-[10px] text-blue-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Searching...
              </span>
            )}
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-emerald-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <input
              type="text"
              value={pickupText}
              onChange={(e) => handlePickupChange(e.target.value)}
              onFocus={() => {
                setActiveDropdown('pickup');
                if (pickupSuggestions.length === 0) {
                  setPickupSuggestions(selectedCity.locations.slice(0, 5));
                }
              }}
              placeholder="e.g. Noida Sector 62, Botanical Garden..."
              className="w-full pl-10 pr-24 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
            />
            {/* GPS Detection Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={detectingGps}
              className="absolute right-2 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl flex items-center gap-1 transition-all"
              title="Use current GPS position"
            >
              <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{detectingGps ? 'Locating...' : 'GPS'}</span>
            </button>
          </div>

          {/* Pickup Dropdown Suggestions */}
          {activeDropdown === 'pickup' && pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Select Location</span>
                <span>{pickupSuggestions.length} found</span>
              </div>
              {pickupSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onUpdatePickup(item);
                    setPickupText(item.shortName);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700/70 flex items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.shortName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.address || item.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (Floating between inputs) */}
        <div className="flex justify-center -my-2 z-10">
          <button
            onClick={onSwapLocations}
            title="Swap Pickup and Drop"
            className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full shadow-md text-blue-600 dark:text-blue-400 transition-all transform hover:rotate-180 active:scale-95"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Field */}
        <div ref={destContainerRef} className="relative">
          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              DESTINATION (कहाँ जाना है)
            </span>
            {isTypingLoading && activeDropdown === 'dest' && (
              <span className="text-[10px] text-blue-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Searching...
              </span>
            )}
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-rose-500">
              <MapPin className="w-4 h-4 text-rose-600" />
            </div>
            <input
              type="text"
              value={destText}
              onChange={(e) => handleDestChange(e.target.value)}
              onFocus={() => {
                setActiveDropdown('dest');
                if (destSuggestions.length === 0) {
                  setDestSuggestions(selectedCity.locations.slice(1, 6));
                }
              }}
              placeholder="e.g. Connaught Place, Airport T3, Cyber City..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
            />
          </div>

          {/* Destination Dropdown Suggestions */}
          {activeDropdown === 'dest' && destSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Select Destination</span>
                <span>{destSuggestions.length} found</span>
              </div>
              {destSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onUpdateDestination(item);
                    setDestText(item.shortName);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700/70 flex items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.shortName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.address || item.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Fast Routes Pills */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick 1-Click Routes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedCity.popularRoutes.map((route, i) => (
            <button
              key={i}
              onClick={() => {
                onUpdatePickup(route.pickup);
                onUpdateDestination(route.destination);
              }}
              className="text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold transition-all"
            >
              {route.title}
            </button>
          ))}
        </div>
      </div>

      {/* Distance & Search Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-500" />
            <span>{distanceKm} km</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>~{durationMinutes} min trip</span>
          </div>
        </div>

        <button
          onClick={onSearch}
          disabled={isSearching}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing Rates...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search & Compare Rides</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
