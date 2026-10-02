import { 
  RideOption, 
  ComparisonResult, 
  LocationPoint, 
  VehicleCategory, 
  SortOption,
  AdminSettings 
} from '../types';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  providerEnabled: {
    uber: true,
    ola: true,
    rapido: true,
    indrive: true,
    blusmart: true,
    nammayatri: true,
    yatrisathi: false // disabled by default (regional)
  },
  surgeMultiplier: 1.0,
  weatherCondition: 'clear',
  customCommissionPercent: 0,
  simulatedSearchesCount: 1482,
  simulatedBookingsCount: 684,
  totalUserSavings: 84600
};

// Calculate all available rides from enabled providers
export function calculateRideComparisons(
  pickup: LocationPoint,
  destination: LocationPoint,
  distanceKm: number,
  baseDurationMinutes: number,
  settings: AdminSettings = DEFAULT_ADMIN_SETTINGS
): ComparisonResult {
  const rides: RideOption[] = [];
  const dist = Math.max(distanceKm, 1.2);

  // Surge calculation based on weather & admin controls
  let globalSurge = settings.surgeMultiplier;
  if (settings.weatherCondition === 'rain') {
    globalSurge = Math.max(globalSurge, 1.35);
  } else if (settings.weatherCondition === 'traffic') {
    globalSurge = Math.max(globalSurge, 1.2);
  }

  // 1. UBER
  if (settings.providerEnabled.uber) {
    const uberSurge = globalSurge;
    // Uber Moto
    rides.push(createRideOption({
      id: 'uber-moto',
      providerId: 'uber',
      providerName: 'Uber',
      providerColor: '#000000',
      providerBg: 'bg-black text-white',
      providerBorder: 'border-slate-800',
      vehicleName: 'Uber Moto',
      vehicleModel: 'Hero Splendor / Honda Activa',
      category: 'bike',
      capacity: 1,
      baseFare: 25,
      perKmRate: 8.5,
      timeRate: 0.9,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.75),
      etaMin: 3,
      surge: uberSurge,
      rating: 4.8,
      ratingCount: '1.2M+',
      features: ['Helmet provided', 'Fastest in traffic'],
      cancellationPolicy: 'Free cancellation within 2 mins',
      deepLink: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}&dropoff[latitude]=${destination.lat}&dropoff[longitude]=${destination.lng}`
    }));

    // Uber Auto
    rides.push(createRideOption({
      id: 'uber-auto',
      providerId: 'uber',
      providerName: 'Uber',
      providerColor: '#000000',
      providerBg: 'bg-black text-white',
      providerBorder: 'border-slate-800',
      vehicleName: 'Uber Auto',
      vehicleModel: 'Bajaj RE Auto',
      category: 'auto',
      capacity: 3,
      baseFare: 35,
      perKmRate: 11.0,
      timeRate: 1.1,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.9),
      etaMin: 4,
      surge: Math.min(uberSurge, 1.2), // autos capped surge
      rating: 4.6,
      ratingCount: '850K+',
      features: ['Doorstep pickup', 'No haggling'],
      cancellationPolicy: 'Free cancellation within 2 mins',
      deepLink: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}`
    }));

    // Uber Go
    rides.push(createRideOption({
      id: 'uber-go',
      providerId: 'uber',
      providerName: 'Uber',
      providerColor: '#000000',
      providerBg: 'bg-black text-white',
      providerBorder: 'border-slate-800',
      vehicleName: 'Uber Go',
      vehicleModel: 'Maruti WagonR / Swift',
      category: 'cab',
      capacity: 4,
      baseFare: 50,
      perKmRate: 14.5,
      timeRate: 1.8,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 4,
      surge: uberSurge,
      rating: 4.7,
      ratingCount: '2.5M+',
      acAvailable: true,
      features: ['AC hatchback', 'Top rated drivers'],
      cancellationPolicy: 'Free cancellation within 3 mins',
      deepLink: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}`
    }));

    // Uber Premier
    rides.push(createRideOption({
      id: 'uber-premier',
      providerId: 'uber',
      providerName: 'Uber',
      providerColor: '#000000',
      providerBg: 'bg-black text-white',
      providerBorder: 'border-slate-800',
      vehicleName: 'Uber Premier',
      vehicleModel: 'Honda City / Maruti Dzire',
      category: 'premium',
      capacity: 4,
      baseFare: 80,
      perKmRate: 18.5,
      timeRate: 2.3,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 6,
      surge: uberSurge,
      rating: 4.9,
      ratingCount: '920K+',
      acAvailable: true,
      features: ['Premium sedans', 'Highest rated drivers', 'Extra legroom'],
      cancellationPolicy: 'Free cancellation within 3 mins',
      deepLink: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}`
    }));
  }

  // 2. OLA
  if (settings.providerEnabled.ola) {
    const olaSurge = globalSurge > 1.1 ? globalSurge * 0.96 : globalSurge;

    // Ola Bike
    rides.push(createRideOption({
      id: 'ola-bike',
      providerId: 'ola',
      providerName: 'Ola',
      providerColor: '#00d285',
      providerBg: 'bg-emerald-600 text-white',
      providerBorder: 'border-emerald-500',
      vehicleName: 'Ola Bike',
      vehicleModel: 'Ola S1 / Honda Shine',
      category: 'bike',
      capacity: 1,
      baseFare: 22,
      perKmRate: 8.2,
      timeRate: 0.9,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.75),
      etaMin: 3,
      surge: olaSurge,
      rating: 4.6,
      ratingCount: '980K+',
      features: ['Pocket friendly', 'Quick pickup'],
      cancellationPolicy: 'Free cancellation within 2 mins',
      deepLink: `https://book.olacabs.com/?pickup_lat=${pickup.lat}&pickup_lng=${pickup.lng}&drop_lat=${destination.lat}&drop_lng=${destination.lng}`
    }));

    // Ola Auto
    rides.push(createRideOption({
      id: 'ola-auto',
      providerId: 'ola',
      providerName: 'Ola',
      providerColor: '#00d285',
      providerBg: 'bg-emerald-600 text-white',
      providerBorder: 'border-emerald-500',
      vehicleName: 'Ola Auto',
      vehicleModel: 'Piaggio Ape Auto',
      category: 'auto',
      capacity: 3,
      baseFare: 33,
      perKmRate: 10.8,
      timeRate: 1.0,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.9),
      etaMin: 5,
      surge: 1.0, // Ola auto often maintains flat rate
      rating: 4.5,
      ratingCount: '710K+',
      features: ['Metred fare equivalent', 'Contactless OTP'],
      cancellationPolicy: 'Free cancellation within 2 mins',
      deepLink: `https://book.olacabs.com/?pickup_lat=${pickup.lat}&pickup_lng=${pickup.lng}`
    }));

    // Ola Mini
    rides.push(createRideOption({
      id: 'ola-mini',
      providerId: 'ola',
      providerName: 'Ola',
      providerColor: '#00d285',
      providerBg: 'bg-emerald-600 text-white',
      providerBorder: 'border-emerald-500',
      vehicleName: 'Ola Mini',
      vehicleModel: 'Tata Indica / Hyundai i10',
      category: 'cab',
      capacity: 4,
      baseFare: 48,
      perKmRate: 13.8,
      timeRate: 1.6,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 5,
      surge: olaSurge,
      rating: 4.6,
      ratingCount: '1.8M+',
      acAvailable: true,
      features: ['Compact AC cab', 'Value for money'],
      cancellationPolicy: 'Free cancellation within 3 mins',
      deepLink: `https://book.olacabs.com/?pickup_lat=${pickup.lat}&pickup_lng=${pickup.lng}`
    }));

    // Ola Prime Plus
    rides.push(createRideOption({
      id: 'ola-prime-plus',
      providerId: 'ola',
      providerName: 'Ola',
      providerColor: '#00d285',
      providerBg: 'bg-emerald-600 text-white',
      providerBorder: 'border-emerald-500',
      vehicleName: 'Ola Prime Plus',
      vehicleModel: 'Maruti Ciaz / Ertiga',
      category: 'premium',
      capacity: 4,
      baseFare: 85,
      perKmRate: 18.0,
      timeRate: 2.2,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 7,
      surge: 1.0, // Prime Plus guarantees no cancellations and steady rates
      rating: 4.9,
      ratingCount: '450K+',
      acAvailable: true,
      features: ['Zero driver cancellations', 'Top elite partners'],
      cancellationPolicy: 'Free cancellation within 4 mins',
      deepLink: `https://book.olacabs.com/?pickup_lat=${pickup.lat}&pickup_lng=${pickup.lng}`
    }));
  }

  // 3. RAPIDO
  if (settings.providerEnabled.rapido) {
    // Rapido Bike (Known for best pricing on two-wheelers)
    rides.push(createRideOption({
      id: 'rapido-bike',
      providerId: 'rapido',
      providerName: 'Rapido',
      providerColor: '#eab308',
      providerBg: 'bg-amber-400 text-slate-900',
      providerBorder: 'border-amber-400',
      vehicleName: 'Rapido Bike',
      vehicleModel: 'Hero HF Deluxe / Bajaj Pulsar',
      category: 'bike',
      capacity: 1,
      baseFare: 18,
      perKmRate: 7.2,
      timeRate: 0.8,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.72),
      etaMin: 2,
      surge: globalSurge > 1.2 ? 1.1 : 1.0,
      rating: 4.8,
      ratingCount: '2.1M+',
      features: ['Lowest bike fare', 'Fastest arrival', 'Sanitized helmet'],
      cancellationPolicy: 'Zero cancellation fee',
      deepLink: 'https://rapido.bike'
    }));

    // Rapido Auto
    rides.push(createRideOption({
      id: 'rapido-auto',
      providerId: 'rapido',
      providerName: 'Rapido',
      providerColor: '#eab308',
      providerBg: 'bg-amber-400 text-slate-900',
      providerBorder: 'border-amber-400',
      vehicleName: 'Rapido Auto',
      vehicleModel: 'Bajaj Maxima Auto',
      category: 'auto',
      capacity: 3,
      baseFare: 29,
      perKmRate: 10.2,
      timeRate: 0.9,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.9),
      etaMin: 3,
      surge: 1.0,
      rating: 4.7,
      ratingCount: '1.1M+',
      features: ['Direct auto price', 'Zero surge'],
      cancellationPolicy: 'Zero cancellation fee',
      deepLink: 'https://rapido.bike'
    }));

    // Rapido Cab Economy
    rides.push(createRideOption({
      id: 'rapido-cab',
      providerId: 'rapido',
      providerName: 'Rapido',
      providerColor: '#eab308',
      providerBg: 'bg-amber-400 text-slate-900',
      providerBorder: 'border-amber-400',
      vehicleName: 'Rapido Cab Economy',
      vehicleModel: 'Hyundai Grand i10',
      category: 'cab',
      capacity: 4,
      baseFare: 42,
      perKmRate: 12.8,
      timeRate: 1.4,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 6,
      surge: 1.05,
      rating: 4.6,
      ratingCount: '580K+',
      acAvailable: true,
      features: ['Affordable four-wheeler', 'Lowest commission rate'],
      cancellationPolicy: 'Free cancellation within 3 mins',
      deepLink: 'https://rapido.bike'
    }));
  }

  // 4. inDRIVE (Bidding model - normally saves 15-20% on cabs)
  if (settings.providerEnabled.indrive) {
    rides.push(createRideOption({
      id: 'indrive-cab',
      providerId: 'indrive',
      providerName: 'inDrive',
      providerColor: '#0284c7',
      providerBg: 'bg-sky-600 text-white',
      providerBorder: 'border-sky-500',
      vehicleName: 'inDrive Cab',
      vehicleModel: 'Maruti WagonR / Dzire',
      category: 'cab',
      capacity: 4,
      baseFare: 38,
      perKmRate: 11.5,
      timeRate: 1.1,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 5,
      surge: 1.0, // inDrive has NO algorithmic surge, users set fare
      rating: 4.7,
      ratingCount: '620K+',
      acAvailable: true,
      features: ['Choose your own price', 'Driver bidding', 'No surge pricing'],
      cancellationPolicy: 'Free cancellation before driver starts',
      deepLink: 'https://indrive.com'
    }));

    rides.push(createRideOption({
      id: 'indrive-comfort',
      providerId: 'indrive',
      providerName: 'inDrive',
      providerColor: '#0284c7',
      providerBg: 'bg-sky-600 text-white',
      providerBorder: 'border-sky-500',
      vehicleName: 'inDrive Comfort',
      vehicleModel: 'Toyota Etios / Honda Amaze',
      category: 'premium',
      capacity: 4,
      baseFare: 55,
      perKmRate: 14.5,
      timeRate: 1.5,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 6,
      surge: 1.0,
      rating: 4.8,
      ratingCount: '290K+',
      acAvailable: true,
      features: ['Spacious sedan', 'Pick driver by rating & model'],
      cancellationPolicy: 'Free cancellation',
      deepLink: 'https://indrive.com'
    }));
  }

  // 5. BLUSMART (100% Electric, Zero Surge, Zero Driver Cancellation)
  if (settings.providerEnabled.blusmart) {
    rides.push(createRideOption({
      id: 'blusmart-city-ev',
      providerId: 'blusmart',
      providerName: 'BluSmart',
      providerColor: '#0066f5',
      providerBg: 'bg-blue-600 text-white',
      providerBorder: 'border-blue-500',
      vehicleName: 'BluSmart EV Sedan',
      vehicleModel: 'Tata Tigor EV / XPRES-T',
      category: 'ev',
      capacity: 4,
      baseFare: 55,
      perKmRate: 14.2,
      timeRate: 1.5,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 7,
      surge: 1.0, // BluSmart ALWAYS has ZERO surge!
      rating: 4.9,
      ratingCount: '890K+',
      isElectric: true,
      acAvailable: true,
      features: ['100% Electric (Zero Emission)', 'Zero Surge guarantee', 'Zero driver cancellation'],
      cancellationPolicy: 'Free cancellation up to 10 mins before',
      deepLink: 'https://blu-smart.com'
    }));

    rides.push(createRideOption({
      id: 'blusmart-premium-ev',
      providerId: 'blusmart',
      providerName: 'BluSmart',
      providerColor: '#0066f5',
      providerBg: 'bg-blue-600 text-white',
      providerBorder: 'border-blue-500',
      vehicleName: 'BluSmart Prime EV',
      vehicleModel: 'MG ZS EV / BYD E6',
      category: 'premium',
      capacity: 4,
      baseFare: 95,
      perKmRate: 18.0,
      timeRate: 2.0,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 8,
      surge: 1.0,
      rating: 5.0,
      ratingCount: '240K+',
      isElectric: true,
      acAvailable: true,
      features: ['Luxury EV experience', 'Silent cabin & air purifier', 'Zero surge'],
      cancellationPolicy: 'Free cancellation',
      deepLink: 'https://blu-smart.com'
    }));
  }

  // 6. NAMMA YATRI (Zero commission open network)
  if (settings.providerEnabled.nammayatri) {
    rides.push(createRideOption({
      id: 'namma-yatri-auto',
      providerId: 'nammayatri',
      providerName: 'Namma Yatri',
      providerColor: '#f97316',
      providerBg: 'bg-orange-500 text-white',
      providerBorder: 'border-orange-500',
      vehicleName: 'Namma Yatri Auto',
      vehicleModel: 'Direct Auto Meter (ONDC)',
      category: 'auto',
      capacity: 3,
      baseFare: 30,
      perKmRate: 9.8,
      timeRate: 0.8,
      distanceKm: dist,
      durationMin: Math.round(baseDurationMinutes * 0.9),
      etaMin: 4,
      surge: 1.0, // 0% commission direct to driver
      rating: 4.7,
      ratingCount: '480K+',
      features: ['100% direct driver pay', '0% commission', 'ONDC open mobility'],
      cancellationPolicy: 'No cancellation charges',
      deepLink: 'https://nammayatri.in'
    }));

    rides.push(createRideOption({
      id: 'namma-yatri-cab',
      providerId: 'nammayatri',
      providerName: 'Namma Yatri',
      providerColor: '#f97316',
      providerBg: 'bg-orange-500 text-white',
      providerBorder: 'border-orange-500',
      vehicleName: 'Namma Yatri Cab Non-AC/AC',
      vehicleModel: 'Tata Zest / Swift Dzire',
      category: 'cab',
      capacity: 4,
      baseFare: 45,
      perKmRate: 12.2,
      timeRate: 1.2,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 6,
      surge: 1.0,
      rating: 4.6,
      ratingCount: '190K+',
      acAvailable: true,
      features: ['Direct driver pricing', 'Fair compensation'],
      cancellationPolicy: 'Free cancellation',
      deepLink: 'https://nammayatri.in'
    }));
  }

  // 7. YATRI SATHI (Kolkata / Bengal Open Initiative)
  if (settings.providerEnabled.yatrisathi) {
    rides.push(createRideOption({
      id: 'yatri-sathi-cab',
      providerId: 'yatrisathi',
      providerName: 'Yatri Sathi',
      providerColor: '#059669',
      providerBg: 'bg-teal-600 text-white',
      providerBorder: 'border-teal-500',
      vehicleName: 'Yatri Sathi Yellow/White Taxi',
      vehicleModel: 'Ambassador / Dzire Taxi',
      category: 'cab',
      capacity: 4,
      baseFare: 40,
      perKmRate: 11.0,
      timeRate: 1.0,
      distanceKm: dist,
      durationMin: baseDurationMinutes,
      etaMin: 5,
      surge: 1.0,
      rating: 4.5,
      ratingCount: '340K+',
      acAvailable: true,
      features: ['Government supported', 'Zero surge', 'Direct meter rate'],
      cancellationPolicy: 'No cancellation fee',
      deepLink: 'https://yatrisathi.wb.gov.in'
    }));
  }

  // Calculate comparative analytics
  if (rides.length === 0) {
    return {
      rides: [],
      cheapest: null,
      fastest: null,
      ecoFriendly: null,
      bestValue: null,
      maxSavings: 0,
      highestFare: 0,
      lowestFare: 0,
      averageFare: 0
    };
  }

  // Sort by price to determine cheapest
  const priceSorted = [...rides].sort((a, b) => a.fare - b.fare);
  const cheapest = priceSorted[0];
  const highestFare = priceSorted[priceSorted.length - 1].fare;
  const lowestFare = cheapest.fare;
  const maxSavings = highestFare - lowestFare;

  // Determine fastest pickup (lowest eta)
  const etaSorted = [...rides].sort((a, b) => a.etaMinutes - b.etaMinutes);
  const fastest = etaSorted[0];

  // Determine eco-friendly
  const ecoFriendly = rides.find(r => r.isElectric) || null;

  // Tag individual rides
  rides.forEach(ride => {
    if (ride.id === cheapest.id) {
      ride.tags.push('Cheapest');
    }
    if (ride.id === fastest.id) {
      ride.tags.push('Fastest Pickup');
    }
    if (ride.isElectric) {
      ride.tags.push('100% Electric');
    }
    if (ride.surgeMultiplier <= 1.0) {
      ride.tags.push('Zero Surge');
    }
    if (ride.rating >= 4.85) {
      ride.tags.push('Top Rated');
    }
  });

  // Best value: balancing price, ETA, and rating
  // Normalized score = (1 - normPrice)*0.5 + (1 - normEta)*0.3 + (normRating)*0.2
  const bestValue = [...rides].sort((a, b) => {
    const scoreA = (1 - (a.fare / highestFare)) * 0.5 + (1 - (a.etaMinutes / 12)) * 0.3 + (a.rating / 5) * 0.2;
    const scoreB = (1 - (b.fare / highestFare)) * 0.5 + (1 - (b.etaMinutes / 12)) * 0.3 + (b.rating / 5) * 0.2;
    return scoreB - scoreA;
  })[0];

  const averageFare = Math.round(
    rides.reduce((acc, r) => acc + r.fare, 0) / rides.length
  );

  return {
    rides,
    cheapest,
    fastest,
    ecoFriendly,
    bestValue,
    maxSavings,
    highestFare,
    lowestFare,
    averageFare
  };
}

