import { useEffect, useState } from "react";
import axios from "axios";

export default function useAircraftTypes() {
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchAircraftTypes() {
    try {
      const response = await axios.get("http://localhost:5000/aircraftTypes");
      setAircraftTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch aircraft types:", error);
    }
  }

  async function createAircraftType(typeData) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/aircraftTypes",
        typeData
      );
      setAircraftTypes((prev) => [...prev, response.data]);
      return response.data;
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
