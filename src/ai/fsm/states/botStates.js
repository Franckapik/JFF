// src/ai/fsm/states/botStates.js
// Définition des comportements spécifiques à chaque état du bot

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';
import usePlayerStore from '../../../stores/usePlayerStore';

/**
 * Configuration des comportements par état
 * Chaque état définit:
 * - defaultAction: Action à ajouter quand la file est vide
 * - onEnterState: Fonction appelée quand le bot entre dans cet état
 * - onExitState: Fonction appelée quand le bot quitte cet état
 */
export const BotStateConfig = {
  [BOT_STATES.IDLE]: {
    description: "État central d'évaluation des conditions",
    defaultAction: { type: 'evaluateIdle', priority: PRIORITY.HIGH },
    onEnterState: (playerStore) => {
      console.log("[BotState] Entering IDLE state - Evaluating conditions");
      
      // Récupérer l'état actuel du bot si playerStore est fourni
      if (playerStore) {
        const botVehicle = playerStore.players?.player2?.vehicles?.ship;
        console.log(`[BotState] Bot status: Fuel=${botVehicle?.fuel}, At base=${botVehicle?.coord === botVehicle?.startCoord}`);
      }
    },
    onExitState: (playerStore, changeState, targetState) => {
      console.log(`[BotState] Exiting IDLE state, transitioning to ${targetState}`);
      
      // Des actions spécifiques pourraient être ajoutées ici selon l'état de destination
      const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
      if (botVehicle) {
        // Enregistrer l'état de transition pour référence ou débogage
        console.log(`[BotState] Transition details: Fuel=${botVehicle.fuel}, Resources=${JSON.stringify(botVehicle.resources)}`);
      }
    },
    // Nouvelle fonction d'évaluation centralisée
    evaluateConditions: (botVehicle, playerStore) => {
      console.log("[BotState] Evaluating conditions from IDLE state");

      if (!botVehicle) return null;
      
      // Récupérer la mémoire du bot
      const botMemory = playerStore?.players?.player2?.memory;
      
      // 1. SAFETY - Vérifier le niveau de carburant (PRIORITÉ LA PLUS HAUTE)
      if (botVehicle.fuel < 50) {
        console.log("[BotState][IDLE] Low fuel detected, should return to base");
        return BOT_STATES.RETURNING;
      }
      
      // 2. CAPACITY - Vérifier si capacité maximale atteinte
      if (botVehicle.isAtCapacity) {
        console.log("[BotState][IDLE] Maximum capacity reached, should return to base");
        return BOT_STATES.RETURNING;
      }
      
      // 3. EFFICIENCY - Vérifier s'il y a des ressources à collecter
      const hasKnownResources = botMemory?.knownResources && 
                               botMemory.knownResources.length > 0;
      
      if (hasKnownResources && botVehicle.fuel >= 50) {
        console.log(`[BotState][IDLE] ${botMemory.knownResources.length} resources available, should collect`);
        return BOT_STATES.COLLECTING;
      }
      
      // 4. DISCOVERY - Par défaut, explorer si carburant suffisant
      if (botVehicle.fuel >= 50) {
        console.log("[BotState][IDLE] No specific conditions met, defaulting to exploration");
        return BOT_STATES.EXPLORING;
      }
      
      // Si aucune condition n'est remplie, rester en IDLE
      console.log("[BotState][IDLE] No transition conditions met, remaining in IDLE");
      return BOT_STATES.IDLE;
    }
  },
  
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration de la carte",
    defaultAction: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
    onEnterState: () => {
      console.log("[BotState] Entering EXPLORING state");
    },
    onExitState: (playerStore, changeState) => {
      console.log("[BotState] Exiting EXPLORING state - Returning to IDLE for evaluation");
      
      // Toujours retourner à l'état IDLE après la fin des actions d'exploration
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
    }
  },
  
  [BOT_STATES.COLLECTING]: {
    description: "Bot en collecte de ressources",
    defaultAction: { type: 'collect', priority: PRIORITY.MEDIUM },
    onEnterState: () => {
      console.log("[BotState] Entering COLLECTING state");
    },
    onExitState: (playerStore, changeState) => {
      console.log("[BotState] Exiting COLLECTING state - Returning to IDLE for evaluation");
      
      // Toujours retourner à l'état IDLE après la fin des actions de collecte
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
    }
  },
  
  [BOT_STATES.RETURNING]: {
    description: "Bot en retour vers sa base",
    defaultAction: { type: 'returnToBase', priority: PRIORITY.HIGH },
    onEnterState: () => {
      console.log("[BotState] Entering RETURNING state");
    },
    onExitState: (playerStore, changeState) => {
      // Lors de la sortie de l'état RETURNING, transférer les ressources
      if (playerStore && playerStore.transferResourcesToScore) {
        const botVehicle = playerStore.players?.player2?.vehicles?.ship;
        if (botVehicle && botVehicle.coord === botVehicle.startCoord) {
          console.log("[BotState] Transferring resources to score before exiting RETURNING state");
          playerStore.transferResourcesToScore('player2', 'ship');
          
          // Réinitialiser l'indicateur de capacité maximale
          playerStore.updateVehicle('player2', 'ship', { isAtCapacity: false });
        }
      }
      
      console.log("[BotState] Exiting RETURNING state - Returning to IDLE for evaluation");
      
      // Toujours retourner à l'état IDLE après la fin des actions de retour à la base
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
    }
  }
};