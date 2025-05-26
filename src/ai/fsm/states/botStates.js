// src/ai/fsm/states/botStates.js
// Définition des comportements spécifiques à chaque état du bot

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';
import { getBotPlayerId, getMainShipId } from '../../constants/playerConstants';
import usePlayerStore from '../../../stores/playerStore';
import useBotStore from '../../../stores/useBotStore';
import fsmLogger from '../../../utils/fsmLogger';

/**
 * Utilitaires pour factoriser les fonctions communes entre états
 */
const StateUtils = {
  /**
   * Obtient l'ID du bot actif
   * @param {string} botId - ID du bot spécifié (optionnel)
   * @returns {string} - ID du bot actif
   */
  getActiveBotId: (botId) => {
    return botId || useBotStore.getState().currentBotId || getBotPlayerId(0);
  },
  
  /**
   * Obtient la mémoire du bot
   * @param {Object} playerStore - L'instance du store des joueurs
   * @param {string} botId - ID du bot
   * @returns {Object} - La mémoire du bot
   */
  getBotMemory: (playerStore, botId) => {
    return playerStore?.players?.[botId]?.memory;
  },
  
  /**
   * Vérifie si une transition est déjà en cours
   * @param {Object} botMemory - La mémoire du bot
   * @returns {boolean} - true si une transition est en cours
   */
  isTransitionInProgress: (botMemory) => {
    // Simplification : il suffit de vérifier si transitionState existe
    return Boolean(botMemory?.transitionState);
  },
  
  /**
   * Fonction générique pour gérer l'entrée dans un état
   * @param {Object} playerStore - L'instance du store des joueurs
   * @param {string} stateName - Le nom de l'état entré
   * @param {string} botId - ID du bot (optionnel)
   * @param {Function} additionalCallback - Fonction additionnelle à exécuter (optionnel)
   * @param {string} customMessage - Message de log personnalisé (optionnel)
   * @returns {string} - L'ID du bot actif
   */
  handleStateEnter: (playerStore, stateName, botId, additionalCallback = null, customMessage = null) => {
    const activeBotId = StateUtils.getActiveBotId(botId);
    const message = customMessage || `Entering ${stateName} state for bot ${activeBotId}`;
    fsmLogger.state(message, null, activeBotId);
    
    if (additionalCallback && typeof additionalCallback === 'function') {
      additionalCallback(playerStore, activeBotId);
    }
    
    return activeBotId;
  },
  
  /**
   * Fonction générique pour gérer la sortie d'un état et la transition vers IDLE
   * @param {Object} playerStore - L'instance du store des joueurs
   * @param {Function} changeState - Fonction pour changer d'état
   * @param {string} fromState - État d'origine
   * @param {Object} additionalMemoryUpdates - Mises à jour additionnelles de la mémoire
   * @param {string} logMessage - Message de log personnalisé (optionnel)
   */
  handleStateExit: (playerStore, changeState, fromState, additionalMemoryUpdates = {}, logMessage = null) => {
    const activeBotId = StateUtils.getActiveBotId();
    const botMemory = StateUtils.getBotMemory(playerStore, activeBotId);
    
    // Vérifier si une transition est déjà en cours
    if (StateUtils.isTransitionInProgress(botMemory)) {
      return;
    }
    
    // Log de la sortie d'état
    const message = logMessage || `Exiting ${fromState} state for bot ${activeBotId} - Returning to IDLE for evaluation`;
    fsmLogger.state(message, null, activeBotId);
    
    // Marquer la transition comme en cours
    playerStore.updatePlayerMemory(activeBotId, {
      transitionState: { isTransitioning: true, fromState }
    });
    
    // Appliquer les mises à jour additionnelles si fournies
    if (Object.keys(additionalMemoryUpdates).length > 0) {
      playerStore.updatePlayerMemory(activeBotId, additionalMemoryUpdates);
    }
    
    // Effectuer la transition vers IDLE
    if (changeState) {
      changeState(BOT_STATES.IDLE);
    }
    
    // Nettoyer l'état de transition
    playerStore.updatePlayerMemory(activeBotId, {
      transitionState: null
    });
  },
  
  /**
   * Obtient le véhicule principal du bot
   * @param {Object} playerStore - L'instance du store des joueurs
   * @param {string} botId - ID du bot
   * @returns {Object} - Le véhicule du bot
   */
  getBotVehicle: (playerStore, botId) => {
    return playerStore?.players?.[botId]?.vehicles?.[getMainShipId()];
  },
  
  /**
   * Crée une action formatée avec un type et une priorité
   * @param {string} type - Le type d'action
   * @param {number} priority - La priorité de l'action
   * @returns {Object} - L'action formatée
   */
  createAction: (type, priority = PRIORITY.MEDIUM) => {
    return { type, priority };
  },
};

/**
 * Configuration des comportements par état
 * Chaque état définit:
 * - defaultAction: Action à ajouter quand la file est vide
 * - onEnterState: Fonction appelée quand le bot entre dans cet état
 * - onExitState: Fonction appelée quand le bot quitte cet état
 * - getNextState: Fonction pure pour déterminer le prochain état
 */
export const BotStateConfig = {
  [BOT_STATES.IDLE]: {
    description: "État central d'évaluation des conditions",
    defaultAction: StateUtils.createAction('evaluateIdle', PRIORITY.HIGH),
    onEnterState: (playerStore, botId) => {
      StateUtils.handleStateEnter(playerStore, 'IDLE', botId);
    },
    onExitState: (playerStore, changeState, targetState) => {
      StateUtils.handleStateExit(playerStore, changeState, BOT_STATES.IDLE);
    }
  },
  
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration de la carte",
    defaultAction: StateUtils.createAction('exploreDrone', PRIORITY.MEDIUM),
    onEnterState: (playerStore, botId) => {
      StateUtils.handleStateEnter(playerStore, 'EXPLORING', botId);
    },
    onExitState: (playerStore, changeState) => {
      StateUtils.handleStateExit(playerStore, changeState, BOT_STATES.EXPLORING);
    }
  },
  
  [BOT_STATES.COLLECTING]: {
    description: "Bot en collecte de ressources",
    defaultAction: StateUtils.createAction('moveToResource', PRIORITY.MEDIUM),
    onEnterState: (playerStore, botId) => {
      StateUtils.handleStateEnter(playerStore, 'COLLECTING', botId);
    },
    onExitState: (playerStore, changeState) => {
      StateUtils.handleStateExit(playerStore, changeState, BOT_STATES.COLLECTING);
    }
  },
  
  [BOT_STATES.RETURNING]: {
    description: "Bot en retour vers sa base",
    defaultAction: StateUtils.createAction('returnToBase', PRIORITY.HIGH),
    onEnterState: (playerStore, botId) => {
      StateUtils.handleStateEnter(playerStore, 'RETURNING', botId);
    },
    onExitState: (playerStore, changeState) => {
      StateUtils.handleStateExit(playerStore, changeState, BOT_STATES.RETURNING);
    }
  }
};