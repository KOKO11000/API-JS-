import {
  createAircraft,
  getAircraftById,
  getAll,
  updateAircraft,
  deleteAircraft,
} from "../DAL/supabase.js";

const tableName = "flights";

export async function list(_, res) {
  try {
    const flights = await getAll(tableName);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flights" });
  }
}

export async function get(req, res) {
  try {
    const { id } = req.params;
    const flight = await getAircraftById(tableName, id);
    if (flight) {
      res.json(flight);
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flight" });
  }
}

export async function create(req, res) {
  const { aircraft_id, take_off, is_land, Longitude, Latitude } = req.body;

  try {
    if (
      !aircraft_id ||
      !take_off ||
      is_land === undefined ||
      Longitude === undefined ||
      Latitude === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const lon = Number(Longitude);
    const lat = Number(Latitude);

    if (isNaN(lon) || isNaN(lat)) {
      return res
        .status(400)
        .json({ error: "Longitude and Latitude must be numbers" });
    }

    if (isNaN(Date.parse(take_off))) {
      return res.status(400).json({ error: "Invalid take_off date" });
    }

    const existingFlight = await getAll(tableName, {
      aircraft_id,
      is_land: false,
    });

    if (existingFlight.length > 0) {
      return res.status(400).json({
        error: "This aircraft already has an active flight",
      });
    }

    const newFlight = await createAircraft(tableName, {
      aircraft_id,
      take_off,
      is_land,
      Longitude: lon,
      Latitude: lat,
      created_at: new Date().toISOString(),
    });

    return res.status(201).json(newFlight);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create flight" });
  }
}

export async function update(req, res) {
  const { id } = req.params;
  const { aircraft_id, take_off, is_land, Longitude, Latitude } = req.body;
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

    const updatedFlight = await updateAircraft(tableName, id, {
      aircraft_id,
      take_off,
      is_land,
      Longitude,
      Latitude,
      updated_at: new Date().toISOString(),
    });
    if (updatedFlight) {
      res.json(updatedFlight);
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