// Helper to calculate exact fare breakdown
interface CreateRideOptionParams {
  id: string;
  providerId: RideOption['providerId'];
  providerName: string;
  providerColor: string;
  providerBg: string;
  providerBorder: string;
  vehicleName: string;
  vehicleModel: string;
  category: RideOption['category'];
  capacity: number;
  baseFare: number;
  perKmRate: number;
  timeRate: number;
  distanceKm: number;
  durationMin: number;
  etaMin: number;
  surge: number;
  rating: number;
  ratingCount: string;
  features: string[];
  cancellationPolicy: string;
  deepLink: string;
  isElectric?: boolean;
  acAvailable?: boolean;
}

function createRideOption(params: CreateRideOptionParams): RideOption {
  const distFare = Math.round(params.distanceKm * params.perKmRate);
  const timeFare = Math.round(params.durationMin * params.timeRate);
  const subtotal = params.baseFare + distFare + timeFare;
  
  // Surge adds extra on subtotal
  const surgeDifference = params.surge > 1.0 ? Math.round(subtotal * (params.surge - 1.0)) : 0;
  
  // Indian GST / Platform convenience fee ~ 5%
  const tollAndTaxes = Math.round((subtotal + surgeDifference) * 0.05);

  const totalFare = Math.round(subtotal + surgeDifference + tollAndTaxes);

  return {
    id: params.id,
    providerId: params.providerId,
    providerName: params.providerName,
    providerColor: params.providerColor,
    providerBg: params.providerBg,
    providerBorder: params.providerBorder,
    vehicleName: params.vehicleName,
    vehicleModel: params.vehicleModel,
    category: params.category,
    capacity: params.capacity,
    fare: totalFare,
    originalFare: params.surge > 1.0 ? Math.round(totalFare * 1.15) : undefined,
    etaMinutes: params.etaMin,
    durationMinutes: params.durationMin,
    distanceKm: params.distanceKm,
    rating: params.rating,
    ratingCount: params.ratingCount,
    tags: [],
    surgeMultiplier: params.surge,
    breakdown: {
      baseFare: params.baseFare,
      distanceFare: distFare,
      timeFare: timeFare,
      surgeFee: surgeDifference,
      tollAndTaxes: tollAndTaxes,
      total: totalFare
    },
    deepLink: params.deepLink,
    isElectric: !!params.isElectric,
    acAvailable: !!params.acAvailable,
    cancellationPolicy: params.cancellationPolicy,
    features: params.features
  };
}

// Filter and sort rides based on user selection
export function filterAndSortRides(
  rides: RideOption[],
  category: VehicleCategory,
  sortBy: SortOption,
  filterOnlyAC: boolean,
  filterOnlyEV: boolean,
  filterNoSurge: boolean
): RideOption[] {
  let list = [...rides];

  // Category filter
  if (category !== 'all') {
    if (category === 'ev') {
      list = list.filter(r => r.isElectric);
    } else {
      list = list.filter(r => r.category === category);
    }
  }

  // Toggles
  if (filterOnlyAC) {
    list = list.filter(r => r.acAvailable);
  }
  if (filterOnlyEV) {
    list = list.filter(r => r.isElectric);
  }
  if (filterNoSurge) {
    list = list.filter(r => r.surgeMultiplier <= 1.0);
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      list.sort((a, b) => a.fare - b.fare);
      break;
    case 'eta_asc':
      list.sort((a, b) => a.etaMinutes - b.etaMinutes);
      break;
    case 'duration_asc':
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
    case 'rating_desc':
      list.sort((a, b) => b.rating - a.rating);
      break;
  }

  return list;
}
