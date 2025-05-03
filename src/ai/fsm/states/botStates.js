// src/ai/fsm/states/botStates.js
// Définition des comportements spécifiques à chaque état du bot

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';

/**
 * Configuration des comportements par état
 * Chaque état définit:
 * - defaultAction: Action à ajouter quand la file est vide
 * - onEnterState: Fonction appelée quand le bot entre dans cet état
 * - onExitState: Fonction appelée quand le bot quitte cet état
 */
export const BotStateConfig = {
  [BOT_STATES.IDLE]: {
    description: "Bot inactif, en attente",
    defaultAction: null, // Pas d'action par défaut en mode IDLE
    onEnterState: () => {
      console.log("[BotState] Entering IDLE state");
    },
    onExitState: () => {
      console.log("[BotState] Exiting IDLE state");
    }
  },
  
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration de la carte",
    defaultAction: { type: 'move', priority: PRIORITY.LOW },
    onEnterState: () => {
      console.log("[BotState] Entering EXPLORING state");
    },
    onExitState: () => {
      console.log("[BotState] Exiting EXPLORING state");
    }
  },
  
  [BOT_STATES.RETURNING]: {
    description: "Bot en retour vers sa base",
    defaultAction: { type: 'returnToBase', priority: PRIORITY.HIGH },
    onEnterState: () => {
      console.log("[BotState] Entering RETURNING state");
    },
    onExitState: (playerStore) => {
      // Lors de la sortie de l'état RETURNING, transférer les ressources
      if (playerStore.transferResourcesToScore) {
        const botVehicle = playerStore.players?.player2?.vehicles?.ship;
        if (botVehicle && botVehicle.coord === botVehicle.startCoord) {
          playerStore.transferResourcesToScore('player2', 'ship');
        }
      }
      console.log("[BotState] Exiting RETURNING state");
    }
  }
};