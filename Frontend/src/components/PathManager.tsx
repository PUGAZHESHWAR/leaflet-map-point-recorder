import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Node, Path } from '../types';

interface PathManagerProps {
  nodes: Node[];
  paths: Path[];
  onPathsChange: (paths: Path[]) => void;
  onSave: () => void;
}

export default function PathManager({ nodes, paths, onPathsChange, onSave }: PathManagerProps) {
  const [newPath, setNewPath] = useState<Omit<Path, 'distance'>>({
    from: '',
    to: '',
  });
  const [distance, setDistance] = useState<number>(1);

  const calculateDistance = (fromNode: Node, toNode: Node): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (toNode.lat - fromNode.lat) * Math.PI / 180;
    const dLon = (toNode.lon - fromNode.lon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(fromNode.lat * Math.PI / 180) * Math.cos(toNode.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000); // Convert to meters and round
  };

  const addPath = () => {
    if (newPath.from && newPath.to && newPath.from !== newPath.to) {
      const fromNode = nodes.find(n => n.id === newPath.from);
      const toNode = nodes.find(n => n.id === newPath.to);
      
      if (fromNode && toNode) {
        const calculatedDistance = calculateDistance(fromNode, toNode);
        const path: Path = {
          from: newPath.from,
          to: newPath.to,
          distance: distance || calculatedDistance,
        };
        
        // Check if path already exists
        const exists = paths.some(p => 
          (p.from === path.from && p.to === path.to) || 
          (p.from === path.to && p.to === path.from)
        );
        
        if (!exists) {
          onPathsChange([...paths, path]);
          setNewPath({ from: '', to: '' });
          setDistance(1);
        }
      }
    }
  };

  const removePath = (index: number) => {
    const newPaths = paths.filter((_, i) => i !== index);
    onPathsChange(newPaths);
  };

  const autoGeneratePaths = () => {
    const newPaths: Path[] = [];
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const fromNode = nodes[i];
      const toNode = nodes[i + 1];
      const distance = calculateDistance(fromNode, toNode);
      
      newPaths.push({
        from: fromNode.id,
        to: toNode.id,
        distance,
      });
    }
    
    onPathsChange(newPaths);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Path Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={autoGeneratePaths}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Auto Generate
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Data
          </button>
        </div>
      </div>

      {/* Add new path */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Path</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From Node</label>
            <select
              value={newPath.from}
              onChange={(e) => setNewPath(prev => ({ ...prev, from: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To Node</label>
            <select
              value={newPath.to}
              onChange={(e) => setNewPath(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Distance (m)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-calculated"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addPath}
              disabled={!newPath.from || !newPath.to || newPath.from === newPath.to}
              className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Path
            </button>
          </div>
        </div>
      </div>

      {/* Paths list */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Current Paths ({paths.length})</h4>
        {paths.length === 0 ? (
          <p className="text-sm text-gray-500">No paths defined yet. Add paths above or use auto-generate.</p>
        ) : (
          <div className="space-y-2">
            {paths.map((path, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-900">{path.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-medium text-gray-900">{path.to}</span>
                  <span className="text-sm text-gray-600">({path.distance}m)</span>
                </div>
                <button
                  onClick={() => removePath(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Remove path"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 