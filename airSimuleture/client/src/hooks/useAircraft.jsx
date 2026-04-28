import { useEffect, useMemo, useState } from "react";
import {
  createAircraft,
  deleteAircraft,
  getAircrafts,
  updateAircraft,
} from "../api/flights";
import useAircraftTypes from "./useAircraftTypes";

function getAircraftTypeLabel(aircraft, aircraftTypes) {
  const matchingType = aircraftTypes.find(
    (type) =>
      String(type.id) === String(aircraft.aircraft_type) ||
      String(type.aircraftType).toLowerCase() === String(aircraft.aircraft_type).toLowerCase(),
  );

  return matchingType?.aircraftType || aircraft.aircraft_type || "Unassigned";
}

export default function useAircraft() {
  const [aircrafts, setAircrafts] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    mode: null,
    selectedAircraft: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { aircraftTypes, createAircraftType } = useAircraftTypes();

  async function fetchAircrafts() {
    try {
      const data = await getAircrafts();
      setAircrafts(data);
    } catch (error) {
      console.error("Failed to fetch aircrafts:", error);
    }
  }

  function openAddModal() {
    setModal({ isOpen: true, mode: "add", selectedAircraft: null });
  }

  function openEditModal(aircraft) {
    setModal({ isOpen: true, mode: "edit", selectedAircraft: aircraft });
  }

  function openDeleteModal(aircraft) {
    setModal({ isOpen: true, mode: "delete", selectedAircraft: aircraft });
  }

  function closeModal() {
    setModal({ isOpen: false, mode: null, selectedAircraft: null });
  }

  async function confirmAdd(newAircraft) {
    setIsLoading(true);
    try {
      const created = await createAircraft(newAircraft);
      setAircrafts((prev) => [...prev, created]);
      closeModal();
    } catch (error) {
      console.error("Failed to create aircraft:", error);
      alert("Failed to create aircraft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmEdit(updatedAircraft) {
    setIsLoading(true);
    try {
      const updated = await updateAircraft(modal.selectedAircraft.id, updatedAircraft);

      setAircrafts((prev) =>
        prev.map((aircraft) => (aircraft.id === modal.selectedAircraft.id ? updated : aircraft))
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update aircraft:", error);
      alert("Failed to update aircraft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    setIsLoading(true);
    try {
      await deleteAircraft(modal.selectedAircraft.id);
      setAircrafts((prev) => prev.filter((aircraft) => aircraft.id !== modal.selectedAircraft.id));
      closeModal();
    } catch (error) {
      console.error("Failed to delete aircraft:", error);
      alert("Failed to delete aircraft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleModalConfirm(data) {
    if (modal.mode === "add") {
      confirmAdd(data);
    } else if (modal.mode === "edit") {
      confirmEdit(data);
    } else if (modal.mode === "delete") {
      confirmDelete();
    }
  }

  async function handleAddType(typeData) {
    return createAircraftType(typeData);
  }

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const columns = useMemo(() => [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Type", key: "type" },
  ], []);

  const aircraftRows = useMemo(
    () =>
      aircrafts.map((aircraft) => ({
        ...aircraft,
        type: getAircraftTypeLabel(aircraft, aircraftTypes),
      })),
    [aircraftTypes, aircrafts],
  );

  return {
    aircrafts: aircraftRows,
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
  };
}
