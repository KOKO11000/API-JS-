import { Fragment, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  Circle,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Menu from "../components/home/Menu";
import useFlights from "../hooks/useFlights";

const BASE_COORDINATES = [31.7683, 35.2137];
const DEFAULT_SPEED_KMH = 600;
const DEFAULT_SEARCH_RADIUS = 10000;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceKm([lat1, lon1], [lat2, lon2]) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function interpolate([fromLat, fromLon], [toLat, toLon], ratio) {
  return [fromLat + (toLat - fromLat) * ratio, fromLon + (toLon - fromLon) * ratio];
}

function bearing([lat1, lon1], [lat2, lon2]) {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function aircraftSpeedKmh(aircraft) {
  const type = String(aircraft?.aircraft_type || "").toLowerCase();
  if (/fighter|jet|combat|f-/.test(type)) return 900;
  if (/prop|helicopter|copter|drone/.test(type)) return 320;
  if (/cargo|transport/.test(type)) return 520;
  return DEFAULT_SPEED_KMH;
}

function planeIcon(angle) {
  return divIcon({
    className: "plane-div-icon",
    html: `<div style="font-size:24px; transform: rotate(${angle}deg); text-shadow: 0 0 8px rgba(0,0,0,0.8); color: #f8fafc;">✈️</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-IL", {
    hour: "2-digit",
    minute: "2-digit",
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

function buildFlightView(flight, aircraft, now) {
  const destination = [Number(flight.Latitude), Number(flight.Longitude)];
  const aircraftName = aircraft?.name || "Unknown Aircraft";
  const speedKmh = aircraftSpeedKmh(aircraft);
  const distance = distanceKm(BASE_COORDINATES, destination);
  const flightDurationMs = Math.max((distance / speedKmh) * 3600 * 1000, 30_000);
  const takeOffTime = new Date(flight.take_off).getTime();
  const arrivalTime = takeOffTime + flightDurationMs;
  const returnTime = arrivalTime + flightDurationMs;

  const status =
    now < takeOffTime
      ? "Scheduled"
      : now < arrivalTime
      ? "Outbound"
      : now < returnTime
      ? "Returning"
      : "Landed";

  const progress =
    status === "Outbound"
      ? Math.min((now - takeOffTime) / flightDurationMs, 1)
      : status === "Returning"
      ? Math.min((now - arrivalTime) / flightDurationMs, 1)
      : status === "Landed"
      ? 1
      : 0;

  const currentPosition =
    status === "Outbound"
      ? interpolate(BASE_COORDINATES, destination, progress)
      : status === "Returning"
      ? interpolate(destination, BASE_COORDINATES, progress)
      : BASE_COORDINATES;

  const iconAngle = bearing(
    status === "Returning" ? destination : BASE_COORDINATES,
    status === "Returning" ? BASE_COORDINATES : destination
  );

  const eta =
    status === "Scheduled"
      ? takeOffTime
      : status === "Outbound"
      ? arrivalTime
      : status === "Returning"
      ? returnTime
      : null;

  return {
    id: flight.id,
    aircraftName,
    status,
    speedKmh,
    distance,
    destination,
    currentPosition,
    iconAngle,
    eta,
    showReturnRoute: now >= arrivalTime,
  };
}

export default function Map() {
  const { flights, aircrafts } = useFlights();
  const [now, setNow] = useState(Date.now());
  const [searchMarker, setSearchMarker] = useState(BASE_COORDINATES);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_SEARCH_RADIUS);
  const [radiusFlights, setRadiusFlights] = useState([]);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [polygonFlights, setPolygonFlights] = useState([]);
  const [flightDistances, setFlightDistances] = useState({});
  const [radiusMessage, setRadiusMessage] = useState("");
  const [polygonMessage, setPolygonMessage] = useState("");
  const [isSearchingRadius, setIsSearchingRadius] = useState(false);
  const [isSearchingPolygon, setIsSearchingPolygon] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const flightViews = useMemo(
    () =>
      flights.map((flight) => {
        const aircraft = aircrafts.find((item) => item.id === flight.aircraft_id);
        return buildFlightView(flight, aircraft, now);
      }),
    [flights, aircrafts, now]
  );

  const mapBounds = useMemo(() => {
    const points = flightViews.flatMap((flight) => [BASE_COORDINATES, flight.destination]);
    return points.length ? points : null;
  }, [flightViews]);

  const handleRadiusMarkerDrag = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setSearchMarker([lat, lng]);
  };

  const handleMapClick = (point) => {
    setPolygonPoints((prev) => [...prev, point]);
    setPolygonMessage("");
  };

  const fetchFlightsWithinRadius = async () => {
    setRadiusMessage("");
    setIsSearchingRadius(true);
    try {
      const response = await axios.get("http://localhost:5000/flights/within-radius", {
        params: {
          lat: searchMarker[0],
          lng: searchMarker[1],
          radius: radiusMeters,
        },
      });
      setRadiusFlights(response.data);
    } catch (error) {
      setRadiusMessage("Failed to load flights inside radius.");
      console.error(error);
    } finally {
      setIsSearchingRadius(false);
    }
  };

  const fetchFlightsWithinPolygon = async () => {
    if (polygonPoints.length < 3) {
      setPolygonMessage("Please add at least three points to build a polygon.");
      return;
    }

    setPolygonMessage("");
    setIsSearchingPolygon(true);
    try {
      const response = await axios.post("http://localhost:5000/flights/within-polygon", {
        points: polygonPoints,
      });
      setPolygonFlights(response.data);
    } catch (error) {
      setPolygonMessage("Failed to load flights inside polygon.");
      console.error(error);
    } finally {
      setIsSearchingPolygon(false);
    }
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
    setPolygonFlights([]);
    setPolygonMessage("");
  };

  const fetchFlightDistance = async (flightId) => {
    try {
      const response = await axios.get(`http://localhost:5000/flights/${flightId}/distance`);
      setFlightDistances((prev) => ({ ...prev, [flightId]: response.data }));
    } catch (error) {
      console.error("Failed to load flight distance", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-white">Mission Map</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Track every mission, see the route to the target, and watch the plane return to base.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-slate-950/80">
              <MapContainer
                center={BASE_COORDINATES}
                bounds={mapBounds || undefined}
                zoom={13}
                scrollWheelZoom={true}
                className="h-[560px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onMapClick={handleMapClick} />

                <Marker position={BASE_COORDINATES}>
                  <Popup>
                    Base
                    <br />
                    Ready for takeoff
                  </Popup>
                </Marker>

                <Marker position={searchMarker} draggable eventHandlers={{ dragend: handleRadiusMarkerDrag }}>
                  <Popup>
                    Search center
                    <br />
                    Drag to move the radius center.
                  </Popup>
                </Marker>

                <Circle
                  center={searchMarker}
                  radius={radiusMeters}
                  pathOptions={{ color: "#f472b6", fillOpacity: 0.1, weight: 2 }}
                />

                {polygonPoints.length > 0 && (
                  <>
                    <Polygon positions={polygonPoints} pathOptions={{ color: "#22c55e", dashArray: "6 8", weight: 3, opacity: 0.9 }} />
                    {polygonPoints.map((point, index) => (
                      <Marker key={`polygon-point-${index}`} position={point}>
                        <Popup>Polygon point {index + 1}</Popup>
                      </Marker>
                    ))}
                  </>
                )}

                {flightViews.map((flight) => (
                  <Fragment key={flight.id}>
                    <Polyline
                      key={`out-${flight.id}`}
                      positions={[BASE_COORDINATES, flight.destination]}
                      pathOptions={{ color: "#38bdf8", weight: 4, opacity: 0.8 }}
                    />

                    {flight.showReturnRoute && (
                      <Polyline
                        key={`return-${flight.id}`}
                        positions={[flight.destination, BASE_COORDINATES]}
                        pathOptions={{ color: "#7c3aed", dashArray: "8 8", weight: 3, opacity: 0.9 }}
                      />
                    )}

                    <Marker key={`target-${flight.id}`} position={flight.destination}>
                      <Popup>
                        <strong>{flight.aircraftName}</strong>
                        <br />
                        Target #{flight.id}
                        <br />
                        Distance: {flight.distance.toFixed(1)} km
                      </Popup>
                    </Marker>

                    <Marker key={`plane-${flight.id}`} position={flight.currentPosition} icon={planeIcon(flight.iconAngle)}>
                      <Tooltip direction="top" offset={[0, -14]}>
                        <div className="text-xs">
                          <div className="font-semibold">{flight.aircraftName}</div>
                          <div>{flight.status}</div>
                          <div>ETA: {flight.eta ? formatTime(flight.eta) : "Landed"}</div>
                        </div>
                      </Tooltip>
                    </Marker>
                  </Fragment>
                ))}
              </MapContainer>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-3">Radius search</h2>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div>
                    <span className="font-semibold text-white">Center:</span> {searchMarker[0].toFixed(5)}, {searchMarker[1].toFixed(5)}
                  </div>
                  <div>
                    <label className="font-semibold text-white">Radius (meters):</label>
                    <input
                      type="number"
                      min={100}
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters(Number(e.target.value))}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    onClick={fetchFlightsWithinRadius}
                    disabled={isSearchingRadius}
                    className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
                  >
                    {isSearchingRadius ? "Searching..." : "Find flights inside radius"}
                  </button>
                  {radiusMessage && <p className="text-sm text-rose-300">{radiusMessage}</p>}
                  {radiusFlights.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-white font-semibold">Flights in radius</h3>
                      {radiusFlights.map((flight) => (
                        <div key={flight.id} className="rounded-2xl border border-white/10 bg-slate-900 p-3 text-sm text-gray-200">
                          <div>Flight #{flight.id}</div>
                          <div>Aircraft ID: {flight.aircraft_id}</div>
                          <div>Lat: {Number(flight.Latitude).toFixed(5)}, Lng: {Number(flight.Longitude).toFixed(5)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No flights matching the selected radius yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-3">Polygon search</h2>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p>Click on the map to add polygon vertices. Then press search to find flights inside.</p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>Points: {polygonPoints.length}</div>
                      <button onClick={clearPolygon} className="rounded-2xl bg-slate-800 px-3 py-2 text-left text-white hover:bg-slate-700">
                        Reset polygon
                      </button>
                    </div>
                    {polygonPoints.length > 0 && (
                      <div className="max-h-24 overflow-auto rounded-2xl border border-slate-700 bg-slate-900 p-3 text-xs">
                        {polygonPoints.map((point, index) => (
                          <div key={`point-${index}`}>Point {index + 1}: {point[0].toFixed(5)}, {point[1].toFixed(5)}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={fetchFlightsWithinPolygon}
                    disabled={isSearchingPolygon}
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
                  >
                    {isSearchingPolygon ? "Searching..." : "Find flights inside polygon"}
                  </button>
                  {polygonMessage && <p className="text-sm text-rose-300">{polygonMessage}</p>}
                  {polygonFlights.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-white font-semibold">Flights inside polygon</h3>
                      {polygonFlights.map((flight) => (
                        <div key={flight.id} className="rounded-2xl border border-white/10 bg-slate-900 p-3 text-sm text-gray-200">
                          <div>Flight #{flight.id}</div>
                          <div>Aircraft ID: {flight.aircraft_id}</div>
                          <div>Lat: {Number(flight.Latitude).toFixed(5)}, Lng: {Number(flight.Longitude).toFixed(5)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No flights found inside the current polygon.</p>
                  )}
                </div>
              </div>

              {flightViews.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-3">No active missions</h2>
                  <p className="text-gray-400">Create a flight in the Flights page to start tracking missions.</p>
                </div>
              ) : (
                flightViews.map((flight) => (
                  <div key={flight.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-sky-300 uppercase tracking-[.2em]">Flight #{flight.id}</p>
                        <h3 className="text-2xl font-semibold text-white">{flight.aircraftName}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          flight.status === "Landed"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : flight.status === "Returning"
                            ? "bg-indigo-500/20 text-indigo-300"
                            : flight.status === "Outbound"
                            ? "bg-sky-500/20 text-sky-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>
                    <div className="mt-5 space-y-3 text-gray-300 text-sm">
                      <div>
                        <span className="font-semibold text-white">Target:</span> {flight.destination[0].toFixed(4)}, {flight.destination[1].toFixed(4)}
                      </div>
                      <div>
                        <span className="font-semibold text-white">Distance:</span> {flight.distance.toFixed(1)} km
                      </div>
                      <div>
                        <span className="font-semibold text-white">Speed:</span> {flight.speedKmh} km/h
                      </div>
                      <div>
                        <span className="font-semibold text-white">ETA:</span> {flight.eta ? formatTime(flight.eta) : "Landed"}
                      </div>
                      <div>
                        <span className="font-semibold text-white">Current position:</span> {flight.currentPosition[0].toFixed(4)}, {flight.currentPosition[1].toFixed(4)}
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          onClick={() => fetchFlightDistance(flight.id)}
                          className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                        >
                          Show server distance
                        </button>
                        {flightDistances[flight.id] && (
                          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 text-xs text-gray-200">
                            <div>Distance from base: {flightDistances[flight.id].distance_km.toFixed(2)} km</div>
                            <div>Distance in meters: {flightDistances[flight.id].distance_meters.toFixed(0)} m</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
