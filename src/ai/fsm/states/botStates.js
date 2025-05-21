// src/ai/fsm/states/botStates.js
// Définition des comportements spécifiques à chaque état du bot

import { BOT_STATES, PRIORITY, ACTION_STATUS, COLLECT_ACTION_TYPES } from '../../constants/botConstants';
import { BOT_PLAYER_ID, getMainShipId } from '../../constants/playerConstants';
import usePlayerStore from '../../../stores/playerStore';
import fsmLogger from '../../../utils/fsmLogger';

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
      fsmLogger.state("Entering IDLE state - Evaluating conditions");
      
      // Récupérer l'état actuel du bot si playerStore est fourni
      if (playerStore) {
        const botVehicle = playerStore.players?.[BOT_PLAYER_ID]?.vehicles?.[getMainShipId()];
        fsmLogger.info(`Bot status: Fuel=${botVehicle?.fuel}, At base=${botVehicle?.coord === botVehicle?.startCoord}`);
      }
    },
    onExitState: (playerStore, changeState, targetState) => {
      fsmLogger.state(`Exiting IDLE state, transitioning to ${targetState}`);
      
      // Des actions spécifiques pourraient être ajoutées ici selon l'état de destination
      const botVehicle = playerStore?.players?.[BOT_PLAYER_ID]?.vehicles?.[getMainShipId()];
      if (botVehicle) {
        // Enregistrer l'état de transition pour référence ou débogage
        fsmLogger.info(`Transition details: Fuel=${botVehicle.fuel}, Resources=${JSON.stringify(botVehicle.resources)}`);
      }
    },
    // Nouvelle fonction d'évaluation centralisée
    evaluateConditions: (botVehicle, playerStore) => {
      fsmLogger.condition("Evaluating conditions from IDLE state");

      if (!botVehicle) return null;
      
      // Récupérer la mémoire du bot
      const botMemory = playerStore?.players?.[BOT_PLAYER_ID]?.memory;
      
      // 1. SAFETY - Vérifier le niveau de carburant (PRIORITÉ LA PLUS HAUTE)
      if (botVehicle.fuel < 50) {
        fsmLogger.condition("[IDLE] Low fuel detected, should return to base");
        return BOT_STATES.RETURNING;
      }
      
      // 2. CAPACITY - Vérifier si capacité maximale atteinte
      if (botVehicle.isAtCapacity) {
        fsmLogger.condition("[IDLE] Maximum capacity reached, should return to base");
        return BOT_STATES.RETURNING;
      }
      
      // 3. EFFICIENCY - Vérifier s'il y a des ressources à collecter
      const hasKnownResources = botMemory?.knownResources && 
                               botMemory.knownResources.length > 0;
      
      if (hasKnownResources && botVehicle.fuel >= 50) {
        fsmLogger.condition(`[IDLE] ${botMemory.knownResources.length} resources available, should collect`);
        return BOT_STATES.COLLECTING;
      }
      
      // 4. DISCOVERY - Par défaut, explorer si carburant suffisant
      if (botVehicle.fuel >= 50) {
        fsmLogger.condition("[IDLE] No specific conditions met, defaulting to exploration");
        return BOT_STATES.EXPLORING;
      }
      
      // Si aucune condition n'est remplie, rester en IDLE
      fsmLogger.condition("[IDLE] No transition conditions met, remaining in IDLE");
      return BOT_STATES.IDLE;
    }
  },
  
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration de la carte",
    defaultAction: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
    onEnterState: () => {
      fsmLogger.state("Entering EXPLORING state");
    },
    onExitState: (playerStore, changeState) => {
      // Ajout d'une variable statique pour éviter les appels multiples
      if (BotStateConfig[BOT_STATES.EXPLORING]._isExiting) return;
      
      // Marquer que nous sommes en train de sortir pour éviter la récursion
      BotStateConfig[BOT_STATES.EXPLORING]._isExiting = true;
      
      fsmLogger.state("Exiting EXPLORING state - Returning to IDLE for evaluation");
      
      // Toujours retourner à l'état IDLE après la fin des actions d'exploration
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
      
      // Réinitialiser l'indicateur après un court délai
      setTimeout(() => {
        BotStateConfig[BOT_STATES.EXPLORING]._isExiting = false;
      }, 50);
    },
    // Initialiser l'indicateur d'état de sortie
    _isExiting: false
  },
  
  [BOT_STATES.COLLECTING]: {
    description: "Bot en collecte de ressources",
    // Modification importante: l'action par défaut est maintenant adaptative
    getDefaultAction: (playerStore, tileStore, addAction) => {
      // Vérifier si le bot est sur la tuile cible pour savoir quelle action ajouter
      const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
      const botMemory = playerStore?.players?.player2?.memory;

      // Si la mémoire contient une cible de ressource actuelle
      if (botVehicle && botMemory?.currentTargetResource) {
        // Si le bot est déjà sur la tuile cible, ajouter directement collectResource
        if (botVehicle.coord === botMemory.currentTargetResource.coord) {
          fsmLogger.action("Bot is at resource location, adding collectResource action");
          return { type: 'collectResource', priority: PRIORITY.HIGH };
        }
      }
      
      // Sinon, ajouter moveToResource (comportement par défaut)
      return { type: 'moveToResource', priority: PRIORITY.MEDIUM };
    },
    // Conserver l'action par défaut originale pour compatibilité
    defaultAction: { type: 'moveToResource', priority: PRIORITY.MEDIUM },
    onEnterState: (playerStore) => {
      fsmLogger.state("Entering COLLECTING state");
      
      // Solution temporaire: vérifier immédiatement si le bot est déjà sur une tuile de ressource
      const botVehicle = playerStore?.players?.player2?.vehicles?.ship;
      const botMemory = playerStore?.players?.player2?.memory;
      
      // Si nous avons des ressources ciblées et que le bot est déjà dessus
      if (botVehicle && botMemory?.knownResources && botMemory.knownResources.length > 0) {
        // Chercher si le bot est déjà sur une des ressources connues
        const currentResource = botMemory.knownResources.find(r => r.coord === botVehicle.coord);
        
        if (currentResource) {
          // Enregistrer dans la mémoire du bot quelle est la ressource actuelle
          playerStore.updatePlayerMemory('player2', {
            currentTargetResource: currentResource
          });
          
          fsmLogger.action(`Bot already at resource location ${botVehicle.coord}, preparing collection`);
        }
      }
    },
    onExitState: (playerStore, changeState) => {
      // Ajout d'une variable statique pour éviter les appels multiples
      if (BotStateConfig[BOT_STATES.COLLECTING]._isExiting) return;
      
      // Marquer que nous sommes en train de sortir pour éviter la récursion
      BotStateConfig[BOT_STATES.COLLECTING]._isExiting = true;
      
      fsmLogger.state("Exiting COLLECTING state - Returning to IDLE for evaluation");
      
      // Nettoyer les données de ciblage de ressources
      if (playerStore) {
        playerStore.updatePlayerMemory('player2', {
          currentTargetResource: null
        });
      }
      
      // Toujours retourner à l'état IDLE après la fin des actions de collecte
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
      
      // Réinitialiser l'indicateur après un court délai
      setTimeout(() => {
        BotStateConfig[BOT_STATES.COLLECTING]._isExiting = false;
      }, 50);
    },
    // Initialiser l'indicateur d'état de sortie
    _isExiting: false
  },
  
  [BOT_STATES.RETURNING]: {
    description: "Bot en retour vers sa base",
    defaultAction: { type: 'returnToBase', priority: PRIORITY.HIGH },
    onEnterState: (playerStore, addAction) => {
      fsmLogger.state("Entering RETURNING state");
      
      // Ajouter explicitement l'action returnToBase à la file pour s'assurer qu'elle soit exécutée
      if (addAction) {
        fsmLogger.action("Adding returnToBase action after entering RETURNING state");
        addAction('returnToBase', PRIORITY.HIGH);
      }
    },
    onExitState: (playerStore, changeState) => {
      // Ajout d'une variable statique pour éviter les appels multiples
      if (BotStateConfig[BOT_STATES.RETURNING]._isExiting) return;
      
      // Marquer que nous sommes en train de sortir pour éviter la récursion
      BotStateConfig[BOT_STATES.RETURNING]._isExiting = true;
      
      // Toute la logique de traitement (transfert des ressources) est maintenant gérée par l'état IDLE
      fsmLogger.state("Exiting RETURNING state - Returning to IDLE for evaluation");
      
      // Toujours retourner à l'état IDLE après la fin des actions de retour à la base
      if (changeState) {
        changeState(BOT_STATES.IDLE);
      }
      
      // Réinitialiser l'indicateur après un court délai
      setTimeout(() => {
        BotStateConfig[BOT_STATES.RETURNING]._isExiting = false;
      }, 50);
    },
    // Initialiser l'indicateur d'état de sortie
    _isExiting: false
  }
};