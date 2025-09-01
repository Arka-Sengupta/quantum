
# Qryptix QAOA Based Route Planner

A modern web dashboard for route planning using the Quantum Approximate Optimization Algorithm (QAOA) and real-world road routing APIs. Built with React, Framer Motion, Leaflet, and OSRM.

## Features
- Add, remove, and manage multiple locations
- Calculate optimized route using QAOA principles and OSRM road network
- View route and waypoints on an interactive map
- Animated, beautiful UI with Framer Motion
- Displays total route distance
- Toast notifications for actions and errors

## How It Works
This dashboard simulates QAOA-based path planning by leveraging classical routing APIs (OSRM) for real-world navigation. The UI and logic are designed to be extensible for future quantum integration.

- **Input**: Add locations with name, latitude, and longitude
- **Routing**: When you click "Calculate Route", the app queries OSRM for the shortest road route between all waypoints
- **Output**: The optimized route is displayed on the map, with total distance and ordered waypoints

## Getting Started

1. **Install dependencies**
	```sh
	npm install
	```
2. **Start the development server**
	```sh
	npm start
	```
3. **Open the app**
	Visit [http://localhost:3000](http://localhost:3000) in your browser

## Usage
- Add at least two locations using the form
- Click "Calculate Route" to view the optimized path
- View the route, waypoints, and total distance on the dashboard

## Technologies Used
- React & TypeScript
- Framer Motion (animations)
- Material UI (design)
- Leaflet (map)
- OSRM (routing API)

## Extending for Quantum Computing
This app is designed to be extensible for future integration with quantum algorithms and QAOA solvers. The current routing logic uses classical APIs, but the UI and structure can be adapted for quantum backends.