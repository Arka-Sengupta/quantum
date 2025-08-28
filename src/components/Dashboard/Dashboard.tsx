import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import Map from '../Map/Map';
import LocationInput from '../LocationInput/LocationInput';
import { fetchOsrmRoute, OsrmRouteResult } from '../../utils/mapboxRoute';
// ...existing code...

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [optimizedPath, setOptimizedPath] = useState<Location[]>([]);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAddLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(), // Simple unique ID
    };
    setLocations([...locations, newLocation]);
    // Reset optimized path when locations change
    setOptimizedPath([]);
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id));
    // Reset optimized path when locations change
    setOptimizedPath([]);
  };

  const handleCalculatePath = async () => {
    if (locations.length < 2) return;

    setIsCalculating(true);
    try {
      // Fetch route from OSRM public API
      const result: OsrmRouteResult = await fetchOsrmRoute(locations);
      setRoutePolyline(result.polyline);
      setTotalDistance(result.distance);
      setOptimizedPath(locations);
    } catch (error) {
      console.error('Error calculating path:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Route Planner
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Optimize travel routes using real-world road routing
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <LocationInput
            locations={locations}
            onAddLocation={handleAddLocation}
            onRemoveLocation={handleRemoveLocation}
            onCalculatePath={handleCalculatePath}
          />

          {isCalculating && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Calculating optimal route using road network...
              </Typography>
            </Box>
          )}

          {optimizedPath.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Optimized Path
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Total Distance: {(totalDistance / 1000).toFixed(2)} km
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                {optimizedPath.map((location, index) => (
                  <Box component="li" key={location.id} sx={{ mb: 1 }}>
                    <Typography>
                      {index + 1}. {location.name} ({location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Map View
            </Typography>
            <Map 
              locations={locations} 
              path={optimizedPath.length > 0 ? optimizedPath : []}
              routePolyline={routePolyline}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;