import React from "react";
import usePlayerStore from "../stores/usePlayerStore"; // Import player store

const VehicleSelector = () => {
  const players = usePlayerStore((state) => state.players); // Get all players
  const selectVehicle = usePlayerStore((state) => state.selectVehicle); // Function to select a vehicle
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Get the globally selected vehicle

  const handleSelect = (playerId, vehicleId) => {
    if (playerId === "player2") {
      console.warn("Manual selection is disabled for player 2 (autonomous bot).");
      return; // Prevent manual selection for player 2
    }
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
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === "ship"
                      ? "yellow"
                      : "#f0f0f0", // Use a light gray color for unselected buttons
                  color: "black", // Ensure text is always black for readability
                  border: "1px solid black",
                }}
              >
                Vaisseau (Ship)
              </button>
            </li>
            {Array.isArray(player.vehicles.drones) && player.vehicles.drones.length > 0 ? (
              player.vehicles.drones.map((drone) => (
                <li key={drone.id}>
                  <button
                    onClick={() => handleSelect(playerId, drone.id)}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === drone.id
                          ? "yellow"
                          : "#f0f0f0", // Use a light gray color for unselected buttons
                      color: "black", // Ensure text is always black for readability
                      border: "1px solid black",
                    }}
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
