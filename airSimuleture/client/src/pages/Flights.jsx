import { useState } from "react";
import FlightModal from "../components/aircrfts/FlightModal";
import DataTable from "../components/DataTable";
import Menu from "../components/home/Menu";
import useFlights from "../hooks/useFlights";

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAircraftName(flight, aircraftMap) {
  return (
    flight.aircraft_name ||
    aircraftMap.get(String(flight.aircraft_id)) ||
    `Aircraft ${flight.aircraft_id}`
  );
}

export default function Flights() {
  const {
    flights,
    aircrafts,
    availableAircrafts,
    isLoading,
    createFlight,
    updateFlight,
    deleteFlight,
  } = useFlights();
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    selectedFlight: null,
  });

  const aircraftMap = new Map(aircrafts.map((aircraft) => [String(aircraft.id), aircraft.name]));

  const rows = flights.map((flight) => ({
    ...flight,
    aircraft: getAircraftName(flight, aircraftMap),
    departure: formatDateTime(flight.take_off),
    location: `${Number(flight.Latitude).toFixed(2)}, ${Number(flight.Longitude).toFixed(2)}`,
    status: flight.is_land ? "Landed" : "Active",
  }));

  const columns = [
    { header: "ID", key: "id" },
    { header: "Aircraft", key: "aircraft" },
    { header: "Takeoff", key: "departure" },
    { header: "Coordinates", key: "location" },
    { header: "Status", key: "status" },
  ];

  function closeModal() {
    setModalState({ isOpen: false, mode: null, selectedFlight: null });
  }

  const selectableAircrafts =
    modalState.mode === "edit" && modalState.selectedFlight
      ? aircrafts.filter((aircraft) => {
          const selectedAircraftName = getAircraftName(modalState.selectedFlight, aircraftMap).toLowerCase();
          return (
            availableAircrafts.some((item) => item.id === aircraft.id) ||
            aircraft.name.toLowerCase() === selectedAircraftName
          );
        })
      : availableAircrafts;

  async function handleConfirm(payload) {
    try {
      if (modalState.mode === "add") {
        await createFlight(payload);
      } else if (modalState.mode === "edit") {
        await updateFlight(modalState.selectedFlight.id, payload);
      } else if (modalState.mode === "delete") {
        await deleteFlight(modalState.selectedFlight.id);
      }
      closeModal();
    } catch {
      alert("Flight operation failed.");
    }
  }

  return (
    <div className="min-h-screen">
      <Menu />

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <DataTable
          data={rows}
          columns={columns}
          onAdd={() => setModalState({ isOpen: true, mode: "add", selectedFlight: null })}
          onEdit={(flight) => setModalState({ isOpen: true, mode: "edit", selectedFlight: flight })}
          onDelete={(flight) => setModalState({ isOpen: true, mode: "delete", selectedFlight: flight })}
          title="Mission Board"
          subtitle="Flight records now use the same aircraft identifiers the server expects for create and update flows."
          addLabel="Add Flight"
        />
      </main>

      <FlightModal
        key={`${modalState.mode}-${modalState.selectedFlight?.id || "new"}`}
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        flight={modalState.selectedFlight}
        aircrafts={selectableAircrafts}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </div>
  );
}
