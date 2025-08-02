# Interactive Point Recorder with Node Management

A React-based web application for recording map points with advanced node and path management capabilities.

## Features

### Core Functionality
- **Interactive Map**: Click anywhere on the map to record points with coordinates
- **Color Selection**: Choose between blue and pink markers
- **Location Detection**: Get your current location to center the map
- **Point Management**: View, edit, and delete recorded points

### Node Management
- **Node ID Assignment**: Assign unique node IDs (e.g., A75, A76, A77) to points
- **Edit Points**: Click the "Edit" button in the table to modify point data
- **Node Visualization**: See node IDs in map popups and table

### Path Management
- **Path Creation**: Create connections between nodes with distances
- **Auto-Generation**: Automatically generate paths between consecutive nodes
- **Distance Calculation**: Automatic distance calculation between nodes
- **Path Visualization**: See paths as lines on the map
- **Connection Display**: Click on markers to see their connections

### Data Export
- **JSON Export**: Save data in two formats:
  - `road_path.json`: Node data with coordinates and colors
  - `edges_with_distances.json`: Path data with distances
- **CSV Export**: Download all points as CSV file

## Usage

1. **Get Started**: Click "Get Current Location" to center the map
2. **Add Points**: Select a color and click on the map to add points
3. **Assign Node IDs**: Edit points in the table to assign node IDs (e.g., A75)
4. **Create Paths**: Use the Path Manager to connect nodes
5. **Visualize**: Click on map markers to see connections
6. **Export**: Save your data using the "Save Data" button

## Data Formats

### Node Format (road_path.json)
```json
[
  {
    "id": "A75",
    "lat": 12.192052,
    "lon": 79.083649,
    "colour": "blue"
  }
]
```

### Path Format (edges_with_distances.json)
```json
[
  {
    "from": "A75",
    "to": "A76",
    "distance": 150
  }
]
```

## Technology Stack

- **React 18** with TypeScript
- **Leaflet** for interactive maps
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Development

```bash
cd Frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`