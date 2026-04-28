import { useState } from "react";
import DataTable from "../components/DataTable";
import AddTypeModal from "../components/aircrfts/AddTypeModal";
import Menu from "../components/home/Menu";
import useAircraftTypes from "../hooks/useAircraftTypes";

export default function AircraftTypePage() {
  const { aircraftTypes, createAircraftType, isLoading } = useAircraftTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rows = aircraftTypes.map((type) => ({
    id: type.id,
    name: type.aircraftType,
    max_speed: `${type.max_speed} km/h`,
    fuel_capacity: `${type.full_tank_gas} L`,
  }));

  const columns = [
    { header: "ID", key: "id" },
    { header: "Type", key: "name" },
    { header: "Max Speed", key: "max_speed" },
    { header: "Fuel Capacity", key: "fuel_capacity" },
  ];

  async function handleCreate(typeData) {
    await createAircraftType(typeData);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen">
      <Menu />

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <DataTable
          data={rows}
          columns={columns}
          onAdd={() => setIsModalOpen(true)}
          title="Aircraft Type Catalog"
          subtitle="Performance definitions stay centralized so aircraft and missions can reuse the same source of truth."
          addLabel="Add Type"
        />
      </main>

      <AddTypeModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        onConfirm={handleCreate}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
