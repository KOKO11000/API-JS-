/**
 * PROJECT STRUCTURE DOCUMENTATION
 * 
 * Air Simulator - Military Flight Tracking System
 * 
 * FOLDER ORGANIZATION:
 * 
 * /api         - API communication layer
 *               Centralized Axios client for server requests
 *               Functions: getFlights, createFlight, getFlightDistance, etc.
 * 
 * /hooks       - React custom hooks
 *               useFlights    - Flight and aircraft data management
 *               useMap        - Map search functionality (radius, polygon, distance)
 *               useValidation - Data consistency and synchronization
 * 
 * /components  - Reusable React components
 *               /flights      - Flight-specific components
 *                 FlightCard  - Individual flight display with details
 *                 FlightSearch - Flight search and filtering
 *               /home         - Navigation and menu components
 * 
 * /pages       - Full page components
 *               Map.jsx    - Mission control dashboard with map visualization
 *               Other pages for aircraft, types, flights management
 * 
 * /utils       - Helper functions and constants
 *               geo.js          - Geographic calculations (distance, bearing, interpolation)
 *               militaryTheme.js - Colors and styling constants
 * 
 * 
 * KEY DESIGN PRINCIPLES:
 * 
 * 1. DATA VALIDATION
 *    - All flights are validated to ensure aircraft exist and types are valid
 *    - useValidation hook ensures data consistency
 * 
 * 2. MILITARY THEME
 *    - Dark backgrounds (gray-900, gray-950)
 *    - Amber accents (#d97706) for primary actions
 *    - Red indicators (#ef4444) for active operations
 *    - Status colors: Green (Landed), Amber (Returning), Red (Outbound)
 * 
 * 3. CLEAN SEPARATION OF CONCERNS
 *    - API layer handles all server communication
 *    - Hooks manage state and business logic
 *    - Components focus on UI rendering only
 *    - Pages compose hooks and components
 * 
 * 4. PROFESSIONAL UX
 *    - Scrollable sidebar for flights list (doesn't scroll entire page)
 *    - Click aircraft on map to see detailed info overlay
 *    - Search functionality to find flights by ID or name
 *    - Real-time flight status updates
 */
