import React, { useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import LeafletMap from './components/MapContainer';
import ColorSelector from './components/ColorSelector';
import LocationButton from './components/LocationButton';
import PointsTable from './components/PointsTable';
import CSVDownload from './components/CSVDownload';
import EditPointModal from './components/EditPointModal';
import PathManager from './components/PathManager';
import { MapPoint, MarkerColor, Node, Path, EditPointData } from './types';

function App() {
  // State management for the application
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [selectedColor, setSelectedColor] = useState<MarkerColor>('blue');
  const [nextId, setNextId] = useState(1);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  
  // New state for editing and path management
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<EditPointData | null>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [nextNodeId, setNextNodeId] = useState(75); // Start from A75

  // Handle map clicks to add new points
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newPoint: MapPoint = {
      id: nextId,
      serialNumber: points.length + 1,
      latitude: lat,
      longitude: lng,
      color: selectedColor,
    };

    setPoints(prevPoints => [...prevPoints, newPoint]);
    setNextId(prevId => prevId + 1);
  }, [points.length, selectedColor, nextId]);

  // Handle point deletion
  const handleDeletePoint = useCallback((id: number) => {
    setPoints(prevPoints => {
      const filteredPoints = prevPoints.filter(point => point.id !== id);
      // Reassign serial numbers after deletion to maintain sequence
      return filteredPoints.map((point, index) => ({
        ...point,
        serialNumber: index + 1,
      }));
    });
  }, []);

  // Handle point editing
  const handleEditPoint = useCallback((point: EditPointData) => {
    setEditingPoint(point);
    setIsEditModalOpen(true);
  }, []);

  // Handle save edited point
  const handleSaveEditedPoint = useCallback((updatedPoint: EditPointData) => {
    setPoints(prevPoints => 
      prevPoints.map(point => 
        point.id === updatedPoint.id 
          ? { ...point, ...updatedPoint }
          : point
      )
    );
    setIsEditModalOpen(false);
    setEditingPoint(null);
  }, []);

  // Handle color selection change
  const handleColorChange = useCallback((color: MarkerColor) => {
    setSelectedColor(color);
  }, []);

  // Handle location found
  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  }, []);

  // Handle point click on map
  const handlePointClick = useCallback((point: MapPoint) => {
    console.log('Point clicked:', point);
  }, []);

  // Convert points to nodes for export
  const getNodes = useCallback((): Node[] => {
    return points
      .filter(point => point.nodeId)
      .map(point => ({
        id: point.nodeId!,
        lat: point.latitude,
        lon: point.longitude,
        colour: point.color,
      }));
  }, [points]);

  // Handle save data
  const handleSaveData = useCallback(() => {
    const nodes = getNodes();
    const dataToSave = {
      nodes: nodes,
      paths: paths,
    };

    // Create JSON files for download
    const nodesBlob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
    const pathsBlob = new Blob([JSON.stringify(paths, null, 2)], { type: 'application/json' });

    // Download road_path.json (nodes)
    const nodesUrl = URL.createObjectURL(nodesBlob);
    const nodesLink = document.createElement('a');
    nodesLink.href = nodesUrl;
    nodesLink.download = 'road_path.json';
    document.body.appendChild(nodesLink);
    nodesLink.click();
    document.body.removeChild(nodesLink);
    URL.revokeObjectURL(nodesUrl);

    // Download edges_with_distances.json (paths)
    const pathsUrl = URL.createObjectURL(pathsBlob);
    const pathsLink = document.createElement('a');
    pathsLink.href = pathsUrl;
    pathsLink.download = 'edges_with_distances.json';
    document.body.appendChild(pathsLink);
    pathsLink.click();
    document.body.removeChild(pathsLink);
    URL.revokeObjectURL(pathsUrl);

    console.log('Data saved:', dataToSave);
  }, [getNodes, paths]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Interactive Point Recorder</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Click on the map to record points with coordinates and colors. Manage your data with the table below.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <LocationButton onLocationFound={handleLocationFound} />
              <ColorSelector
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            </div>
            <CSVDownload points={points} />
          </div>
        </div>

        {/* Location Info */}
        {mapCenter && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Current Location Found</p>
                <p className="text-xs text-green-600">
                  Lat: {mapCenter[0].toFixed(6)}, Lng: {mapCenter[1].toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Interactive Map</h2>
            <p className="text-sm text-gray-600 mt-1">
              {mapCenter 
                ? "Map centered on your current location. Click anywhere to record a point with the selected color"
                : "Click 'Get Current Location' to center the map on your position, then click anywhere to record points"
              }
            </p>
          </div>
          <LeafletMap
            points={points}
            selectedColor={selectedColor}
            onMapClick={handleMapClick}
            mapCenter={mapCenter}
            paths={paths}
            onPointClick={handlePointClick}
          />
        </div>

        {/* Path Management Section */}
        <PathManager
          nodes={getNodes()}
          paths={paths}
          onPathsChange={setPaths}
          onSave={handleSaveData}
        />

        {/* Table Section */}
        <PointsTable
          points={points}
          onDeletePoint={handleDeletePoint}
          onEditPoint={handleEditPoint}
        />

        {/* Edit Modal */}
        <EditPointModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPoint(null);
          }}
          point={editingPoint}
          onSave={handleSaveEditedPoint}
        />

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Click 'Get Current Location' to automatically center the map on your position</p>
            <p>• Select your preferred marker color (pink or blue) from the dropdown</p>
            <p>• Click anywhere on the map to record a point at that location</p>
            <p>• Edit points in the table to assign Node IDs (e.g., A75, A76)</p>
            <p>• Use the Path Manager to create connections between nodes</p>
            <p>• Click on map markers to see their connections</p>
            <p>• Save your data to get road_path.json and edges_with_distances.json files</p>
            <p>• Download all your recorded points as a CSV file for external use</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;