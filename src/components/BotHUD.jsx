import React from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useSimpleBotStore from "../stores/useSimpleBotStore";

// Renommé de SimpleUserHUD à BotHUD
const BotHUD = () => {
  const botState = useSimpleBotStore((state) => state.botState);
  const isRunning = useSimpleBotStore((state) => state.isRunning);
  const actionQueue = useSimpleBotStore((state) => state.actionQueue);
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
      backgroundColor: color,
      height: "20px",
      borderRadius: "3px",
      transition: "width 0.3s ease-in-out"
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
    <div className="bot-hud" style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif',
      width: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Bot Status</h3>
      
      <div>
        <p style={{ margin: '5px 0' }}>
          <strong>State:</strong> {botState}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Active:</strong> {isRunning ? "Yes" : "No"}
        </p>
      </div>
      
      {/* File d'actions prioritaires */}
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ margin: '0 0 5px 0' }}>File d'actions ({actionQueue.length})</h4>
        {actionQueue.length === 0 ? (
          <p style={{ fontSize: '0.9em', fontStyle: 'italic' }}>Aucune action planifiée</p>
        ) : (
          <ul style={{ 
            listStyleType: 'none', 
            padding: '0', 
            margin: '0',
            maxHeight: '120px',
            overflowY: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '4px',
            padding: '5px'
          }}>
            {actionQueue.map((action, index) => (
              <li key={index} style={{
                padding: '5px',
                margin: '2px 0',
                borderLeft: `4px solid ${getPriorityColor(action.priority)}`,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.9em',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span><strong>{action.type}</strong></span>
                <span style={{
                  color: getPriorityColor(action.priority),
                  fontWeight: 'bold'
                }}>
                  {getPriorityName(action.priority)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {player2Ship && (
        <div style={{ marginTop: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0' }}>Ship Info:</h4>
          <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
            <strong>Position:</strong> {player2Ship.coord || "Unknown"}
          </p>
          <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
            <strong>Moving:</strong> {player2Ship.isMoving ? "Yes" : "No"}
          </p>
          
          {/* Section améliorée pour le carburant */}
          <div style={{ marginTop: '10px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              Fuel Level: {player2Ship.fuel}%
              {player2Ship.fuel < 50 && (
                <span style={{ marginLeft: '5px', color: '#ff9800' }}>
                  (LOW!)
                </span>
              )}
            </p>
            <div style={{ 
              backgroundColor: "#ddd", 
              borderRadius: "3px", 
              height: "20px",
              marginTop: "5px"
            }}>
              <div style={getFuelBarStyle(player2Ship.fuel)}></div>
            </div>
            <p style={{ 
              margin: '5px 0', 
              fontSize: '0.8em', 
              color: player2Ship.fuel < 50 ? '#ff9800' : 'inherit'
            }}>
              {player2Ship.fuel < 50 
                ? "Threshold reached! Bot should return to base."
                : "Above 50% threshold, bot can explore."
              }
            </p>
          </div>
          
          {/* Informations supplémentaires */}
          {player2Ship.targetTile && player2Ship.targetTile.coord && (
            <p style={{ margin: '10px 0', fontSize: '0.9em' }}>
              <strong>Target:</strong> {player2Ship.targetTile.coord}
            </p>
          )}
          
          {/* Section Base */}
          <p style={{ margin: '10px 0', fontSize: '0.9em' }}>
            <strong>Base Coord:</strong> {player2Ship.startCoord || "Unknown"}
            {player2Ship.coord === player2Ship.startCoord && (
              <span style={{ marginLeft: '5px', color: '#4CAF50' }}>(At Base!)</span>
            )}
          </p>
          
          {/* Section Ressources */}
          <div style={{ marginTop: '10px' }}>
            <p style={{ margin: '0', fontWeight: 'bold' }}>Resources:</p>
            <ul style={{ 
              paddingLeft: '20px', 
              margin: '5px 0', 
              fontSize: '0.9em'
            }}>
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