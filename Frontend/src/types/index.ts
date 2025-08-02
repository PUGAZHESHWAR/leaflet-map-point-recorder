// Type definitions for the point recording application

export interface MapPoint {
  id: number;           // Unique identifier for the point
  serialNumber: number; // Serial number starting from 1
  latitude: number;     // Latitude coordinate
  longitude: number;    // Longitude coordinate
  color: 'pink' | 'blue'; // Selected color for the marker
}

export type MarkerColor = 'pink' | 'blue';