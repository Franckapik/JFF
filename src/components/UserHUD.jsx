import React from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import useBotStore from "../stores/useBotStore"; // Import BotStore
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const players = usePlayerStore((state) => state.players); // Get all players
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Get globally selected vehicle
  const botState = useBotStore(state => state.bots?.player2?.ship?.currentState || 'unknown');
  const botTargetTile = useBotStore(state => state.bots?.player2?.ship?.targetTile);

  // Adapter pour la nouvelle structure de véhicules
  const vehicle =
    selectedVehicle.playerId && selectedVehicle.vehicleId
      ? players[selectedVehicle.playerId]?.vehicles[selectedVehicle.vehicleId]
      : null;

  // Récupérer la tuile cible du véhicule sélectionné
  const targetTile = vehicle?.targetTile?.coord
    ? useTileStore.getState().tiles[vehicle.targetTile.coord]
    : null;

  /**
   * Vérifie si un objet est un véhicule valide
   * @param {Object} vehicle - L'objet à vérifier
   * @param {string} key - La clé de l'objet
   * @returns {boolean} - true si c'est un véhicule, false sinon
   */
  const isVehicle = (vehicle, key) => {
    return vehicle && typeof vehicle === 'object' && vehicle.id && key !== 'drones';
  };

  return (
    <div className="user-hud">
      {/* Section: Tile Information */}
      <div className="hud-column">
        <h3>Tuile Cible</h3>
        {targetTile ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>Coord :</strong> {targetTile.coord || "N/A"}
            </li>
            <li>
              <strong>Position :</strong> x: {targetTile.position?.x.toFixed(2) || "N/A"}, y:{" "}
              {targetTile.position?.y.toFixed(2) || "N/A"}, z: {targetTile.position?.z.toFixed(2) || "N/A"}
            </li>
            <li>
              <strong>Type :</strong> {targetTile.type || "N/A"}
            </li>
            <li>
              <strong>Walkable :</strong> {targetTile.walkable ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Explored :</strong> {targetTile.explored ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Collected :</strong> {targetTile.collected ? "Oui" : "Non"}
            </li>
            <li>
              <strong>Neighbors :</strong> {targetTile.neighbors?.join(", ") || "N/A"}
            </li>
            <li>
              <strong>Resources:</strong>
              <ul>
                <li>
                  <strong>Food:</strong> {targetTile.resources?.food || 0}
                </li>
                <li>
                  <strong>Debris:</strong> {targetTile.resources?.debris || 0}
                </li>
                <li>
                  <strong>Special:</strong> {targetTile.resources?.special || 0}
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          <p>Aucune tuile cible</p> // Message when no target tile is set
        )}
      </div>

      {/* Section: Players Information */}
      {Object.entries(players).map(([playerId, player]) => (
        <div className="hud-column" key={playerId}>
          <h3>Informations Joueur: {playerId}</h3>
          <div className="scrollable-content">
            <h4>Véhicules:</h4>
            {Object.entries(player.vehicles).map(([vehicleId, vehicle]) => {
              if (isVehicle(vehicle, vehicleId)) {
                return (
                  <div key={vehicleId} style={{ marginBottom: "15px" }}>
                    <h5>{vehicleId === 'ship' ? 'Vaisseau' : `Drone ${vehicle.id}`}</h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      <li>
                        <strong>Position:</strong>{" "}
                        {vehicle.position
                          ? `x: ${vehicle.position.x.toFixed(2)}, y: ${vehicle.position.y.toFixed(
                              2
                            )}, z: ${vehicle.position.z.toFixed(2)} (Coord: ${vehicle.coord})`
                          : "N/A"}
                      </li>
                      <li>
                        <strong>En Mouvement:</strong> {vehicle.isMoving ? "Oui" : "Non"}
                      </li>
                      <li>
                        <strong>Progression:</strong> {vehicle.progress}%
                      </li>
                      <li>
                        <strong>Carburant:</strong> {vehicle.fuel || "N/A"}%
                      </li>
                      <li>
                        <strong>Dommages:</strong> {vehicle.damage || "N/A"}%
                      </li>
                      <li>
                        <strong>Ressources:</strong>
                        <ul>
                          <li>
                            <strong>Nourriture:</strong> {vehicle.resources?.food || 0}
                          </li>
                          <li>
                            <strong>Débris:</strong> {vehicle.resources?.debris || 0}
                          </li>
                          <li>
                            <strong>Spécial:</strong> {vehicle.resources?.special || 0}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                );
              }
              return null;
            })}

            <h4>Ressources Joueur:</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <strong>Nourriture:</strong> {player.score.resources.food}
              </li>
              <li>
                <strong>Débris:</strong> {player.score.resources.debris}
              </li>
              <li>
                <strong>Spécial:</strong> {player.score.resources.special}
              </li>
            </ul>
          </div>
        </div>
      ))}

      {/* Section: Bot Information */}
      <div className="hud-column">
        <h3>Informations du Bot</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>État :</strong> {botState || 'Non défini'}
          </li>
          <li>
            <strong>Tuile Cible :</strong> 
            {botTargetTile ? 
              (typeof botTargetTile === 'string' ? 
                botTargetTile : 
                botTargetTile.coord || 'Format inconnu'
              ) : 
              'Aucune'
            }
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserHUD;
