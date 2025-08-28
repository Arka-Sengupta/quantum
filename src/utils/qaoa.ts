// Build a graph from OSM road data (GeoJSON from Overpass API)

export function buildGraph(osmData: any): Record<string, Record<string, number>> {
  const nodes: Record<string, [number, number]> = {};
  const graph: Record<string, Record<string, number>> = {};

  // Extract nodes
  for (const element of osmData.elements) {
    if (element.type === 'node') {
      nodes[element.id] = [element.lat, element.lon];
    }
  }

  // Extract edges from ways
  for (const element of osmData.elements) {
    if (element.type === 'way' && element.nodes) {
      for (let i = 0; i < element.nodes.length - 1; i++) {
        const a = element.nodes[i];
        const b = element.nodes[i + 1];
        if (nodes[a] && nodes[b]) {
          const dist = calculateDistance(nodes[a], nodes[b]);
          if (!graph[a]) graph[a] = {};
          if (!graph[b]) graph[b] = {};
          graph[a][b] = dist;
          graph[b][a] = dist; // bidirectional
        }
      }
    }
  }
  return graph;
}
/**
 * Quantum Approximate Optimization Algorithm (QAOA) simulation for path planning
 * 
 * This is a simplified simulation of how QAOA would work for path optimization.
 * In a real quantum computing implementation, this would interface with a quantum
 * processor or simulator using libraries like Qiskit, Cirq, or Q#.
 */

interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

/**
 * Calculate distance between two geographic coordinates using the Haversine formula
 */
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

  // Fetch road data from OpenStreetMap Overpass API as GeoJSON
  export async function fetchRoadsGeoJSON(bbox: [number, number, number, number]): Promise<any> {
      // bbox: [south, west, north, east]
      const query = `
          [out:json];
          (
            way["highway"](${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]});
          );
          out body;
          >;
          out skel qt;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch OSM data');
      return await response.json();
  }

/**
 * Create a distance matrix between all locations
 */
function createDistanceMatrix(locations: Location[]): number[][] {
  const n = locations.length;
  const distanceMatrix: number[][] = [];
  
  for (let i = 0; i < n; i++) {
    distanceMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        distanceMatrix[i][j] = 0;
      } else {
        distanceMatrix[i][j] = calculateDistance(
          locations[i].coordinates,
          locations[j].coordinates
        );
      }
    }
  }
  
  return distanceMatrix;
}

/**
 * Simulate QAOA for solving the Traveling Salesman Problem
 * 
 * In a real quantum implementation, this would:
 * 1. Encode the problem into a quantum Hamiltonian
 * 2. Prepare a quantum circuit with QAOA ansatz
 * 3. Execute on quantum hardware/simulator
 * 4. Sample from the output distribution
 * 
 * Here we simulate the result with a classical approximation
 */
function simulateQAOA(distanceMatrix: number[][]): number[] {
  const n = distanceMatrix.length;
  
  // In a real QAOA implementation, we would run a quantum circuit here
  // For simulation, we'll use a greedy algorithm with some randomness to mimic
  // the probabilistic nature of quantum algorithms
  
  // Start from a random city
  const startIndex = Math.floor(Math.random() * n);
  const path: number[] = [startIndex];
  const visited = new Set<number>([startIndex]);
  
  // Simple greedy algorithm with some randomness
  while (path.length < n) {
    const lastCity = path[path.length - 1];
    const candidates = [];
    
    // Find unvisited cities
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        candidates.push({
          index: i,
          distance: distanceMatrix[lastCity][i]
        });
      }
    }
    
    // Sort by distance
    candidates.sort((a, b) => a.distance - b.distance);
    
    // Add some quantum-inspired randomness
    // In QAOA, we would get a distribution of possible next steps
    // Here we simulate by sometimes not taking the greedy choice
    let nextIndex;
    const rand = Math.random();
    if (rand < 0.7) {
      // Take the greedy choice (closest city) 70% of the time
      nextIndex = candidates[0].index;
    } else {
      // Take a random choice from the top 3 closest cities (or fewer if less available)
      const topN = Math.min(3, candidates.length);
      const randomChoice = Math.floor(Math.random() * topN);
      nextIndex = candidates[randomChoice].index;
    }
    
    path.push(nextIndex);
    visited.add(nextIndex);
  }
  
  // Add the return to starting city to complete the circuit
  // path.push(startIndex);
  
  return path;
}

/**
 * Calculate the optimal path using QAOA simulation
 */
export async function calculateOptimalPath(locations: Location[]): Promise<Location[]> {
  return new Promise((resolve) => {
    // Add artificial delay to simulate quantum computation
    setTimeout(() => {
      if (locations.length <= 1) {
        resolve(locations);
        return;
      }
      
      const distanceMatrix = createDistanceMatrix(locations);
      const pathIndices = simulateQAOA(distanceMatrix);
      
      // Convert indices back to locations
      const path = pathIndices.map(index => locations[index]);
      
      resolve(path);
    }, 2000); // 2 second delay to simulate computation
  });
}