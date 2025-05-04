import React from "react";
import usePlayerStore from "../stores/usePlayerStore";

const PlayerHUD = () => {
  const players = usePlayerStore((state) => state.players);
  const selectedVehicle = usePlayerStore((state) => state.selectedVehicle);
  const player1Ship = players.player1?.vehicles?.ship;

  // Style pour la barre de carburant
  const getFuelBarStyle = (fuelLevel) => {
    let color = "#4CAF50"; // Vert par défaut
    
    // Changement de couleur selon le niveau de carburant
    if (fuelLevel < 30) color = "#f44336"; // Rouge si très bas
    else if (fuelLevel < 50) color = "#ff9800"; // Orange si sous le seuil de 50%
    
    return {
      width: `${fuelLevel}%`,
      backgroundColor: color
    };
  };

  // Style pour les barres de ressources
  const getResourceBarStyle = (level, total = 50) => {
    // Calculer le pourcentage
    const percentage = Math.min(100, (level / total) * 100);
    
    let color = "#4CAF50"; // Vert par défaut
    if (level === 0) color = "#777777"; // Gris si aucune ressource
    else if (level > 35) color = "#2196F3"; // Bleu si beaucoup de ressources
    
    return {
      width: `${percentage}%`,
      backgroundColor: color,
      height: "8px",
      borderRadius: "4px"
    };
  };

  return (
    <div className="player-hud">
      <h3>Player Status</h3>
      
      <div>
        <p>
          <strong>Vehicle Selected:</strong> {selectedVehicle.vehicleId || "None"}
        </p>
        <p>
          <strong>Player ID:</strong> player1
        </p>
      </div>
      
      {/* Ressources globales du joueur */}
      <div className="player-hud-section">
        <h4>Total Resources</h4>
        <div className="player-hud-resource-item">
          <div className="player-hud-resource-label">
            <span>Food:</span> {players.player1?.score?.resources?.food || 0}
          </div>
          <div className="player-hud-resource-container">
            <div className="player-hud-resource-bar" 
                 style={getResourceBarStyle(players.player1?.score?.resources?.food || 0)}>
            </div>
          </div>
        </div>
        
        <div className="player-hud-resource-item">
          <div className="player-hud-resource-label">
            <span>Debris:</span> {players.player1?.score?.resources?.debris || 0}
          </div>
          <div className="player-hud-resource-container">
            <div className="player-hud-resource-bar" 
                 style={getResourceBarStyle(players.player1?.score?.resources?.debris || 0)}>
            </div>
          </div>
        </div>
        
        <div className="player-hud-resource-item">
          <div className="player-hud-resource-label">
            <span>Special:</span> {players.player1?.score?.resources?.special || 0}
          </div>
          <div className="player-hud-resource-container">
            <div className="player-hud-resource-bar" 
                 style={getResourceBarStyle(players.player1?.score?.resources?.special || 0)}>
            </div>
          </div>
        </div>
      </div>
      
      {player1Ship && (
        <div className="player-hud-info">
          <h4>Ship Info:</h4>
          <p className="player-hud-subinfo">
            <strong>Position:</strong> {player1Ship.coord || "Unknown"}
          </p>
          <p className="player-hud-subinfo">
            <strong>Moving:</strong> {player1Ship.isMoving ? "Yes" : "No"}
          </p>
          
          {/* Section pour le carburant */}
          <div className="player-hud-info">
            <p className="player-hud-fuel-label">
              Fuel Level: {player1Ship.fuel}%
              {player1Ship.fuel < 30 && (
                <span className="player-hud-fuel-warning">
                  (LOW!)
                </span>
              )}
            </p>
            <div className="player-hud-fuel-container">
              <div className="player-hud-fuel-bar" style={getFuelBarStyle(player1Ship.fuel)}></div>
            </div>
            <p className="player-hud-fuel-info" 
               style={{color: player1Ship.fuel < 30 ? '#ff9800' : 'inherit'}}>
              {player1Ship.fuel < 30 
                ? "Warning! Low fuel levels."
                : "Fuel level sufficient for exploration."
              }
            </p>
          </div>
          
          {/* Informations supplémentaires */}
          {player1Ship.targetTile && player1Ship.targetTile.coord && (
            <p className="player-hud-fuel-info">
              <strong>Target:</strong> {player1Ship.targetTile.coord}
            </p>
          )}
          
          {/* Section Base */}
          <p className="player-hud-fuel-info">
            <strong>Base Coord:</strong> {player1Ship.startCoord || "Unknown"}
            {player1Ship.coord === player1Ship.startCoord && (
              <span className="player-hud-at-base">(At Base!)</span>
            )}
          </p>
          
          {/* Section Damage */}
          <div className="player-hud-info">
            <p className="player-hud-damage-label">
              Damage Level: {player1Ship.damage || 0}%
              {player1Ship.damage > 50 && (
                <span className="player-hud-damage-warning">
                  (CRITICAL!)
                </span>
              )}
            </p>
            <div className="player-hud-damage-container">
              <div 
                className="player-hud-damage-bar" 
                style={{
                  width: `${player1Ship.damage || 0}%`,
                  backgroundColor: player1Ship.damage > 50 ? '#f44336' : '#ff9800'
                }}
              ></div>
            </div>
          </div>
          
          {/* Section Ressources du vaisseau */}
          <div className="player-hud-section">
            <p className="player-hud-resources-title">Ship Resources:</p>
            <ul className="player-hud-resources-list">
              <li>Food: {player1Ship.resources?.food || 0}</li>
              <li>Debris: {player1Ship.resources?.debris || 0}</li>
              <li>Special: {player1Ship.resources?.special || 0}</li>
            </ul>
            <p>
              <strong>At Capacity:</strong> {player1Ship.isAtCapacity ? "Yes" : "No"}
            </p>
          </div>
        </div>
      )}
      
      {/* Section pour les drones */}
      <div className="player-hud-section">
        <h4>Drones Status</h4>
        {Object.entries(players.player1?.vehicles || {})
          .filter(([key, vehicle]) => key.includes('drone') && vehicle)
          .map(([droneId, drone]) => (
            <div key={droneId} className="player-hud-drone">
              <p><strong>{droneId}:</strong> {drone.isMoving ? "Active" : "Idle"}</p>
              {drone.targetTile && (
                <p className="player-hud-drone-target">
                  Target: {drone.targetTile.coord}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlayerHUD;