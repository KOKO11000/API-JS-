/**
 * Aircrafts Page - Fleet Management Interface
 * 
 * Purpose: Manage the aircraft inventory of the organization
 * 
 * Features:
 * - View all aircraft in a data table (sortable, searchable)
 * - Add new aircraft with name, designation, and type assignment
 * - Edit existing aircraft properties
 * - Delete aircraft from the inventory
 * - Assign aircraft types to ensure proper classification
 * 
 * Data Integrity:
 * - Each aircraft must have a valid aircraft type
 * - Aircraft cannot be deleted if active flights exist
 * - Aircraft cannot be unassigned from types
 */

import Menu from "../components/home/Menu";
import DataTable from "../components/DataTable";
import AircraftModal from "../components/aircrfts/AircraftModal";
import useAircraft from "../hooks/useAircraft";

export default function Aircrafts() {
  const {
    aircrafts,
    aircraftTypes,
    columns,
    modal,
    isLoading,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleModalConfirm,
    handleAddType,
  } = useAircraft();

  const data = aircrafts.map((a) => ({
    ...a,
    type: a.aircraft_type || "Unknown",
  }));

  const handleAdd = () => {
    openAddModal();
  };

  const handleEdit = (aircraft) => {
    openEditModal(aircraft);
  };

  const handleDelete = (aircraft) => {
    openDeleteModal(aircraft);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Menu />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">Combat Aircraft Fleet</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Explore our collection of fighter aircraft available in the flight simulation
              platform. From agile fighters to advanced stealth planes, discover the
              variety of aircraft and find the perfect one for your flying experience.
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

      <AircraftModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        aircraft={modal.selectedAircraft}
        aircraftTypes={aircraftTypes}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        isLoading={isLoading}
        onAddType={handleAddType}
      />
    </div>
  );
}
