import { LocationPoint } from '../types';
import { CITIES } from '../data/popularLocations';

export interface RouteGeometryResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng][]
  summary: string;
}

// Extensive in-memory Indian places dictionary for instant 2-3 letter autocomplete
const EXTENSIVE_INDIAN_PLACES: LocationPoint[] = [
  // Delhi NCR / Noida / Gurgaon
  { name: 'Noida Sector 62, Electronic City, Noida', shortName: 'Noida Sector 62', lat: 28.6280, lng: 77.3649, address: 'Sector 62, Noida, Uttar Pradesh' },
  { name: 'Noida Sector 18, Wave Mall & Atta Market, Noida', shortName: 'Noida Sector 18', lat: 28.5708, lng: 77.3260, address: 'Sector 18, Noida' },
  { name: 'Botanical Garden Metro Station, Noida', shortName: 'Botanical Garden Metro', lat: 28.5644, lng: 77.3344, address: 'Noida, Uttar Pradesh' },
  { name: 'Noida City Centre, Sector 32, Noida', shortName: 'Noida City Centre', lat: 28.5747, lng: 77.3560, address: 'Sector 32, Noida' },
  { name: 'Noida Sector 137, Expressway, Noida', shortName: 'Noida Sector 137', lat: 28.5132, lng: 77.4042, address: 'Sector 137, Noida' },
  { name: 'Pari Chowk, Greater Noida', shortName: 'Pari Chowk Greater Noida', lat: 28.4646, lng: 77.5108, address: 'Greater Noida, Uttar Pradesh' },
  { name: 'Indirapuram Habitat Centre, Ghaziabad', shortName: 'Indirapuram Ghaziabad', lat: 28.6392, lng: 77.3713, address: 'Indirapuram, Ghaziabad' },
  { name: 'Vaishali Metro Station, Ghaziabad', shortName: 'Vaishali Metro', lat: 28.6441, lng: 77.3400, address: 'Vaishali, Ghaziabad' },
  { name: 'Anand Vihar ISBT & Railway Station, Delhi', shortName: 'Anand Vihar ISBT', lat: 28.6469, lng: 77.3160, address: 'Anand Vihar, New Delhi' },
  { name: 'Connaught Place, Central Delhi, New Delhi', shortName: 'Connaught Place (CP)', lat: 28.6328, lng: 77.2197, address: 'Connaught Place, New Delhi 110001' },
  { name: 'India Gate, Rajpath, New Delhi', shortName: 'India Gate', lat: 28.6129, lng: 77.2295, address: 'Rajpath, New Delhi' },
  { name: 'Indira Gandhi International Airport Terminal 3, Delhi', shortName: 'IGI Airport T3', lat: 28.5562, lng: 77.0999, address: 'IGI Airport, New Delhi' },
  { name: 'Indira Gandhi International Airport Terminal 1, Delhi', shortName: 'IGI Airport T1', lat: 28.5670, lng: 77.1180, address: 'Domestic T1, New Delhi' },
  { name: 'New Delhi Railway Station (NDLS), Paharganj', shortName: 'New Delhi Railway Station', lat: 28.6430, lng: 77.2194, address: 'NDLS, New Delhi' },
  { name: 'Old Delhi Railway Station (DLI), Chandni Chowk', shortName: 'Old Delhi Railway Station', lat: 28.6619, lng: 77.2280, address: 'Chandni Chowk, Delhi' },
  { name: 'Hauz Khas Social & Village, South Delhi', shortName: 'Hauz Khas Village', lat: 28.5539, lng: 77.1944, address: 'Hauz Khas, New Delhi' },
  { name: 'Saket Select Citywalk Mall, South Delhi', shortName: 'Select Citywalk Saket', lat: 28.5284, lng: 77.2193, address: 'Saket, New Delhi' },
  { name: 'Lajpat Nagar Central Market, South Delhi', shortName: 'Lajpat Nagar', lat: 28.5700, lng: 77.2400, address: 'Lajpat Nagar, New Delhi' },
  { name: 'Akshardham Temple, East Delhi', shortName: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, address: 'NH 24, New Delhi' },
  { name: 'DLF Cyber City, Phase 2, Gurugram', shortName: 'DLF Cyber City Gurgaon', lat: 28.4950, lng: 77.0895, address: 'Cyber City, Gurugram' },
  { name: 'Cyber Hub, DLF Cyber City, Gurugram', shortName: 'Cyber Hub Gurgaon', lat: 28.4952, lng: 77.0880, address: 'Gurugram, Haryana' },
  { name: 'Huda City Centre (Millennium City Centre) Metro, Gurgaon', shortName: 'Huda City Centre Metro', lat: 28.4593, lng: 77.0725, address: 'Gurugram, Haryana' },
  { name: 'Ambience Mall, NH-8, Gurugram', shortName: 'Ambience Mall Gurgaon', lat: 28.5042, lng: 77.0967, address: 'Gurugram, Haryana' },
  { name: 'Sector 29 Market & Food Hub, Gurugram', shortName: 'Sector 29 Gurgaon', lat: 28.4682, lng: 77.0620, address: 'Gurugram, Haryana' },

  // Bengaluru
  { name: 'Indiranagar 100 Feet Road, Bengaluru', shortName: 'Indiranagar Bangalore', lat: 12.9784, lng: 77.6408, address: 'Indiranagar, Bengaluru' },
  { name: 'Koramangala 4th Block, Sony Signal, Bengaluru', shortName: 'Koramangala Bangalore', lat: 12.9345, lng: 77.6265, address: 'Koramangala, Bengaluru' },
  { name: 'HSR Layout Sector 1, Bengaluru', shortName: 'HSR Layout Bangalore', lat: 12.9116, lng: 77.6389, address: 'HSR Layout, Bengaluru' },
  { name: 'Whitefield ITPL International Tech Park, Bengaluru', shortName: 'Whitefield ITPL Bangalore', lat: 12.9863, lng: 77.7337, address: 'Whitefield, Bengaluru' },
  { name: 'Kempegowda International Airport (BLR), Bengaluru', shortName: 'BLR Airport Bangalore', lat: 13.1986, lng: 77.7066, address: 'Devanahalli, Bengaluru' },
  { name: 'MG Road Metro Station, Bengaluru', shortName: 'MG Road Bangalore', lat: 12.9754, lng: 77.6066, address: 'MG Road, Bengaluru' },
  { name: 'Electronic City Phase 1, Bengaluru', shortName: 'Electronic City Bangalore', lat: 12.8452, lng: 77.6602, address: 'Electronic City, Bengaluru' },
  { name: 'Marathahalli Bridge, Outer Ring Road, Bengaluru', shortName: 'Marathahalli Bangalore', lat: 12.9569, lng: 77.7011, address: 'Marathahalli, Bengaluru' },

  // Mumbai
  { name: 'Bandra Kurla Complex (BKC), Mumbai', shortName: 'BKC Bandra Mumbai', lat: 19.0657, lng: 72.8687, address: 'BKC, Mumbai' },
  { name: 'Chhatrapati Shivaji Maharaj International Airport (T2), Mumbai', shortName: 'Mumbai Airport T2', lat: 19.0896, lng: 72.8656, address: 'Sahar, Andheri East, Mumbai' },
  { name: 'Marine Drive Promenade, Churchgate, Mumbai', shortName: 'Marine Drive Mumbai', lat: 18.9432, lng: 72.8230, address: 'Marine Drive, Mumbai' },
  { name: 'Andheri West Station & Lokhandwala, Mumbai', shortName: 'Andheri West Mumbai', lat: 19.1197, lng: 72.8464, address: 'Andheri West, Mumbai' },
  { name: 'Powai Hiranandani Gardens, Mumbai', shortName: 'Powai Hiranandani Mumbai', lat: 19.1197, lng: 72.9051, address: 'Powai, Mumbai' },
  { name: 'Dadar Western & Central Railway Station, Mumbai', shortName: 'Dadar Station Mumbai', lat: 19.0178, lng: 72.8478, address: 'Dadar, Mumbai' },

  // Other Metro Hubs (Kolkata, Hyderabad, Pune)
  { name: 'Park Street, Kolkata, West Bengal', shortName: 'Park Street Kolkata', lat: 22.5510, lng: 88.3526, address: 'Park Street, Kolkata' },
  { name: 'Howrah Railway Station, Kolkata', shortName: 'Howrah Station Kolkata', lat: 22.5839, lng: 88.3426, address: 'Howrah, West Bengal' },
  { name: 'Hitec City, Cyberabad, Hyderabad', shortName: 'Hitec City Hyderabad', lat: 17.4435, lng: 78.3772, address: 'Madhapur, Hyderabad' },
  { name: 'Gachibowli Stadium & Financial District, Hyderabad', shortName: 'Gachibowli Hyderabad', lat: 17.4401, lng: 78.3489, address: 'Gachibowli, Hyderabad' },
  { name: 'Koregaon Park, Pune, Maharashtra', shortName: 'Koregaon Park Pune', lat: 18.5362, lng: 73.8940, address: 'Koregaon Park, Pune' },
  { name: 'Viman Nagar & Phoenix Marketcity, Pune', shortName: 'Viman Nagar Pune', lat: 18.5679, lng: 73.9143, address: 'Viman Nagar, Pune' }
];

