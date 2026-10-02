import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint } from '../types';
import { SimulatedDriverMarker } from '../services/mapService';
import { Navigation, Compass, Layers } from 'lucide-react';

interface InteractiveMapProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  routeCoords: [number, number][];
  nearbyDrivers: SimulatedDriverMarker[];
  isSearching: boolean;
  onDetectLocation?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  destination,
  routeCoords,
  nearbyDrivers,
  isSearching,
  onDetectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([pickup.lat, pickup.lng], 13);

      // Clean, modern OpenStreetMap CartoDB Positron / OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polyline when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. Pickup Custom Pin (Green)
    const pickupIcon = L.divIcon({
      className: 'custom-pickup-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping"></div>
          <div class="w-8 h-8 bg-emerald-600 border-2 border-white text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xs">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
      .bindPopup(`<div class="font-sans text-xs"><strong>Pickup:</strong><br/>${pickup.shortName}</div>`);
    markersLayer.addLayer(pickupMarker);

    // 2. Destination Custom Pin (Red)
    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 bg-rose-600 border-2 border-white text-white rounded-full shadow-lg flex items-center justify-center font-bold text-xs">
            🏁
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
      .bindPopup(`<div class="font-sans text-xs"><strong>Destination:</strong><br/>${destination.shortName}</div>`);
    markersLayer.addLayer(destMarker);

    // 3. Nearby Live Drivers
    nearbyDrivers.forEach(driver => {
      let iconEmoji = '🚗';
      let bgColor = 'bg-black text-white';
      let providerName = 'Uber';

      if (driver.type === 'bike') iconEmoji = '🏍️';
      if (driver.type === 'auto') iconEmoji = '🛺';

      if (driver.provider === 'ola') {
        bgColor = 'bg-emerald-600 text-white';
        providerName = 'Ola';
      } else if (driver.provider === 'rapido') {
        bgColor = 'bg-amber-400 text-black';
        providerName = 'Rapido';
      } else if (driver.provider === 'blusmart') {
        bgColor = 'bg-blue-600 text-white';
        providerName = 'BluSmart EV';
      }

      const driverIcon = L.divIcon({
        className: 'custom-driver-icon',
        html: `
          <div class="w-7 h-7 ${bgColor} rounded-full shadow-md border border-white flex items-center justify-center text-xs transition-transform transform hover:scale-125 cursor-pointer driver-marker-pulse" title="${providerName}">
            ${iconEmoji}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const dMarker = L.marker([driver.lat, driver.lng], { icon: driverIcon })
        .bindTooltip(`${providerName} nearby (${driver.type})`, { direction: 'top', offset: [0, -10] });
      markersLayer.addLayer(dMarker);
    });

    // 4. Update Route Polyline
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
    }

    if (routeCoords.length > 0) {
      const polyline = L.polyline(routeCoords, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        dashArray: '1, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Add a subtle outer glow line
      const outline = L.polyline(routeCoords, {
        color: '#60a5fa',
        weight: 8,
        opacity: 0.4
      }).addTo(map);
      outline.bringToBack();

      routePolylineRef.current = polyline;

      // Fit map viewport smoothly to cover route
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
        ...routeCoords
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      ]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }

    // Leaflet needs resize tick
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [pickup, destination, routeCoords, nearbyDrivers]);

  const handleCenterRoute = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([
      [pickup.lat, pickup.lng],
      [destination.lat, destination.lng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="relative w-full h-[320px] lg:h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        {onDetectLocation && (
          <button
            onClick={onDetectLocation}
            title="Locate my position"
            className="p-2.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 backdrop-blur transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        )}
        <button
          onClick={handleCenterRoute}
          title="Reset View"
          className="p-2.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 backdrop-blur transition-all active:scale-95"
        >
          <Compass className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950"></span>
          Pickup
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-950"></span>
          Drop
        </span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <Layers className="w-3 h-3" />
          {nearbyDrivers.length} Nearby Cabs
        </span>
      </div>

      {/* Searching Loader Overlay */}
      {isSearching && (
        <div className="absolute inset-0 z-[500] bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Querying Uber, Ola, Rapido, inDrive, BluSmart...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
