import React, { useState, useEffect, useRef } from 'react';
import usePlayerStore from "../../stores/playerStore";
import useBotStore from "../../stores/useBotStore";
import { useTileStore } from "../../stores/useNewTileStore";
import {
  HUMAN_PLAYER_ID,
  getBotPlayerId,
  getMainShipId,
  getDroneId,
  isMainShipId,
  VEHICLE_TYPES
} from '../../ai/constants/playerConstants';

/**
 * Version refactorisée du BotDebugger
 * Affiche toutes les informations des bots de façon organisée
 */
const BotDebuggerNew = () => {
  // États pour le débogueur
  const [activeTab, setActiveTab] = useState('actions'); // 'actions', 'state', 'resources', 'player', 'tile'
  const [activeSubTab, setActiveSubTab] = useState('resources'); // 'resources', 'collected', 'dangers'
  const [activeBotId, setActiveBotId] = useState(getBotPlayerId(0)); // ID du bot actif dans le débogueur
  
  // Récupération de l'état du bot
  const {
    botState,
    isRunning,
    actionQueue,
    actionHistory: storeActionHistory,
    BOT_STATES,
    ACTION_STATUS,
    currentBotIndex,
    switchActiveBot
  } = useBotStore();
  
  // Récupération des données des joueurs
  const botVehicle = usePlayerStore(state => state.players?.[activeBotId]?.vehicles?.[getMainShipId()]);
  const botMemory = usePlayerStore(state => state.players?.[activeBotId]?.memory);
  
  // Données du joueur humain
  const playerVehicle = usePlayerStore(state => state.players?.[HUMAN_PLAYER_ID]?.vehicles?.[getMainShipId()]);
  const playerData = usePlayerStore(state => state.players?.[HUMAN_PLAYER_ID]);
  
  // Récupérer la fonction calculateDistance du TileStore
  const calculateDistance = useTileStore((state) => state.calculateDistance);
  
  // Récupération des données des tuiles pour l'onglet Tile
  const hoveredTileCoord = useTileStore((state) => state.hoveredTile);
  const tiles = useTileStore((state) => state.tiles);
  const hoveredTile = hoveredTileCoord ? tiles[hoveredTileCoord] : null;
  
  // Nombre de bots dans le jeu
  const botCount = usePlayerStore(state => 
    Object.keys(state.players || {}).filter(id => id !== HUMAN_PLAYER_ID).length
  );
  
  // Formater le nom d'un état pour l'affichage
  const formatStateName = (state) => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };
  
  // Obtenir la couleur pour un statut d'action
  const getActionStatusColor = (status) => {
    switch(status) {
      case ACTION_STATUS.PENDING: return "#f9a825"; // Orange
      case ACTION_STATUS.IN_PROGRESS: return "#2196F3"; // Bleu
      case ACTION_STATUS.COMPLETED: return "#4CAF50"; // Vert
      case ACTION_STATUS.FAILED: return "#f44336"; // Rouge
      default: return "#aaaaaa"; // Gris
    }
  };

  // Fonction helper pour la barre de ressources des tuiles
  const getTileResourceBarStyle = (quantity) => {
    let color = "#4CAF50"; // Green by default
    
    if (quantity === 0) color = "#777777"; // Gray if empty
    else if (quantity < 3) color = "#f44336"; // Red if very low
    else if (quantity < 5) color = "#ff9800"; // Orange if somewhat low
    
    return {
      width: `${Math.min(quantity * 10, 100)}%`,
      backgroundColor: color,
    };
  };

  // Changer le bot actif
  const handleBotChange = (index) => {
    switchActiveBot(index);
    setActiveBotId(getBotPlayerId(index));
  };
  
  // Barre de progression pour les ressources
  const ResourceBar = ({ value, max, color = "#4CAF50" }) => {
    const percentage = Math.min(100, (value / max) * 100);
    
    return (
      <div className="debugger-resource-bar-container">
        <div 
          className="debugger-resource-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }} 
        />
      </div>
    );
  };
  
  // Récupérer les données d'un véhicule de bot
  const getBotVehicleData = (botId, vehicleId) => {
    return usePlayerStore.getState().players?.[botId]?.vehicles?.[vehicleId];
  };

  // Vérifier si un véhicule est actif
  const isVehicleActive = (botId, vehicleId) => {
    const vehicle = getBotVehicleData(botId, vehicleId);
    return vehicle?.isActive === true;
  };
  
  // Rendu de l'onglet Player
  const renderPlayerTab = () => {
    if (!playerVehicle || !playerData) {
      return <div className="debugger-empty-message">Données du joueur non disponibles</div>;
    }

    return (
      <div className="debugger-tab-content">
        <div className="debugger-section">
          <h3 className="debugger-section-title">État du joueur</h3>
          <div className="debugger-state-current">
            <span className="debugger-label">Joueur:</span>
            <span className="debugger-value debugger-highlight">Humain (Player 1)</span>
          </div>
          <div className="debugger-state-running">
            <span className="debugger-label">En jeu:</span>
            <span className="debugger-value debugger-value-active">
              Oui
            </span>
          </div>
          
          <div className="debugger-state-running">
            <span className="debugger-label">Score:</span>
            <span className="debugger-value debugger-highlight">
              {playerData?.score?.total || 0} points
            </span>
          </div>
        </div>

        <div className="debugger-section">
          <h3 className="debugger-section-title">Véhicules</h3>
          <div className="debugger-vehicles">
            <div className="debugger-vehicle-item">
              <span className="debugger-vehicle-name">Vaisseau principal</span>
              <span className="debugger-vehicle-id">{getMainShipId(HUMAN_PLAYER_ID)}</span>
            </div>
            
            <div className="debugger-vehicle-item">
              <span className="debugger-vehicle-name">Drone explorateur</span>
              <span className="debugger-vehicle-id">{getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.EXPLORER_DRONE)}</span>
              <span className={`debugger-vehicle-status ${isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.EXPLORER_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
                {isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.EXPLORER_DRONE)) ? 'ACTIF' : 'INACTIF'}
              </span>
            </div>
            
            <div className="debugger-vehicle-item">
              <span className="debugger-vehicle-name">Drone de combat</span>
              <span className="debugger-vehicle-id">{getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.COMBAT_DRONE)}</span>
              <span className={`debugger-vehicle-status ${isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.COMBAT_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
                {isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.COMBAT_DRONE)) ? 'ACTIF' : 'INACTIF'}
              </span>
            </div>
            
            <div className="debugger-vehicle-item">
              <span className="debugger-vehicle-name">Drone spécial</span>
              <span className="debugger-vehicle-id">{getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.SPECIAL_DRONE)}</span>
              <span className={`debugger-vehicle-status ${isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.SPECIAL_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
                {isVehicleActive(HUMAN_PLAYER_ID, getDroneId(HUMAN_PLAYER_ID, VEHICLE_TYPES.SPECIAL_DRONE)) ? 'ACTIF' : 'INACTIF'}
              </span>
            </div>
          </div>
        </div>

        <div className="debugger-section">
          <h3 className="debugger-section-title">Données du vaisseau</h3>
          <div className="debugger-ship-data">
            <div className="debugger-data-item">
              <span className="debugger-label">Position:</span>
              <span className="debugger-value">{playerVehicle?.coord || "Inconnue"}</span>
            </div>
            <div className="debugger-data-item">
              <span className="debugger-label">En mouvement:</span>
              <span className={`debugger-value ${playerVehicle?.isMoving ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
                {playerVehicle?.isMoving ? "Oui" : "Non"}
              </span>
            </div>
            <div className="debugger-data-item">
              <span className="debugger-label">À capacité max:</span>
              <span className={`debugger-value ${playerVehicle?.isAtCapacity ? 'debugger-value-warning' : 'debugger-value-ok'}`}>
                {playerVehicle?.isAtCapacity ? "Oui" : "Non"}
              </span>
            </div>
            <div className="debugger-data-item">
              <span className="debugger-label">Santé:</span>
              <span className={`debugger-value ${playerVehicle?.health < 50 ? 'debugger-value-warning' : 'debugger-value-ok'}`}>
                {playerVehicle?.health || 100}/100
              </span>
            </div>
          </div>
        </div>

        <div className="debugger-ship-resources">
          <h3 className="debugger-section-title">Ressources du vaisseau</h3>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Carburant:</span>
              <span className="debugger-resource-value">
                {playerVehicle.fuel || 0}/100
              </span>
            </div>
            <ResourceBar 
              value={playerVehicle.fuel || 0} 
              max={100}
              color={playerVehicle.fuel < 30 ? "#f44336" : playerVehicle.fuel < 50 ? "#FF9800" : "#4CAF50"}
            />
          </div>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Food:</span>
              <span className="debugger-resource-value">
                {playerVehicle.resources?.food || 0}/{playerVehicle.maxCapacity?.food || 100}
              </span>
            </div>
            <ResourceBar 
              value={playerVehicle.resources?.food || 0} 
              max={playerVehicle.maxCapacity?.food || 100}
              color="#8BC34A"
            />
          </div>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Debris:</span>
              <span className="debugger-resource-value">
                {playerVehicle.resources?.debris || 0}/{playerVehicle.maxCapacity?.debris || 1000}
              </span>
            </div>
            <ResourceBar 
              value={playerVehicle.resources?.debris || 0} 
              max={playerVehicle.maxCapacity?.debris || 1000}
              color="#2196F3"
            />
          </div>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Special:</span>
              <span className="debugger-resource-value">
                {playerVehicle.resources?.special || 0}/{playerVehicle.maxCapacity?.special || 2}
              </span>
            </div>
            <ResourceBar 
              value={playerVehicle.resources?.special || 0} 
              max={playerVehicle.maxCapacity?.special || 2}
              color="#9C27B0"
            />
          </div>
        </div>

        <div className="debugger-section">
          <h3 className="debugger-section-title">Score total</h3>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Food:</span>
              <span className="debugger-resource-value">
                {playerData?.score?.resources?.food || 0}
              </span>
            </div>
            <ResourceBar 
              value={playerData?.score?.resources?.food || 0} 
              max={100}
              color="#8BC34A"
            />
          </div>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Debris:</span>
              <span className="debugger-resource-value">
                {playerData?.score?.resources?.debris || 0}
              </span>
            </div>
            <ResourceBar 
              value={playerData?.score?.resources?.debris || 0} 
              max={200}
              color="#2196F3"
            />
          </div>
          
          <div className="debugger-resource-item">
            <div className="debugger-resource-header">
              <span className="debugger-resource-name">Special:</span>
              <span className="debugger-resource-value">
                {playerData?.score?.resources?.special || 0}
              </span>
            </div>
            <ResourceBar 
              value={playerData?.score?.resources?.special || 0} 
              max={10}
              color="#9C27B0"
            />
          </div>
        </div>
      </div>
    );
  };

  // Rendu de l'onglet Tile
  const renderTileTab = () => {
    if (!hoveredTile) {
      return (
        <div className="debugger-empty-message">
          <p>Aucune tuile survolée.</p>
          <p>Passez votre souris sur une tuile pour voir ses détails.</p>
        </div>
      );
    }

    return (
      <div className="debugger-tab-content">
        <div className="debugger-section">
          <h3 className="debugger-section-title">Informations sur la tuile</h3>
          
          <div className="debugger-tile-info">
            <div className="debugger-data-item">
              <span className="debugger-label">Coordonnées:</span>
              <span className="debugger-value">{hoveredTileCoord}</span>
            </div>
            
            <div className="debugger-data-item">
              <span className="debugger-label">Type:</span>
              <span className="debugger-value">{hoveredTile.type || "Standard"}</span>
            </div>
            
            <div className="debugger-data-item">
              <span className="debugger-label">Status:</span>
              <span className="debugger-value">{hoveredTile.collected ? "Collectée" : "Disponible"}</span>
            </div>
            
            <div className="debugger-data-item">
              <span className="debugger-label">Explorée:</span>
              <span className="debugger-value">{hoveredTile.explored ? "Oui" : "Non"}</span>
            </div>
            
            {hoveredTile.walkable === false && (
              <div className="debugger-warning-message">
                <span>Attention: Tuile non praticable!</span>
              </div>
            )}
          </div>
        </div>

        {hoveredTile.resources && (
          <div className="debugger-section">
            <h3 className="debugger-section-title">Ressources</h3>
            
            <div className="debugger-resource-item">
              <div className="debugger-resource-header">
                <span className="debugger-resource-name">Food:</span>
                <span className="debugger-resource-value">
                  {hoveredTile.resources.food || 0}
                </span>
              </div>
              <ResourceBar 
                value={hoveredTile.resources.food || 0} 
                max={10}
                color={getTileResourceBarStyle(hoveredTile.resources.food || 0).backgroundColor}
              />
            </div>
            
            <div className="debugger-resource-item">
              <div className="debugger-resource-header">
                <span className="debugger-resource-name">Debris:</span>
                <span className="debugger-resource-value">
                  {hoveredTile.resources.debris || 0}
                </span>
              </div>
              <ResourceBar 
                value={hoveredTile.resources.debris || 0} 
                max={10}
                color={getTileResourceBarStyle(hoveredTile.resources.debris || 0).backgroundColor}
              />
            </div>
            
            <div className="debugger-resource-item">
              <div className="debugger-resource-header">
                <span className="debugger-resource-name">Special:</span>
                <span className="debugger-resource-value">
                  {hoveredTile.resources.special || 0}
                </span>
              </div>
              <ResourceBar 
                value={hoveredTile.resources.special || 0} 
                max={10}
                color={getTileResourceBarStyle(hoveredTile.resources.special || 0).backgroundColor}
              />
            </div>
          </div>
        )}

        {/* Special Properties Section */}
        {hoveredTile.type && (
          <div className={`debugger-section debugger-tile-special debugger-tile-type-${hoveredTile.type}`}>
            <h3 className="debugger-section-title">Propriétés spéciales</h3>
            
            {hoveredTile.type === 'station' && (
              <div className="debugger-tile-station">
                <p>
                  <strong>Station</strong> - Permet de ravitailler et réparer les vaisseaux
                </p>
              </div>
            )}
            
            {hoveredTile.type === 'danger' && (
              <div className="debugger-tile-danger">
                <p>
                  <strong>Zone Dangereuse</strong> - Les vaisseaux peuvent subir des dommages dans cette zone
                </p>
              </div>
            )}
            
            {(hoveredTile.type === 'base' || hoveredTile.type === 'depart') && (
              <div className="debugger-tile-base">
                <p>
                  <strong>Base</strong> - Revenez ici pour déposer vos ressources
                </p>
              </div>
            )}
          </div>
        )}

        <div className="debugger-section">
          <h3 className="debugger-section-title">Distances</h3>
          
          {playerVehicle?.coord && hoveredTileCoord && (
            <div className="debugger-data-item">
              <span className="debugger-label">Distance joueur:</span>
              <span className="debugger-value">{calculateDistance(playerVehicle.coord, hoveredTileCoord, true, true)} tuiles</span>
            </div>
          )}
          
          {botVehicle?.coord && hoveredTileCoord && (
            <div className="debugger-data-item">
              <span className="debugger-label">Distance Bot {currentBotIndex + 1}:</span>
              <span className="debugger-value">{calculateDistance(botVehicle.coord, hoveredTileCoord, true, true)} tuiles</span>
            </div>
          )}
          
          {hoveredTile.explored && (
            <div className="debugger-data-item">
              <span className="debugger-label">Explorée par:</span>
              <span className="debugger-value">
                {hoveredTile.exploredBy === HUMAN_PLAYER_ID 
                  ? "Joueur" 
                  : `Bot ${parseInt(hoveredTile.exploredBy.replace("bot", "")) + 1}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Rendu de l'onglet État
  const renderStateTab = () => (
    <div className="debugger-tab-content">
      <div className="debugger-section">
        <h3 className="debugger-section-title">État actuel</h3>
        <div className="debugger-state-current">
          <span className="debugger-label">État:</span>
          <span className="debugger-value debugger-highlight">{formatStateName(botState)}</span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">Bot actif:</span>
          <span className={`debugger-value ${isRunning ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
            {isRunning ? 'Oui' : 'Non'}
          </span>
        </div>
      </div>

      <div className="debugger-section">
        <h3 className="debugger-section-title">États disponibles</h3>
        <div className="debugger-states-list">
          {Object.values(BOT_STATES).map(state => (
            <div 
              key={state} 
              className={`debugger-state-item ${state === botState ? 'debugger-state-active' : ''}`}
            >
              {formatStateName(state)}
            </div>
          ))}
        </div>
      </div>

      <div className="debugger-section">
        <h3 className="debugger-section-title">Véhicules</h3>
        <div className="debugger-vehicles">
          <div className="debugger-vehicle-item">
            <span className="debugger-vehicle-name">Vaisseau principal</span>
            <span className="debugger-vehicle-id">{getMainShipId(activeBotId)}</span>
          </div>
          
          <div className="debugger-vehicle-item">
            <span className="debugger-vehicle-name">Drone explorateur</span>
            <span className="debugger-vehicle-id">{getDroneId(activeBotId, VEHICLE_TYPES.EXPLORER_DRONE)}</span>
            <span className={`debugger-vehicle-status ${isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.EXPLORER_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
              {isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.EXPLORER_DRONE)) ? 'ACTIF' : 'INACTIF'}
            </span>
          </div>
          
          <div className="debugger-vehicle-item">
            <span className="debugger-vehicle-name">Drone de combat</span>
            <span className="debugger-vehicle-id">{getDroneId(activeBotId, VEHICLE_TYPES.COMBAT_DRONE)}</span>
            <span className={`debugger-vehicle-status ${isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.COMBAT_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
              {isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.COMBAT_DRONE)) ? 'ACTIF' : 'INACTIF'}
            </span>
          </div>
          
          <div className="debugger-vehicle-item">
            <span className="debugger-vehicle-name">Drone spécial</span>
            <span className="debugger-vehicle-id">{getDroneId(activeBotId, VEHICLE_TYPES.SPECIAL_DRONE)}</span>
            <span className={`debugger-vehicle-status ${isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.SPECIAL_DRONE)) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
              {isVehicleActive(activeBotId, getDroneId(activeBotId, VEHICLE_TYPES.SPECIAL_DRONE)) ? 'ACTIF' : 'INACTIF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Rendu de l'onglet Actions
  const renderActionsTab = () => (
    <div className="debugger-tab-content">
      <div className="debugger-section">
        <h3 className="debugger-section-title">File d'actions ({actionQueue.length})</h3>
        {actionQueue.length === 0 ? (
          <div className="debugger-empty-message">Aucune action en attente</div>
        ) : (
          <div className="debugger-actions-list">
            {actionQueue.map((action, index) => (
              <div 
                key={index} 
                className="debugger-action-item"
                style={{ borderLeftColor: getActionStatusColor(action.status) }}
              >
                <div className="debugger-action-type">
                  <span className="debugger-label">Type:</span>
                  <span className="debugger-value">{action.type}</span>
                </div>
                <div className="debugger-action-priority">
                  <span className="debugger-label">Priorité:</span>
                  <span className="debugger-value">{action.priority}</span>
                </div>
                <div className="debugger-action-status">
                  <span className="debugger-label">Statut:</span>
                  <span className="debugger-value" style={{ color: getActionStatusColor(action.status) }}>
                    {action.status}
                  </span>
                </div>
                {action.status === ACTION_STATUS.IN_PROGRESS && (
                  <div className="debugger-action-time">
                    En cours depuis {((Date.now() - action.timestamp)/1000).toFixed(1)}s
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="debugger-section">
        <h3 className="debugger-section-title">Historique des actions ({storeActionHistory.length})</h3>
        {storeActionHistory.length === 0 ? (
          <div className="debugger-empty-message">Aucune action complétée</div>
        ) : (
          <div className="debugger-history-list">
            {storeActionHistory.map((action, index) => (
              <div 
                key={index} 
                className={`debugger-history-item ${action.status === ACTION_STATUS.COMPLETED ? 'debugger-history-completed' : 'debugger-history-failed'}`}
              >
                <div className="debugger-history-header">
                  <span className="debugger-history-type">{action.type}</span>
                  <span className="debugger-history-time">
                    {new Date(action.completedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="debugger-history-details">
                  <span className="debugger-history-priority">Priorité: {action.priority}</span>
                  <span className="debugger-history-status" style={{ color: getActionStatusColor(action.status) }}>
                    Status: {action.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Rendu de l'onglet Ressources
  const renderResourcesTab = () => {
    if (!botVehicle || !botMemory) {
      return <div className="debugger-empty-message">Données du bot non disponibles</div>;
    }

    // Sous-onglets pour les ressources
    const renderSubTabs = () => (
      <div className="debugger-subtabs">
        <button 
          className={`debugger-subtab-button ${activeSubTab === 'resources' ? 'debugger-subtab-active' : ''}`}
          onClick={() => setActiveSubTab('resources')}
        >
          Ressources ({botMemory?.knownResources?.length || 0})
        </button>
        <button 
          className={`debugger-subtab-button ${activeSubTab === 'collected' ? 'debugger-subtab-active' : ''}`}
          onClick={() => setActiveSubTab('collected')}
        >
          Collectées ({botMemory?.collectedResources?.length || 0})
        </button>
        <button 
          className={`debugger-subtab-button ${activeSubTab === 'dangers' ? 'debugger-subtab-active' : ''}`}
          onClick={() => setActiveSubTab('dangers')}
        >
          Dangers ({botMemory?.knownDangers?.length || 0})
        </button>
      </div>
    );

    // Contenu du sous-onglet Ressources connues
    const renderKnownResources = () => {
      if (!botMemory?.knownResources || botMemory.knownResources.length === 0) {
        return <div className="debugger-empty-message">Aucune ressource découverte</div>;
      }

      return (
        <div className="debugger-table-container">
          <table className="debugger-resources-table">
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
                  <td>{calculateDistance(botVehicle?.coord, resource.coord, true, true)}</td>
                  <td className={`debugger-resource-value ${resource.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                    {resource.resources?.food || 0}
                  </td>
                  <td className={`debugger-resource-value ${resource.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                    {resource.resources?.debris || 0}
                  </td>
                  <td className={`debugger-resource-value ${resource.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                    {resource.resources?.special || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    // Contenu du sous-onglet Ressources collectées
    const renderCollectedResources = () => {
      if (!botMemory?.collectedResources || botMemory.collectedResources.length === 0) {
        return <div className="debugger-empty-message">Aucune ressource collectée</div>;
      }

      return (
        <div className="debugger-table-container">
          <table className="debugger-resources-table">
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
                  <td className={`debugger-resource-value ${resource.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                    {resource.resources?.food || 0}
                  </td>
                  <td className={`debugger-resource-value ${resource.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                    {resource.resources?.debris || 0}
                  </td>
                  <td className={`debugger-resource-value ${resource.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                    {resource.resources?.special || 0}
                  </td>
                  <td>
                    {resource.collectedAt ? new Date(resource.collectedAt).toLocaleTimeString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    // Contenu du sous-onglet Dangers
    const renderDangers = () => {
      if (!botMemory?.knownDangers || botMemory.knownDangers.length === 0) {
        return <div className="debugger-empty-message">Aucun danger détecté</div>;
      }

      return (
        <div className="debugger-table-container">
          <table className="debugger-resources-table">
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
                  <td>{calculateDistance(botVehicle?.coord, danger.coord, true, true)}</td>
                  <td>{danger.type || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    // Rendu des barres de ressources pour le vaisseau
    const renderShipResources = () => (
      <div className="debugger-ship-resources">
        <h3 className="debugger-section-title">Ressources du vaisseau</h3>
        
        <div className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">Food:</span>
            <span className="debugger-resource-value">
              {botVehicle.resources?.food || 0}/{botVehicle.maxCapacity?.food || 100}
            </span>
          </div>
          <ResourceBar 
            value={botVehicle.resources?.food || 0} 
            max={botVehicle.maxCapacity?.food || 100}
            color="#8BC34A"
          />
        </div>
        
        <div className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">Debris:</span>
            <span className="debugger-resource-value">
              {botVehicle.resources?.debris || 0}/{botVehicle.maxCapacity?.debris || 1000}
            </span>
          </div>
          <ResourceBar 
            value={botVehicle.resources?.debris || 0} 
            max={botVehicle.maxCapacity?.debris || 1000}
            color="#2196F3"
          />
        </div>
        
        <div className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">Special:</span>
            <span className="debugger-resource-value">
              {botVehicle.resources?.special || 0}/{botVehicle.maxCapacity?.special || 2}
            </span>
          </div>
          <ResourceBar 
            value={botVehicle.resources?.special || 0} 
            max={botVehicle.maxCapacity?.special || 2}
            color="#9C27B0"
          />
        </div>
        
        <div className="debugger-capacity-status">
          <span className="debugger-label">À capacité max:</span>
          <span className={`debugger-value ${botVehicle.isAtCapacity ? 'debugger-value-warning' : 'debugger-value-ok'}`}>
            {botVehicle.isAtCapacity ? "Oui" : "Non"}
          </span>
        </div>
      </div>
    );

    return (
      <div className="debugger-tab-content">
        {renderSubTabs()}
        
        <div className="debugger-subtab-content">
          {activeSubTab === 'resources' && renderKnownResources()}
          {activeSubTab === 'collected' && renderCollectedResources()}
          {activeSubTab === 'dangers' && renderDangers()}
        </div>
        
        {renderShipResources()}
      </div>
    );
  };

  return (
    <div className="bot-debugger">
      <div className="debugger-header">
        <h2 className="debugger-title">Bot Debugger</h2>
        <div className="debugger-bot-selector">
          {[...Array(botCount)].map((_, index) => (
            <button
              key={index}
              className={`debugger-bot-button ${currentBotIndex === index ? 'debugger-bot-active' : ''}`}
              onClick={() => handleBotChange(index)}
            >
              Bot {index + 1}
            </button>
          ))}
          <button
            className={`debugger-bot-button debugger-bot-player ${activeTab === 'player' ? 'debugger-bot-active' : ''}`}
            onClick={() => setActiveTab('player')}
          >
            Player
          </button>
          <button
            className={`debugger-bot-button debugger-bot-tile ${activeTab === 'tile' ? 'debugger-bot-active' : ''}`}
            onClick={() => setActiveTab('tile')}
          >
            Tile
          </button>
        </div>
      </div>
      
      <div className="debugger-tabs">
        <button 
          className={`debugger-tab-button ${activeTab === 'actions' ? 'debugger-tab-active' : ''}`} 
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
        <button 
          className={`debugger-tab-button ${activeTab === 'state' ? 'debugger-tab-active' : ''}`} 
          onClick={() => setActiveTab('state')}
        >
          État
        </button>
        <button 
          className={`debugger-tab-button ${activeTab === 'resources' ? 'debugger-tab-active' : ''}`} 
          onClick={() => setActiveTab('resources')}
        >
          Ressources
        </button>
      </div>
      
      <div className="debugger-content">
        {activeTab === 'actions' && renderActionsTab()}
        {activeTab === 'state' && renderStateTab()}
        {activeTab === 'resources' && renderResourcesTab()}
        {activeTab === 'player' && renderPlayerTab()}
        {activeTab === 'tile' && renderTileTab()}
      </div>
    </div>
  );
};

export default BotDebuggerNew;
