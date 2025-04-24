import React from "react";
import { useTileStore } from "../store/useTileStore";

const VehicleSelector = () => {
  const drones = useTileStore((state) => state.drones || []); // Ensure drones is an array
  const targetVehicle = useTileStore((state) => state.targetVehicle); // Get target vehicle from the store
  const setSelectedVehicle = useTileStore((state) => state.setSelectedVehicle); // Setter for selected vehicle

  const handleSelect = (vehicle) => {
    if (vehicle) {
      setSelectedVehicle(vehicle); // Update the selected vehicle in the store
    }
  };

  return (
    <div className="vehicle-selector" style={{ position: "absolute", left: 10, top: 10, zIndex: 10 }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {targetVehicle && (
          <li>
            <button
              onClick={() => handleSelect({ id: "targetVehicle", type: "Vaisseau", ...targetVehicle })}
              style={{ marginBottom: "10px", padding: "10px", cursor: "pointer" }}
            >
              Vaisseau
            </button>
          </li>
        )}
        {drones.length > 0 ? (
          drones.map((drone) => (
            <li key={drone.id}>
              <button
                onClick={() => handleSelect({ id: drone.id, type: `Drone ${drone.id}`, ...drone })}
                style={{ marginBottom: "10px", padding: "10px", cursor: "pointer" }}
              >
                Drone {drone.id}
              </button>
            </li>
          ))
        ) : (
          <li>Aucun drone disponible</li>
        )}
      </ul>
    </div>
  );
};

export default VehicleSelector; // Add this line to export the component as default
