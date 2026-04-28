import {
  createAircraft,
  getAircraftById,
  getAll,
  updateAircraft,
  deleteAircraft,
} from "../DAL/supabase.js";

const tableName = "flights";
const BASE_COORDINATES = [31.7683, 35.2137];

function enrichFlightRecord(flight, aircraftMap) {
  if (!flight) {
    return flight;
  }

  const aircraft =
    aircraftMap.get(String(flight.aircraft_id)) ||
    aircraftMap.get(String(flight.aircraft_id).trim().toLowerCase()) ||
    aircraftMap.get(String(flight.aircraft_name || "").trim().toLowerCase());
  return {
    ...flight,
    aircraft_name: aircraft?.name || flight.aircraft_name || null,
    aircraft_type: aircraft?.aircraft_type || null,
  };
}

async function enrichFlights(flights) {
  const aircrafts = await getAll("aircrafts");
  const aircraftMap = new Map(
    aircrafts.flatMap((aircraft) => [
      [String(aircraft.id), aircraft],
      [String(aircraft.name).trim().toLowerCase(), aircraft],
    ]),
  );
  return flights.map((flight) => enrichFlightRecord(flight, aircraftMap));
}

async function resolveAircraft(referenceId, referenceName) {
  const aircrafts = await getAll("aircrafts");
  const normalizedName = String(referenceName || "").trim().toLowerCase();

  return (
    aircrafts.find((aircraft) => String(aircraft.id) === String(referenceId)) ||
    aircrafts.find(
      (aircraft) => String(aircraft.name).trim().toLowerCase() === normalizedName,
    ) ||
    aircrafts.find(
      (aircraft) => String(aircraft.name).trim().toLowerCase() === String(referenceId || "").trim().toLowerCase(),
    ) ||
    null
  );
}

async function hasActiveFlightForAircraft(aircraft, excludedFlightId = null) {
  const flights = await getAll(tableName, { is_land: false });
  return flights.some((flight) => {
    if (excludedFlightId !== null && String(flight.id) === String(excludedFlightId)) {
      return false;
    }

    return (
      String(flight.aircraft_id) === String(aircraft.id) ||
      String(flight.aircraft_id).trim().toLowerCase() === String(aircraft.name).trim().toLowerCase()
    );
  });
}

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

function distanceMeters(a, b) {
  return distanceKm(a, b) * 1000;
}

function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function getFlightDistance(flight) {
  const flightPoint = [Number(flight.Latitude), Number(flight.Longitude)];
  return {
    distance_km: distanceKm(BASE_COORDINATES, flightPoint),
    distance_meters: distanceMeters(BASE_COORDINATES, flightPoint),
  };
}

export async function list(_, res) {
  try {
    const flights = await getAll(tableName);
    const enrichedFlights = await enrichFlights(flights);
    res.json(enrichedFlights);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flights" });
  }
}

export async function get(req, res) {
  try {
    const { id } = req.params;
    const flight = await getAircraftById(tableName, id);
    if (flight) {
      const [enrichedFlight] = await enrichFlights([flight]);
      res.json(enrichedFlight);
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flight" });
  }
}

export async function create(req, res) {
  const { aircraft_id, aircraft_name, take_off, is_land, Longitude, Latitude } = req.body;
  try {
    if (
      !take_off ||
      is_land === undefined ||
      Longitude === undefined ||
      Latitude === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const aircraft = await resolveAircraft(aircraft_id, aircraft_name);

    if (!aircraft) {
      return res.status(400).json({ error: "Aircraft does not exist" });
    }

    if (await hasActiveFlightForAircraft(aircraft)) {
      return res.status(400).json({
        error: "This aircraft already has an active flight",
      });
    }

    const newFlight = await createAircraft(tableName, {
      aircraft_id: aircraft.id,
      take_off: new Date(take_off).toISOString(),
      is_land,
      Longitude: Number(Longitude),
      Latitude: Number(Latitude),
      created_at: new Date().toISOString(),
    });
    const [enrichedFlight] = await enrichFlights([newFlight]);
    return res.status(201).json(enrichedFlight);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create flight" });
  }
}

export async function update(req, res) {
  const { id } = req.params;
  const { aircraft_id, aircraft_name, take_off, is_land, Longitude, Latitude } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing flight ID" });
    }
    if (
      !aircraft_id ||
      !take_off ||
      is_land === undefined ||
      Longitude === undefined ||
      Latitude === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const aircraft = await resolveAircraft(aircraft_id, aircraft_name);

    if (!aircraft) {
      return res.status(400).json({ error: "Aircraft does not exist" });
    }

    if (await hasActiveFlightForAircraft(aircraft, id)) {
      return res.status(400).json({
        error: "This aircraft already has an active flight",
      });
    }

    const updatedFlight = await updateAircraft(tableName, id, {
      aircraft_id: aircraft.id,
      take_off: new Date(take_off).toISOString(),
      is_land,
      Longitude: Number(Longitude),
      Latitude: Number(Latitude),
      updated_at: new Date().toISOString(),
    });
    if (updatedFlight) {
      const [enrichedFlight] = await enrichFlights([updatedFlight]);
      res.json(enrichedFlight);
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update flight" });
  }
}

export async function deleteById(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing flight ID" });
    }

    const deletedFlight = await deleteAircraft(tableName, id);
    if (deletedFlight) {
      res.json({ message: "Flight deleted successfully" });
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete flight" });
  }
}

export async function getDistanceForFlight(req, res) {
  try {
    const { id } = req.params;
    const flight = await getAircraftById(tableName, id);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    const distance = getFlightDistance(flight);
    res.json(distance);
  } catch (error) {
    res.status(500).json({ error: "Failed to compute flight distance" });
  }
}

export async function withinRadius(req, res) {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Number(req.query.radius);

    if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radius) || radius <= 0) {
      return res.status(400).json({ error: "Invalid radius search parameters" });
    }

    const flights = await getAll(tableName, { is_land: false });
    const center = [lat, lng];
    const matchingFlights = flights.filter((flight) => {
      const point = [Number(flight.Latitude), Number(flight.Longitude)];
      return distanceMeters(center, point) <= radius;
    });

    res.json(matchingFlights);
  } catch (error) {
    res.status(500).json({ error: "Failed to execute radius search" });
  }
}

export async function withinPolygon(req, res) {
  try {
    const { points } = req.body;
    if (!Array.isArray(points) || points.length < 3) {
      return res.status(400).json({ error: "Polygon must include at least three points" });
    }

    const flights = await getAll(tableName, { is_land: false });
    const matchingFlights = flights.filter((flight) => {
      const point = [Number(flight.Latitude), Number(flight.Longitude)];
      return isPointInPolygon(point, points);
    });

    res.json(matchingFlights);
  } catch (error) {
    res.status(500).json({ error: "Failed to execute polygon search" });
  }
}
