// Utility to fetch route from Mapbox Directions API
// Add your Mapbox API key in .env as REACT_APP_MAPBOX_API_KEY

interface Location {
  coordinates: [number, number]; // [latitude, longitude]
}

export interface OsrmRouteResult {
  polyline: [number, number][];
  distance: number; // in meters
}

// Fetch route from OSRM public API
export async function fetchOsrmRoute(locations: Location[]): Promise<OsrmRouteResult> {
  if (!locations || locations.length < 2) throw new Error('At least two locations required');

  // Format coordinates for OSRM: lon,lat;lon,lat;...
  const coords = locations.map((loc: Location) => `${loc.coordinates[1]},${loc.coordinates[0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch route');
  const data = await response.json();

  // Extract route geometry (array of [lon, lat]) and total distance
  const route = data.routes[0]?.geometry?.coordinates || [];
  const distance = data.routes[0]?.distance || 0;
  // Convert to [lat, lng] for your app
  return {
    polyline: route.map(([lon, lat]: [number, number]) => [lat, lon]),
    distance,
  };
}
