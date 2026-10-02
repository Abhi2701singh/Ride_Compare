import { LocationPoint } from '../types';
import { CITIES } from '../data/popularLocations';

export interface RouteGeometryResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng][]
  summary: string;
}

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
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distKm = Number((route.distance / 1000).toFixed(1));
        const durMin = Math.round(route.duration / 60);
        // OSRM coordinates are [lng, lat], Leaflet needs [lat, lng]
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
    // Graceful fallback to simulated driving route
  }

  // Realistic fallback: Indian traffic road factor is ~1.35x straight line
  const simulatedDistKm = Number((Math.max(straightDistance, 1.5) * 1.35).toFixed(1));
  const simulatedDurationMin = Math.round(simulatedDistKm * 2.5); // ~24 km/h city average

  // Generate interpolated curve points between pickup and destination
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
    // slight curve offset for natural looking road simulation
    const curvature = Math.sin(t * Math.PI) * 0.008;
    const lat = start[0] + (end[0] - start[0]) * t + curvature;
    const lng = start[1] + (end[1] - start[1]) * t + curvature * 0.5;
    points.push([lat, lng]);
  }
  return points;
}

// Search locations with local preset priority + free Nominatim API
export async function searchLocationSuggestions(query: string): Promise<LocationPoint[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // 1. Search local preset database (Instant response)
  const localMatches: LocationPoint[] = [];
  for (const city of CITIES) {
    for (const loc of city.locations) {
      if (
        loc.name.toLowerCase().includes(clean) ||
        loc.shortName.toLowerCase().includes(clean)
      ) {
        if (!localMatches.some(m => m.name === loc.name)) {
          localMatches.push(loc);
        }
      }
    }
  }

  if (clean.length < 3) {
    return localMatches.slice(0, 5);
  }

  // 2. Fetch from OpenStreetMap Nominatim for any location in India
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      clean
    )}&countrycodes=in&limit=5&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'RideCompareApp/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const nominatimResults: LocationPoint[] = data.map((item: { display_name: string; lat: string; lon: string; name?: string }) => {
        const parts = item.display_name.split(',');
        const shortName = item.name || parts[0] || 'Location';
        return {
          name: item.display_name,
          shortName: shortName.trim(),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name
        };
      });

      // Combine local matches first, followed by live Nominatim results
      const combined = [...localMatches];
      for (const item of nominatimResults) {
        if (!combined.some(c => Math.abs(c.lat - item.lat) < 0.001 && Math.abs(c.lng - item.lng) < 0.001)) {
          combined.push(item);
        }
      }
      return combined.slice(0, 6);
    }
  } catch {
    // If Nominatim fails or times out, return local matches
  }

  return localMatches.slice(0, 5);
}

// Generate realistic simulated drivers around a coordinate
export interface SimulatedDriverMarker {
  id: string;
  provider: 'uber' | 'ola' | 'rapido' | 'blusmart';
  type: 'cab' | 'auto' | 'bike';
  lat: number;
  lng: number;
  rotation: number;
}

export function generateNearbyDrivers(pickup: LocationPoint): SimulatedDriverMarker[] {
  const drivers: SimulatedDriverMarker[] = [];
  const providers: ('uber' | 'ola' | 'rapido' | 'blusmart')[] = ['uber', 'ola', 'rapido', 'blusmart'];
  const types: ('cab' | 'auto' | 'bike')[] = ['cab', 'auto', 'bike'];

  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * 2 * Math.PI + Math.random() * 0.3;
    const distanceKm = 0.3 + Math.random() * 0.8; // within 300m - 1.1km
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
