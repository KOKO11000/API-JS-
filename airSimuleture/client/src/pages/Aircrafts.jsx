import AircraftModal from "../components/aircrfts/AircraftModal";
import DataTable from "../components/DataTable";
import Menu from "../components/home/Menu";
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

  return (
    <div className="min-h-screen">
      <Menu />

      <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <DataTable
          data={aircrafts}
          columns={columns}
          onAdd={openAddModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          title="Fleet Registry"
          subtitle="Every aircraft record uses the same type catalog and naming rules as the backend."
          addLabel="Add Aircraft"
        />
      </main>

      <AircraftModal
        key={`${modal.mode}-${modal.selectedAircraft?.id || "new"}`}
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
