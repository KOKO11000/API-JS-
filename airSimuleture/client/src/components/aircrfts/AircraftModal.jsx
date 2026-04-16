import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import AddTypeModal from "./AddTypeModal";

export default function AircraftModal({
  isOpen,
  mode, // 'add', 'edit', 'delete'
  aircraft,
  aircraftTypes,
  onConfirm,
  onCancel,
  isLoading,
  onAddType,
}) {
  const [formData, setFormData] = useState({
    name: "",
    aircraft_type: "",
  });
  const [showAddType, setShowAddType] = useState(false);

  useEffect(() => {
    if (mode === "delete") {
      return;
    }
    if (aircraft && mode === "edit") {
      setFormData({
        name: aircraft.name || "",
        aircraft_type: aircraft.aircraft_type || "",
      });
    } else {
      setFormData({ name: "", aircraft_type: "" });
    }
  }, [isOpen, mode, aircraft]);

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
      if (!formData.name.trim() || !formData.aircraft_type) {
        alert("Please fill in all fields");
        return;
      }
      onConfirm(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-linear-to-br from-slate-900 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
            {mode === "add" && "Add Aircraft"}
            {mode === "edit" && "Edit Aircraft"}
            {mode === "delete" && "Delete Aircraft"}
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
              Are you sure you want to delete <strong className="text-red-400">{aircraft?.name}</strong>?
              <br />
              <span className="text-sm text-gray-400">This action cannot be undone.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-200">
                Aircraft Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter aircraft name"
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Aircraft Type
                </label>
                <button
                  onClick={() => setShowAddType(true)}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 px-3 py-1 rounded-lg disabled:opacity-50 font-semibold transition-all"
                >
                  <Plus size={14} />
                  New Type
                </button>
              </div>
              <select
                name="aircraft_type"
                value={formData.aircraft_type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition-all"
              >
                <option value="">Select Type</option>
                {aircraftTypes && aircraftTypes.length > 0 ? (
                  aircraftTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.aircraftType || type.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No types available</option>
                )}
              </select>
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

      {/* Add Type Modal */}
      <AddTypeModal
        isOpen={showAddType}
        isLoading={isLoading}
        onConfirm={async (typeData) => {
          try {
            await onAddType(typeData);
            setShowAddType(false);
          } catch (error) {
            alert("Failed to create type. Please try again.");
          }
        }}
        onCancel={() => setShowAddType(false)}
      />
    </div>
  );
}
