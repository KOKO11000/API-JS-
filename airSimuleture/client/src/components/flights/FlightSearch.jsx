/**
 * FlightSearch Component
 * Provides search functionality to filter flights by name or ID
 * Displays search results with flight status and location
 */

import { useState, useMemo } from 'react';

function FlightSearch({ flights, aircrafts }) {
  const [searchQuery, setSearchQuery] = useState('');

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return flights.filter(flight => {
      const aircraft = aircrafts.find(a => a.id === flight.aircraft_id);
      return (
        flight.id.toString().includes(query) ||
        aircraft?.name?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, flights, aircrafts]);

  return (
    <div className="rounded-lg border border-amber-700/40 bg-gray-900/40 p-4">
      <h3 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wider">Search Flights</h3>
      
      <input
        type="text"
        placeholder="Search by ID or aircraft name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded px-3 py-2 text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-600"
      />

      {searchQuery && (
        <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
          {results.length > 0 ? (
            results.map(flight => {
              const aircraft = aircrafts.find(a => a.id === flight.aircraft_id);
              return (
                <div key={flight.id} className="rounded px-3 py-2 bg-gray-800/60 border border-gray-700 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-300">#{flight.id}</span>
                    <span className="text-gray-400">{aircraft?.name}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Pos: {flight.Latitude.toFixed(4)}, {flight.Longitude.toFixed(4)}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-500">No flights found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FlightSearch;
