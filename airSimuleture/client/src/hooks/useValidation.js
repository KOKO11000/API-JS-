import { useMemo } from "react";

function findAircraft(flight, aircrafts) {
  return aircrafts.find(
    (aircraft) =>
      String(aircraft.id) === String(flight.aircraft_id) ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_id).toLowerCase() ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_name || "").toLowerCase(),
  );
}

function findAircraftType(aircraft, aircraftTypes) {
  return aircraftTypes.find(
    (type) =>
      String(type.id) === String(aircraft.aircraft_type) ||
      String(type.aircraftType).toLowerCase() === String(aircraft.aircraft_type).toLowerCase(),
  );
}

export default function useValidation(flights, aircrafts, aircraftTypes) {
  const validatedFlights = useMemo(
    () =>
      flights.filter((flight) => {
        const aircraft = findAircraft(flight, aircrafts);
        if (!aircraft) {
          return false;
        }

        return Boolean(findAircraftType(aircraft, aircraftTypes));
      }),
    [aircraftTypes, aircrafts, flights],
  );

  return {
    validatedFlights,
    getAircraftType: (aircraft) => findAircraftType(aircraft, aircraftTypes),
  };
}
