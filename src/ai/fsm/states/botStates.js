// src/ai/fsm/states/botStates.js
// Définition des comportements spécifiques à chaque état du bot

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';
import { getBotPlayerId, getMainShipId } from '../../constants/playerConstants';
import usePlayerStore from '../../../stores/playerStore';
import useBotStore from '../../../stores/useBotStore';
import fsmLogger from '../../../utils/fsmLogger';

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
    defaultAction: { type: 'evaluateIdle', priority: PRIORITY.HIGH },
    onEnterState: (playerStore, botId) => {
      fsmLogger.state(`Entering IDLE state for bot ${botId} - Evaluating conditions`);
      
      if (playerStore) {
        const activeBotId = botId || useBotStore.getState().currentBotId || getBotPlayerId(0);
        const botVehicle = playerStore.players?.[activeBotId]?.vehicles?.[getMainShipId()];
        fsmLogger.info(`Bot ${activeBotId} status: Fuel=${botVehicle?.fuel}, At base=${botVehicle?.coord === botVehicle?.startCoord}`);
      }
    },
    onExitState: (playerStore, changeState, targetState) => {
      fsmLogger.state(`Exiting IDLE state, transitioning to ${targetState}`);
    }
  },
  
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration de la carte",
    defaultAction: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
    onEnterState: (playerStore, botId) => {
      const activeBotId = botId || useBotStore.getState().currentBotId || getBotPlayerId(0);
      fsmLogger.state(`Entering EXPLORING state for bot ${activeBotId}`);
    },
    onExitState: (playerStore, changeState) => {
      const botStore = useBotStore.getState();
      const activeBotId = botStore.currentBotId || getBotPlayerId(0);
      const botMemory = playerStore?.players?.[activeBotId]?.memory;

      // Vérifier si une transition est déjà en cours
      if (botMemory?.transitionState?.isTransitioning) {
        return;
      }

      fsmLogger.state(`Exiting EXPLORING state for bot ${activeBotId} - Returning to IDLE for evaluation`);
      
      // Marquer la transition comme en cours
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: { isTransitioning: true, fromState: BOT_STATES.EXPLORING }
      });

      // Effectuer la transition vers IDLE
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }

      // Nettoyer l'état de transition
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: null
      });
    }
  },
  
  [BOT_STATES.COLLECTING]: {
    description: "Bot en collecte de ressources",
    getDefaultAction: (playerStore, tileStore, addAction) => {
      const botStore = useBotStore.getState();
      const activeBotId = botStore.currentBotId || getBotPlayerId(0);
      const botVehicle = playerStore?.players?.[activeBotId]?.vehicles?.ship;
      const botMemory = playerStore?.players?.[activeBotId]?.memory;

      if (botVehicle && botMemory?.currentTargetResource) {
        if (botVehicle.coord === botMemory.currentTargetResource.coord) {
          fsmLogger.action("Bot is at resource location, adding collectResource action");
          return { type: 'collectResource', priority: PRIORITY.HIGH };
        }
      }
      
      return { type: 'moveToResource', priority: PRIORITY.MEDIUM };
    },
    defaultAction: { type: 'moveToResource', priority: PRIORITY.MEDIUM },
    onEnterState: (playerStore) => {
      const botStore = useBotStore.getState();
      const activeBotId = botStore.currentBotId || getBotPlayerId(0);
      
      fsmLogger.state(`Entering COLLECTING state for bot ${activeBotId}`);
      
      const botVehicle = playerStore?.players?.[activeBotId]?.vehicles?.ship;
      const botMemory = playerStore?.players?.[activeBotId]?.memory;
      
      if (botVehicle && botMemory?.knownResources && botMemory.knownResources.length > 0) {
        const currentResource = botMemory.knownResources.find(r => r.coord === botVehicle.coord);
        
        if (currentResource) {
          playerStore.updatePlayerMemory(activeBotId, {
            currentTargetResource: currentResource
          });
          fsmLogger.action(`Bot ${activeBotId} already at resource location ${botVehicle.coord}, preparing collection`);
        }
      }
    },
    onExitState: (playerStore, changeState) => {
      const botStore = useBotStore.getState();
      const activeBotId = botStore.currentBotId || getBotPlayerId(0);
      const botMemory = playerStore?.players?.[activeBotId]?.memory;

      // Vérifier si une transition est déjà en cours
      if (botMemory?.transitionState?.isTransitioning) {
        return;
      }

      fsmLogger.state(`Exiting COLLECTING state for bot ${activeBotId} - Returning to IDLE for evaluation`);

      // Marquer la transition comme en cours
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: { isTransitioning: true, fromState: BOT_STATES.COLLECTING }
      });

      // Nettoyer les données de ciblage de ressources
      playerStore.updatePlayerMemory(activeBotId, {
        currentTargetResource: null
      });

      // Effectuer la transition vers IDLE
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }

      // Nettoyer l'état de transition
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: null
      });
    }
  },
  
  [BOT_STATES.RETURNING]: {
    description: "Bot en retour vers sa base",
    defaultAction: { type: 'returnToBase', priority: PRIORITY.HIGH },
    onEnterState: (playerStore, addAction) => {
      fsmLogger.state("Entering RETURNING state");
      
      if (addAction) {
        fsmLogger.action("Adding returnToBase action after entering RETURNING state");
        addAction('returnToBase', PRIORITY.HIGH);
      }
    },
    onExitState: (playerStore, changeState) => {
      const botStore = useBotStore.getState();
      const activeBotId = botStore.currentBotId || getBotPlayerId(0);
      const botMemory = playerStore?.players?.[activeBotId]?.memory;

      // Vérifier si une transition est déjà en cours
      if (botMemory?.transitionState?.isTransitioning) {
        return;
      }

      fsmLogger.state("Exiting RETURNING state - Returning to IDLE for evaluation");

      // Marquer la transition comme en cours
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: { isTransitioning: true, fromState: BOT_STATES.RETURNING }
      });

      // Effectuer la transition vers IDLE
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }

      // Nettoyer l'état de transition
      playerStore.updatePlayerMemory(activeBotId, {
        transitionState: null
      });
    }
  }
};