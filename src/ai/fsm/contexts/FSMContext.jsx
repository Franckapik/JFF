/**
 * ============================================================================
 * FSM CONTEXT - Contexte global pour partager les machines FSM
 * ============================================================================
 * 
 * Résout le problème des instances multiples de machines FSM pour le même bot.
 * Une seule machine par botId, partagée entre tous les composants.
 * 
 * @version 1.0.0
 */

import React, { createContext, useContext, useRef, useCallback } from 'react';
import { useMachine } from 'react-robot';
import { createEntityContext } from '../machine/context/initialContext.js';
import { ENTITY_TYPES } from '../machine/constants/constants.js';
import { createBotMachine } from '../machine/machineFactory.js';
import fsmLogger from '../../../logger/fsmLogger.js';

/**
 * Contexte pour partager les machines FSM
 */
const FSMContext = createContext(null);

/**
 * Provider pour gérer les machines FSM centralisées
 */
export const FSMProvider = ({ children }) => {
  // Map pour stocker les machines par botId
  const machinesRef = useRef(new Map());
  
  /**
   * Obtient ou crée une machine FSM pour un bot
   */
  const getBotMachine = useCallback((botId, entityType = ENTITY_TYPES.auto) => {
    // Si la machine existe déjà, la retourner
    if (machinesRef.current.has(botId)) {
      return machinesRef.current.get(botId);
    }
    
    // Créer une nouvelle machine pour ce bot
    fsmLogger.info(`[FSMContext] Creating new FSM machine for bot: ${botId}`);
    
    const initialContext = createEntityContext(botId, entityType);
    const machine = createBotMachine(botId, initialContext);
    
    // Stocker la machine
    machinesRef.current.set(botId, { machine, initialContext });
    
    return { machine, initialContext };
  }, []);
  
  /**
   * Supprime la machine d'un bot
   */
  const removeBotMachine = useCallback((botId) => {
    if (machinesRef.current.has(botId)) {
      fsmLogger.info(`[FSMContext] Removing FSM machine for bot: ${botId}`);
      machinesRef.current.delete(botId);
    }
  }, []);
  
  /**
   * Nettoie toutes les machines
   */
  const clearAllMachines = useCallback(() => {
    fsmLogger.info(`[FSMContext] Clearing all FSM machines`);
    machinesRef.current.clear();
  }, []);
  
  const value = {
    getBotMachine,
    removeBotMachine,
    clearAllMachines,
    machineCount: () => machinesRef.current.size
  };
  
  return (
    <FSMContext.Provider value={value}>
      {children}
    </FSMContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte FSM
 */
export const useFSMContext = () => {
  const context = useContext(FSMContext);
  if (!context) {
    throw new Error('useFSMContext must be used within an FSMProvider');
  }
  return context;
};

/**
 * Hook centralisé pour les machines FSM
 * Remplace l'ancien useBotMachine en utilisant des machines partagées
 */
export const useBotMachineShared = (botId, entityType = ENTITY_TYPES.auto) => {
  const { getBotMachine } = useFSMContext();
  
  // Obtenir la machine partagée
  const { machine, initialContext } = getBotMachine(botId, entityType);
  
  // Utiliser la machine partagée
  const [current, send] = useMachine(machine, initialContext);
  
  return { current, send };
};

export default FSMContext;
