import { useEffect, useState } from "react";
import axios from "axios";

export default function useFlights() {
  const [flights, setFlights] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchFlights() {
    try {
      const response = await axios.get("http://localhost:5000/flights");
      setFlights(response.data);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    }
  }

  async function fetchAircrafts() {
    try {
      const response = await axios.get("http://localhost:5000/aircrafts");
      setAircrafts(response.data);
    } catch (error) {
      console.error("Failed to fetch aircrafts:", error);
    }
  }

  async function createFlight(flightData) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/flights",
        flightData
      );
      setFlights((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Failed to create flight:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateFlight(id, flightData) {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/flights/${id}`,
        flightData
      );
      setFlights((prev) =>
        prev.map((f) => (f.id === id ? response.data : f))
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update flight:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteFlight(id) {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/flights/${id}`);
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Failed to delete flight:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFlights();
    fetchAircrafts();
  }, []);

  return {
    flights,
    aircrafts,
    isLoading,
    createFlight,
    updateFlight,
    deleteFlight,
  };
}
