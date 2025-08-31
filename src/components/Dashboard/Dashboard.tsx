import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Paper, Grid, CircularProgress, Button } from '@mui/material';
import Toast from '../Toast';
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
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '', severity: 'info' });
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
    setOptimizedPath([]);
    setToast({ open: true, message: 'Location added!', severity: 'success' });
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id));
    setOptimizedPath([]);
    setToast({ open: true, message: 'Location removed!', severity: 'info' });
  };

  const handleCalculatePath = async () => {
    if (locations.length < 2) {
      setToast({ open: true, message: 'Add at least two locations!', severity: 'warning' });
      return;
    }
    setIsCalculating(true);
    try {
      const result: OsrmRouteResult = await fetchOsrmRoute(locations);
      setRoutePolyline(result.polyline);
      setTotalDistance(result.distance);
      setOptimizedPath(locations);
      setToast({ open: true, message: 'Route calculated!', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'Error calculating route!', severity: 'error' });
      console.error('Error calculating path:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
  <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1, color: '#2d3a4a' }}>
              Qryptix QAOA based route planner
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ fontStyle: 'italic', color: '#4b6584' }}>
              Optimize travel routes using real-world road routing
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>

      <Grid container spacing={4}>
  <Grid size={{ xs: 12, md: 5 }}>
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <LocationInput
              locations={locations}
              onAddLocation={handleAddLocation}
              onRemoveLocation={handleRemoveLocation}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, borderRadius: 3, fontWeight: 600, boxShadow: '0 4px 16px rgba(44,62,80,0.10)', background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)' }}
              component={motion.button}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(44,62,80,0.18)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCalculatePath}
            >
              Calculate Route
            </Button>

            {isCalculating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <CircularProgress color="success" />
                  </motion.div>
                  <Box sx={{ width: '100px', ml: 2 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }} style={{ height: 6, background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', borderRadius: 3 }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Calculating optimal route using road network...
                  </Typography>
                </Box>
              </motion.div>
            )}

            {optimizedPath.length > 0 && (
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
                <Paper elevation={6} sx={{ p: 3, mt: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2d3a4a', fontWeight: 600 }}>
                    Optimized Path
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, color: '#43cea2', fontWeight: 500 }}>
                    Total Distance: {(totalDistance / 1000).toFixed(2)} km
                  </Typography>
                  <Box component="ol" sx={{ pl: 2 }}>
                    {optimizedPath.map((location, index) => (
                      <motion.li key={location.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.1 }} style={{ listStyle: 'none', marginBottom: '8px' }}>
                        <Typography sx={{ color: index === 0 ? '#185a9d' : (index === optimizedPath.length - 1 ? '#43cea2' : '#2d3a4a'), fontWeight: index === 0 || index === optimizedPath.length - 1 ? 700 : 400 }}>
                          {index === 0 ? 'Start: ' : index === optimizedPath.length - 1 ? 'End: ' : `${index + 1}. `}
                          {location.name} ({location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)})
                        </Typography>
                      </motion.li>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <Paper elevation={6} sx={{ p: 2, borderRadius: 4, boxShadow: '0 8px 32px rgba(44,62,80,0.12)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#185a9d', fontWeight: 600 }}>
                Map View
              </Typography>
              <Map 
                locations={locations} 
                path={optimizedPath.length > 0 ? optimizedPath : []}
                routePolyline={routePolyline}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} />
    </Container>
  );
};

export default Dashboard;