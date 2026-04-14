import db from "../db.js";

export async function getAllAircrafts(tableName) {
  try {
    const result = await db.from(tableName).select("*");
    return result.data;
  } catch (error) {
    console.error("get all aircrafts err:", error.message);
  }
}
export async function getAircraftById(tableName, id) {
  try {
    const result = await db.from(tableName).select("*").eq("id", id).single();
    return result.data;
  } catch (error) {
    console.error("get aircraft by id err:", error.message);
  }
}

export async function createAircraft(tableName, data) {
  try {
    const result = await db.from(tableName).insert(data).select("*").single();
    return result.data;
  } catch (error) {
    console.error("create aircraft err:", error.message);
  }
}

export async function updateAircraft(tableName, id, data) {
  try {
    const result = await db.from(tableName).update(data).eq("id", id).select("*").single();
    return result.data;
  } catch (error) {
    console.error("update aircraft err:", error.message);
  }
}

export async function deleteAircraft(tableName, id) {
  try {
    const result = await db.from(tableName).delete().eq("id", id).select("*").single();
    return result.data;
  } catch (error) {
    console.error("delete aircraft err:", error.message);
  }
}


