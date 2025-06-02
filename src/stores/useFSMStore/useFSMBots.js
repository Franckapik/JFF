import { useCallback } from 'react';
import useFSMStore from '../useFSMStore/index.js';

/**
 * Hook personnalisé pour faciliter l'interaction avec les bots FSM
 * 
 * @returns {Object} Interface simplifiée pour gérer les bots FSM
 */
export const useFSMBots = () => {
  const store = useFSMStore();
  
  // Actions avec logs personnalisés
  const addBot = useCallback(() => {
    console.log('🤖 Ajout d\'un nouveau bot...');
    store.addBot();
  }, [store]);
  
  const removeBot = useCallback(() => {
    console.log('🗑️ Suppression d\'un bot...');
    store.removeBot();
  }, [store]);
  
  const startAllBots = useCallback(() => {
    console.log('🚀 Démarrage de tous les bots...');
    store.startSystem();
  }, [store]);
  
  const stopAllBots = useCallback(() => {
    console.log('⏹️ Arrêt de tous les bots...');
    store.stopSystem();
    }, [store]);
    
  const toggleSystem = useCallback(() => {
    console.log('🔄 Basculement de l\'état du système...');
    store.toggleSystem();
  }, [store]);

  const updateBotStates = useCallback((statesSnapshot) => {
    store.updateBotStatesSnapshot(statesSnapshot);
  }, [store]);

  const getSystemStats = useCallback(() => {
    return store.getSystemStats();
  }, [store]);
  
  return {
    // État
    botIds: store.activeBots,
    botCount: store.getBotCount(),
    isSystemRunning: store.isSystemRunning,
    isRunning: store.isSystemRunning, // Alias pour compatibilité
    metrics: store.metrics,
    
    // Actions simplifiées
    addBot,
    removeBot,
    startAllBots,
    stopAllBots,
    toggleSystem,
    updateBotStates,
    
    // Utilitaires
    getSystemStats,
    hasBotId: store.hasBotId,
    generateBotId: store.generateBotId,
    
    // Accès à l'historique centralisé
    getEventHistory: useFSMStore(state => state.getEventHistory),
    clearEventHistory: useFSMStore(state => state.clearEventHistory),
    
    // Accès direct au store pour les cas avancés
    store
  };
};

export default useFSMBots;
