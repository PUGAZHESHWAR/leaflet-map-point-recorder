import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EditPointData, MarkerColor } from '../types';

interface EditPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  point: EditPointData | null;
  onSave: (updatedPoint: EditPointData) => void;
}

export default function EditPointModal({ isOpen, onClose, point, onSave }: EditPointModalProps) {
  const [formData, setFormData] = useState<EditPointData>({
    id: 0,
    latitude: 0,
    longitude: 0,
    color: 'blue',
    nodeId: '',
  });

  useEffect(() => {
    if (point) {
      setFormData(point);
    }
  }, [point]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nodeId.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleColorChange = (color: MarkerColor) => {
    setFormData(prev => ({ ...prev, color }));
  };

  if (!isOpen || !point) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Point</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node ID
            </label>
            <input
              type="text"
              value={formData.nodeId}
              onChange={(e) => setFormData(prev => ({ ...prev, nodeId: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A75"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="color"
                  value="blue"
                  checked={formData.color === 'blue'}
                  onChange={() => handleColorChange('blue')}
                  className="mr-2"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Blue</span>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="color"
                  value="pink"
                  checked={formData.color === 'pink'}
                  onChange={() => handleColorChange('pink')}
                  className="mr-2"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="text-sm">Pink</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 