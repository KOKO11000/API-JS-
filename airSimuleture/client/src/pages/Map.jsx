/**
 * Map Page - Mission Control Dashboard
 * 
 * Real-time flight tracking interface featuring:
 * - Interactive map with drag-enabled search radius
 * - Professional military-themed design (amber & red colors)
 * - Scrollable flights sidebar with search functionality
 * - Flight data validation and sync
 * - Individual flight details with distance calculations
 * - Polygon-based area search for operations
 */

import { Fragment, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, Polygon, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Menu from "../components/home/Menu";
import FlightCard from "../components/flights/FlightCard";
import FlightSearch from "../components/flights/FlightSearch";
import useFlights from "../hooks/useFlights";
import useMap from "../hooks/useMap.jsx";
import useValidation from "../hooks/useValidation";
import { distanceKm, interpolate, bearing } from "../utils/geo";
import { MAP_ROUTE_COLORS } from "../utils/militaryTheme";

const BASE_COORDINATES = [31.7683, 35.2137];
const DEFAULT_SPEED_KMH = 600;
const DEFAULT_SEARCH_RADIUS = 10000;

function aircraftSpeedKmh(aircraft) {
  const type = String(aircraft?.aircraft_type || "").toLowerCase();
  if (/fighter|jet|combat|f-/.test(type)) return 900;
  if (/prop|helicopter|copter|drone/.test(type)) return 320;
  if (/cargo|transport/.test(type)) return 520;
  return DEFAULT_SPEED_KMH;
}

function createAircraftIcon(angle, status) {
  const colorMap = {
    Landed: '#10b981',
    Returning: '#f59e0b',
    Outbound: '#ef4444',
    Scheduled: '#6b7280',
  };
  
  return divIcon({
    className: "aircraft-marker",
    html: `
      <div style="
        font-size: 28px;
        transform: rotate(${angle}deg);
        filter: drop-shadow(0 0 3px rgba(0,0,0,0.8));
        color: ${colorMap[status] || colorMap.Scheduled};
      ">🛩️</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

function getFlightStatus(now, takeOffMs, arrivalMs, returnMs) {
  if (now < takeOffMs) return "Scheduled";
  if (now < arrivalMs) return "Outbound";
  if (now < returnMs) return "Returning";
  return "Landed";
}

function buildFlightData(flight, aircraft, now) {
  const destination = [Number(flight.Latitude), Number(flight.Longitude)];
  const aircraftName = aircraft?.name || "Unknown";
  const speedKmh = aircraftSpeedKmh(aircraft);
  const distance = distanceKm(BASE_COORDINATES, destination);
  const flightDurationMs = Math.max((distance / speedKmh) * 3600 * 1000, 30000);
  const takeOffMs = new Date(flight.take_off).getTime();
  const arrivalMs = takeOffMs + flightDurationMs;
  const returnMs = arrivalMs + flightDurationMs;
  const status = getFlightStatus(now, takeOffMs, arrivalMs, returnMs);
  const progress = status === "Outbound"
    ? Math.min((now - takeOffMs) / flightDurationMs, 1)
    : status === "Returning"
    ? Math.min((now - arrivalMs) / flightDurationMs, 1)
    : status === "Landed" ? 1 : 0;

  const currentPosition = status === "Outbound"
    ? interpolate(BASE_COORDINATES, destination, progress)
    : status === "Returning"
    ? interpolate(destination, BASE_COORDINATES, progress)
    : BASE_COORDINATES;

  return {
    id: flight.id,
    aircraftName,
    status,
    speedKmh,
    distance,
    destination,
    currentPosition,
    iconAngle: bearing(
      status === "Returning" ? destination : BASE_COORDINATES,
      status === "Returning" ? BASE_COORDINATES : destination
    ),
    eta: status === "Scheduled"
      ? takeOffMs
      : status === "Outbound" ? arrivalMs
      : status === "Returning" ? returnMs
      : null,
    showReturnRoute: now >= arrivalMs,
  };
}

export default function Map() {
  const { flights, aircrafts, aircraftTypes } = useFlights();
  const { validatedFlights } = useValidation(flights, aircrafts, aircraftTypes);
  const { flightDistances, fetchFlightDistance } = useMap();

  const [now, setNow] = useState(Date.now());
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [searchMarker, setSearchMarker] = useState(BASE_COORDINATES);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_SEARCH_RADIUS);
  const [polygonPoints, setPolygonPoints] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const flightData = useMemo(() =>
    validatedFlights.map(flight => {
      const aircraft = aircrafts.find(a => a.id === flight.aircraft_id);
      return buildFlightData(flight, aircraft, now);
    }),
    [validatedFlights, aircrafts, now]
  );

  const mapBounds = useMemo(() => {
    const points = flightData.flatMap(flight => [BASE_COORDINATES, flight.destination]);
    return points.length ? points : null;
  }, [flightData]);

  const selectedFlight = selectedFlightId ? flightData.find(f => f.id === selectedFlightId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Menu />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <MapContainer
              center={BASE_COORDINATES}
              bounds={mapBounds || undefined}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapClickHandler onMapClick={(point) => setPolygonPoints(prev => [...prev, point])} />

              {/* Base Marker */}
              <Marker position={BASE_COORDINATES}>
                <Popup>
                  <div className="text-sm font-semibold">Command Base</div>
                </Popup>
              </Marker>

              {/* Search Radius */}
              <Marker
                position={searchMarker}
                draggable
                eventHandlers={{
                  dragend: (e) => setSearchMarker([e.target.getLatLng().lat, e.target.getLatLng().lng])
                }}
              >
                <Popup>Search Center</Popup>
              </Marker>
              <Circle
                center={searchMarker}
                radius={radiusMeters}
                pathOptions={{ color: MAP_ROUTE_COLORS.searchRadius, fillOpacity: 0.05, weight: 2 }}
              />

              {/* Polygon Search Area */}
              {polygonPoints.length > 0 && (
                <>
                  <Polygon
                    positions={polygonPoints}
                    pathOptions={{ color: MAP_ROUTE_COLORS.polygon, dashArray: "6 6", weight: 2, opacity: 0.7 }}
                  />
                  {polygonPoints.map((point, idx) => (
                    <Marker key={`polygon-${idx}`} position={point}>
                      <Popup>Point {idx + 1}</Popup>
                    </Marker>
                  ))}
                </>
              )}

              {/* Flight Data on Map */}
              {flightData.map(flight => (
                <Fragment key={flight.id}>
                  {/* Route Lines */}
                  <Polyline
                    positions={[BASE_COORDINATES, flight.destination]}
                    pathOptions={{ color: MAP_ROUTE_COLORS.outbound, weight: 3, opacity: 0.6 }}
                  />
                  {flight.showReturnRoute && (
                    <Polyline
                      positions={[flight.destination, BASE_COORDINATES]}
                      pathOptions={{ color: MAP_ROUTE_COLORS.returning, weight: 2, dashArray: "5 5", opacity: 0.4 }}
                    />
                  )}
                  
                  {/* Target Location */}
                  <Marker position={flight.destination}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{flight.aircraftName}</strong>
                        <br />
                        Target Location
                      </div>
                    </Popup>
                  </Marker>

                  {/* Aircraft Position */}
                  <Marker
                    position={flight.currentPosition}
                    icon={createAircraftIcon(flight.iconAngle, flight.status)}
                    eventHandlers={{ click: () => setSelectedFlightId(flight.id) }}
                  >
                    <Popup>{flight.aircraftName}</Popup>
                  </Marker>
                </Fragment>
              ))}
            </MapContainer>

            {/* Selected Flight Info Overlay */}
            {selectedFlight && (
              <div className="absolute bottom-4 left-4 bg-gray-900/95 border border-amber-700/50 rounded-lg p-4 max-w-xs text-sm z-40">
                <button
                  onClick={() => setSelectedFlightId(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
                <h3 className="font-bold text-amber-400 mb-2">{selectedFlight.aircraftName}</h3>
                <div className="space-y-1 text-gray-300 text-xs">
                  <p><span className="text-gray-400">Status:</span> <span className="text-amber-300 font-semibold">{selectedFlight.status}</span></p>
                  <p><span className="text-gray-400">Position:</span> {selectedFlight.currentPosition[0].toFixed(4)}, {selectedFlight.currentPosition[1].toFixed(4)}</p>
                  <p><span className="text-gray-400">Target:</span> {selectedFlight.destination[0].toFixed(4)}, {selectedFlight.destination[1].toFixed(4)}</p>
                  <p><span className="text-gray-400">Distance:</span> {selectedFlight.distance.toFixed(1)} km</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Flights Control Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-800 p-4 bg-gray-900">
            <h2 className="text-lg font-bold text-amber-400">Active Missions</h2>
            <p className="text-xs text-gray-400 mt-1">{flightData.length} operations</p>
          </div>

          {/* Flight Search */}
          <div className="p-3 border-b border-gray-800">
            <FlightSearch flights={validatedFlights} aircrafts={aircrafts} />
          </div>

          {/* Flights List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {flightData.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <p className="font-semibold">No Active Missions</p>
                <p className="text-xs mt-2">Launch flights to begin operations</p>
              </div>
            ) : (
              flightData.map(flight => (
                <div
                  key={flight.id}
                  onClick={() => setSelectedFlightId(flight.id)}
                  className={`cursor-pointer transition-all rounded ${
                    selectedFlightId === flight.id ? 'ring-2 ring-amber-600' : ''
                  }`}
                >
                  <FlightCard
                    flight={flight}
                    onShowDistance={fetchFlightDistance}
                    distance={flightDistances[flight.id]}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
