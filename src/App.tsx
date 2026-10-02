import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LocationPoint, 
  VehicleCategory, 
  SortOption, 
  RideOption, 
  AdminSettings, 
  ComparisonResult,
  UserAccount 
} from './types';
import { CITIES, CityPreset, DEFAULT_PICKUP, DEFAULT_DESTINATION } from './data/popularLocations';
import { 
  getRouteDetails, 
  generateNearbyDrivers, 
  SimulatedDriverMarker 
} from './services/mapService';
import { 
  calculateRideComparisons, 
  filterAndSortRides, 
  DEFAULT_ADMIN_SETTINGS 
} from './services/providerEngine';

import { Navbar } from './components/Navbar';
import { SearchPanel } from './components/SearchPanel';
import { InteractiveMap } from './components/InteractiveMap';
import { FilterBar } from './components/FilterBar';
import { ComparisonBanner } from './components/ComparisonBanner';
import { RideCard } from './components/RideCard';
import { BookingModal } from './components/BookingModal';
import { AdminModal } from './components/AdminModal';
import { CloudflareGuideModal } from './components/CloudflareGuideModal';
import { TripsHistoryModal, TripHistoryItem } from './components/TripsHistoryModal';
import { AuthModal } from './components/AuthModal';

import { 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ridecompare_theme') === 'dark' ||
      (!('ridecompare_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // User Auth state
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('ridecompare_user');
    if (saved) return JSON.parse(saved);
    return {
      id: 'guest',
      name: 'Guest User',
      phone: '',
      email: '',
      isLoggedIn: false,
      savedPlaces: []
    };
  });

  // Cities and locations
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES[0]);
  const [pickup, setPickup] = useState<LocationPoint>(DEFAULT_PICKUP);
  const [destination, setDestination] = useState<LocationPoint>(DEFAULT_DESTINATION);

  // Route & Driver states
  const [distanceKm, setDistanceKm] = useState<number>(19.4);
  const [durationMinutes, setDurationMinutes] = useState<number>(38);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [nearbyDrivers, setNearbyDrivers] = useState<SimulatedDriverMarker[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Filter & Sort States
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('price_asc');
  const [filterOnlyAC, setFilterOnlyAC] = useState<boolean>(false);
  const [filterOnlyEV, setFilterOnlyEV] = useState<boolean>(false);
  const [filterNoSurge, setFilterNoSurge] = useState<boolean>(false);

  // Admin & History states
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('ridecompare_admin_settings');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_SETTINGS;
  });

  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>(() => {
    const saved = localStorage.getItem('ridecompare_trip_history');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'hist-1',
        pickup: DEFAULT_PICKUP,
        destination: DEFAULT_DESTINATION,
        date: 'Today, 2:15 PM',
        fare: 65,
        providerName: 'Rapido E-Rickshaw'
      }
    ];
  });

  // Modals
  const [bookingRide, setBookingRide] = useState<RideOption | null>(null);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showDeployGuide, setShowDeployGuide] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ridecompare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ridecompare_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync User in localStorage
  useEffect(() => {
    localStorage.setItem('ridecompare_user', JSON.stringify(user));
  }, [user]);

  // Sync Admin Settings
  useEffect(() => {
    localStorage.setItem('ridecompare_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  // Sync Trip History
  useEffect(() => {
    localStorage.setItem('ridecompare_trip_history', JSON.stringify(tripHistory));
  }, [tripHistory]);

  // Fetch Route Geometry and update drivers when pickup/destination change
  const refreshRouteAndDrivers = useCallback(async (start: LocationPoint, end: LocationPoint) => {
    setIsSearching(true);
    try {
      const details = await getRouteDetails(start, end);
      setDistanceKm(details.distanceKm);
      setDurationMinutes(details.durationMinutes);
      setRouteCoords(details.coordinates);
      setNearbyDrivers(generateNearbyDrivers(start));
    } catch {
      // Fallback already handled inside getRouteDetails
    } finally {
      setTimeout(() => setIsSearching(false), 300);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshRouteAndDrivers(pickup, destination);
  }, []);

  // When city changes, update to city's first popular route
  const handleSelectCity = (city: CityPreset) => {
    setSelectedCity(city);
    if (city.popularRoutes.length > 0) {
      const firstRoute = city.popularRoutes[0];
      setPickup(firstRoute.pickup);
      setDestination(firstRoute.destination);
      refreshRouteAndDrivers(firstRoute.pickup, firstRoute.destination);
    }
  };

  // Swap pickup & drop
  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
    refreshRouteAndDrivers(destination, temp);
  };

  // Explicit Search Trigger
  const handleSearch = () => {
    refreshRouteAndDrivers(pickup, destination);
    const newItem: TripHistoryItem = {
      id: `search-${Date.now()}`,
      pickup,
      destination,
      date: 'Just now'
    };
    setTripHistory(prev => [newItem, ...prev.slice(0, 9)]);

    setAdminSettings(prev => ({
      ...prev,
      simulatedSearchesCount: prev.simulatedSearchesCount + 1
    }));
  };

  // Calculate comparison results
  const comparison: ComparisonResult = useMemo(() => {
    return calculateRideComparisons(
      pickup,
      destination,
      distanceKm,
      durationMinutes,
      adminSettings
    );
  }, [pickup, destination, distanceKm, durationMinutes, adminSettings]);

  // Filter & sort visible rides
  const visibleRides = useMemo(() => {
    return filterAndSortRides(
      comparison.rides,
      selectedCategory,
      selectedSort,
      filterOnlyAC,
      filterOnlyEV,
      filterNoSurge
    );
  }, [comparison.rides, selectedCategory, selectedSort, filterOnlyAC, filterOnlyEV, filterNoSurge]);

  // Handle successful booking
  const handleBookingSuccess = (bookingId: string) => {
    if (!bookingRide) return;

    const newItem: TripHistoryItem = {
      id: bookingId,
      pickup,
      destination,
      date: 'Just now',
      fare: bookingRide.fare,
      providerName: `${bookingRide.providerName} (${bookingRide.vehicleName})`
    };
    setTripHistory(prev => [newItem, ...prev.slice(0, 9)]);

    setAdminSettings(prev => ({
      ...prev,
      simulatedBookingsCount: prev.simulatedBookingsCount + 1,
      totalUserSavings: prev.totalUserSavings + (comparison.maxSavings || 45)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-amber-400 selection:text-slate-900">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenDeployGuide={() => setShowDeployGuide(true)}
        onOpenTripsHistory={() => setShowHistory(true)}
        tripHistoryCount={tripHistory.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-5">
        {/* Banner with clear call to action */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3.5 sm:p-4 rounded-3xl shadow-lg shadow-blue-500/15">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-2xl text-xl backdrop-blur-sm">
              🚕
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight">
                RideCompare — India's Unified Ride Aggregator
              </h1>
              <p className="text-xs text-blue-100 font-medium">
                Compare Cabs, Autos, Bikes & E-Rickshaws across Uber, Ola, Rapido, inDrive, BluSmart & Namma Yatri.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeployGuide(true)}
              className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Deploy to Cloudflare Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Column Layout: Left Search/Map, Right Rides Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 Cols): Search Box & Interactive Leaflet Map */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Panel */}
            <SearchPanel
              pickup={pickup}
              destination={destination}
              onUpdatePickup={(loc) => {
                setPickup(loc);
                refreshRouteAndDrivers(loc, destination);
              }}
              onUpdateDestination={(loc) => {
                setDestination(loc);
                refreshRouteAndDrivers(pickup, loc);
              }}
              onSwapLocations={handleSwapLocations}
              onSearch={handleSearch}
              isSearching={isSearching}
              distanceKm={distanceKm}
              durationMinutes={durationMinutes}
              selectedCity={selectedCity}
              onSelectCity={handleSelectCity}
            />

            {/* Interactive Map */}
            <InteractiveMap
              pickup={pickup}
              destination={destination}
              routeCoords={routeCoords}
              nearbyDrivers={nearbyDrivers}
              isSearching={isSearching}
              onDetectLocation={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(pos => {
                    const loc: LocationPoint = {
                      name: 'Current GPS Location',
                      shortName: 'My Location',
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude
                    };
                    setPickup(loc);
                    refreshRouteAndDrivers(loc, destination);
                  });
                }
              }}
            />
          </div>

          {/* Right Column (7 Cols): Comparison Highlights, Filters & Ride List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Value Highlight Banner */}
            <ComparisonBanner
              comparison={comparison}
              onSelectRide={(r) => setBookingRide(r)}
            />

            {/* Filter and Sorting Options (Includes E-Rickshaw) */}
            <FilterBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              filterOnlyAC={filterOnlyAC}
              onToggleOnlyAC={() => setFilterOnlyAC(!filterOnlyAC)}
              filterOnlyEV={filterOnlyEV}
              onToggleOnlyEV={() => setFilterOnlyEV(!filterOnlyEV)}
              filterNoSurge={filterNoSurge}
              onToggleNoSurge={() => setFilterNoSurge(!filterNoSurge)}
              totalRidesCount={comparison.rides.length}
            />

            {/* Visible Rides Cards List */}
            <div className="space-y-3">
              {visibleRides.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No rides found for this category.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try switching back to "All Rides" or reset your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setFilterOnlyAC(false);
                      setFilterOnlyEV(false);
                      setFilterNoSurge(false);
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Show All Rides
                  </button>
                </div>
              ) : (
                visibleRides.map((ride) => (
                  <RideCard
                    key={ride.id}
                    ride={ride}
                    onBook={(r) => setBookingRide(r)}
                    isCheapest={comparison.cheapest?.id === ride.id}
                  />
                ))
              )}
            </div>

            {/* Informational Footer Pill */}
            <div className="bg-slate-100 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p>
                <strong>Payment Policy:</strong> All rides on RideCompare follow standard Indian ride policies — <em>Pay ₹ directly to the driver via UPI or Cash after reaching your destination</em>. No advance charges required.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              🚕 RideCompare Platform
            </span>
            <span>• Uber, Ola, Rapido, inDrive, BluSmart & E-Rickshaws</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDeployGuide(true)}
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              Cloudflare Free Deploy Docs
            </button>
            <span>•</span>
            <button
              onClick={() => setShowAdmin(true)}
              className="hover:text-slate-900 dark:hover:text-white"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Booking Flow Modal (With Pay at Destination Flow) */}
      {bookingRide && (
        <BookingModal
          ride={bookingRide}
          pickup={pickup}
          destination={destination}
          onClose={() => setBookingRide(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* 2. Admin Control Panel Modal */}
      {showAdmin && (
        <AdminModal
          settings={adminSettings}
          onUpdateSettings={setAdminSettings}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* 3. Cloudflare Deployment Guide Modal */}
      {showDeployGuide && (
        <CloudflareGuideModal
          onClose={() => setShowDeployGuide(false)}
        />
      )}

      {/* 4. Trips & Search History Modal */}
      {showHistory && (
        <TripsHistoryModal
          history={tripHistory}
          onSelectTrip={(item) => {
            setPickup(item.pickup);
            setDestination(item.destination);
            refreshRouteAndDrivers(item.pickup, item.destination);
          }}
          onClearHistory={() => setTripHistory([])}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* 5. User Login / Profile Modal */}
      {showAuthModal && (
        <AuthModal
          user={user}
          onUpdateUser={setUser}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
