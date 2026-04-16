import React, { useState } from "react";
import Menu from "../components/home/Menu";
import DataTable from "../components/DataTable";
import FlightModal from "../components/aircrfts/FlightModal";
import useFlights from "../hooks/useFlights";

export default function Flights() {
  const { flights, aircrafts, isLoading, createFlight, updateFlight, deleteFlight } = useFlights();

  const [modal, setModal] = useState({
    isOpen: false,
    mode: null,
    selectedFlight: null,
  });

  const handleAdd = () => {
    setModal({ isOpen: true, mode: "add", selectedFlight: null });
  };

  const handleEdit = (flight) => {
    setModal({ isOpen: true, mode: "edit", selectedFlight: flight });
  };

  const handleDelete = (flight) => {
    setModal({ isOpen: true, mode: "delete", selectedFlight: flight });
  };

  const handleModalConfirm = async (data) => {
    try {
      if (modal.mode === "add") {
        await createFlight(data);
      } else if (modal.mode === "edit") {
        await updateFlight(modal.selectedFlight.id, data);
      } else if (modal.mode === "delete") {
        await deleteFlight(modal.selectedFlight.id);
      }
      setModal({ isOpen: false, mode: null, selectedFlight: null });
    } catch (error) {
      alert("Operation failed. Please try again.");
    }
  };

  const getAircraftName = (id) => {
    const aircraft = aircrafts.find((a) => a.id === id);
    return aircraft ? aircraft.name : "Unknown";
  };

  const data = flights.map((f) => ({
    id: f.id,
    aircraft: getAircraftName(f.aircraft_id),
    departure: new Date(f.take_off).toLocaleString("en-IL"),
    location: `${f.Latitude.toFixed(2)}, ${f.Longitude.toFixed(2)}`,
    status: f.is_land ? "Landed" : "Flying",
  }));

  const columns = [
    { header: "ID", key: "id" },
    { header: "Aircraft", key: "aircraft" },
    { header: "Take Off", key: "departure" },
    { header: "Location", key: "location" },
    { header: "Status", key: "status" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Active Flights</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Discover the exciting world of aviation with our flight simulation
              platform. Experience the thrill of flying and explore the skies like
              never before.
            </p>
          </div>
          <DataTable
            data={data}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <FlightModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        flight={modal.selectedFlight}
        aircrafts={aircrafts}
        onConfirm={handleModalConfirm}
        onCancel={() => setModal({ isOpen: false, mode: null, selectedFlight: null })}
        isLoading={isLoading}
      />
    </div>
  );
}
