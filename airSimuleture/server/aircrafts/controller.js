// Changes made: Changed create function to handle single object instead of array for simplicity and synchronization. Added trimming and lowercasing for name and aircraft_type, improved validations.
import {
  deleteAircraft,
  getAll,
  createAircraft,
  getAircraftById,
  updateAircraft,
} from "../DAL/supabase.js";

const tableName = "aircrafts";

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

    const cleanName = name.trim().toLowerCase();
    const cleanType = aircraft_type.trim().toLowerCase();

    const existingAircraft = await getAll(tableName, { name: cleanName });
    if (existingAircraft.length > 0) {
      return res
        .status(400)
        .json({ error: "Aircraft with this name already exists" });
    }

    const newAircraft = await createAircraft(tableName, {
      name: cleanName,
      aircraft_type: cleanType,
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
    const updatedAircraft = await updateAircraft(tableName, id, {
      name,
      aircraft_type,
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
    const deletedAircraft = await deleteAircraft(tableName, id);
    if (deletedAircraft) {
      res.json({ message: "Aircraft deleted successfully" });
    } else {
      res.status(404).json({ err: "Aircraft not found !" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete aircraft" });
  }
}
