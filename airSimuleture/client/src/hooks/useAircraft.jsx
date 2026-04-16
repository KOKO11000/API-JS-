import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import useAircraftTypes from "./useAircraftTypes";

const initialAircraft = {
  name: "",
  aircraft_type: "",
};

export default function useAircraft() {
  const [aircrafts, setAircrafts] = useState([]);
  const [fields, setFields] = useState({ ...initialAircraft });
  const [modal, setModal] = useState({
    isOpen: false,
    mode: null, // 'add', 'edit', 'delete'
    selectedAircraft: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Use aircraft types hook
  const { aircraftTypes, createAircraftType, isLoading: typesLoading } = useAircraftTypes();

  async function fetchAircrafts() {
    try {
      const data = (await axios.get("http://localhost:5000/aircrafts")).data;
      setAircrafts(data);
    } catch (error) {
      console.error("Failed to fetch aircrafts:", error);
    }
  }

  function openAddModal() {
    setFields({ ...initialAircraft });
    setModal({ isOpen: true, mode: "add", selectedAircraft: null });
  }

  function openEditModal(aircraft) {
    setFields({
      id: aircraft.id,
      name: aircraft.name,
      aircraft_type: aircraft.aircraft_type,
    });
    setModal({ isOpen: true, mode: "edit", selectedAircraft: aircraft });
  }

  function openDeleteModal(aircraft) {
    setFields({ id: aircraft.id, ...aircraft });
    setModal({ isOpen: true, mode: "delete", selectedAircraft: aircraft });
  }

  function closeModal() {
    setModal({ isOpen: false, mode: null, selectedAircraft: null });
    setFields({ ...initialAircraft });
  }

  async function confirmAdd(newAircraft) {
    setIsLoading(true);
    try {
      const created = (
        await axios.post("http://localhost:5000/aircrafts", newAircraft)
      ).data;
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
      const updated = (
        await axios.put(
          `http://localhost:5000/aircrafts/${fields.id}`,
          updatedAircraft
        )
      ).data;

      setAircrafts((prev) =>
        prev.map((a) => (a.id === fields.id ? updated : a))
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
      await axios.delete(`http://localhost:5000/aircrafts/${fields.id}`);
      setAircrafts((prev) => prev.filter((a) => a.id !== fields.id));
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
    try {
      const newType = await createAircraftType(typeData);
      // Auto-select the newly created type
      setFields((prev) => ({
        ...prev,
        aircraft_type: newType.id,
      }));
      return newType;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    (async () => await fetchAircrafts())();
  }, []);

  const columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Type", key: "type" },
  ];

  return {
    aircrafts,
    aircraftTypes,
    columns,
    fields,
    setFields,
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
