import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function FlightModal({
  isOpen,
  mode, // 'add', 'edit', 'delete'
  flight,
  aircrafts,
  onConfirm,
  onCancel,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    aircraft_id: "",
    take_off: "",
    Longitude: "",
    Latitude: "",
  });

  useEffect(() => {
    if (flight && mode === "edit") {
      setFormData({
        aircraft_id: flight.aircraft_id || "",
        take_off: flight.take_off || "",
        Longitude: flight.Longitude || "",
        Latitude: flight.Latitude || "",
      });
    } else {
      setFormData({
        aircraft_id: "",
        take_off: "",
        Longitude: "",
        Latitude: "",
      });
    }
  }, [isOpen, mode, flight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    if (mode === "delete") {
      onConfirm();
    } else if (mode === "add" || mode === "edit") {
      if (
        !formData.aircraft_id ||
        !formData.take_off ||
        !formData.Longitude ||
        !formData.Latitude
      ) {
        alert("Please fill in all fields");
        return;
      }

      const lon = Number(formData.Longitude);
      const lat = Number(formData.Latitude);

      if (isNaN(lon) || isNaN(lat)) {
        alert("Longitude and Latitude must be numbers");
        return;
      }

      onConfirm({
        ...formData,
        aircraft_id: parseInt(formData.aircraft_id),
        Longitude: lon,
        Latitude: lat,
        is_land: false,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-linear-to-br from-slate-900 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
            {mode === "add" && "Add Flight"}
            {mode === "edit" && "Edit Flight"}
            {mode === "delete" && "Delete Flight"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transform hover:rotate-90 transition-transform duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {mode === "delete" ? (
          <div className="py-4">
            <p className="text-gray-300 text-lg">
              Are you sure you want to delete flight{" "}
              <strong className="text-red-400">#{flight?.id}</strong>?
              <br />
              <span className="text-sm text-gray-400">This action cannot be undone.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-200">
                Aircraft
              </label>
              <select
                name="aircraft_id"
                value={formData.aircraft_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
              >
                <option value="">Select Aircraft</option>
                {aircrafts.map((aircraft) => (
                  <option key={aircraft.id} value={aircraft.id}>
                    {aircraft.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-200">
                Take Off Time
              </label>
              <input
                type="datetime-local"
                name="take_off"
                value={formData.take_off}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Longitude
                </label>
                <input
                  type="number"
                  name="Longitude"
                  value={formData.Longitude}
                  onChange={handleChange}
                  placeholder="e.g., 35.2137"
                  step="0.0001"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-200">
                  Latitude
                </label>
                <input
                  type="number"
                  name="Latitude"
                  value={formData.Latitude}
                  onChange={handleChange}
                  placeholder="e.g., 31.7707"
                  step="0.0001"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-8 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white disabled:opacity-50 font-semibold transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50 transition-all duration-300 ${
              mode === "delete"
                ? "bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                : "bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
            }`}
          >
            {isLoading ? "Processing..." : mode === "delete" ? "Delete" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
