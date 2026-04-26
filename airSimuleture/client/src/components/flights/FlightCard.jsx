/**
 * FlightCard Component
 * Displays a single flight's information in card format
 * Shows: ID, aircraft name, status, target, distance, speed, ETA, current position
 */

function FlightCard({ flight, onShowDistance, distance }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Landed':
        return 'bg-green-900/40 border-green-700 text-green-300';
      case 'Returning':
        return 'bg-amber-900/40 border-amber-700 text-amber-300';
      case 'Outbound':
        return 'bg-red-900/40 border-red-700 text-red-300';
      default:
        return 'bg-gray-900/40 border-gray-700 text-gray-300';
    }
  };

  return (
    <div className={`rounded-lg border ${getStatusColor(flight.status)} bg-opacity-20 p-4 text-sm text-gray-200`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Mission #{flight.id}</p>
          <h4 className="text-lg font-bold text-white">{flight.aircraftName}</h4>
        </div>
        <span className={`px-3 py-1 rounded font-semibold text-xs border ${getStatusColor(flight.status)}`}>
          {flight.status}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Target:</span>
          <span>{flight.destination[0].toFixed(4)}, {flight.destination[1].toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Distance:</span>
          <span>{flight.distance.toFixed(1)} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Speed:</span>
          <span>{flight.speedKmh} km/h</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ETA:</span>
          <span>{flight.eta ? new Date(flight.eta).toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' }) : 'Landed'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Position:</span>
          <span>{flight.currentPosition[0].toFixed(4)}, {flight.currentPosition[1].toFixed(4)}</span>
        </div>
      </div>

      <button
        onClick={() => onShowDistance(flight.id)}
        className="mt-3 w-full rounded px-3 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-600 text-amber-100 transition-colors"
      >
        Calculate Distance
      </button>

      {distance && (
        <div className="mt-3 rounded bg-gray-900/60 p-2 border border-gray-700 text-xs">
          <p className="text-gray-300">Distance: {distance.distance_km.toFixed(2)} km ({distance.distance_meters.toFixed(0)} m)</p>
        </div>
      )}
    </div>
  );
}

export default FlightCard;
