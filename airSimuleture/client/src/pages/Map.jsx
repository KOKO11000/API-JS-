import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { divIcon } from "leaflet";
import Menu from "../components/home/Menu";
import FlightCard from "../components/flights/FlightCard";
import FlightSearch from "../components/flights/FlightSearch";
import useFlights from "../hooks/useFlights";
import useMap from "../hooks/useMap.jsx";
import useValidation from "../hooks/useValidation";
import { bearing, distanceKm, interpolate } from "../utils/geo";
import { MAP_ROUTE_COLORS, STATUS_COLORS } from "../utils/militaryTheme";

const BASE_COORDINATES = [31.7683, 35.2137];
const DEFAULT_SPEED_KMH = 600;
const DEFAULT_SEARCH_RADIUS = 10000;
const INITIAL_TIME = Date.now();

function getAircraftSpeed(aircraft, aircraftType) {
  if (aircraftType?.max_speed) {
    return Number(aircraftType.max_speed);
  }

  const typeName = String(aircraftType?.aircraftType || aircraft?.aircraft_type || "").toLowerCase();
  if (typeName.includes("fighter") || typeName.includes("combat")) {
    return 900;
  }
  if (typeName.includes("cargo") || typeName.includes("transport")) {
    return 520;
  }
  if (typeName.includes("helicopter") || typeName.includes("drone")) {
    return 320;
  }
  return DEFAULT_SPEED_KMH;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFlightStatus(currentTime, takeoffTime, arrivalTime, returnTime) {
  if (currentTime < takeoffTime) {
    return "Scheduled";
  }
  if (currentTime < arrivalTime) {
    return "Outbound";
  }
  if (currentTime < returnTime) {
    return "Returning";
  }
  return "Landed";
}

function createAircraftIcon(angle, status) {
  const color = STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.scheduled;

  return divIcon({
    className: "flight-marker-shell",
    html: `
      <div class="flight-marker" style="--flight-color:${color};transform:rotate(${angle}deg);">
        <div class="flight-marker-core"></div>
        <div class="flight-marker-wing"></div>
        <div class="flight-marker-trail"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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

function buildFlightViewModel(flight, aircraft, aircraftType, currentTime) {
  const destination = [Number(flight.Latitude), Number(flight.Longitude)];
  const aircraftName = flight.aircraft_name || aircraft?.name || `Aircraft ${flight.aircraft_id}`;
  const speedKmh = getAircraftSpeed(aircraft, aircraftType);
  const distance = distanceKm(BASE_COORDINATES, destination);
  const flightDurationMs = Math.max((distance / speedKmh) * 3600 * 1000, 30000);
  const takeoffTime = new Date(flight.take_off).getTime();
  const arrivalTime = takeoffTime + flightDurationMs;
  const returnTime = arrivalTime + flightDurationMs;
  const status = getFlightStatus(currentTime, takeoffTime, arrivalTime, returnTime);

  let currentPosition = BASE_COORDINATES;
  let progressRatio = 0;

  if (status === "Outbound") {
    progressRatio = Math.min((currentTime - takeoffTime) / flightDurationMs, 1);
    currentPosition = interpolate(BASE_COORDINATES, destination, progressRatio);
  }

  if (status === "Returning") {
    progressRatio = Math.min((currentTime - arrivalTime) / flightDurationMs, 1);
    currentPosition = interpolate(destination, BASE_COORDINATES, progressRatio);
  }

  if (status === "Landed") {
    progressRatio = 1;
  }

  return {
    id: flight.id,
    aircraftName,
    status,
    speedKmh,
    distance,
    destination,
    currentPosition,
    takeoffTime,
    arrivalTime,
    returnTime,
    progressRatio,
    eta: status === "Scheduled" ? takeoffTime : status === "Outbound" ? arrivalTime : status === "Returning" ? returnTime : null,
    iconAngle: bearing(
      status === "Returning" ? destination : BASE_COORDINATES,
      status === "Returning" ? BASE_COORDINATES : destination,
    ),
  };
}

function matchesSearch(flight, searchValue) {
  if (!searchValue.trim()) {
    return true;
  }

  const term = searchValue.trim().toLowerCase();
  return String(flight.id).includes(term) || flight.aircraftName.toLowerCase().includes(term);
}

function findAircraftForFlight(flight, aircrafts) {
  return aircrafts.find(
    (aircraft) =>
      String(aircraft.id) === String(flight.aircraft_id) ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_id).toLowerCase() ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_name || "").toLowerCase(),
  );
}

export default function Map() {
  const { flights, aircrafts, aircraftTypes } = useFlights();
  const { validatedFlights } = useValidation(flights, aircrafts, aircraftTypes);
  const {
    radiusFlights,
    polygonFlights,
    flightDistances,
    radiusMessage,
    polygonMessage,
    fetchFlightsWithinRadius,
    fetchFlightsWithinPolygon,
    fetchFlightDistance,
    clearPolygonResults,
  } = useMap();

  const [currentTime, setCurrentTime] = useState(INITIAL_TIME);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchMarker, setSearchMarker] = useState(BASE_COORDINATES);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_SEARCH_RADIUS);
  const [polygonPoints, setPolygonPoints] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const flightsView = useMemo(
    () =>
      validatedFlights
        .map((flight) => {
          const aircraft = findAircraftForFlight(flight, aircrafts);
          const aircraftType = aircraftTypes.find(
            (type) =>
              String(type.id) === String(aircraft?.aircraft_type) ||
              String(type.aircraftType).toLowerCase() === String(aircraft?.aircraft_type).toLowerCase(),
          );
          return buildFlightViewModel(flight, aircraft, aircraftType, currentTime);
        })
        .filter((flight) => matchesSearch(flight, searchValue)),
    [aircraftTypes, aircrafts, currentTime, searchValue, validatedFlights],
  );

  const selectedFlight = flightsView.find((flight) => flight.id === selectedFlightId) || null;

  const highlightedRadiusIds = new Set(radiusFlights.map((flight) => flight.id));
  const highlightedPolygonIds = new Set(polygonFlights.map((flight) => flight.id));

  async function handleRadiusSearch() {
    await fetchFlightsWithinRadius(searchMarker, radiusMeters);
  }

  async function handlePolygonSearch() {
    await fetchFlightsWithinPolygon(polygonPoints);
  }

  function clearPolygon() {
    setPolygonPoints([]);
    clearPolygonResults();
  }

  return (
    <div className="min-h-screen">
      <Menu />

      <main className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="border-b border-[var(--panel-border)] lg:border-b-0 lg:border-r">
          <div className="h-full min-h-[500px]">
            <MapContainer center={BASE_COORDINATES} zoom={9} scrollWheelZoom className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <MapClickHandler onMapClick={(point) => setPolygonPoints((current) => [...current, point])} />

              <Marker position={BASE_COORDINATES}>
                <Popup>Command base</Popup>
              </Marker>

              <Marker
                position={searchMarker}
                draggable
                eventHandlers={{
                  dragend: (event) =>
                    setSearchMarker([
                      event.target.getLatLng().lat,
                      event.target.getLatLng().lng,
                    ]),
                }}
              >
                <Popup>Radius center</Popup>
              </Marker>

              <Circle
                center={searchMarker}
                radius={radiusMeters}
                pathOptions={{ color: MAP_ROUTE_COLORS.searchRadius, fillOpacity: 0.04, weight: 2 }}
              />

              {polygonPoints.length >= 2 ? (
                <Polygon
                  positions={polygonPoints}
                  pathOptions={{ color: MAP_ROUTE_COLORS.polygon, weight: 2, opacity: 0.8 }}
                />
              ) : null}

              {flightsView.map((flight) => (
                <Fragment key={flight.id}>
                  <Polyline
                    positions={[BASE_COORDINATES, flight.destination]}
                    pathOptions={{
                      color: MAP_ROUTE_COLORS.outbound,
                      weight: isNaN(flight.progressRatio) ? 2 : 3,
                      opacity: 0.7,
                      dashArray: flight.status === "Scheduled" ? "10 8" : "14 10",
                    }}
                  />

                  <Marker position={flight.destination}>
                    <Popup>
                      <div className="min-w-52 space-y-2 text-sm">
                        <p className="font-semibold text-slate-900">{flight.aircraftName}</p>
                        <p>Target: {flight.destination[0].toFixed(4)}, {flight.destination[1].toFixed(4)}</p>
                        <p>Estimated arrival: {formatDateTime(flight.arrivalTime)}</p>
                      </div>
                    </Popup>
                  </Marker>

                  <Marker
                    position={flight.currentPosition}
                    icon={createAircraftIcon(flight.iconAngle, flight.status)}
                    eventHandlers={{ click: () => setSelectedFlightId(flight.id) }}
                  >
                    <Popup>
                      <div className="min-w-60 space-y-2 text-sm">
                        <p className="font-semibold text-slate-900">{flight.aircraftName}</p>
                        <p>Status: {flight.status}</p>
                        <p>Departure: {formatDateTime(flight.takeoffTime)}</p>
                        <p>ETA: {formatDateTime(flight.eta || flight.arrivalTime)}</p>
                        <p>Target: {flight.destination[0].toFixed(4)}, {flight.destination[1].toFixed(4)}</p>
                      </div>
                    </Popup>
                  </Marker>
                </Fragment>
              ))}
            </MapContainer>
          </div>
        </section>

        <aside className="flex flex-col bg-[rgba(17,21,15,0.94)]">
          <div className="border-b border-[var(--panel-border)] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
              Operations Panel
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">Active Missions</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{flightsView.length} missions visible</p>
          </div>

          <div className="space-y-5 border-b border-[var(--panel-border)] p-5">
            <FlightSearch
              value={searchValue}
              onChange={setSearchValue}
              resultCount={flightsView.length}
            />

            <div className="panel-soft grid gap-3 p-4">
              <label className="grid gap-2 text-sm text-[var(--text-muted)]">
                Radius meters
                <input
                  type="number"
                  min="1000"
                  value={radiusMeters}
                  onChange={(event) => setRadiusMeters(Number(event.target.value))}
                  className="border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-[var(--text-main)] outline-none"
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleRadiusSearch}
                  className="flex-1 border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] px-3 py-2 text-sm font-semibold text-[var(--accent-strong)]"
                >
                  Scan Radius
                </button>
              </div>
              <p className="text-xs text-[var(--text-subtle)]">
                {radiusMessage || `${radiusFlights.length} missions inside radius`}
              </p>
            </div>

            <div className="panel-soft grid gap-3 p-4">
              <p className="text-sm text-[var(--text-muted)]">
                Polygon points: {polygonPoints.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePolygonSearch}
                  className="flex-1 border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] px-3 py-2 text-sm font-semibold text-[var(--accent-strong)]"
                >
                  Scan Polygon
                </button>
                <button
                  onClick={clearPolygon}
                  className="border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-sm text-[var(--text-main)]"
                >
                  Clear
                </button>
              </div>
              <p className="text-xs text-[var(--text-subtle)]">
                {polygonMessage || `${polygonFlights.length} missions inside polygon`}
              </p>
            </div>

            {selectedFlight ? (
              <div className="panel-soft p-4 text-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
                  Selected Mission
                </p>
                <div className="mt-3 grid gap-2 text-[var(--text-muted)]">
                  <div className="flex justify-between gap-4">
                    <span>Aircraft</span>
                    <span className="text-[var(--text-main)]">{selectedFlight.aircraftName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Status</span>
                    <span className="text-[var(--text-main)]">{selectedFlight.status}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Departure</span>
                    <span className="text-right text-[var(--text-main)]">
                      {formatDateTime(selectedFlight.takeoffTime)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Estimated arrival</span>
                    <span className="text-right text-[var(--text-main)]">
                      {formatDateTime(selectedFlight.arrivalTime)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Coordinates</span>
                    <span className="text-right text-[var(--text-main)]">
                      {selectedFlight.currentPosition[0].toFixed(4)}, {selectedFlight.currentPosition[1].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Destination</span>
                    <span className="text-right text-[var(--text-main)]">
                      {selectedFlight.destination[0].toFixed(4)}, {selectedFlight.destination[1].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Route progress</span>
                    <span className="text-right text-[var(--text-main)]">
                      {Math.round(selectedFlight.progressRatio * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {flightsView.length === 0 ? (
              <div className="panel-soft p-4 text-sm text-[var(--text-muted)]">
                No flights are visible right now. Only aircraft with a valid type and matching flight data appear here.
              </div>
            ) : null}

            {flightsView.map((flight) => {
              const isSelected = selectedFlightId === flight.id;
              const isRadiusMatch = highlightedRadiusIds.has(flight.id);
              const isPolygonMatch = highlightedPolygonIds.has(flight.id);
              const cardKey = `${flight.id}-${isRadiusMatch}-${isPolygonMatch}`;

              return (
                <div
                  key={cardKey}
                  onClick={() => setSelectedFlightId(flight.id)}
                  className="cursor-pointer"
                >
                  <FlightCard
                    flight={flight}
                    onShowDistance={fetchFlightDistance}
                    distance={flightDistances[flight.id]}
                    isSelected={isSelected}
                    matchSummary={[
                      isRadiusMatch ? "Radius match" : null,
                      isPolygonMatch ? "Polygon match" : null,
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  />
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}
