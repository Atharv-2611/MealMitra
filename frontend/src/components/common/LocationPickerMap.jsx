import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Configure Leaflet default icons to avoid missing asset issues in Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom MealMitra Electric Indigo branded map pin
const createBrandedPin = (isDraggable = false) => {
  return L.divIcon({
    className: 'mealmitra-map-marker',
    html: `
      <div style="position: relative; width: 34px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; filter: drop-shadow(0 4px 8px rgba(0, 55, 112, 0.28)); ${
        isDraggable ? 'cursor: grab;' : 'cursor: default;'
      }">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 26.5 14.5 40.5 15.82 41.77C16.48 42.4 17.52 42.4 18.18 41.77C19.5 40.5 34 26.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#533afd"/>
          <circle cx="17" cy="16" r="6" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38]
  });
};

// Smoothly pans/zooms the map when coordinates change and ensures modal resize handling
function MapRecenter({ center, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (center && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom, { duration: 1.0 });
    }

    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

// Allows clicking directly on the map to place/move the marker
function MapClickHandler({ onLocationChange, enabled }) {
  useMapEvents({
    click(e) {
      if (enabled && onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

// Draggable marker with dragend handler
function DraggableMarker({ position, onLocationChange, isDraggable, addressName }) {
  const markerRef = useRef(null);
  const pinIcon = useMemo(() => createBrandedPin(isDraggable), [isDraggable]);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          if (onLocationChange) {
            onLocationChange(latLng.lat, latLng.lng);
          }
        }
      }
    }),
    [onLocationChange]
  );

  return (
    <Marker
      draggable={isDraggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={pinIcon}
    >
      <Popup>
        <div className="text-xs p-1">
          <p className="font-semibold text-[#0d253d]">
            {isDraggable ? 'Restaurant Pickup Point' : 'Registered Pickup Point'}
          </p>
          <p className="text-[#64748d] text-[11px] mt-0.5 line-clamp-2">
            {addressName || `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}
          </p>
          {isDraggable && (
            <p className="text-[#533afd] text-[10px] font-medium mt-1">
              • Drag pin or click map to adjust exact entrance
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

/**
 * Interactive Leaflet + OpenStreetMap component.
 * Supports both draggable editing (profile) and static read-only presentation (donation page).
 */
export const LocationPickerMap = ({
  latitude,
  longitude,
  address = '',
  isEditable = false,
  onLocationChange,
  height = '300px',
  className = ''
}) => {
  const hasValidCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const center = useMemo(() => {
    return hasValidCoords ? [latitude, longitude] : [18.5204, 73.8567]; // Pune fallback center
  }, [hasValidCoords, latitude, longitude]);

  if (!hasValidCoords && !isEditable) {
    return (
      <div
        style={{ height }}
        className={`w-full bg-[#f6f9fc] border border-[#e3e8ee] rounded-xl flex flex-col items-center justify-center p-6 text-center text-[#64748d] ${className}`}
      >
        <MapPin className="w-8 h-8 text-[#a8c3de] mb-2" />
        <p className="text-xs sm:text-sm font-medium text-[#0d253d]">No Coordinates Available</p>
        <p className="text-xs text-[#64748d] mt-1 font-light max-w-sm">
          Please configure and save your restaurant pickup address and map location in your Profile.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-[#e3e8ee] shadow-stripe-1 bg-[#f6f9fc] ${className}`}>
      {/* Top Banner / Help Note */}
      {isEditable && (
        <div className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 border-b border-[#e3e8ee] flex items-center justify-between text-xs text-[#64748d]">
          <span className="flex items-center gap-1.5 font-light">
            <Navigation className="w-3.5 h-3.5 text-[#533afd]" />
            <span>Interactive Pickup Location Map</span>
          </span>
          <span className="text-[11px] text-[#533afd] font-medium">
            Drag marker to adjust
          </span>
        </div>
      )}

      {/* Map Body */}
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={hasValidCoords ? 16 : 13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <MapRecenter center={center} zoom={hasValidCoords ? 16 : 13} />
          <MapClickHandler onLocationChange={onLocationChange} enabled={isEditable} />
          {hasValidCoords && (
            <DraggableMarker
              position={center}
              onLocationChange={onLocationChange}
              isDraggable={isEditable}
              addressName={address}
            />
          )}
        </MapContainer>
      </div>

      {/* Bottom Coordinates HUD */}
      {hasValidCoords && (
        <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 border-t border-[#e3e8ee] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748d]">
          <span className="truncate max-w-md font-light text-[#273951]">
            {address || 'Selected pickup coordinates'}
          </span>
          <div className="flex items-center gap-2 tnum font-mono text-[10px] text-[#533afd] bg-[#eef0ff] px-2 py-0.5 rounded-full border border-[#b9b9f9]/50">
            <span>Lat: {latitude.toFixed(5)}</span>
            <span>•</span>
            <span>Lng: {longitude.toFixed(5)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

