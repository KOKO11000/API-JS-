import { useState } from "react";
import { X } from "lucide-react";

const initialFormState = {
  aircraftType: "",
  max_speed: "",
  full_tank_gas: "",
};

export default function AddTypeModal({ isOpen, onConfirm, onCancel, isLoading }) {
  const [formState, setFormState] = useState(initialFormState);

  if (!isOpen) {
    return null;
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function closeModal() {
    setFormState(initialFormState);
    onCancel();
  }

  function handleSubmit() {
    const maxSpeed = Number(formState.max_speed);
    const fuelCapacity = Number(formState.full_tank_gas);

    if (!formState.aircraftType.trim() || maxSpeed <= 0 || fuelCapacity <= 0) {
      alert("Enter valid type, speed and fuel capacity.");
      return;
    }

    onConfirm({
      aircraftType: formState.aircraftType.trim(),
      max_speed: maxSpeed,
      full_tank_gas: fuelCapacity,
    });

    setFormState(initialFormState);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4">
      <div className="panel w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--panel-border-soft)] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)]">
              Type Registry
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
              Add Aircraft Type
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="border border-[var(--panel-border)] bg-[var(--panel-alt)] p-2 text-[var(--text-muted)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 py-6">
          <label className="grid gap-2 text-sm text-[var(--text-muted)]">
            Type name
            <input
              type="text"
              name="aircraftType"
              value={formState.aircraftType}
              onChange={updateField}
              className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--text-muted)]">
            Maximum speed
            <input
              type="number"
              name="max_speed"
              value={formState.max_speed}
              onChange={updateField}
              className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--text-muted)]">
            Fuel capacity
            <input
              type="number"
              name="full_tank_gas"
              value={formState.full_tank_gas}
              onChange={updateField}
              className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-3 py-3 text-[var(--text-main)] outline-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[var(--panel-border-soft)] pt-4">
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="border border-[var(--panel-border)] bg-[var(--panel-alt)] px-4 py-2 text-sm text-[var(--text-main)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="border border-[var(--accent)] bg-[rgba(143,154,104,0.14)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)] disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
