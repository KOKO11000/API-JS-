import httpClient from "./http";

export function getFlights() {
  return httpClient.get("/flights").then((response) => response.data);
}

export function getAircrafts() {
  return httpClient.get("/aircrafts").then((response) => response.data);
}

export function getAircraftTypes() {
  return httpClient.get("/aircraftTypes").then((response) => response.data);
}

export function createFlight(flightData) {
  return httpClient.post("/flights", flightData).then((response) => response.data);
}

export function updateFlight(id, flightData) {
  return httpClient.put(`/flights/${id}`, flightData).then((response) => response.data);
}

export function deleteFlight(id) {
  return httpClient.delete(`/flights/${id}`).then((response) => response.data);
}

export function getFlightsWithinRadius({ lat, lng, radius }) {
  return httpClient
    .get("/flights/within-radius", {
      params: { lat, lng, radius },
    })
    .then((response) => response.data);
}

export function getFlightsWithinPolygon(points) {
  return httpClient
    .post("/flights/within-polygon", { points })
    .then((response) => response.data);
}

export function getFlightDistance(id) {
  return httpClient.get(`/flights/${id}/distance`).then((response) => response.data);
}

export function createAircraft(aircraftData) {
  return httpClient.post("/aircrafts", aircraftData).then((response) => response.data);
}

export function updateAircraft(id, aircraftData) {
  return httpClient.put(`/aircrafts/${id}`, aircraftData).then((response) => response.data);
}

export function deleteAircraft(id) {
  return httpClient.delete(`/aircrafts/${id}`).then((response) => response.data);
}

export function createAircraftType(typeData) {
  return httpClient.post("/aircraftTypes", typeData).then((response) => response.data);
}
