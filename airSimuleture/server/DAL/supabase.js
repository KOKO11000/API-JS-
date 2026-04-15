import db from "../db.js";


export async function getAll(tableName, filters = {}) {
  try {
    let query = db.from(tableName).select("*");

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const result = await query;
    return result.data || [];
  } catch (error) {
    console.error("get all items err:", error.message);
    return [];
  }
}
export async function getAircraftById(tableName, id) {
  try {
    const result = await db.from(tableName).select("*").eq("id", id).single();
    return result.data;
  } catch (error) {
    console.error("get item by id err:", error.message);
    return null;
  }
}

export async function createAircraft(tableName, data) {
  try {
    const result = await db.from(tableName).insert(data).select("*").single();
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("create item err:", error.message);
    return null;
  }
}

export async function updateAircraft(tableName, id, data) {
  try {
    const result = await db
      .from(tableName)
      .update(data)
      .eq("id", id)
      .select("*")
      .single();
    return result.data;
  } catch (error) {
    console.error("update item err:", error.message);
    return null;
  }
}

export async function deleteAircraft(tableName, id) {
  try {
    const result = await db
      .from(tableName)
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    return result.data;
  } catch (error) {
    console.error("delete item err:", error.message);
    return null;
  }
}
