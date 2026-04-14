import db from "../db.js";

export async function getAll(tableName) {
  try {
    const result = await db.from(tableName).select("*");
    return result.data;
  } catch (error) {
    console.error("get all items err:", error.message);
  }
}
export async function getAircraftById(tableName, id) {
  try {
    const result = await db.from(tableName).select("*").eq("id", id).single();
    return result.data;
  } catch (error) {
    console.error("get item by id err:", error.message);
  }
}

export async function createAircraft(tableName, data) {
  try {
    const result = await db.from(tableName).insert(data).select("*").single();
    console.log(result)
    return result.data;
  } catch (error) {
    console.error("create item err:", error.message);
  }
}

export async function updateAircraft(tableName, id, data) {
  try {
    const result = await db.from(tableName).update(data).eq("id", id).select("*").single();
    return result.data;
  } catch (error) {
    console.error("update item err:", error.message);
  }
}

export async function deleteAircraft(tableName, id) {
  try {
    const result = await db.from(tableName).delete().eq("id", id).select("*").single();
    return result.data;
  } catch (error) {
    console.error("delete item err:", error.message);
  }
}


