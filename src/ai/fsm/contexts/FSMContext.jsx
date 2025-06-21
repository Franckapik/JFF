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

import React, { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';
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
 * Provider pour gérer les machines FSM centralisées avec instances partagées
 */
export const FSMProvider = ({ children }) => {
  // Map pour stocker les définitions de machines par botId
  const machinesRef = useRef(new Map());
  // State pour stocker les instances de machines actives
  const [activeMachines, setActiveMachines] = useState(new Map());
  
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
   * Enregistre une instance de machine active
   */
  const registerMachineInstance = useCallback((botId, current, send) => {
    setActiveMachines(prev => {
      const newMap = new Map(prev);
      newMap.set(botId, { current, send });
      fsmLogger.info(`[FSMContext] Registered machine instance for bot: ${botId}`);
      return newMap;
    });
  }, []);

  /**
   * Obtient l'instance active d'une machine
   */
  const getMachineInstance = useCallback((botId) => {
    return activeMachines.get(botId);
  }, [activeMachines]);
  
  /**
   * Supprime la machine d'un bot
   */
  const removeBotMachine = useCallback((botId) => {
    if (machinesRef.current.has(botId)) {
      fsmLogger.info(`[FSMContext] Removing FSM machine for bot: ${botId}`);
      machinesRef.current.delete(botId);
    }
    setActiveMachines(prev => {
      const newMap = new Map(prev);
      newMap.delete(botId);
      return newMap;
    });
  }, []);
  
  /**
   * Nettoie toutes les machines
   */
  const clearAllMachines = useCallback(() => {
    fsmLogger.info(`[FSMContext] Clearing all FSM machines`);
    machinesRef.current.clear();
    setActiveMachines(new Map());
  }, []);
  
  const value = {
    getBotMachine,
    registerMachineInstance,
    getMachineInstance,
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
 * Hook centralisé pour les machines FSM avec vraies instances partagées
 */
export const useBotMachineShared = (botId, entityType = ENTITY_TYPES.auto) => {
  const { getBotMachine, registerMachineInstance, getMachineInstance } = useFSMContext();
  
  // Vérifier s'il y a déjà une instance active pour ce bot
  const existingInstance = getMachineInstance(botId);
  
  // Obtenir la machine partagée
  const { machine, initialContext } = getBotMachine(botId, entityType);
  
  // Créer une nouvelle instance useMachine
  const [current, send] = useMachine(machine, initialContext);
  
  // Enregistrer cette instance comme la référence principale si c'est la première
  React.useEffect(() => {
    if (!existingInstance) {
      registerMachineInstance(botId, current, send);
    }
  }, [botId, existingInstance, registerMachineInstance, current, send]);
  
  // Si une instance existe déjà, l'utiliser, sinon utiliser la nouvelle
  if (existingInstance) {
    fsmLogger.info(`[FSMContext] Using existing instance for bot: ${botId}`);
    return existingInstance;
  }
  
  return { current, send };
};

export default FSMContext;
