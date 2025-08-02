import React, { useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPoint, MarkerColor } from '../types';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored markers
const createColoredIcon = (color: MarkerColor) => {
  const iconColor = color === 'pink' ? '#ec4899' : '#3b82f6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${iconColor};
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      "></div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [1, -24],
  });
};

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

// Component to handle map click events
function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

// Component to handle map centering
interface MapCenterHandlerProps {
  center: [number, number] | null;
}

function MapCenterHandler({ center }: MapCenterHandlerProps) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, 15); // Zoom level 15 for better detail
    }
  }, [center, map]);
  
  return null;
}

interface LeafletMapProps {
  points: MapPoint[];
  selectedColor: MarkerColor;
  onMapClick: (lat: number, lng: number) => void;
  mapCenter: [number, number] | null;
}

export default function LeafletMap({ points, selectedColor, onMapClick, mapCenter }: LeafletMapProps) {
  const handleMapClick = useCallback((lat: number, lng: number) => {
    onMapClick(lat, lng);
  }, [onMapClick]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={mapCenter || [40.7128, -74.0060]} // Default to New York City or user location
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map click handler */}
        <MapClickHandler onMapClick={handleMapClick} />
        
        {/* Map center handler */}
        <MapCenterHandler center={mapCenter} />
        
        {/* Render all recorded points as markers */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createColoredIcon(point.color)}
          >
            <Popup>
              <div className="text-center">
                <strong>Point #{point.serialNumber}</strong><br />
                <span className="text-sm text-gray-600">
                  Lat: {point.latitude.toFixed(6)}<br />
                  Lng: {point.longitude.toFixed(6)}<br />
                  Color: {point.color}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}