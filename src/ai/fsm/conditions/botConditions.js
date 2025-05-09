// src/ai/fsm/conditions/botConditions.js
// Conditions qui déclenchent des transitions d'état dans la FSM

import { BOT_STATES, PRIORITY, IDLE_EVALUATION } from '../../constants/botConstants';
import usePlayerStore from '../../../stores/usePlayerStore';

/**
 * Registre des conditions du bot
 * Restructuré pour une architecture centralisée autour de l'état IDLE
 */
export const BotConditions = {
  // === CONDITIONS DE SÉCURITÉ (PRIORITÉ LA PLUS HAUTE) ===
  
  // Vérifie si le carburant est bas
  isLowFuel: (botVehicle) => {
    const isLow = botVehicle?.fuel < 50;
    return {
      result: isLow,
      priority: IDLE_EVALUATION.SAFETY,
      state: isLow ? BOT_STATES.RETURNING : null,
      action: isLow ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  // === CONDITIONS DE CAPACITÉ ===
  
  // Vérifie si le véhicule est à capacité maximale
  isAtMaxCapacity: (botVehicle) => {
    const isAtCapacity = botVehicle.isAtCapacity === true;
    return {
      result: isAtCapacity,
      priority: IDLE_EVALUATION.CAPACITY,
      state: isAtCapacity ? BOT_STATES.RETURNING : null,
      action: isAtCapacity ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  // === CONDITIONS D'EFFICACITÉ ===
  
  // Vérifie si des ressources ont été découvertes
  hasDiscoveredResources: (currentState, botVehicle) => {
    // Récupérer directement l'état du joueur
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Vérifier s'il y a au moins 3 ressources connues
    const hasEnoughResources = botMemory && 
                              botMemory.knownResources && 
                              botMemory.knownResources.length >= 3;
    
    // Vérifier s'il y a une nouvelle découverte de ressource (flag défini dans UnifiedDroneMovement)
    const hasNewDiscovery = botMemory?.hasNewResourceDiscovery === true;
    
    // Vérifier si le drone est revenu au vaisseau après une exploration
    const droneReturnedToShip = botMemory?.droneReturnedToShip === true;
    
    // On doit avoir assez de ressources ET soit une nouvelle découverte, soit le drone de retour
    const shouldCollect = hasEnoughResources && (hasNewDiscovery || droneReturnedToShip);
    
    // Si la condition est remplie, réinitialiser les flags dans la mémoire
    if (shouldCollect) {
      // Réinitialiser les flags dans la mémoire
      usePlayerStore.getState().updatePlayerMemory('player2', {
        hasNewResourceDiscovery: false,
        droneReturnedToShip: false
      });
      
      console.log("[BotConditions] Resource discovery conditions met");
      
      // Si nous sommes dans l'état EXPLORING ou un autre état actif, 
      // nous retournons à IDLE qui évaluera automatiquement la prochaine action
      if (currentState && currentState !== BOT_STATES.IDLE) {
        console.log(`[BotConditions] In state ${currentState}, returning to IDLE for centralized evaluation`);
        return {
          result: true,
          priority: IDLE_EVALUATION.EFFICIENCY,
          state: BOT_STATES.IDLE, // Toujours retourner à IDLE depuis les états actifs
          action: null // Pas d'action spécifique, l'évaluation sera faite dans IDLE
        };
      } 
      // Si nous sommes déjà dans IDLE, le système peut passer directement à COLLECTING
      else if (currentState === BOT_STATES.IDLE) {
        console.log(`[BotConditions] In IDLE state, can transition directly to COLLECTING`);
        return {
          result: true,
          priority: IDLE_EVALUATION.EFFICIENCY,
          state: BOT_STATES.COLLECTING,
          action: { type: 'collect', priority: PRIORITY.HIGH }
        };
      }
    }
    
    return {
      result: false,
      priority: IDLE_EVALUATION.EFFICIENCY,
      state: null,
      action: null
    };
  },
  
  // Vérifie si toutes les ressources connues ont été collectées
  allKnownResourcesCollected: (botVehicle) => {
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Si le bot n'a pas de mémoire ou pas de ressources connues
    const noResourcesToCollect = !botMemory || 
                             !botMemory.knownResources || 
                             botMemory.knownResources.length === 0;
    
    return {
      result: noResourcesToCollect,
      priority: IDLE_EVALUATION.EFFICIENCY,
      state: noResourcesToCollect ? BOT_STATES.EXPLORING : null,
      action: noResourcesToCollect ? { type: 'exploreDrone', priority: PRIORITY.HIGH } : null
    };
  },
  
  // === CONDITIONS DE RETOUR À LA BASE ===
  
  // Vérifie si le véhicule est à la base
  isAtBase: (botVehicle) => {
    const isAtBase = botVehicle?.coord === botVehicle?.startCoord;
    return {
      result: isAtBase,
      priority: IDLE_EVALUATION.SAFETY,
      action: isAtBase ? { type: 'refuel', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  // Vérifie si le ravitaillement est complet
  isFullyRefueled: (botVehicle) => {
    const isFull = botVehicle?.fuel >= 100;
    return {
      result: isFull,
      priority: IDLE_EVALUATION.SAFETY,
      state: isFull ? null : null,      action: isFull ? null : null    };
  },
  
  // === CONDITIONS DE DÉCOUVERTE ===
  
  // Vérifie si le bot a besoin d'explorer davantage
  shouldExplore: (botVehicle) => {
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // MODIFICATION: Si pas assez de ressources connues (moins de 3)
    const needsExploration = !botMemory?.knownResources || 
                           botMemory.knownResources.length < 3;
    
    // Suffisamment de carburant pour explorer
    const hasEnoughFuel = botVehicle?.fuel >= 50;
    
    const shouldExplore = needsExploration && hasEnoughFuel;
    
    return {
      result: shouldExplore,
      priority: IDLE_EVALUATION.DISCOVERY,
      state: shouldExplore ? BOT_STATES.EXPLORING : null,
      action: shouldExplore ? { type: 'exploreDrone', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  // === NOUVELLES FONCTIONS POUR L'ARCHITECTURE CENTRALISÉE ===
  
  // Nouvelle fonction pour déterminer si le bot doit passer de IDLE à EXPLORING
  shouldStartExploring: (botVehicle, playerStore) => {
    // Vérifier d'abord qu'il y a assez de carburant
    if (botVehicle.fuel < 50) return { result: false };
    
    const botMemory = playerStore?.players?.player2?.memory;
    
    // MODIFICATION: Si le bot n'a pas assez de ressources connues (moins de 3)
    const needsExploration = !botMemory?.knownResources || 
                           botMemory.knownResources.length < 3;
    
    return {
      result: needsExploration,
      state: BOT_STATES.EXPLORING,
      action: { type: 'exploreDrone', priority: PRIORITY.MEDIUM }
    };
  },
  
  // Nouvelle fonction pour déterminer si le bot doit passer de IDLE à COLLECTING
  shouldStartCollecting: (botVehicle, playerStore) => {
    // Vérifier d'abord qu'il y a assez de carburant
    if (botVehicle.fuel < 50) return { result: false };
    
    const botMemory = playerStore?.players?.player2?.memory;
    
    // MODIFICATION: Vérifier s'il y a au moins 3 ressources connues
    const hasEnoughResources = botMemory?.knownResources && 
                             botMemory.knownResources.length >= 3;
                             
    return {
      result: hasEnoughResources,
      state: BOT_STATES.COLLECTING,
      action: { type: 'collect', priority: PRIORITY.MEDIUM }
    };
  },
  
  // Détermine si le bot doit retourner à sa base
  shouldReturnToBase: (botVehicle) => {
    // Vérifier le niveau de carburant
    const isLowFuel = botVehicle?.fuel < 50;
    
    // Vérifier si capacité maximale atteinte
    const isAtCapacity = botVehicle?.isAtCapacity === true;
    
    // Retourner à la base si l'une des conditions est remplie
    return {
      result: isLowFuel || isAtCapacity,
      state: BOT_STATES.RETURNING,
      action: { type: 'returnToBase', priority: PRIORITY.HIGH }
    };
  },
  
  // Fonction centrale d'évaluation depuis l'état IDLE
  evaluateNextState: (botVehicle, playerStore) => {
    if (!botVehicle) return { result: false };
    
    // Ordre de priorité des évaluations
    
    // 1. SAFETY - Vérifier s'il faut retourner à la base (priorité la plus haute)
    const needsToReturn = BotConditions.shouldReturnToBase(botVehicle);
    if (needsToReturn.result) return needsToReturn;
    
    // 2. EFFICIENCY - Vérifier s'il faut collecter des ressources
    const shouldCollect = BotConditions.shouldStartCollecting(botVehicle, playerStore);
    if (shouldCollect.result) return shouldCollect;
    
    // 3. DISCOVERY - Par défaut, explorer si rien d'autre à faire
    const shouldExplore = BotConditions.shouldStartExploring(botVehicle, playerStore);
    if (shouldExplore.result) return shouldExplore;
    
    // Si aucune condition n'est remplie, rester en IDLE
    return { result: false };
  },
  
  // Vérification complète des conditions selon l'état actuel
  checkAllConditions: (botState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Vérifier les conditions selon l'état actuel
    switch (botState) {
      case BOT_STATES.IDLE:
        // Pour IDLE, la vérification se fait via evaluateNextState
        // Aucune condition spécifique de sortie ici car c'est l'état central
        break;
        
      case BOT_STATES.EXPLORING:
        // Conditions qui font revenir à IDLE depuis EXPLORING
        
        // 1. Vérifier le carburant (priorité la plus haute)
        const lowFuelExploring = BotConditions.isLowFuel(botVehicle);
        if (lowFuelExploring.result) {
          console.log("[BotConditions] Low fuel detected in EXPLORING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 2. Vérifier si assez de ressources ont été découvertes
        const resourcesDiscoveredExploring = BotConditions.hasDiscoveredResources(botVehicle);
        if (resourcesDiscoveredExploring.result) {
          console.log("[BotConditions] Enough resources discovered, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
        
      case BOT_STATES.COLLECTING:
        // Conditions qui font revenir à IDLE depuis COLLECTING
        
        // 1. Vérifier le carburant (priorité la plus haute)
        const lowFuelCollecting = BotConditions.isLowFuel(botVehicle);
        if (lowFuelCollecting.result) {
          console.log("[BotConditions] Low fuel detected in COLLECTING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 2. Vérifier si capacité maximale atteinte
        const maxCapacity = BotConditions.isAtMaxCapacity(botVehicle);
        if (maxCapacity.result) {
          console.log("[BotConditions] Maximum capacity reached in COLLECTING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 3. Vérifier si toutes les ressources ont été collectées
        const allCollected = BotConditions.allKnownResourcesCollected(botVehicle);
        if (allCollected.result) {
          console.log("[BotConditions] All known resources collected, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }

        // 4. NOUVELLE CONDITION: Vérifier si le bot a terminé une collecte sur une tuile (n'est plus en mouvement)
        // Cette condition sera traitée directement dans moveToKnownResource, pas besoin de la répliquer ici
        
        break;
        
      case BOT_STATES.RETURNING:
        // Conditions qui font revenir à IDLE depuis RETURNING
        
        // Vérifier si le bot est arrivé à la base
        const atBase = BotConditions.isAtBase(botVehicle);
        if (atBase.result) {
          console.log("[BotConditions] Reached base in RETURNING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
        
      default:
        // État non reconnu, retourner à IDLE
        return { result: true, state: BOT_STATES.IDLE };
    }
    
    // Si aucune condition n'est remplie
    return { result: false };
  }
};