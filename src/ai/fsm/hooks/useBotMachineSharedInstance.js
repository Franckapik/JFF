/**
 * ============================================================================
 * SHARED FSM MACHINE INSTANCE - Instance partagée de machine FSM
 * ============================================================================
 * 
 * Résout le problème des instances multiples de useMachine pour le même bot.
 * Une seule instance par botId, partagée entre tous les composants.
 * 
 * @version 1.0.0
 */

import { useMachine } from 'react-robot';
import { useFSMContext } from '../contexts/FSMContext.jsx';
import { ENTITY_TYPES } from '../machine/constants/constants.js';
import fsmLogger from '../../../logger/fsmLogger.js';

// Map globale pour stocker les instances de machines FSM partagées
const globalMachineInstances = new Map();

/**
 * Hook pour obtenir une instance partagée de machine FSM
 * Garantit qu'une seule instance useMachine existe par botId
 * 
 * @param {string} botId - ID du bot
 * @param {string} entityType - Type d'entité
 * @returns {Object} { current, send }
 */
export const useBotMachineSharedInstance = (botId, entityType = ENTITY_TYPES.auto) => {
  const { getBotMachine } = useFSMContext();
  
  // Vérifier si une instance existe déjà pour ce botId
  if (globalMachineInstances.has(botId)) {
    fsmLogger.info(`[useBotMachineSharedInstance] Using existing instance for bot: ${botId}`);
    return globalMachineInstances.get(botId);
  }
  
  fsmLogger.info(`[useBotMachineSharedInstance] Creating new shared instance for bot: ${botId}`);
  
  // Obtenir la machine partagée
  const { machine, initialContext } = getBotMachine(botId, entityType);
  
  // Créer l'instance useMachine
  const [current, send] = useMachine(machine, initialContext);
  
  // Stocker l'instance globalement
  const instance = { current, send };
  globalMachineInstances.set(botId, instance);
  
  return instance;
};

/**
 * Fonction pour nettoyer une instance spécifique
 */
export const clearBotMachineInstance = (botId) => {
  if (globalMachineInstances.has(botId)) {
    fsmLogger.info(`[useBotMachineSharedInstance] Clearing instance for bot: ${botId}`);
    globalMachineInstances.delete(botId);
  }
};

/**
 * Fonction pour nettoyer toutes les instances
 */
export const clearAllBotMachineInstances = () => {
  fsmLogger.info(`[useBotMachineSharedInstance] Clearing all instances`);
  globalMachineInstances.clear();
};
