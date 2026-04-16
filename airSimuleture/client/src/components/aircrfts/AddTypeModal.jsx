import { useState } from "react";
import { X } from "lucide-react";

export default function AddTypeModal({ isOpen, onConfirm, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    aircraftType: "",
    max_speed: "",
    full_tank_gas: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (
      !formData.aircraftType.trim() ||
      !formData.max_speed ||
      !formData.full_tank_gas
    ) {
      alert("Please fill in all fields");
      return;
    }

    const numSpeed = Number(formData.max_speed);
    const numFuel = Number(formData.full_tank_gas);

    if (isNaN(numSpeed) || isNaN(numFuel)) {
      alert("Speed and fuel must be numbers");
      return;
    }

    if (numSpeed <= 0 || numFuel <= 0) {
      alert("Speed and fuel must be positive numbers");
      return;
    }

    onConfirm({
      aircraftType: formData.aircraftType,
      max_speed: numSpeed,
      full_tank_gas: numFuel,
    });

    setFormData({ aircraftType: "", max_speed: "", full_tank_gas: "" });
  };

  const handleCancel = () => {
    setFormData({ aircraftType: "", max_speed: "", full_tank_gas: "" });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-linear-to-br from-slate-900 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Add Aircraft Type</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transform hover:rotate-90 transition-transform duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-200">Type Name</label>
            <input
              type="text"
              name="aircraftType"
              value={formData.aircraftType}
              onChange={handleChange}
              placeholder="e.g., Fighter, Commercial, Cargo"
              className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-200">
              Max Speed (km/h)
            </label>
            <input
              type="number"
              name="max_speed"
              value={formData.max_speed}
              onChange={handleChange}
              placeholder="e.g., 2400"
              className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-200">
              Fuel Tank (Liters)
            </label>
            <input
              type="number"
              name="full_tank_gas"
              value={formData.full_tank_gas}
              onChange={handleChange}
              placeholder="e.g., 8000"
              className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8 justify-end">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 font-semibold transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 py-2 bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-lg text-white font-semibold disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? "Creating..." : "Create Type"}
          </button>
        </div>
      </div>
    </div>
  );
}
