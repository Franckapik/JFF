import React from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useSimpleBotStore from "../stores/useSimpleBotStore";

// Composant HUD simplifié qui se concentre uniquement sur l'état du SimpleBot
const SimpleUserHUD = () => {
  const botState = useSimpleBotStore((state) => state.botState);
  const isRunning = useSimpleBotStore((state) => state.isRunning);
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

  return (
    <div className="simple-user-hud" style={{
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
      <h3 style={{ margin: '0 0 10px 0' }}>Simple Bot Status</h3>
      
      <div>
        <p style={{ margin: '5px 0' }}>
          <strong>State:</strong> {botState}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Active:</strong> {isRunning ? "Yes" : "No"}
        </p>
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

export default SimpleUserHUD;