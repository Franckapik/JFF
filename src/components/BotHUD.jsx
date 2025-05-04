import React from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore";

// Renommé de SimpleUserHUD à BotHUD
const BotHUD = () => {
  const botState = useBotStore((state) => state.botState);
  const isRunning = useBotStore((state) => state.isRunning);
  const actionQueue = useBotStore((state) => state.actionQueue) || []; // Ajout d'un tableau vide par défaut
  const players = usePlayerStore((state) => state.players);
  const player2Ship = players.player2?.vehicles?.ship;

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

  // Couleur selon la priorité de l'action
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 4: return "#FF0000"; // URGENT - Rouge
      case 3: return "#FFA500"; // HIGH - Orange
      case 2: return "#FFC107"; // MEDIUM - Jaune
      case 1: return "#4CAF50"; // LOW - Vert
      default: return "#777777"; // Gris par défaut
    }
  };
  
  // Nom lisible pour la priorité
  const getPriorityName = (priority) => {
    switch(priority) {
      case 4: return "URGENT";
      case 3: return "HAUTE";
      case 2: return "MOYENNE";
      case 1: return "BASSE";
      default: return "INCONNUE";
    }
  };

  return (
    <div className="bot-hud">
      <h3>Bot Status</h3>
      
      <div>
        <p>
          <strong>State:</strong> {botState || "Unknown"}
        </p>
        <p>
          <strong>Active:</strong> {isRunning ? "Yes" : "No"}
        </p>
      </div>
      
      {/* File d'actions prioritaires */}
      <div className="bot-hud-section">
        <h4>File d'actions ({actionQueue.length})</h4>
        {actionQueue.length === 0 ? (
          <p className="bot-hud-empty-actions">Aucune action planifiée</p>
        ) : (
          <ul className="bot-hud-action-list">
            {actionQueue.map((action, index) => (
              <li key={index} className="bot-hud-action-item" 
                  style={{borderLeft: `4px solid ${getPriorityColor(action.priority)}`}}>
                <span><strong>{action.type}</strong></span>
                <span className="bot-hud-priority-label" 
                      style={{color: getPriorityColor(action.priority)}}>
                  {getPriorityName(action.priority)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {player2Ship && (
        <div className="bot-hud-info">
          <h4>Ship Info:</h4>
          <p className="bot-hud-subinfo">
            <strong>Position:</strong> {player2Ship.coord || "Unknown"}
          </p>
          <p className="bot-hud-subinfo">
            <strong>Moving:</strong> {player2Ship.isMoving ? "Yes" : "No"}
          </p>
          
          {/* Section améliorée pour le carburant */}
          <div className="bot-hud-info">
            <p className="bot-hud-fuel-label">
              Fuel Level: {player2Ship.fuel}%
              {player2Ship.fuel < 50 && (
                <span className="bot-hud-fuel-warning">
                  (LOW!)
                </span>
              )}
            </p>
            <div className="bot-hud-fuel-container">
              <div className="bot-hud-fuel-bar" style={getFuelBarStyle(player2Ship.fuel)}></div>
            </div>
            <p className="bot-hud-fuel-info" 
               style={{color: player2Ship.fuel < 50 ? '#ff9800' : 'inherit'}}>
              {player2Ship.fuel < 50 
                ? "Threshold reached! Bot should return to base."
                : "Above 50% threshold, bot can explore."
              }
            </p>
          </div>
          
          {/* Informations supplémentaires */}
          {player2Ship.targetTile && player2Ship.targetTile.coord && (
            <p className="bot-hud-fuel-info">
              <strong>Target:</strong> {player2Ship.targetTile.coord}
            </p>
          )}
          
          {/* Section Base */}
          <p className="bot-hud-fuel-info">
            <strong>Base Coord:</strong> {player2Ship.startCoord || "Unknown"}
            {player2Ship.coord === player2Ship.startCoord && (
              <span className="bot-hud-at-base">(At Base!)</span>
            )}
          </p>
          
          {/* Section Ressources */}
          <div className="bot-hud-section">
            <p className="bot-hud-resources-title">Resources:</p>
            <ul className="bot-hud-resources-list">
              <li>Food: {player2Ship.resources?.food || 0}</li>
              <li>Debris: {player2Ship.resources?.debris || 0}</li>
              <li>Special: {player2Ship.resources?.special || 0}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotHUD;