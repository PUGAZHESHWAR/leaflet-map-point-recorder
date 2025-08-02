import React from 'react';
import { MarkerColor } from '../types';

interface ColorSelectorProps {
  selectedColor: MarkerColor;
  onColorChange: (color: MarkerColor) => void;
}

export default function ColorSelector({ selectedColor, onColorChange }: ColorSelectorProps) {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="color-select" className="text-sm font-medium text-gray-700">
        Marker Color:
      </label>
      <select
        id="color-select"
        value={selectedColor}
        onChange={(e) => onColorChange(e.target.value as MarkerColor)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="blue">Blue</option>
        <option value="pink">Pink</option>
      </select>
      
      {/* Visual indicator of selected color */}
      <div className="flex items-center space-x-1">
        <div
          className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            selectedColor === 'blue' ? 'bg-blue-500' : 'bg-pink-500'
          }`}
        />
        <span className="text-xs text-gray-500 capitalize">{selectedColor}</span>
      </div>
    </div>
  );
}