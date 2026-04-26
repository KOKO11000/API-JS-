import { useCallback, useState } from "react";
import * as flightApi from "../api/flights";

export default function useMap() {
  const [radiusFlights, setRadiusFlights] = useState([]);
  const [polygonFlights, setPolygonFlights] = useState([]);
  const [flightDistances, setFlightDistances] = useState({});
  const [radiusMessage, setRadiusMessage] = useState("");
  const [polygonMessage, setPolygonMessage] = useState("");
  const [isSearchingRadius, setIsSearchingRadius] = useState(false);
  const [isSearchingPolygon, setIsSearchingPolygon] = useState(false);

  const fetchFlightsWithinRadius = useCallback(async (center, radius) => {
    setRadiusMessage("");
    setIsSearchingRadius(true);

    try {
      const results = await flightApi.getFlightsWithinRadius({
        lat: center[0],
        lng: center[1],
        radius,
      });
      setRadiusFlights(results);
    } catch (error) {
      console.error("Radius search failed", error);
      setRadiusMessage("Failed to load flights inside radius.");
    } finally {
      setIsSearchingRadius(false);
    }
  }, []);

  const fetchFlightsWithinPolygon = useCallback(async (points) => {
    if (points.length < 3) {
      setPolygonMessage("Polygon must contain at least three points.");
      return;
    }

    setPolygonMessage("");
    setIsSearchingPolygon(true);

    try {
      const results = await flightApi.getFlightsWithinPolygon(points);
      setPolygonFlights(results);
    } catch (error) {
      console.error("Polygon search failed", error);
      setPolygonMessage("Failed to load flights inside polygon.");
    } finally {
      setIsSearchingPolygon(false);
    }
  }, []);

  const fetchFlightDistance = useCallback(async (flightId) => {
    try {
      const distance = await flightApi.getFlightDistance(flightId);
      setFlightDistances((prev) => ({ ...prev, [flightId]: distance }));
    } catch (error) {
      console.error("Failed to load flight distance", error);
    }
  }, []);

  const clearPolygonResults = useCallback(() => {
    setPolygonFlights([]);
    setPolygonMessage("");
  }, []);

  return {
    radiusFlights,
    polygonFlights,
    flightDistances,
    radiusMessage,
    polygonMessage,
    isSearchingRadius,
    isSearchingPolygon,
    fetchFlightsWithinRadius,
    fetchFlightsWithinPolygon,
    fetchFlightDistance,
    clearPolygonResults,
  };
}