// Fallback Haversine Distance (in km)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Fetch real driving route from free OSRM Public Routing API
export async function getRouteDetails(
  pickup: LocationPoint,
  destination: LocationPoint
): Promise<RouteGeometryResult> {
  const straightDistance = calculateHaversineDistance(
    pickup.lat,
    pickup.lng,
    destination.lat,
    destination.lng
  );

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distKm = Number((route.distance / 1000).toFixed(1));
        const durMin = Math.round(route.duration / 60);
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        return {
          distanceKm: distKm,
          durationMinutes: Math.max(durMin, Math.round(distKm * 2.2)),
          coordinates: coords,
          summary: `${distKm} km • ~${durMin} mins`
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  // Realistic fallback with road winding factor
  const simulatedDistKm = Number((Math.max(straightDistance, 1.2) * 1.35).toFixed(1));
  const simulatedDurationMin = Math.round(simulatedDistKm * 2.4);

  const coords = generateInterpolatedPath(
    [pickup.lat, pickup.lng],
    [destination.lat, destination.lng],
    16
  );

  return {
    distanceKm: simulatedDistKm,
    durationMinutes: simulatedDurationMin,
    coordinates: coords,
    summary: `${simulatedDistKm} km • ~${simulatedDurationMin} mins`
  };
}

function generateInterpolatedPath(
  start: [number, number],
  end: [number, number],
  steps: number
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const curvature = Math.sin(t * Math.PI) * 0.008;
    const lat = start[0] + (end[0] - start[0]) * t + curvature;
    const lng = start[1] + (end[1] - start[1]) * t + curvature * 0.5;
    points.push([lat, lng]);
  }
  return points;
}

