import React from "react";
import usePlayerStore from "../../stores/playerStore";

const VehicleSelector = () => {
  const players = usePlayerStore((state) => state.players); // Get all players
  const selectVehicle = usePlayerStore((state) => state.selectVehicle); // Function to select a vehicle
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Get the globally selected vehicle

  const handleSelect = (playerId, vehicleId) => {
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

  // On ne traite que le player1
  const player = players.player1;

  return (
    <div className="vehicle-selector vehicle-selector-container" style={{ height: "auto", width: "120px" }}>
      <h3>Véhicules</h3>
      <ul className="vehicle-selector-list">
        {/* Afficher tous les véhicules du player1 */}
        {Object.entries(player.vehicles).map(([vehicleKey, vehicle]) => {
          // Vérifier si c'est un véhicule valide (avec un ID)
          if (isVehicle(vehicle, vehicleKey)) {
            const displayName = vehicleKey === 'ship' 
              ? 'Vaisseau' 
              : `Drone ${vehicle.id.slice(-1)}`;
              
            return (
              <li key={vehicleKey}>
                <button
                  onClick={() => handleSelect('player1', vehicleKey)}
                  className={isSelected('player1', vehicleKey) ? "selected" : ""}
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
  );
};

export default VehicleSelector;
