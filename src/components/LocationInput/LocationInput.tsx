import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

interface LocationInputProps {
  locations: Location[];
  onAddLocation: (location: Omit<Location, 'id'>) => void;
  onRemoveLocation: (id: string) => void;
  onCalculatePath: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onCalculatePath
}) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddLocation = () => {
    // Validate inputs
    if (!name.trim()) {
      setError('Location name is required');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Coordinates must be valid numbers');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    // Add location
    onAddLocation({
      name: name.trim(),
      coordinates: [lat, lng]
    });

    // Reset form
    setName('');
    setLatitude('');
    setLongitude('');
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Locations
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Location Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Office, Home"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Latitude"
              variant="outlined"
              fullWidth
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 28.6139"
              type="number"
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Longitude"
              variant="outlined"
              fullWidth
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., 77.2090"
              type="number"
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddLocation}
              startIcon={<AddIcon />}
              sx={{ height: '56px' }}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Added Locations ({locations.length})
        </Typography>
        {locations.length > 0 ? (
          <>
            <List>
              {locations.map((location) => (
                <React.Fragment key={location.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => onRemoveLocation(location.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={location.name}
                      secondary={`${location.coordinates[0].toFixed(4)}, ${location.coordinates[1].toFixed(4)}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Button
              variant="contained"
              color="secondary"
              onClick={onCalculatePath}
              disabled={locations.length < 2}
              sx={{ mt: 2 }}
            >
              Calculate Optimal Path
            </Button>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No locations added yet. Add at least 2 locations to calculate the optimal path.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LocationInput;