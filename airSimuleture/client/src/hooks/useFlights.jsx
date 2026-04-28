import { useEffect, useState } from "react";
import * as flightApi from "../api/flights";

export default function useFlights() {
  const [flights, setFlights] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function findAircraft(reference) {
    return aircrafts.find(
      (aircraft) =>
        String(aircraft.id) === String(reference) ||
        String(aircraft.name).toLowerCase() === String(reference).toLowerCase(),
    );
  }

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
      const response = await flightApi.getAircraftTypes();
      setAircraftTypes(response);
    } catch (error) {
      console.error("Failed to fetch aircraft types:", error);
    }
  }

  async function createFlight(flightData) {
    setIsLoading(true);
    try {
      const aircraft = findAircraft(flightData.aircraft_id);

      const newFlight = await flightApi.createFlight({
        ...flightData,
        aircraft_id: aircraft?.id || flightData.aircraft_id,
        aircraft_name: aircraft?.name,
      });

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
      const aircraft = findAircraft(flightData.aircraft_id);
      const updatedFlight = await flightApi.updateFlight(id, {
        ...flightData,
        aircraft_id: aircraft?.id || flightData.aircraft_id,
        aircraft_name: aircraft?.name,
      });
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

  const activeFlightAircrafts = new Set(
    flights
      .filter((flight) => !flight.is_land)
      .flatMap((flight) => [
        String(flight.aircraft_id),
        String(flight.aircraft_name || "").toLowerCase(),
      ]),
  );

  const validAircraftTypes = new Set(
    aircraftTypes.map((type) => String(type.aircraftType).toLowerCase()),
  );

  const availableAircrafts = aircrafts.filter((aircraft) => {
    const aircraftType = String(aircraft.aircraft_type || "").toLowerCase();
    const aircraftName = String(aircraft.name || "").toLowerCase();

    return (
      validAircraftTypes.has(aircraftType) &&
      !activeFlightAircrafts.has(String(aircraft.id)) &&
      !activeFlightAircrafts.has(aircraftName)
    );
  });

  return {
    flights,
    aircrafts,
    aircraftTypes,
    availableAircrafts,
    isLoading,
    createFlight,
    updateFlight,
    deleteFlight,
  };
}
