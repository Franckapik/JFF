import React from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useSimpleBotStore from "../stores/useSimpleBotStore";

// Composant HUD simplifié qui se concentre uniquement sur l'état du SimpleBot
const SimpleUserHUD = () => {
  const botState = useSimpleBotStore((state) => state.botState);
  const isRunning = useSimpleBotStore((state) => state.isRunning);
  const players = usePlayerStore((state) => state.players);
  const player2Ship = players.player2?.vehicles?.ship;

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
      width: '250px'
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
          <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
            <strong>Fuel:</strong> {player2Ship.fuel}%
          </p>
          {player2Ship.targetTile && player2Ship.targetTile.coord && (
            <p style={{ margin: '3px 0', fontSize: '0.9em' }}>
              <strong>Target:</strong> {player2Ship.targetTile.coord}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleUserHUD;