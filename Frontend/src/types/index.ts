// Type definitions for the point recording application

export interface MapPoint {
  id: number;           // Unique identifier for the point
  serialNumber: number; // Serial number starting from 1
  latitude: number;     // Latitude coordinate
  longitude: number;    // Longitude coordinate
  color: 'pink' | 'blue'; // Selected color for the marker
  nodeId?: string;      // Node ID like "A75", "A76", etc.
}

export type MarkerColor = 'pink' | 'blue';

// New types for node and path management
export interface Node {
  id: string;           // Node ID like "A75"
  lat: number;         // Latitude coordinate
  lon: number;         // Longitude coordinate
  colour: 'pink' | 'blue'; // Node color
}

export interface Path {
  from: string;        // Source node ID
  to: string;          // Destination node ID
  distance: number;    // Distance between nodes
}

export interface EditPointData {
  id: number;
  latitude: number;
  longitude: number;
  color: 'pink' | 'blue';
  nodeId: string;
}