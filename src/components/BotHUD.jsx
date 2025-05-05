import React, { useState } from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore";
import { useTileStore } from "../stores/useNewTileStore";

// Renommé de SimpleUserHUD à BotHUD
const BotHUD = () => {
  const botState = useBotStore((state) => state.botState);
  const isRunning = useBotStore((state) => state.isRunning);
  const actionQueue = useBotStore((state) => state.actionQueue) || []; // Ajout d'un tableau vide par défaut
  const players = usePlayerStore((state) => state.players);
  const player2Ship = players.player2?.vehicles?.ship;
  const botMemory = players.player2?.memory;
  
  // Récupérer la fonction calculateDistance du TileStore
  const calculateDistance = useTileStore((state) => state.calculateDistance);
  
  // États locaux pour les onglets de mémoire du bot
  const [activeTab, setActiveTab] = useState('resources'); // 'resources', 'collected', ou 'dangers'

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
  
  // Obtenir une couleur pour les ressources en fonction de leur quantité
  const getResourceColor = (quantity) => {
    if (quantity > 50) return "#4CAF50"; // Vert pour beaucoup
    if (quantity > 20) return "#FFC107"; // Jaune pour moyen
    return "#ff9800"; // Orange pour peu
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
        <p>
          <strong>Explorations:</strong> {botMemory?.explorationCount || 0}
        </p>
      </div>
      
      {/* NOUVELLE SECTION - Mémoire du bot */}
      <div className="bot-hud-section bot-memory-section">
        <h4>Bot Memory</h4>
        
        {/* Onglets pour choisir le type de mémoire à afficher */}
        <div className="bot-memory-tabs">
          <button 
            className={`bot-memory-tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}>
            Resources ({botMemory?.knownResources?.length || 0})
          </button>
          <button 
            className={`bot-memory-tab ${activeTab === 'collected' ? 'active' : ''}`}
            onClick={() => setActiveTab('collected')}>
            Collected ({botMemory?.collectedResources?.length || 0})
          </button>
          <button 
            className={`bot-memory-tab ${activeTab === 'dangers' ? 'active' : ''}`}
            onClick={() => setActiveTab('dangers')}>
            Dangers ({botMemory?.knownDangers?.length || 0})
          </button>
        </div>
        
        {/* Contenu des onglets */}
        <div className="bot-memory-content">
          {/* Onglet des ressources découvertes */}
          {activeTab === 'resources' && (
            <>
              {(!botMemory?.knownResources || botMemory.knownResources.length === 0) ? (
                <p className="bot-memory-empty">Aucune ressource découverte</p>
              ) : (
                <div className="bot-memory-table-container">
                  <table className="bot-memory-table">
                    <thead>
                      <tr>
                        <th>Coord</th>
                        <th>Tiles</th>
                        <th>Food</th>
                        <th>Debris</th>
                        <th>Special</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botMemory.knownResources.map((resource, index) => (
                        <tr key={index}>
                          <td>{resource.coord}</td>
                          <td>{calculateDistance(player2Ship?.coord, resource.coord, true, true)}</td>
                          <td style={{color: getResourceColor(resource.resources?.food || 0)}}>
                            {resource.resources?.food || 0}
                          </td>
                          <td style={{color: getResourceColor(resource.resources?.debris || 0)}}>
                            {resource.resources?.debris || 0}
                          </td>
                          <td style={{color: getResourceColor(resource.resources?.special || 0) * 10}}>
                            {resource.resources?.special || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          
          {/* Nouvel onglet des ressources collectées */}
          {activeTab === 'collected' && (
            <>
              {(!botMemory?.collectedResources || botMemory.collectedResources.length === 0) ? (
                <p className="bot-memory-empty">Aucune ressource collectée</p>
              ) : (
                <div className="bot-memory-table-container">
                  <table className="bot-memory-table">
                    <thead>
                      <tr>
                        <th>Coord</th>
                        <th>Food</th>
                        <th>Debris</th>
                        <th>Special</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botMemory.collectedResources.map((resource, index) => (
                        <tr key={index}>
                          <td>{resource.coord}</td>
                          <td style={{color: getResourceColor(resource.resources?.food || 0)}}>
                            {resource.resources?.food || 0}
                          </td>
                          <td style={{color: getResourceColor(resource.resources?.debris || 0)}}>
                            {resource.resources?.debris || 0}
                          </td>
                          <td style={{color: getResourceColor(resource.resources?.special || 0) * 10}}>
                            {resource.resources?.special || 0}
                          </td>
                          <td>{resource.collectedAt ? 
                              new Date(resource.collectedAt).toLocaleTimeString() : 
                              'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
          
          {/* Onglet des dangers détectés */}
          {activeTab === 'dangers' && (
            <>
              {(!botMemory?.knownDangers || botMemory.knownDangers.length === 0) ? (
                <p className="bot-memory-empty">Aucun danger détecté</p>
              ) : (
                <div className="bot-memory-table-container">
                  <table className="bot-memory-table">
                    <thead>
                      <tr>
                        <th>Coord</th>
                        <th>Tiles</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {botMemory.knownDangers.map((danger, index) => (
                        <tr key={index}>
                          <td>{danger.coord}</td>
                          <td>{calculateDistance(player2Ship?.coord, danger.coord, true, true)}</td>
                          <td>{danger.type || 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
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