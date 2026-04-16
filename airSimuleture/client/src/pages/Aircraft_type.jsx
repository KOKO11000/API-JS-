import React, { useState } from "react";
import Menu from "../components/home/Menu";
import DataTable from "../components/DataTable";
import useAircraftTypes from "../hooks/useAircraftTypes";

export default function Aircraft_type() {
  const { aircraftTypes, createAircraftType, isLoading } = useAircraftTypes();
  const [modal, setModal] = useState({ isOpen: false });
  const [formData, setFormData] = useState({
    aircraftType: "",
    max_speed: "",
    full_tank_gas: "",
  });

  const handleAddType = () => {
    setFormData({ aircraftType: "", max_speed: "", full_tank_gas: "" });
    setModal({ isOpen: true });
  };

  const handleConfirm = async () => {
    if (!formData.aircraftType.trim() || !formData.max_speed || !formData.full_tank_gas) {
      alert("Please fill in all fields");
      return;
    }

    const numSpeed = Number(formData.max_speed);
    const numFuel = Number(formData.full_tank_gas);

    if (isNaN(numSpeed) || isNaN(numFuel) || numSpeed <= 0 || numFuel <= 0) {
      alert("Speed and fuel must be positive numbers");
      return;
    }

    try {
      await createAircraftType({
        aircraftType: formData.aircraftType,
        max_speed: numSpeed,
        full_tank_gas: numFuel,
      });
      setModal({ isOpen: false });
    } catch (error) {
      alert("Failed to create type");
    }
  };

  const data = aircraftTypes.map((type) => ({
    id: type.id,
    name: type.aircraftType,
    max_speed: `${type.max_speed} km/h`,
    max_fuel: `${type.full_tank_gas} L`,
  }));

  const columns = [
    { header: "ID", key: "id" },
    { header: "Type", key: "name" },
    { header: "Max Speed", key: "max_speed" },
    { header: "Fuel Tank", key: "max_fuel" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Aircraft Types</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Discover the various types of aircraft available in our flight
              simulation platform. From small private planes to large commercial jets,
              explore the diversity of aviation.
            </p>
          </div>
          <DataTable data={data} columns={columns} onAdd={handleAddType} />
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-linear-to-br from-slate-900 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold bg-linear-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-6">Add Aircraft Type</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type Name"
                value={formData.aircraftType}
                onChange={(e) =>
                  setFormData({ ...formData, aircraftType: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              />
              <input
                type="number"
                placeholder="Max Speed (km/h)"
                value={formData.max_speed}
                onChange={(e) =>
                  setFormData({ ...formData, max_speed: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              />
              <input
                type="number"
                placeholder="Fuel Tank (L)"
                value={formData.full_tank_gas}
                onChange={(e) =>
                  setFormData({ ...formData, full_tank_gas: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
              />
            </div>
            <div className="flex gap-3 mt-8 justify-end">
              <button
                onClick={() => setModal({ isOpen: false })}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-6 py-2 bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-lg text-white font-semibold"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
