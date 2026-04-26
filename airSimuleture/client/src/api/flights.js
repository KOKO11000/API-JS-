import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export function getFlights() {
  return api.get("/flights").then((response) => response.data);
}

export function getAircrafts() {
  return api.get("/aircrafts").then((response) => response.data);
}

export function getAircraftTypes() {
  return api.get("/aircraftTypes").then((response) => response.data);
}

export function createFlight(flightData) {
  return api.post("/flights", flightData).then((response) => response.data);
}

export function updateFlight(id, flightData) {
  return api.put(`/flights/${id}`, flightData).then((response) => response.data);
}

export function deleteFlight(id) {
  return api.delete(`/flights/${id}`).then((response) => response.data);
}

export function getFlightsWithinRadius({ lat, lng, radius }) {
  return api
    .get("/flights/within-radius", {
      params: { lat, lng, radius },
    })
    .then((response) => response.data);
}

export function getFlightsWithinPolygon(points) {
  return api.post("/flights/within-polygon", { points }).then((response) => response.data);
}

export function getFlightDistance(id) {
  return api.get(`/flights/${id}/distance`).then((response) => response.data);
}
