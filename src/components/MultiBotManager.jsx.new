import React, { useEffect, useState } from 'react';
import useBotStore from '../stores/useBotStore';
import useGameStore from '../stores/useGameStore';
import { getBotPlayerId } from '../ai/constants/playerConstants';

/**
 * Composant pour gérer plusieurs bots en parallèle ou séquentiel
 * Ce composant s'occupe de traiter tous les bots selon le mode de traitement choisi
 */
const MultiBotManager = () => {
  const { 
    isRunning, 
    processAllBots, 
    switchActiveBot, 
    currentBotIndex,
    processBot,
    processingMode
  } = useBotStore();
  
  const botCount = useGameStore(state => state.botCount);
  const [lastSwitchTime, setLastSwitchTime] = useState(Date.now());
  const switchInterval = 5000; // 5 secondes d'intervalle entre les changements de bot
  
  // Effet pour le traitement des bots en parallèle ou séquentiel
  useEffect(() => {
    if (!isRunning) return;
    
    let interval;
    
    if (processingMode === 'parallel') {
      // Mode parallèle: traite tous les bots en une fois
      console.log("[MultiBotManager] Starting parallel processing mode");
      interval = setInterval(() => {
        processAllBots();
      }, 1000); // Exécuter toutes les secondes
    } else {
      // Mode séquentiel: alterne entre les bots
      console.log("[MultiBotManager] Starting sequential processing mode");
      
      // Traiter immédiatement le bot actif au démarrage
      processBot();
      
      interval = setInterval(() => {
        // Calculer le prochain index de bot (en boucle)
        const nextBotIndex = (currentBotIndex + 1) % botCount;
        
        // Changer le bot actif
        switchActiveBot(nextBotIndex);
        setLastSwitchTime(Date.now());
        console.log(`[MultiBotManager] Switched to Bot ${nextBotIndex + 1} (${getBotPlayerId(nextBotIndex)})`);
        
        // Traiter immédiatement le nouveau bot actif
        processBot();
      }, switchInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      console.log("[MultiBotManager] Stopped bot processing");
    };
  }, [isRunning, currentBotIndex, botCount, switchActiveBot, processBot, processAllBots, processingMode]);
  
  // Si le composant ne fait que gérer la logique, il n'y a rien à rendre
  if (!isRunning) return null;
  
  // On peut également ajouter un petit composant visuel pour montrer quand le bot change
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      transition: 'opacity 0.3s ease',
      opacity: processingMode === 'sequential' && (Date.now() - lastSwitchTime < 1000) ? 1 : 0,
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      Active Bot: Bot {currentBotIndex + 1} ({getBotPlayerId(currentBotIndex)})
    </div>
  );
};

export default MultiBotManager;
