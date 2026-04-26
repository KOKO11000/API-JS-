/**
 * PAGE DOCUMENTATION - MAP.JSX
 * 
 * Mission Control Dashboard - Real-Time Flight Tracking Interface
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * PURPOSE & OVERVIEW
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * The Map page is the central hub for real-time flight mission tracking and control.
 * It provides operators with a professional military-themed interface to monitor
 * active flights, visualize aircraft routes, and perform geospatial searches.
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * KEY FEATURES
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * 1. INTERACTIVE MAP VISUALIZATION
 *    - OpenStreetMap integration with Leaflet
 *    - Command base marker at coordinates [31.7683, 35.2137]
 *    - Flight aircraft markers with rotation and status-based coloring
 *    - Route visualization (outbound in red, returning in dark red)
 *    - Target location markers
 * 
 * 2. PROFESSIONAL AIRCRAFT ICONS
 *    - Visual distinction by flight status:
 *      ✓ Green (🛩️)  - Aircraft Landed
 *      ✓ Amber (🛩️)  - Aircraft Returning to Base
 *      ✓ Red (🛩️)    - Aircraft Outbound to Target
 *      ✓ Gray (🛩️)   - Flight Scheduled (not yet launched)
 *    - Icon rotates to show aircraft heading
 *    - Click on aircraft marker to see detailed info overlay
 * 
 * 3. SCROLLABLE FLIGHTS SIDEBAR (40% of screen width)
 *    - No full-page scroll required to see all flights
 *    - List of active missions with FlightCard components
 *    - Each card shows: ID, aircraft name, status, position, target
 *    - Real-time status updates every 1 second
 *    - Search bar to find flights by ID or aircraft name
 *    - Can be scrolled independently from map
 * 
 * 4. REAL-TIME FLIGHT TRACKING
 *    - Flight position updates every second based on:
 *      • Aircraft speed (varies by type: fighter 900, cargo 520, etc.)
 *      • Distance to target
 *      • Current flight status
 *    - Interpolation between base and target coordinates
 *    - ETA calculation and countdown
 *    - Distance calculations using Haversine formula
 * 
 * 5. GEOSPATIAL SEARCH CAPABILITIES
 *    - Radius Search: Find flights within N kilometers
 *    - Polygon Search: Define area by clicking map points, find all flights inside
 *    - Visual feedback: Search radius shown as circle, polygon as shaded area
 *    - Draggable search center marker for easy repositioning
 * 
 * 6. DATA VALIDATION & INTEGRITY
 *    - useValidation hook ensures only valid flights display
 *    - Flights filtered to ensure:
 *      ✓ Aircraft exists in inventory
 *      ✓ Aircraft has valid type assignment
 *      ✓ No orphaned records visible
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * TECHNICAL ARCHITECTURE
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * COMPONENT HIERARCHY:
 * Map (main page component)
 *   ├── Leaflet MapContainer
 *   │   ├── TileLayer (OpenStreetMap)
 *   │   ├── Command Base Marker
 *   │   ├── Search Radius Circle & Marker
 *   │   ├── Polygon Points (if drawing)
 *   │   ├── Flight Routes (Polylines)
 *   │   └── Aircraft Markers (Leaflet Markers)
 *   ├── Selected Flight Info Overlay (bottom-left)
 *   └── Right Sidebar (40% width)
 *       ├── FlightSearch component
 *       └── FlightCard components (scrollable list)
 * 
 * STATE MANAGEMENT:
 * - now: Current timestamp (updates every 1 second)
 * - selectedFlightId: Currently selected flight for detail display
 * - searchMarker: Center point for radius search
 * - radiusMeters: Search radius in meters
 * - polygonPoints: Vertices for polygon search area
 * 
 * COMPUTED STATE (useMemo for optimization):
 * - flightData: Processed flight objects with:
 *   • Current position (interpolated between base and target)
 *   • Icon rotation angle
 *   • Status (Scheduled/Outbound/Returning/Landed)
 *   • ETA calculation
 * - mapBounds: Automatically fits map to show all flights
 * - selectedFlight: Currently displayed flight details
 * 
 * HOOKS INTEGRATION:
 * - useFlights: Gets all flights, aircrafts, aircraftTypes
 * - useValidation: Filters flights ensuring data consistency
 * - useMap: Manages search results and distance calculations
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * COLOR SCHEME (Military Theme)
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * BACKGROUND:
 * - Primary: #1a1a1a (Charcoal)
 * - Secondary: #2a2a2a (Dark Gray)
 * - Borders: #404040 (Lighter Gray for contrast)
 * 
 * ACCENT COLORS:
 * - Amber: #d97706 (Primary accent for buttons, headers)
 * - Red: #ef4444 (Alert, active missions indicator)
 * - Green: #10b981 (Success, landed status)
 * - Search Radius: #ea580c (Amber-orange for visibility)
 * - Polygon: #92400e (Amber-brown for area definition)
 * 
 * TEXT:
 * - Primary: #e5e7eb (Light Gray)
 * - Muted: #9ca3af (Medium Gray for secondary info)
 * - Accent: #d97706 (Amber for emphasis)
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * FLIGHT STATUS LIFECYCLE
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Timeline Calculation:
 * 1. Flight Distance = Haversine(Base, Target)
 * 2. Aircraft Speed = Type-based (Fighter 900 km/h, Cargo 520, etc.)
 * 3. One-Way Duration = Distance / Speed
 * 4. Return Duration = Same one-way duration
 * 5. Total Mission Time = Takeoff + Outbound + Arrival_time + Return
 * 
 * Status Transitions:
 * - SCHEDULED: current_time < takeoff_time
 *              Position: Base, Color: Gray (🛩️)
 * - OUTBOUND:  takeoff_time ≤ current_time < arrival_time
 *              Position: Interpolated (Base → Target), Color: Red (🛩️)
 * - RETURNING: arrival_time ≤ current_time < return_completion_time
 *              Position: Interpolated (Target → Base), Color: Amber (🛩️)
 * - LANDED:    current_time ≥ return_completion_time
 *              Position: Base, Color: Green (🛩️)
 * 
 * Position Interpolation:
 * - Uses linear interpolation between two coordinates
 * - Progress ratio = (current_time - phase_start) / phase_duration
 * - Bearing calculation determines aircraft rotation angle
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * USER INTERACTIONS
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * ON MAP:
 * - Click aircraft marker → shows detail overlay with position, target, status
 * - Click detail overlay close button (✕) → hides overlay
 * - Drag radius center marker → repositions search area
 * - Click on map → adds polygon vertex (when drawing search area)
 * 
 * IN SIDEBAR:
 * - Type in search box → filters flights by ID or aircraft name
 * - Click on flight card → selects flight and highlights on map
 * - Scroll flights list → no page scroll, sidebar only
 * - "Calculate Distance" button → queries server for exact distance
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * PERFORMANCE OPTIMIZATIONS
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * 1. useMemo Hooks:
 *    - flightData: Recalculates only when flights, aircrafts, or now changes
 *    - mapBounds: Recalculates only when flightData changes
 *    - selectedFlight: Recalculates only when selectedFlightId or flightData changes
 * 
 * 2. useCallback:
 *    - Handlers memoized to prevent unnecessary re-renders
 * 
 * 3. Component Splitting:
 *    - FlightCard extracted as separate component for reusability
 *    - FlightSearch extracted as separate component
 *    - Only re-render affected components on state change
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * DATA FLOW
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * 1. useFlights hook fetches from API
 * 2. useValidation filters for valid flights only
 * 3. buildFlightData transforms each flight into map-ready format
 * 4. Map renders markers and routes based on transformed data
 * 5. Sidebar renders FlightCard components for each valid flight
 * 6. Every 1 second, now timestamp updates → triggers all recalculations
 * 7. Aircraft positions and statuses update smoothly
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 * INTEGRATION WITH OTHER PAGES
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Flights Page → Map Page:
 * - Create/schedule flights in Flights page
 * - Flights immediately appear on Map page in "Scheduled" status
 * - Monitor flight progress as status changes
 * 
 * Aircrafts Page → Map Page:
 * - Aircraft must be created before flights can be scheduled
 * - Aircraft types affect speed calculations (critical for ETA)
 * 
 * Aircraft Types Page → Map Page:
 * - Type specifications (speed, capacity) control flight calculations
 * - Type determines flight duration and route visualization
 * 
 * ═════════════════════════════════════════════════════════════════════════════
 */

/* This comment block exists in the Map.jsx file to document the page purpose */
