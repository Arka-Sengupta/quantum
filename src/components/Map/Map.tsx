import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

interface MapProps {
  locations: Location[];
  path: Location[];
}

const Map: React.FC<MapProps> = ({ locations, path }) => {
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default center (India)
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    // Adjust center and zoom based on locations if available
    if (locations.length > 0) {
      setCenter(locations[0].coordinates);
      setZoom(10);
    }
  }, [locations]);

  // Create path coordinates for the polyline
  const pathPositions = path.map(location => location.coordinates);

  return (
    <Box sx={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker 
            key={location.id} 
            position={location.coordinates}
          >
            <Popup>
              <Typography variant="body1">{location.name}</Typography>
              <Typography variant="body2">
                {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
              </Typography>
            </Popup>
          </Marker>
        ))}

        {/* Draw the optimized path if available */}
        {pathPositions.length > 1 && (
          <Polyline 
            positions={pathPositions} 
            color="blue" 
            weight={3} 
            opacity={0.7} 
            dashArray="5, 10"
          />
        )}
      </MapContainer>
    </Box>
  );
};

export default Map;