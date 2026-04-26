/**
 * Validation hook for ensuring data consistency
 * Validates that aircraft in flights exist and have valid types
 */

import { useMemo } from 'react';

export default function useValidation(flights, aircrafts, aircraftTypes) {
  const validatedFlights = useMemo(() => {
    return flights.filter(flight => {
      const aircraft = aircrafts.find(a => a.id === flight.aircraft_id);
      if (!aircraft) return false;
      
      const typeExists = aircraftTypes.some(t => t.id === aircraft.aircraft_type_id);
      return typeExists;
    });
  }, [flights, aircrafts, aircraftTypes]);

  const getAircraftType = useMemo(() => {
    return (aircraftTypeId) => {
      return aircraftTypes.find(t => t.id === aircraftTypeId);
    };
  }, [aircraftTypes]);

  return {
    validatedFlights,
    getAircraftType,
  };
}