// Search locations with instant 2-4 letter matching & live Photon Geocoder
export async function searchLocationSuggestions(query: string): Promise<LocationPoint[]> {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  // 1. Instant match from comprehensive local Indian landmarks (0ms latency)
  const matches: LocationPoint[] = [];

  // Check comprehensive dictionary
  for (const loc of EXTENSIVE_INDIAN_PLACES) {
    if (
      loc.shortName.toLowerCase().includes(clean) ||
      loc.name.toLowerCase().includes(clean) ||
      (loc.address && loc.address.toLowerCase().includes(clean))
    ) {
      if (!matches.some(m => m.name === loc.name)) {
        matches.push(loc);
      }
    }
  }

  // Check city presets
  for (const city of CITIES) {
    for (const loc of city.locations) {
      if (
        loc.shortName.toLowerCase().includes(clean) ||
        loc.name.toLowerCase().includes(clean)
      ) {
        if (!matches.some(m => m.name === loc.name)) {
          matches.push(loc);
        }
      }
    }
  }

  // If we already have 4+ good local matches, return top results immediately
  if (matches.length >= 4) {
    return matches.slice(0, 6);
  }

  // 2. Fetch from Komoot Photon Geocoder (Super fast OpenStreetMap search with CORS support)
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=6&lat=28.6139&lon=77.2090`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const liveResults: LocationPoint[] = data.features.map((feat: any) => {
          const props = feat.properties || {};
          const shortName = props.name || props.street || 'Location';
          const parts = [
            props.name,
            props.street,
            props.district || props.city,
            props.state,
            props.country
          ].filter(Boolean);
          const fullAddress = parts.join(', ');

          return {
            name: fullAddress || shortName,
            shortName: shortName,
            lat: feat.geometry.coordinates[1],
            lng: feat.geometry.coordinates[0],
            address: fullAddress
          };
        });

        for (const item of liveResults) {
          if (!matches.some(m => Math.abs(m.lat - item.lat) < 0.001 && Math.abs(m.lng - item.lng) < 0.001)) {
            matches.push(item);
          }
        }
      }
    }
  } catch {
    // If external geocoder is slow, fallback seamlessly to local matches
  }

  return matches.slice(0, 6);
}

// Generate realistic simulated drivers around a coordinate
export interface SimulatedDriverMarker {
  id: string;
  provider: 'uber' | 'ola' | 'rapido' | 'blusmart';
  type: 'cab' | 'auto' | 'bike' | 'erickshaw';
  lat: number;
  lng: number;
  rotation: number;
}

export function generateNearbyDrivers(pickup: LocationPoint): SimulatedDriverMarker[] {
  const drivers: SimulatedDriverMarker[] = [];
  const providers: ('uber' | 'ola' | 'rapido' | 'blusmart')[] = ['uber', 'ola', 'rapido', 'blusmart'];
  const types: ('cab' | 'auto' | 'bike' | 'erickshaw')[] = ['cab', 'auto', 'bike', 'erickshaw'];

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 2 * Math.PI + Math.random() * 0.3;
    const distanceKm = 0.2 + Math.random() * 0.7; // within 200m - 900m
    const latOffset = (distanceKm / 111) * Math.cos(angle);
    const lngOffset = (distanceKm / (111 * Math.cos(deg2rad(pickup.lat)))) * Math.sin(angle);

    drivers.push({
      id: `driver-${i + 1}`,
      provider: providers[i % providers.length],
      type: types[i % types.length],
      lat: pickup.lat + latOffset,
      lng: pickup.lng + lngOffset,
      rotation: Math.floor(Math.random() * 360)
    });
  }

  return drivers;
}
