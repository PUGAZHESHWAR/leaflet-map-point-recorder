import React from 'react';
import { Download } from 'lucide-react';
import { MapPoint } from '../types';

interface CSVDownloadProps {
  points: MapPoint[];
}

export default function CSVDownload({ points }: CSVDownloadProps) {
  // Function to convert points data to CSV format
  const convertToCSV = (data: MapPoint[]): string => {
    const headers = ['s.no', 'latitudinal', 'longitudinal', 'colour'];
    const csvRows = [headers.join(',')];
    
    data.forEach(point => {
      const row = [
        point.serialNumber,
        point.latitude.toFixed(6),
        point.longitude.toFixed(6),
        point.color
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

  // Function to trigger CSV download
  const downloadCSV = () => {
    if (points.length === 0) {
      alert('No points to download. Please add some points first!');
      return;
    }

    const csvContent = convertToCSV(points);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create download link
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `recorded_points_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={downloadCSV}
      disabled={points.length === 0}
      className={`inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
        points.length === 0
          ? 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          : 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-700 focus:ring-green-500'
      }`}
      title={points.length === 0 ? 'No points to download' : 'Download points as CSV'}
    >
      <Download className="w-4 h-4 mr-2" />
      Download CSV ({points.length} point{points.length !== 1 ? 's' : ''})
    </button>
  );
}