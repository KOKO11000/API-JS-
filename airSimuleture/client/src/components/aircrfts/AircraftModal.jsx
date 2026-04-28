import { useState } from "react";
import { Plus, X } from "lucide-react";
import AddTypeModal from "./AddTypeModal";

const initialFormState = {
  name: "",
  aircraft_type: "",
};

function resolveAircraftTypeValue(aircraft, aircraftTypes) {
  if (!aircraft) {
    return "";
  }

  const matchedType = aircraftTypes.find(
    (type) =>
      String(type.id) === String(aircraft.aircraft_type) ||
      String(type.aircraftType).toLowerCase() === String(aircraft.aircraft_type).toLowerCase(),
  );

  return matchedType?.aircraftType || aircraft.aircraft_type || "";
}

export default function AircraftModal({
  isOpen,
  mode,
  aircraft,
  aircraftTypes,
  onConfirm,
  onCancel,
  isLoading,
  onAddType,
}) {
  const [formState, setFormState] = useState(() =>
    mode === "edit" && aircraft
      ? {
          name: aircraft.name || "",
          aircraft_type: resolveAircraftTypeValue(aircraft, aircraftTypes),
        }
      : initialFormState,
  );
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

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

    if (!formState.name.trim() || !formState.aircraft_type) {
      alert("Fill all fields.");
      return;
    }

    onConfirm({
      name: formState.name.trim(),
      aircraft_type: formState.aircraft_type,
    });
  }

  async function handleTypeSubmit(typeData) {
    const createdType = await onAddType(typeData);
    setFormState((current) => ({
      ...current,
      aircraft_type: String(createdType.aircraftType),
    }));
    setIsTypeModalOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="panel w-full max-w-xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--panel-border-soft)] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
              Fleet Record
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              {mode === "add" ? "Add Aircraft" : mode === "edit" ? "Edit Aircraft" : "Delete Aircraft"}
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
            Remove aircraft <span className="text-[var(--text-main)]">{aircraft?.name}</span> from the fleet registry.
          </div>
        ) : (
          <div className="grid gap-4 py-6">
            <label className="grid gap-2 text-sm text-[var(--text-muted)]">
              Aircraft name
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={updateField}
                className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
              />
            </label>

            <div className="grid gap-2 text-sm text-[var(--text-muted)]">
              <div className="flex items-center justify-between gap-3">
                <span>Aircraft type</span>
                <button
                  onClick={() => setIsTypeModalOpen(true)}
                  className="inline-flex items-center gap-2 border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-2 text-xs text-[var(--text-main)]"
                >
                  <Plus size={14} />
                  Add type
                </button>
              </div>
              <select
                name="aircraft_type"
                value={formState.aircraft_type}
                onChange={updateField}
                className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
              >
                <option value="">Select type</option>
                {aircraftTypes.map((type) => (
                  <option key={type.id} value={type.aircraftType}>
                    {type.aircraftType}
                  </option>
                ))}
              </select>
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

      <AddTypeModal
        isOpen={isTypeModalOpen}
        isLoading={isLoading}
        onConfirm={handleTypeSubmit}
        onCancel={() => setIsTypeModalOpen(false)}
      />
    </div>
  );
}
