import * as DAL from "../DAL/supabase.js";

const tableName = "flights";

export async function list(req, res) {
  try {
    const flights = await DAL.getAll(tableName);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve flights" });
  }
}

export async function get(req, res) {
  try {
    const { id } = req.params;
    const flight = await DAL.getAircraftById(tableName, id);
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
    const aircraft = await DAL.getAircraftById("aircrafts", aircraft_id);
    if (!aircraft) {
      return res.status(400).json({ error: "Invalid aircraft_id" });
    }

    const newFlight = await DAL.createAircraft(tableName, {
      aircraft_id,
      take_off,
      is_land,
      Longitude,
      Latitude,
      created_at: new Date().toISOString(),
    });
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(500).json({ error: "Failed to create flight" });
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

    const updatedFlight = await DAL.updateAircraft(tableName, id, {
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

    const deletedFlight = await DAL.deleteAircraft(tableName, id);
    if (deletedFlight) {
      res.json({ message: "Flight deleted successfully" });
    } else {
      res.status(404).json({ error: "Flight not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete flight" });
  }
}
