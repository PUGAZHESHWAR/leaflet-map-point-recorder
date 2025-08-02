import React, { useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPoint, MarkerColor, Node, Path } from '../types';

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
  paths?: Path[];
  onPointClick?: (point: MapPoint) => void;
}

export default function LeafletMap({ 
  points, 
  selectedColor, 
  onMapClick, 
  mapCenter, 
  paths = [],
  onPointClick 
}: LeafletMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    onMapClick(lat, lng);
  }, [onMapClick]);

  const handleMarkerClick = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    if (onPointClick) {
      onPointClick(point);
    }
  }, [onPointClick]);

  // Convert points to nodes for path visualization
  const nodes: Node[] = points
    .filter(point => point.nodeId)
    .map(point => ({
      id: point.nodeId!,
      lat: point.latitude,
      lon: point.longitude,
      colour: point.color,
    }));

  // Get connected paths for selected point
  const getConnectedPaths = (pointId: string) => {
    return paths.filter(path => 
      path.from === pointId || path.to === pointId
    );
  };

  const connectedPaths = selectedPoint?.nodeId ? getConnectedPaths(selectedPoint.nodeId) : [];

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
        
        {/* Render all paths */}
        {paths.map((path, index) => {
          const fromNode = nodes.find(n => n.id === path.from);
          const toNode = nodes.find(n => n.id === path.to);
          
          if (fromNode && toNode) {
            return (
              <Polyline
                key={`path-${index}`}
                positions={[
                  [fromNode.lat, fromNode.lon],
                  [toNode.lat, toNode.lon]
                ]}
                color="#3b82f6"
                weight={3}
                opacity={0.7}
              />
            );
          }
          return null;
        })}
        
        {/* Render connected paths for selected point */}
        {selectedPoint && connectedPaths.map((path, index) => {
          const fromNode = nodes.find(n => n.id === path.from);
          const toNode = nodes.find(n => n.id === path.to);
          
          if (fromNode && toNode) {
            return (
              <Polyline
                key={`connected-${index}`}
                positions={[
                  [fromNode.lat, fromNode.lon],
                  [toNode.lat, toNode.lon]
                ]}
                color="#ef4444"
                weight={5}
                opacity={0.9}
                dashArray="10, 5"
              />
            );
          }
          return null;
        })}
        
        {/* Render all recorded points as markers */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createColoredIcon(point.color)}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Popup>
              <div className="text-center">
                <strong>Point #{point.serialNumber}</strong><br />
                {point.nodeId && (
                  <span className="text-sm font-medium text-blue-600">
                    Node: {point.nodeId}<br />
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  Lat: {point.latitude.toFixed(6)}<br />
                  Lng: {point.longitude.toFixed(6)}<br />
                  Color: {point.color}
                </span>
                {connectedPaths.length > 0 && point.nodeId && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs font-medium text-red-600">
                      Connected to {connectedPaths.length} node{connectedPaths.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Connection info panel */}
      {selectedPoint && connectedPaths.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Connections for {selectedPoint.nodeId}
          </h4>
          <div className="space-y-1">
            {connectedPaths.map((path, index) => (
              <div key={index} className="text-xs text-gray-600">
                {path.from === selectedPoint.nodeId ? path.to : path.from} 
                <span className="text-gray-400"> ({path.distance}m)</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelectedPoint(null)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}