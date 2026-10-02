export type ProviderId = 'uber' | 'ola' | 'rapido' | 'indrive' | 'blusmart' | 'nammayatri' | 'yatrisathi';

export type VehicleCategory = 'all' | 'bike' | 'auto' | 'cab' | 'ev' | 'premium';

export type SortOption = 'price_asc' | 'eta_asc' | 'duration_asc' | 'rating_desc';

export interface LocationPoint {
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFee: number;
  tollAndTaxes: number;
  total: number;
}

export interface RideOption {
  id: string;
  providerId: ProviderId;
  providerName: string;
  providerColor: string;
  providerBg: string;
  providerBorder: string;
  vehicleName: string;
  vehicleModel: string;
  category: 'bike' | 'auto' | 'cab' | 'ev' | 'premium';
  capacity: number;
  fare: number;
  originalFare?: number;
  etaMinutes: number;
  durationMinutes: number;
  distanceKm: number;
  rating: number;
  ratingCount: string;
  tags: string[];
  surgeMultiplier: number;
  breakdown: FareBreakdown;
  deepLink: string;
  isElectric: boolean;
  acAvailable: boolean;
  cancellationPolicy: string;
  features: string[];
}

export interface ComparisonResult {
  rides: RideOption[];
  cheapest: RideOption | null;
  fastest: RideOption | null;
  ecoFriendly: RideOption | null;
  bestValue: RideOption | null;
  maxSavings: number;
  highestFare: number;
  lowestFare: number;
  averageFare: number;
}

export interface DriverInfo {
  name: string;
  phone: string;
  rating: number;
  totalTrips: string;
  vehicleNumber: string;
  vehicleModel: string;
  photo: string;
  currentEtaMin: number;
}

export type BookingStatus = 
  | 'searching' 
  | 'driver_assigned' 
  | 'arriving' 
  | 'in_trip' 
  | 'completed' 
  | 'cancelled';

export interface BookingDetails {
  bookingId: string;
  ride: RideOption;
  pickup: LocationPoint;
  destination: LocationPoint;
  status: BookingStatus;
  driver?: DriverInfo;
  otp: string;
  paymentMethod: 'upi' | 'cash' | 'card' | 'wallet';
  createdAt: string;
}

export interface AdminSettings {
  providerEnabled: Record<ProviderId, boolean>;
  surgeMultiplier: number;
  weatherCondition: 'clear' | 'rain' | 'traffic';
  customCommissionPercent: number;
  simulatedSearchesCount: number;
  simulatedBookingsCount: number;
  totalUserSavings: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  savedPlaces: {
    id: string;
    label: string;
    type: 'home' | 'work' | 'gym' | 'favorite';
    location: LocationPoint;
  }[];
}
