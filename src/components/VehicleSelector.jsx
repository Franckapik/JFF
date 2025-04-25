import React from "react";
import usePlayerStore from "../stores/usePlayerStore"; // Import player store

const VehicleSelector = () => {
  const players = usePlayerStore((state) => state.players); // Get all players
  const selectVehicle = usePlayerStore((state) => state.selectVehicle); // Function to select a vehicle

  const handleSelect = (playerId, vehicleId) => {
    selectVehicle(playerId, vehicleId); // Update the globally selected vehicle
  };

  return (
    <div className="vehicle-selector" style={{ position: "absolute", left: 10, top: 10, zIndex: 10 }}>
      <h3>Sélecteur de Véhicules</h3>
      {Object.entries(players).map(([playerId, player]) => (
        <div key={playerId} style={{ marginBottom: "20px" }}>
          <h4>Joueur: {playerId}</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button
                onClick={() => handleSelect(playerId, "ship")}
                style={{ marginBottom: "10px", padding: "10px", cursor: "pointer" }}
              >
                Vaisseau (Ship)
              </button>
            </li>
            {Array.isArray(player.vehicles.drones) && player.vehicles.drones.length > 0 ? (
              player.vehicles.drones.map((drone) => (
                <li key={drone.id}>
                  <button
                    onClick={() => handleSelect(playerId, drone.id)}
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
      ))}
    </div>
  );
};

export default VehicleSelector;
