import { createAircraft, getAircraftById, getAll, updateAircraft } from "../DAL/supabase.js";

const tableName = "aircraft_types";

export async function list(req, res) {
  try {
    const aircraftTypes = await getAll(tableName);
    res.json(aircraftTypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve aircraft types" });
  }
}

export async function get(req, res) {
  const { id } = req.params;
  try {
    const aircraftType = await getAircraftById(tableName, id);
    if (aircraftType) {
      res.json(aircraftType);
    } else {
      res.status(404).json({ error: "Aircraft type not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve aircraft type" });
  }
}

export async function create(req, res) {
  const { aircraftType, max_speed, full_tank_gas } = req.body;
  try {
    if (!aircraftType || !max_speed || !full_tank_gas) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (isNaN(max_speed) || isNaN(full_tank_gas)) {
      return res.status(400).json({ error: "max_speed and full_tank_gas must be numbers" });
    }
    if(max_speed <= 0 || full_tank_gas <= 0) {
      return res.status(400).json({ error: "max_speed and full_tank_gas must be positive numbers" });
    } 
    const existingAircraft = await getAll(tableName, { aircraftType });
        if (existingAircraft.length > 0) {
          return res.status(400).json({ error: "Aircraft with this name already exists" });
        }
    const newAircraftType = await createAircraft(tableName, {
      aircraftType,
      max_speed,
      full_tank_gas,
      created_at: new Date().toISOString(),
    });
    res.status(201).json(newAircraftType);
  } catch (error) {
    res.status(500).json({ error: "Failed to create aircraft type" });
  }
}

export async function update(req, res) {
  const { id } = req.params;
  const { aircraftType, max_speed, full_tank_gas } = req.body;
  try {
    const updatedAircraftType = await updateAircraft(tableName, id, {
      aircraftType,
      max_speed,
      full_tank_gas,
      updated_at: new Date().toISOString(),
    });
    if (updatedAircraftType) {
      res.json(updatedAircraftType);
    } else {
      res.status(404).json({ error: "Aircraft type not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update aircraft type" });
  }
}

export async function deleteById(req, res) {
  const { id } = req.params;  
    try {
    const deletedAircraftType = await deleteAircraft(tableName, id);
    if (deletedAircraftType) {
      res.json(deletedAircraftType);
    } else {
      res.status(404).json({ error: "Aircraft type not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete aircraft type" });
  }
}