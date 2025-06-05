import { useState, useCallback } from 'react';
import { useTileStore } from "../../../stores/useTileStore";
import { useBotMachineFixed } from "../../../ai/fsm/hooks/useBotMachineSync.js";

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
  } = useBotMachineFixed(activeBotId);

  // Simulation des données pour l'onglet Actions (à remplacer par les vraies données FSM)
  const actionQueue = [
    { id: 1, type: 'MOVE_TO', status: 'pending', target: '5,3' },
    { id: 2, type: 'EXPLORE', status: 'running', area: 'sector-A' }
  ];
  
  const storeActionHistory = [
    { id: 1, type: 'MOVE_TO', status: 'completed', timestamp: Date.now() - 10000 },
    { id: 2, type: 'COLLECT', status: 'failed', timestamp: Date.now() - 5000 }
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
  
  // Simulation d'un véhicule bot basé sur l'entité FSM
  const botMemory = entity ? {
    exploredTiles: [],
    knownResources: [],
    lastTarget: entity.target
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
