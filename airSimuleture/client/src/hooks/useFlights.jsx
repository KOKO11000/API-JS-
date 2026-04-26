import { useEffect, useState } from "react";
import * as flightApi from "../api/flights";

export default function useFlights() {
  const [flights, setFlights] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchFlights() {
    try {
      const response = await flightApi.getFlights();
      setFlights(response);
    } catch (error) {
      console.error("Failed to fetch flights:", error);
    }
  }

  async function fetchAircrafts() {
    try {
      const response = await flightApi.getAircrafts();
      setAircrafts(response);
    } catch (error) {
      console.error("Failed to fetch aircrafts:", error);
    }
  }

  async function fetchAircraftTypes() {
    try {
      const response = await flightApi.getAircrafts();
      setAircraftTypes(response);
    } catch (error) {
      console.error("Failed to fetch aircraft types:", error);
    }
  }

  async function createFlight(flightData) {
    setIsLoading(true);
    try {
      const newFlight = await flightApi.createFlight(flightData);
      setFlights((prev) => [...prev, newFlight]);
      return newFlight;
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
      const updatedFlight = await flightApi.updateFlight(id, flightData);
      setFlights((prev) => prev.map((flight) => (flight.id === id ? updatedFlight : flight)));
      return updatedFlight;
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
      await flightApi.deleteFlight(id);
      setFlights((prev) => prev.filter((flight) => flight.id !== id));
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
    fetchAircraftTypes();
  }, []);

  return {
    flights,
    aircrafts,
    aircraftTypes,
    isLoading,
    createFlight,
    updateFlight,
    deleteFlight,
  };
}
