// Changes made: Changed create function to handle single object instead of array for simplicity and synchronization. Added trimming and lowercasing for name and aircraft_type, improved validations.
import {
  deleteAircraft,
  getAll,
  createAircraft,
  getAircraftById,
  updateAircraft,
} from "../DAL/supabase.js";

const tableName = "aircrafts";

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

async function resolveAircraftType(reference) {
  const normalizedReference = normalizeValue(reference);
  if (!normalizedReference) {
    return null;
  }

  const aircraftTypes = await getAll("aircraft_types");
  return (
    aircraftTypes.find((type) => String(type.id) === String(reference)) ||
    aircraftTypes.find(
      (type) => normalizeValue(type.aircraftType) === normalizedReference,
    ) ||
    null
  );
}

async function hasActiveFlightForAircraft(aircraft) {
  const activeFlights = await getAll("flights", { is_land: false });
  return activeFlights.some(
    (flight) =>
      String(flight.aircraft_id) === String(aircraft.id) ||
      normalizeValue(flight.aircraft_id) === normalizeValue(aircraft.name),
  );
}

export async function list(_, res) {
  try {
    const aircrafts = await getAll(tableName);
    res.json(aircrafts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve aircrafts" });
  }
}

export async function get(req, res) {
  const { id } = req.params;
  try {
    const aircraft = await getAircraftById(tableName, id);
    if (aircraft) {
      res.json(aircraft);
    } else {
      res.status(404).json({ error: "Aircraft not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve aircraft" });
  }
}

export async function create(req, res) {
  const { name, aircraft_type } = req.body;

  try {
    if (!name || !aircraft_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cleanName = normalizeValue(name);

    const existingAircraft = await getAll(tableName, { name: cleanName });
    if (existingAircraft.length > 0) {
      return res
        .status(400)
        .json({ error: "Aircraft with this name already exists" });
    }

    const resolvedType = await resolveAircraftType(aircraft_type);
    if (!resolvedType) {
      return res.status(400).json({ error: "Aircraft type does not exist" });
    }

    const newAircraft = await createAircraft(tableName, {
      name: cleanName,
      aircraft_type: normalizeValue(resolvedType.aircraftType),
      created_at: new Date().toISOString(),
    });

    res.status(201).json(newAircraft);
  } catch (error) {
    res.status(500).json({ error: "Failed to create aircraft" });
  }
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, aircraft_type } = req.body;
  try {
    if (!id || !name || !aircraft_type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const currentAircraft = await getAircraftById(tableName, id);
    if (!currentAircraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    const cleanName = normalizeValue(name);
    const resolvedType = await resolveAircraftType(aircraft_type);
    if (!resolvedType) {
      return res.status(400).json({ error: "Aircraft type does not exist" });
    }

    const existingAircraft = await getAll(tableName, { name: cleanName });
    if (
      existingAircraft.length > 0 &&
      String(existingAircraft[0].id) !== String(id)
    ) {
      return res
        .status(400)
        .json({ error: "Aircraft with this name already exists" });
    }

    const updatedAircraft = await updateAircraft(tableName, id, {
      name: cleanName,
      aircraft_type: normalizeValue(resolvedType.aircraftType),
      updated_at: new Date().toISOString(),
    });
    if (updatedAircraft) {
      res.json(updatedAircraft);
    } else {
      res.status(404).json({ error: "Aircraft not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update aircraft" });
  }
}

export async function deleteById(req, res) {
  const { id } = req.params;
  try {
    const aircraft = await getAircraftById(tableName, id);
    if (!aircraft) {
      return res.status(404).json({ error: "Aircraft not found" });
    }

    if (await hasActiveFlightForAircraft(aircraft)) {
      return res.status(400).json({
        error: "Aircraft with an active flight cannot be deleted",
      });
    }

    const deletedAircraft = await deleteAircraft(tableName, id);
    if (deletedAircraft) {
      res.json({ message: "Aircraft deleted successfully" });
    } else {
      res.status(404).json({ error: "Aircraft not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete aircraft" });
  }
}
