import React from "react";
import { useTileStore } from "../stores/useNewTileStore"; // Import tile store
import usePlayerStore from "../stores/usePlayerStore"; // Import player store
import useBotStore from "../stores/useBotStore"; // Import BotStore
import "../styles/App.css"; // Import CSS for styling

const UserHUD = () => {
  const players = usePlayerStore((state) => state.players); // Get all players
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle); // Get globally selected vehicle
  const { state: botState, targetTile: botTargetTile } = useBotStore(); // Get bot state and target tile

  // Récupérer le véhicule sélectionné
  const vehicle =
    selectedVehicle.playerId && selectedVehicle.vehicleId
      ? selectedVehicle.vehicleId === "ship"
        ? players[selectedVehicle.playerId].vehicles.ship // Accès direct si c'est un ship
        : players[selectedVehicle.playerId].vehicles.drones.find(
            (drone) => drone.id === selectedVehicle.vehicleId
          ) // Recherche dans le tableau si c'est un drone
      : null;

  // Récupérer la tuile cible du véhicule sélectionné
  const targetTile = vehicle?.targetTile?.coord
    ? useTileStore.getState().tiles[vehicle.targetTile.coord]
    : null;

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

      {/* Section: Selected Vehicle */}
      <div className="hud-column">
        <h3>Véhicule Sélectionné</h3>
        {selectedVehicle.playerId && selectedVehicle.vehicleId ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>Joueur :</strong> {selectedVehicle.playerId}
            </li>
            <li>
              <strong>Véhicule :</strong> {selectedVehicle.vehicleId}
            </li>
          </ul>
        ) : (
          <p>Aucun véhicule sélectionné</p>
        )}
      </div>

      {/* Section: Players Information */}
      {Object.entries(players).map(([playerId, player]) => (
        <div className="hud-column" key={playerId}>
          <h3>Informations Joueur: {playerId}</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <strong>Véhicule (Ship):</strong>
              <ul>
                <li>
                  <strong>Position:</strong>{" "}
                  {player.vehicles.ship.position
                    ? `x: ${player.vehicles.ship.position.x.toFixed(2)}, y: ${player.vehicles.ship.position.y.toFixed(
                        2
                      )}, z: ${player.vehicles.ship.position.z.toFixed(2)} (Coord: ${player.vehicles.ship.coord})`
                    : "N/A"}
                </li>
                <li>
                  <strong>En Mouvement:</strong> {player.vehicles.ship.isMoving ? "Oui" : "Non"}
                </li>
                <li>
                  <strong>Progression:</strong> {player.vehicles.ship.progress}%
                </li>
                <li>
                  <strong>Carburant:</strong> {player.vehicles.ship.fuel}%
                </li>
                <li>
                  <strong>Dommages:</strong> {player.vehicles.ship.damage}%
                </li>
                <li>
                  <strong>Ressources:</strong>
                  <ul>
                    <li>
                      <strong>Nourriture:</strong> {player.vehicles.ship.resources.food || 0}
                    </li>
                    <li>
                      <strong>Débris:</strong> {player.vehicles.ship.resources.debris || 0}
                    </li>
                    <li>
                      <strong>Spécial:</strong> {player.vehicles.ship.resources.special || 0}
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <strong>Ressources Joueur:</strong>
              <ul>
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
            </li>
          </ul>
        </div>
      ))}

      {/* Section: Bot Information */}
      <div className="hud-column">
        <h3>Informations du Bot</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <strong>État :</strong> {botState}
          </li>
          <li>
            <strong>Tuile Cible :</strong> 
            {Array.isArray(botTargetTile) ? botTargetTile.join(", ") : botTargetTile || "Aucune"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserHUD;
