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

  /**
   * Vérifie si un objet est un véhicule valide
   * @param {Object} vehicle - L'objet à vérifier
   * @param {string} key - La clé de l'objet
   * @returns {boolean} - true si c'est un véhicule, false sinon
   */
  const isVehicle = (vehicle, key) => {
    return vehicle && typeof vehicle === 'object' && vehicle.id && key !== 'drones';
  };

  /**
   * Détermine si un véhicule est sélectionné
   * @param {string} playerId - ID du joueur
   * @param {string} vehicleId - ID du véhicule
   * @returns {boolean} - true si le véhicule est sélectionné
   */
  const isSelected = (playerId, vehicleId) => {
    return selectedVehicle.playerId === playerId && selectedVehicle.vehicleId === vehicleId;
  };

  return (
    <div className="vehicle-selector" style={{ position: "absolute", left: 10, top: 10, zIndex: 10 }}>
      <h3>Sélecteur de Véhicules</h3>
      {Object.entries(players).map(([playerId, player]) => (
        <div key={playerId} style={{ marginBottom: "20px" }}>
          <h4>Joueur: {playerId}</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {/* Afficher tous les véhicules dans l'objet vehicles */}
            {Object.entries(player.vehicles).map(([vehicleKey, vehicle]) => {
              // Vérifier si c'est un véhicule valide (avec un ID)
              if (isVehicle(vehicle, vehicleKey)) {
                const displayName = vehicleKey === 'ship' 
                  ? 'Vaisseau (Ship)' 
                  : `Drone ${vehicle.id}`;
                  
                return (
                  <li key={vehicleKey}>
                    <button
                      onClick={() => handleSelect(playerId, vehicleKey)}
                      style={{
                        marginBottom: "10px",
                        padding: "10px",
                        cursor: "pointer",
                        backgroundColor: isSelected(playerId, vehicleKey) ? "yellow" : "#f0f0f0",
                        color: "black",
                        border: "1px solid black",
                      }}
                    >
                      {displayName}
                    </button>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default VehicleSelector;
