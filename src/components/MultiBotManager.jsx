import React, { useEffect } from 'react';
import useBotStore from '../stores/useBotStore/';
import useGameStore from '../stores/useGameStore/';
import { getBotId } from '../ai/constants/playerConstants';
import fsmLogger from '../utils/fsmLogger';

/**
 * Composant pour gérer plusieurs bots en parallèle
 * Ce composant s'occupe de démarrer automatiquement tous les bots et de traiter leurs actions
 */
const MultiBotManager = () => {
  const { 
    isRunning, 
    processAllBots,
    toggleBotProcessing, 
    initializeBot,
    switchActiveBot
  } = useBotStore();
  
  // Nombre de bots dans le jeu
  const botCount = useGameStore(state => state.botCount);
  
  // Effet pour initialiser et démarrer automatiquement les bots
  useEffect(() => {
    // Initialiser tous les bots au démarrage
    for (let i = 0; i < botCount; i++) {
      const botId = getBotId(i);
      initializeBot(i);
      fsmLogger.info(`[MultiBotManager] Initialized Bot ${i + 1} (${botId})`, null, botId);
    }
    
    // Démarre automatiquement les bots au montage du composant s'ils ne sont pas déjà en cours
    if (!isRunning) {
      toggleBotProcessing();
      fsmLogger.info("[MultiBotManager] Bots started automatically");
    }
    
    // Définir le bot actif par défaut (pour l'affichage)
    switchActiveBot(0);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Effet pour le traitement des bots en parallèle
  useEffect(() => {
    if (!isRunning) return;
    
    let interval;
    
    // Mode parallèle: traite tous les bots en une fois
    fsmLogger.info("[MultiBotManager] Starting parallel processing mode");
    interval = setInterval(() => {
      processAllBots();
    }, 1000); // Exécuter toutes les secondes
    
    return () => {
      if (interval) clearInterval(interval);
      console.log("[MultiBotManager] Stopped bot processing");
    };
  }, [isRunning, processAllBots]);
  
  // Ce composant gère uniquement la logique, il n'y a rien à rendre
  return null;
};

export default MultiBotManager;
