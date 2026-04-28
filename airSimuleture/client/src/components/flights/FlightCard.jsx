import { getStatusBgColor, getStatusColor } from "../../utils/militaryTheme";

function formatTime(timestamp) {
  if (!timestamp) {
    return "Completed";
  }

  return new Date(timestamp).toLocaleTimeString("en-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FlightCard({
  flight,
  onShowDistance,
  distance,
  isSelected,
  matchSummary,
}) {
  return (
    <article
      className={`panel border-l-4 p-4 transition ${
        getStatusColor(flight.status)
      } ${isSelected ? "border-[var(--accent)] bg-[rgba(35,43,32,0.92)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
            Flight {flight.id}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text-main)]">
            {flight.aircraftName}
          </h3>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold ${getStatusBgColor(flight.status)}`}>
          {flight.status}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-[var(--text-muted)]">
        <div className="flex justify-between gap-4">
          <span>Target</span>
          <span className="text-[var(--text-main)]">
            {flight.destination[0].toFixed(4)}, {flight.destination[1].toFixed(4)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Distance</span>
          <span className="text-[var(--text-main)]">{flight.distance.toFixed(1)} km</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Speed</span>
          <span className="text-[var(--text-main)]">{flight.speedKmh} km/h</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>ETA</span>
          <span className="text-[var(--text-main)]">{formatTime(flight.eta)}</span>
        </div>
      </div>

      {matchSummary ? (
        <div className="mt-4 border-t border-[var(--panel-border-soft)] pt-4 text-xs uppercase tracking-[0.18em] text-[var(--accent-strong)]">
          {matchSummary}
        </div>
      ) : null}

      <div className="mt-4 border-t border-[var(--panel-border-soft)] pt-4">
        <button
          onClick={() => onShowDistance(flight.id)}
          className="w-full border border-[var(--panel-border)] bg-[var(--panel-alt)] px-4 py-2 text-sm text-[var(--text-main)]"
        >
          Show Base Distance
        </button>

        {distance ? (
          <div className="mt-3 grid gap-1 text-xs text-[var(--text-muted)]">
            <span>{distance.distance_km.toFixed(2)} km</span>
            <span>{distance.distance_meters.toFixed(0)} m</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}
