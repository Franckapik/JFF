// src/ai/fsm/conditions/botConditions.js
// Conditions centralisées qui déclenchent des transitions d'état dans la FSM

import { BOT_STATES, PRIORITY, IDLE_EVALUATION } from '../../constants/botConstants';
import usePlayerStore from '../../../stores/usePlayerStore';

/**
 * Registre des conditions du bot - SYSTÈME CENTRALISÉ
 * Toutes les décisions concernant les transitions d'état et les conditions
 * sont maintenant gérées ici pour éviter la duplication de logique
 */
export const BotConditions = {
  // === CONDITIONS DE SÉCURITÉ (PRIORITÉ LA PLUS HAUTE) ===
  
  /**
   * Vérifie si le niveau de carburant est bas
   * @param {Object} botVehicle - Le véhicule du bot
   * @param {number} threshold - Seuil en dessous duquel le carburant est considéré comme bas (défaut: 50)
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isLowFuel: (botVehicle, threshold = 50) => {
    if (!botVehicle) return { result: false };
    
    const isLow = botVehicle.fuel < threshold;
    return {
      result: isLow,
      priority: IDLE_EVALUATION.SAFETY,
      state: isLow ? BOT_STATES.RETURNING : null,
      action: isLow ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  /**
   * Vérifie s'il y a suffisamment de carburant pour une action
   * @param {Object} botVehicle - Le véhicule du bot
   * @param {number} threshold - Seuil au-dessus duquel le carburant est considéré comme suffisant (défaut: 50)
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  hasEnoughFuel: (botVehicle, threshold = 50) => {
    if (!botVehicle) return { result: false };
    
    const hasEnough = botVehicle.fuel >= threshold;
    return {
      result: hasEnough,
      priority: IDLE_EVALUATION.SAFETY
    };
  },
  
  // === CONDITIONS DE CAPACITÉ ===
  
  /**
   * Vérifie si le véhicule est à capacité maximale
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isAtMaxCapacity: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    const isAtCapacity = botVehicle.isAtCapacity === true;
    return {
      result: isAtCapacity,
      priority: IDLE_EVALUATION.CAPACITY,
      state: isAtCapacity ? BOT_STATES.RETURNING : null,
      action: isAtCapacity ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  // === CONDITIONS D'EFFICACITÉ ===
  
  /**
   * Vérifie s'il y a suffisamment de ressources connues pour collecter
   * @returns {Object} - Résultat de l'évaluation de la condition avec le nombre minimum de ressources requises
   */
  hasEnoughKnownResources: (minResources = 3) => {
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    const hasEnoughResources = botMemory?.knownResources && 
                               botMemory.knownResources.length >= minResources;
    
    return {
      result: hasEnoughResources,
      priority: IDLE_EVALUATION.EFFICIENCY
    };
  },
  
  /**
   * Vérifie si des ressources ont été découvertes
   * @param {string} currentState - L'état actuel du bot
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  hasDiscoveredResources: (currentState) => {
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Vérifier s'il y a au moins 3 ressources connues
    const hasEnoughResources = botMemory && 
                              botMemory.knownResources && 
                              botMemory.knownResources.length >= 3;
    
    // Vérifier s'il y a une nouvelle découverte de ressource
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
      
      // Si nous sommes dans un état actif (non-IDLE), retourner à IDLE pour réévaluation
      if (currentState && currentState !== BOT_STATES.IDLE) {
        return {
          result: true,
          priority: IDLE_EVALUATION.EFFICIENCY,
          state: BOT_STATES.IDLE
        };
      } 
      // Si nous sommes déjà dans IDLE, transition directe vers COLLECTING
      else if (currentState === BOT_STATES.IDLE) {
        return {
          result: true,
          priority: IDLE_EVALUATION.EFFICIENCY,
          state: BOT_STATES.COLLECTING,
          action: { type: 'moveToResource', priority: PRIORITY.HIGH }
        };
      }
    }
    
    return {
      result: false,
      priority: IDLE_EVALUATION.EFFICIENCY
    };
  },
  
  /**
   * Vérifie si toutes les ressources connues ont été collectées
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  allKnownResourcesCollected: () => {
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
  
  // === CONDITIONS DE LOCALISATION ===
  
  /**
   * Vérifie si le véhicule est à la base
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isAtBase: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    const isAtBase = botVehicle.coord === botVehicle.startCoord;
    return {
      result: isAtBase,
      priority: IDLE_EVALUATION.SAFETY,
      action: isAtBase ? { type: 'refuelAtBase', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  /**
   * Vérifie si le drone est au même endroit que le vaisseau
   * @param {Object} playerStore - Le store du joueur pour obtenir les véhicules
   * @returns {Object} - Résultat avec drone et vaisseau au même endroit
   */
  isDroneAtShip: () => {
    const playerState = usePlayerStore.getState();
    const botVehicle = playerState.players?.player2?.vehicles?.ship;
    const botDrone = playerState.players?.player2?.vehicles?.drone3;
    
    if (!botVehicle || !botDrone) return { result: false };
    
    const droneAtShip = botDrone.coord === botVehicle.coord;
    return {
      result: droneAtShip
    };
  },
  
  /**
   * Vérifie si le drone est en mouvement
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isDroneMoving: () => {
    const playerState = usePlayerStore.getState();
    const botDrone = playerState.players?.player2?.vehicles?.drone3;
    
    if (!botDrone) return { result: false };
    
    return {
      result: botDrone.isMoving === true
    };
  },
  
  /**
   * Vérifie si le bot est en mouvement
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isShipMoving: () => {
    const playerState = usePlayerStore.getState();
    const botVehicle = playerState.players?.player2?.vehicles?.ship;
    
    if (!botVehicle) return { result: false };
    
    return {
      result: botVehicle.isMoving === true
    };
  },
  
  /**
   * Vérifie si le ravitaillement est complet
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isFullyRefueled: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    const isFull = botVehicle.fuel >= 100;
    return {
      result: isFull
    };
  },
  
  // === CONDITIONS DE DÉCOUVERTE ===
  
  /**
   * Vérifie si le bot a besoin d'explorer davantage
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  shouldExplore: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Vérifier d'abord le carburant
    const hasEnoughFuel = BotConditions.hasEnoughFuel(botVehicle);
    if (!hasEnoughFuel.result) return { result: false };
    
    // Ensuite vérifier s'il y a assez de ressources connues
    const hasEnoughResources = BotConditions.hasEnoughKnownResources();
    
    // On devrait explorer s'il n'y a pas assez de ressources connues
    return {
      result: !hasEnoughResources.result,
      priority: IDLE_EVALUATION.DISCOVERY,
      state: !hasEnoughResources.result ? BOT_STATES.EXPLORING : null,
      action: !hasEnoughResources.result ? { type: 'exploreDrone', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  // === FONCTIONS COMPOSÉES DE HAUT NIVEAU ===
  
  /**
   * Détermine si le bot doit retourner à sa base
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation des conditions
   */
  shouldReturnToBase: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Vérifier le niveau de carburant
    const lowFuel = BotConditions.isLowFuel(botVehicle);
    
    // Vérifier si capacité maximale atteinte
    const atMaxCapacity = BotConditions.isAtMaxCapacity(botVehicle);
    
    // Retourner à la base si l'une des conditions est remplie
    return {
      result: lowFuel.result || atMaxCapacity.result,
      state: BOT_STATES.RETURNING,
      action: { type: 'returnToBase', priority: PRIORITY.HIGH }
    };
  },
  
  /**
   * Évalue l'état suivant depuis l'état IDLE
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - L'état suivant le plus approprié selon les conditions
   */
  evaluateNextStateFromIdle: (botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // 1. SAFETY - Vérifier s'il faut retourner à la base (priorité la plus haute)
    const needsToReturn = BotConditions.shouldReturnToBase(botVehicle);
    if (needsToReturn.result) return needsToReturn;
    
    // 2. CAPACITY - On ne fait pas de vérification supplémentaire ici, c'est inclus dans shouldReturnToBase
    
    // 3. EFFICIENCY - Vérifier s'il faut collecter des ressources
    const hasEnoughFuel = BotConditions.hasEnoughFuel(botVehicle);
    const hasEnoughResources = BotConditions.hasEnoughKnownResources();
    
    if (hasEnoughFuel.result && hasEnoughResources.result) {
      return {
        result: true,
        state: BOT_STATES.COLLECTING,
        action: { type: 'moveToResource', priority: PRIORITY.MEDIUM }
      };
    }
    
    // 4. DISCOVERY - Par défaut, explorer si rien d'autre à faire et assez de carburant
    if (hasEnoughFuel.result) {
      return {
        result: true,
        state: BOT_STATES.EXPLORING,
        action: { type: 'exploreDrone', priority: PRIORITY.MEDIUM }
      };
    }
    
    // Si aucune condition n'est remplie, rester en IDLE
    return { result: false };
  },
  
  /**
   * Vérification complète des conditions selon l'état actuel
   * @param {string} botState - L'état actuel du bot
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de la vérification des conditions
   */
  checkAllConditions: (botState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Vérifier les conditions selon l'état actuel
    switch (botState) {
      case BOT_STATES.IDLE:
        // Pour IDLE, la vérification se fait via evaluateNextStateFromIdle
        // Aucune condition spécifique de sortie ici car c'est l'état central
        break;
        
      case BOT_STATES.EXPLORING:
        // Conditions qui font revenir à IDLE depuis EXPLORING
        
        // 1. Vérifier le carburant (priorité la plus haute)
        const lowFuelExploring = BotConditions.isLowFuel(botVehicle);
        if (lowFuelExploring.result) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 2. Vérifier si assez de ressources ont été découvertes
        const resourcesDiscoveredExploring = BotConditions.hasDiscoveredResources(botState);
        if (resourcesDiscoveredExploring.result) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 3. Vérifier si le drone est revenu au vaisseau après exploration
        const droneAtShipExploring = BotConditions.isDroneAtShip();
        const playerState = usePlayerStore.getState();
        const hasExplored = playerState.players?.player2?.memory?.explorationCount > 0;
        
        if (droneAtShipExploring.result && hasExplored) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
        
      case BOT_STATES.COLLECTING:
        // Conditions qui font revenir à IDLE depuis COLLECTING
        
        // 1. Vérifier le carburant (priorité la plus haute)
        const lowFuelCollecting = BotConditions.isLowFuel(botVehicle);
        if (lowFuelCollecting.result) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 2. Vérifier si capacité maximale atteinte
        const maxCapacity = BotConditions.isAtMaxCapacity(botVehicle);
        if (maxCapacity.result) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 3. Vérifier si toutes les ressources ont été collectées
        const allCollected = BotConditions.allKnownResourcesCollected();
        if (allCollected.result) {
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
        
      case BOT_STATES.RETURNING:
        // Conditions qui font revenir à IDLE depuis RETURNING
        
        // Vérifier si le bot est arrivé à la base
        const atBase = BotConditions.isAtBase(botVehicle);
        if (atBase.result) {
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