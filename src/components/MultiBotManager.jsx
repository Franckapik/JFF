import React, { useEffect } from 'react';
import useBotStore from '../stores/useBotStore';
import useGameStore from '../stores/useGameStore';

/**
 * Composant pour gérer plusieurs bots en parallèle
 * Ce composant s'occupe de traiter tous les bots en mode parallèle
 */
const MultiBotManager = () => {
  const { 
    isRunning, 
    processAllBots
  } = useBotStore();
  
  // Effet pour le traitement des bots en parallèle
  useEffect(() => {
    if (!isRunning) return;
    
    let interval;
    
    // Mode parallèle: traite tous les bots en une fois
    console.log("[MultiBotManager] Starting parallel processing mode");
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
