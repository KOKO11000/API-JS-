import { useState } from "react";
import { X } from "lucide-react";

const initialFormState = {
  aircraft_id: "",
  take_off: "",
  Longitude: "",
  Latitude: "",
};

function toDateTimeInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function resolveAircraftSelection(flight, aircrafts) {
  if (!flight) {
    return "";
  }

  const matchedAircraft = aircrafts.find(
    (aircraft) =>
      String(aircraft.id) === String(flight.aircraft_id) ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_id).toLowerCase() ||
      String(aircraft.name).toLowerCase() === String(flight.aircraft_name || "").toLowerCase(),
  );

  return matchedAircraft?.name || flight.aircraft_name || "";
}

export default function FlightModal({
  isOpen,
  mode,
  flight,
  aircrafts,
  onConfirm,
  onCancel,
  isLoading,
}) {
  const [formState, setFormState] = useState(() =>
    mode === "edit" && flight
      ? {
          aircraft_id: resolveAircraftSelection(flight, aircrafts),
          take_off: toDateTimeInput(flight.take_off),
          Longitude: String(flight.Longitude ?? ""),
          Latitude: String(flight.Latitude ?? ""),
        }
      : initialFormState,
  );

  if (!isOpen) {
    return null;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit() {
    if (mode === "delete") {
      onConfirm();
      return;
    }

    const longitude = Number(formState.Longitude);
    const latitude = Number(formState.Latitude);

    if (!formState.aircraft_id || !formState.take_off || Number.isNaN(longitude) || Number.isNaN(latitude)) {
      alert("Fill all fields with valid values.");
      return;
    }

    onConfirm({
      aircraft_id: formState.aircraft_id,
      take_off: new Date(formState.take_off).toISOString(),
      Longitude: longitude,
      Latitude: latitude,
      is_land: false,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="panel w-full max-w-xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--panel-border-soft)] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
              Flight Record
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {mode === "add" ? "Add Flight" : mode === "edit" ? "Edit Flight" : "Delete Flight"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="border border-[var(--panel-border)] bg-[var(--panel-alt)] p-2 text-[var(--text-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        {mode === "delete" ? (
          <div className="py-6 text-sm text-[var(--text-muted)]">
            Remove flight <span className="text-[var(--text-main)]">#{flight?.id}</span> from the active registry.
          </div>
        ) : (
          <div className="grid gap-4 py-6">
            <label className="grid gap-2 text-sm text-[var(--text-muted)]">
              Aircraft
              <select
                name="aircraft_id"
                value={formState.aircraft_id}
                onChange={updateField}
                className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
              >
                <option value="">Select aircraft</option>
                {aircrafts.map((aircraft) => (
                  <option key={aircraft.id} value={aircraft.name}>
                    {aircraft.name}
                  </option>
                ))}
              </select>
              {aircrafts.length === 0 ? (
                <span className="text-xs text-[var(--danger)]">
                  No aircraft is currently available. Aircraft must have a valid type and no active flight.
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-[var(--text-muted)]">
              Takeoff time
              <input
                type="datetime-local"
                name="take_off"
                value={formState.take_off}
                onChange={updateField}
                className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[var(--text-muted)]">
                Longitude
                <input
                  type="number"
                  step="0.0001"
                  name="Longitude"
                  value={formState.Longitude}
                  onChange={updateField}
                  className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--text-muted)]">
                Latitude
                <input
                  type="number"
                  step="0.0001"
                  name="Latitude"
                  value={formState.Latitude}
                  onChange={updateField}
                  className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-[var(--panel-border-soft)] pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-4 py-2 text-sm text-[var(--text-main)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
              mode === "delete"
                ? "border border-[rgba(183,93,74,0.4)] bg-[rgba(183,93,74,0.14)] text-[#e4b5aa]"
                : "border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] text-[var(--accent-strong)]"
            }`}
          >
            {isLoading ? "Saving..." : mode === "delete" ? "Delete" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
