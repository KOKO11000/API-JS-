import { useEffect, useState } from "react";
import { createAircraftType as createAircraftTypeRequest, getAircraftTypes } from "../api/flights";

export default function useAircraftTypes() {
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAircraftTypes() {
    try {
      const data = await getAircraftTypes();
      setAircraftTypes(data);
    } catch (error) {
      console.error("Failed to fetch aircraft types:", error);
    }
  }

  async function createAircraftType(typeData) {
    setIsLoading(true);
    try {
      const createdType = await createAircraftTypeRequest(typeData);
      setAircraftTypes((prev) => [...prev, createdType]);
      return createdType;
    } catch (error) {
      console.error("Failed to create aircraft type:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAircraftTypes();
  }, []);

  return { aircraftTypes, createAircraftType, isLoading };
}
