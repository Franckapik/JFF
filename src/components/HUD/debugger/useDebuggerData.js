import { useState, useCallback } from 'react';
import usePlayerStore from "../../../stores/usePlayerStore";
import useBotStore from "../../../stores/useBotStore/";
import { useTileStore } from "../../../stores/useTileStore";
import {
  HUMAN_PLAYER_ID,
  getBotId,
  getMainShipId,
  getDroneId,
  VEHICLE_TYPES
} from '../../../ai/constants/playerConstants';

/**
 * Hook personnalisé pour gérer les données du debugger
 */
export const useDebuggerData = () => {
  // États pour le débogueur
  const [activeTab, setActiveTab] = useState('actions');
  const [activeSubTab, setActiveSubTab] = useState('resources');
  const [activeBotId, setActiveBotId] = useState(getBotId(0));
  
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

  // Changer le bot actif
  const handleBotChange = (index) => {
    switchActiveBot(index);
    setActiveBotId(getBotId(index));
  };

  return {
    // États
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    activeBotId,
    
    // Données bot
    botState,
    isRunning,
    actionQueue,
    storeActionHistory,
    BOT_STATES,
    ACTION_STATUS,
    currentBotIndex,
    botVehicle,
    botMemory,
    
    // Données joueur
    playerVehicle,
    playerData,
    
    // Données tuiles
    hoveredTile,
    hoveredTileCoord,
    calculateDistance,
    
    // Métadonnées
    botCount,
    
    // Actions
    handleBotChange,
  };
};
