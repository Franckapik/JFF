import React, { useState } from "react";
import usePlayerStore from "../stores/usePlayerStore";
import useBotStore from "../stores/useBotStore";
import { useTileStore } from "../stores/useNewTileStore";

// Renommé de SimpleUserHUD à BotHUD
const BotHUD = () => {
  const botState = useBotStore((state) => state.botState);
  const isRunning = useBotStore((state) => state.isRunning);
  const actionQueue = useBotStore((state) => state.actionQueue) || []; // Ajout d'un tableau vide par défaut
  const completedActions = useBotStore((state) => state.completedActions) || []; // Récupération des actions terminées
  const clearCompletedActions = useBotStore((state) => state.clearCompletedActions); // Fonction pour vider l'historique
  const players = usePlayerStore((state) => state.players);
  const player2Ship = players.player2?.vehicles?.ship;
  const botMemory = players.player2?.memory;
  
  // Récupérer la fonction calculateDistance du TileStore
  const calculateDistance = useTileStore((state) => state.calculateDistance);
  
  // États locaux pour les onglets de mémoire du bot
  const [activeMemoryTab, setActiveMemoryTab] = useState('resources'); // 'resources', 'collected' ou 'dangers'
  
  // Nouvel état local pour les onglets des actions
  const [activeActionTab, setActiveActionTab] = useState('queue'); // 'queue' ou 'completed'

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

  // Style pour la barre de ressources
  const getResourceBarStyle = (level, total = 100) => {
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
  
  // Couleur spéciale pour les ressources rares (special)
  const getSpecialResourceColor = (quantity) => {
    if (quantity > 0) return "#673AB7"; // Violet pour les ressources spéciales
    return "#777777"; // Gris pour aucune
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
            className={`bot-memory-tab ${activeMemoryTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveMemoryTab('resources')}>
            Resources ({botMemory?.knownResources?.length || 0})
          </button>
          <button 
            className={`bot-memory-tab ${activeMemoryTab === 'collected' ? 'active' : ''}`}
            onClick={() => setActiveMemoryTab('collected')}>
            Collected ({botMemory?.collectedResources?.length || 0})
          </button>
          <button 
            className={`bot-memory-tab ${activeMemoryTab === 'dangers' ? 'active' : ''}`}
            onClick={() => setActiveMemoryTab('dangers')}>
            Dangers ({botMemory?.knownDangers?.length || 0})
          </button>
        </div>
        
        {/* Contenu des onglets */}
        <div className="bot-memory-content">
          {/* Onglet des ressources découvertes */}
          {activeMemoryTab === 'resources' && (
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
                          <td style={{color: getSpecialResourceColor(resource.resources?.special || 0)}}>
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
          {activeMemoryTab === 'collected' && (
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
                          <td style={{color: getSpecialResourceColor(resource.resources?.special || 0)}}>
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
          {activeMemoryTab === 'dangers' && (
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
        <h4>File d'actions</h4>
        
        {/* Onglets pour choisir le type d'actions à afficher */}
        <div className="bot-action-tabs">
          <button 
            className={`bot-action-tab ${activeActionTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveActionTab('queue')}>
            Queue ({actionQueue.length})
          </button>
          <button 
            className={`bot-action-tab ${activeActionTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveActionTab('completed')}>
            Completed ({completedActions.length})
          </button>
        </div>
        
        {/* Contenu des onglets */}
        <div className="bot-action-content">
          {/* Onglet de la file d'attente */}
          {activeActionTab === 'queue' && (
            <>
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
            </>
          )}
          
          {/* Nouvel onglet des actions terminées */}
          {activeActionTab === 'completed' && (
            <>
              {completedActions.length === 0 ? (
                <p className="bot-hud-empty-actions">Aucune action terminée</p>
              ) : (
                <ul className="bot-hud-action-list">
                  {completedActions.map((action, index) => (
                    <li key={index} className="bot-hud-action-item" 
                        style={{borderLeft: `4px solid ${getPriorityColor(action.priority)}`}}>
                      <span><strong>{action.type}</strong></span>
                      <span className="bot-hud-priority-label" 
                            style={{color: getPriorityColor(action.priority)}}>
                        {getPriorityName(action.priority)}
                      </span>
                      <span className="bot-hud-action-timestamp">
                        {new Date(action.completedAt).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={clearCompletedActions} className="bot-hud-clear-completed">
                Clear Completed Actions
              </button>
            </>
          )}
        </div>
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
          

          {/* Section Ressources du vaisseau avec barres de progression */}
          <div className="bot-hud-section">
            <h4 className="bot-hud-resources-title">Ship Resources:</h4>
            
            {/* Food Resource */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Food:</span> {player2Ship.resources?.food || 0}/{player2Ship.maxCapacity?.food || 100}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(player2Ship.resources?.food || 0, player2Ship.maxCapacity?.food || 100)}
                ></div>
              </div>
            </div>
            
            {/* Debris Resource */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Debris:</span> {player2Ship.resources?.debris || 0}/{player2Ship.maxCapacity?.debris || 1000}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(player2Ship.resources?.debris || 0, player2Ship.maxCapacity?.debris || 1000)}
                ></div>
              </div>
            </div>
            
            {/* Special Resource */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Special:</span> {player2Ship.resources?.special || 0}/{player2Ship.maxCapacity?.special || 2}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(player2Ship.resources?.special || 0, player2Ship.maxCapacity?.special || 2)}
                ></div>
              </div>
            </div>
            
            <p>
              <strong>At Capacity:</strong> {player2Ship.isAtCapacity ? "Yes" : "No"}
            </p>
          </div>
          
          {/* Section pour le score total du joueur */}
          <div className="bot-hud-section">
            <h4 className="bot-hud-resources-title">Total Score:</h4>
            
            {/* Food Total */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Food:</span> {players.player2?.score?.resources?.food || 0}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(players.player2?.score?.resources?.food || 0, 100)}
                ></div>
              </div>
            </div>
            
            {/* Debris Total */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Debris:</span> {players.player2?.score?.resources?.debris || 0}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(players.player2?.score?.resources?.debris || 0, 200)}
                ></div>
              </div>
            </div>
            
            {/* Special Total */}
            <div className="bot-hud-resource-item">
              <div className="bot-hud-resource-label">
                <span>Special:</span> {players.player2?.score?.resources?.special || 0}
              </div>
              <div className="bot-hud-resource-container">
                <div 
                  className="bot-hud-resource-bar" 
                  style={getResourceBarStyle(players.player2?.score?.resources?.special || 0, 10)}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotHUD;