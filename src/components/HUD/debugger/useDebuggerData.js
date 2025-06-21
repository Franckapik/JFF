import { useState, useCallback } from 'react';
import { useTileStore } from "../../../stores/useTileStore";
import { useBotMachine } from "../../../ai/fsm/hooks/useBotMachine.js";
import contextReducers from "../../../ai/fsm/machine/reducers/context.js";

/**
 * Hook personnalisé pour gérer les données du debugger (FSM-only)
 */
export const useDebuggerData = () => {
  // États pour le débogueur (bot-only approach)
  const [activeTab, setActiveTab] = useState('actions');
  const [activeSubTab, setActiveSubTab] = useState('stores');
  const [currentBotIndex, setCurrentBotIndex] = useState(0);
  
  // Liste des bots disponibles (simplifiée pour maintenant)
  const botIds = ['bot-0', 'bot-1', 'bot-2'];
  const activeBotId = botIds[currentBotIndex];
  
  // Hook FSM pour le bot actuel
  const {
    entity,
    vehicle: botVehicle,
    state: botState,
    context,
    actions,
    isAutonomous,
    canManualControl,
    isMoving
  } = useBotMachine(activeBotId);

  // Simulation des données pour l'onglet Actions (mise à jour pour la nouvelle structure)
  const actionQueue = [
    { id: 1, type: 'DRONE_EXPLORES_TILE', status: 'pending', target: '5,3' },
    { id: 2, type: 'SHIP_COLLECTS_TILE', status: 'running', target: '3,2' }
  ];
  
  const storeActionHistory = [
    { id: 1, type: 'DRONE_EXPLORES_TILE', status: 'completed', timestamp: Date.now() - 10000, details: 'Tile 2,3 explored, resources found' },
    { id: 2, type: 'SHIP_COLLECTS_TILE', status: 'completed', timestamp: Date.now() - 5000, details: 'Tile 2,3 collected successfully' },
    { id: 3, type: 'DRONE_REACHED_SHIP', status: 'completed', timestamp: Date.now() - 2000, details: 'Drone returned to ship' }
  ];

  // Constants FSM
  const BOT_STATES = {
    IDLE: 'IDLE',
    EXPLORING: 'EXPLORING', 
    COLLECTING: 'COLLECTING',
    RETURNING: 'RETURNING',
    MANUAL_CONTROL: 'MANUAL_CONTROL'
  };
  
  const ACTION_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed'
  };
  
  // Données de mémoire du bot basées sur la nouvelle structure unifiée
  const botMemory = entity && context?.memory ? {
    // Nouvelle structure unifiée
    knownTiles: Array.from(context.memory.knownTiles?.values() || []),
    stats: context.memory.stats || {
      tilesExplored: 0,
      tilesCollected: 0,
      totalResourcesFound: 0,
      lastExploration: null,
      lastCollection: null
    },
    
    // Données dérivées calculées à partir de knownTiles
    exploredTiles: contextReducers.utils.getExploredTiles(context),
    collectibleTiles: contextReducers.utils.getCollectibleTiles(context),
    
    // Historique conservé
    knownDangers: context.memory.knownDangers || [],
    stateHistory: context.memory.stateHistory || [],
    transitionHistory: context.memory.transitionHistory || [],
    
    // Autres propriétés utiles pour le debug
    lastTarget: entity.target,
    memorySize: context.memory.knownTiles?.size || 0,
    hasMemoryData: (context.memory.knownTiles?.size || 0) > 0
  } : null;
  
  // Récupérer les données du TileStore
  const calculateDistance = useTileStore((state) => state.calculateDistance);
  const hoveredTileCoord = useTileStore((state) => state.hoveredTile);
  const tiles = useTileStore((state) => state.tiles);
  const hoveredTile = hoveredTileCoord ? tiles[hoveredTileCoord] : null;
  
  // Nombre de bots disponibles
  const botCount = botIds.length;
  
  // Changer le bot actif
  const handleBotChange = (index) => {
    if (index >= 0 && index < botIds.length) {
      setCurrentBotIndex(index);
    }
  };

  return {
    // États
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    activeBotId,
    
    // Données bot FSM
    botState,
    isRunning: isAutonomous, // Le bot est "running" s'il est en mode autonome
    actionQueue,
    storeActionHistory,
    BOT_STATES,
    ACTION_STATUS,
    currentBotIndex,
    botVehicle,
    botMemory,
    
    // Données tuiles
    hoveredTile,
    hoveredTileCoord,
    calculateDistance,
    
    // Métadonnées
    botCount,
    
    // Actions
    handleBotChange,
    
    // Nouvelles données FSM
    entity,
    context,
    isAutonomous,
    canManualControl,
    isMoving
  };
};
