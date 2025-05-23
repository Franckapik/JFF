// src/ai/fsm/conditions/botConditions.js
// Conditions centralisées qui déclenchent des transitions d'état dans la FSM

import { BOT_STATES, PRIORITY, IDLE_EVALUATION } from '../../constants/botConstants';
import { 
  getBotPlayerId,
  getMainShipId, 
  getDroneId,
  VEHICLE_TYPES
} from '../../constants/playerConstants';
import usePlayerStore from '../../../stores/playerStore';
import useGameStore from '../../../stores/useGameStore';
import useBotStore from '../../../stores/useBotStore';
import useDroneState, { DRONE_STATES } from '../../../hooks/useDroneState';

/**
 * Registre des conditions du bot - SYSTÈME CENTRALISÉ
 * Toutes les décisions concernant les transitions d'état et les conditions
 * sont maintenant gérées ici pour éviter la duplication de logique
 */
export const BotConditions = {
  // Récupère l'ID du bot actif en fonction du store useBotStore
  getCurrentBotId: () => {
    // On utilise le currentBotId du store useBotStore au lieu d'une valeur fixe
    const botStore = useBotStore.getState();
    return botStore.currentBotId || getBotPlayerId(0); // Fallback sur player2 si non défini
  },

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
    
    // Vérifier d'abord le flag isAtCapacity
    let isAtCapacity = botVehicle.isAtCapacity === true;
    
    // Si le flag n'est pas activé, vérifier directement les niveaux de ressources
    if (!isAtCapacity && botVehicle.resources && botVehicle.maxCapacity) {
      const { food = 0, debris = 0, special = 0 } = botVehicle.resources;
      const { food: maxFood = 1000, debris: maxDebris = 1000, special: maxSpecial = 1000 } = botVehicle.maxCapacity;
      
      // Une seule ressource au maximum suffit pour déclencher l'état "à capacité maximale"
      isAtCapacity = food >= maxFood || debris >= maxDebris || special >= maxSpecial;
      
      // Log de débogage pour voir ce qui se passe
      if (isAtCapacity) {
        console.log(`[BotCondition] Ressources au-dessus des limites: Food ${food}/${maxFood}, Debris ${debris}/${maxDebris}, Special ${special}/${maxSpecial}`);
      }
    }
    
    // IMPORTANT: Si le bot a déjà déposé ses ressources à la base, 
    // réinitialiser le flag isAtCapacity
    if (isAtCapacity && botVehicle.coord === botVehicle.startCoord && 
        (!botVehicle.resources || 
         (botVehicle.resources.food === 0 && 
          botVehicle.resources.debris === 0 && 
          botVehicle.resources.special === 0))) {
      
      // Réinitialiser le flag directement
      const playerStore = usePlayerStore.getState();
      playerStore.updateVehicle('player2', 'ship', { isAtCapacity: false });
      
      console.log('[BotCondition] Réinitialisation du flag isAtCapacity car le bot est à la base sans ressources');
      isAtCapacity = false;
    }
    
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
    const botId = getBotPlayerId(0);
    const botMemory = playerState.players?.[botId]?.memory;
    
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
    const botId = getBotPlayerId(0);
    const botMemory = playerState.players?.[botId]?.memory;
    
    // Vérifier s'il y a au moins 3 ressources connues
    const hasEnoughResources = botMemory && 
                              botMemory.knownResources && 
                              botMemory.knownResources.length >= 3;
    
    // Vérifier s'il y a une nouvelle découverte de ressource
    const hasNewDiscovery = botMemory?.hasNewResourceDiscovery === true;
    
    // Use drone state machine to check if drone has returned
    const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
    const droneState = useDroneState.getState();
    const droneReturnedToShip = droneState.isDroneDocked(botDroneId);
    
    // On doit avoir assez de ressources ET soit une nouvelle découverte, soit le drone de retour
    const shouldCollect = hasEnoughResources && (hasNewDiscovery || droneReturnedToShip);
    
    // Si la condition est remplie, réinitialiser les flags dans la mémoire
    if (shouldCollect) {
      // Only reset discovery flag, drone state is managed by the state machine
      usePlayerStore.getState().updatePlayerMemory(botId, {
        hasNewResourceDiscovery: false
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
    const botId = getBotPlayerId(0);
    const botMemory = playerState.players?.[botId]?.memory;
    
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
      action: isAtBase ? { type: 'refuel', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  /**
   * Vérifie si des ressources sont disponibles dans la mémoire du bot
   * @returns {Object} - Résultat avec ressources trouvées
   */
  hasResourcesInMemory: () => {
    const playerState = usePlayerStore.getState();
    const botId = BotConditions.getCurrentBotId();
    const botMemory = playerState.players?.[botId]?.memory;
    
    const hasResources = botMemory?.knownResources && botMemory.knownResources.length > 0;
    
    return {
      result: hasResources,
      priority: IDLE_EVALUATION.EFFICIENCY
    };
  },
  
  /**
   * Vérifie si des dangers sont connus dans la mémoire du bot
   * @returns {Object} - Résultat avec dangers trouvés
   */
  hasKnownDangers: () => {
    const playerState = usePlayerStore.getState();
    const botId = BotConditions.getCurrentBotId();
    const botMemory = playerState.players?.[botId]?.memory;
    
    const hasDangers = botMemory?.knownHazards && botMemory.knownHazards.length > 0;
    
    return {
      result: hasDangers,
      priority: IDLE_EVALUATION.DANGER
    };
  },

  /**
   * Marque une ressource comme collectée dans la mémoire du bot
   * @param {string} resourceId - Identifiant de la ressource
   */
  markResourceAsCollected: (resourceId) => {
    const botId = BotConditions.getCurrentBotId();
    usePlayerStore.getState().updatePlayerMemory(botId, {
      collectedResources: [...(usePlayerStore.getState().players[botId]?.memory?.collectedResources || []), resourceId],
    });
  },

  /**
   * Vérifie si une tuile a déjà été explorée
   * @param {string} tileId - Identifiant de la tuile
   * @returns {Object} - Résultat avec tuile déjà explorée ou non
   */
  isTileExplored: (tileId) => {
    const playerState = usePlayerStore.getState();
    const botId = BotConditions.getCurrentBotId();
    const botMemory = playerState.players?.[botId]?.memory;
    
    const isExplored = botMemory?.exploredTiles && botMemory.exploredTiles.includes(tileId);
    
    return {
      result: isExplored
    };
  },

  /**
   * Vérifie si le drone est au même endroit que le vaisseau
   * @returns {Object} - Résultat avec drone et vaisseau au même endroit
   */
  isDroneAtShip: () => {
    const botId = BotConditions.getCurrentBotId();
    const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
    const droneState = useDroneState.getState();
    
    return {
      result: droneState.isDroneDocked(botDroneId)
    };
  },
  
  /**
   * Vérifie si le drone est en mouvement
   * @returns {Object} - Résultat avec état de mouvement du drone
   */
  isDroneMoving: () => {
    const botId = BotConditions.getCurrentBotId();
    const botDroneId = getDroneId(botId, VEHICLE_TYPES.EXPLORER_DRONE);
    const droneState = useDroneState.getState();
    
    return {
      result: droneState.isDroneInState(botDroneId, DRONE_STATES.MOVING_TO_TARGET) ||
              droneState.isDroneInState(botDroneId, DRONE_STATES.RETURNING_TO_SHIP)
    };
  },
  
  /**
   * Vérifie si le bot est en mouvement
   * @returns {Object} - Résultat de l'évaluation de la condition
   */
  isShipMoving: () => {
    const playerState = usePlayerStore.getState();
    const botId = BotConditions.getCurrentBotId();
    const botVehicleId = getMainShipId();
    const botVehicle = playerState.players?.[botId]?.vehicles?.[botVehicleId];
    
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
   * Fonction centrale pour évaluer les transitions d'état
   * @param {string} currentState - L'état actuel du bot (ou null pour évaluation générale)
   * @param {Object} botVehicle - Le véhicule du bot
   * @returns {Object} - Résultat de l'évaluation avec l'état cible et l'action à effectuer
   */
  evaluateStateTransition: (currentState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // === TRANSITIONS PRIORITAIRES (SÉCURITÉ) ===
    
    // 1. Vérifier s'il faut retourner à la base (carburant bas ou capacité max)
    // IMPORTANT: Ne pas vérifier cette condition si déjà dans l'état RETURNING
    // pour éviter la boucle infinie
    if (currentState !== BOT_STATES.RETURNING) {
      const needsToReturn = BotConditions.shouldReturnToBase(botVehicle);
      if (needsToReturn.result) {
        return {
          result: true,
          state: BOT_STATES.RETURNING,
          reason: "safety_critical"
        };
      }
    }
    
    // 2. Si déjà à la base, priorité au ravitaillement
    const atBase = BotConditions.isAtBase(botVehicle);
    if (atBase.result) {
      if (!BotConditions.isFullyRefueled(botVehicle).result) {
        return {
          result: true,
          state: BOT_STATES.IDLE,
          action: { type: 'refuel', priority: PRIORITY.HIGH },
          reason: "refueling"
        };
      }
    }
    
    // === TRANSITIONS BASÉES SUR L'ÉTAT ACTUEL ===
    
    // Transitions spécifiques selon l'état
    switch(currentState) {
      case BOT_STATES.IDLE:
        // Vérifier explicitement si le vaisseau est à capacité maximale
        const atCapacity = BotConditions.isAtMaxCapacity(botVehicle);
        if (atCapacity.result) {
          return {
            result: true,
            state: BOT_STATES.RETURNING,
            action: { type: 'returnToBase', priority: PRIORITY.HIGH },
            reason: "at_max_capacity"
          };
        }
        
        // Depuis IDLE, on priorise la collecte si possible
        const hasEnoughResources = BotConditions.hasEnoughKnownResources();
        const hasEnoughFuel = BotConditions.hasEnoughFuel(botVehicle);
        
        if (hasEnoughFuel.result && hasEnoughResources.result) {
          return {
            result: true,
            state: BOT_STATES.COLLECTING,
            action: { type: 'moveToResource', priority: PRIORITY.MEDIUM },
            reason: "efficiency"
          };
        }
        
        // Sinon, on explore
        if (hasEnoughFuel.result) {
          return {
            result: true,
            state: BOT_STATES.EXPLORING,
            action: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
            reason: "discovery"
          };
        }
        break;
        
      case BOT_STATES.EXPLORING:
        // Vérifier si des ressources ont été découvertes
        const resourcesDiscovered = BotConditions.hasDiscoveredResources(currentState);
        if (resourcesDiscovered.result) {
          return {
            result: true,
            state: BOT_STATES.IDLE,
            reason: "resources_discovered"
          };
        }
        
        // Vérifier si l'exploration est terminée (drone de retour)
        const droneAtShip = BotConditions.isDroneAtShip();
        const playerState = usePlayerStore.getState();
        const botId = BotConditions.getCurrentBotId();
        const hasExplored = playerState.players?.[botId]?.memory?.explorationCount > 0;
        
        if (droneAtShip.result && hasExplored) {
          return {
            result: true,
            state: BOT_STATES.IDLE,
            reason: "exploration_complete"
          };
        }
        break;
        
      case BOT_STATES.COLLECTING:
        // Vérifier si toutes les ressources connues sont collectées
        const allCollected = BotConditions.allKnownResourcesCollected();
        if (allCollected.result) {
          return {
            result: true,
            state: BOT_STATES.IDLE,
            reason: "collection_complete"
          };
        }
        break;
        
      case BOT_STATES.RETURNING:
        // Vérifier si le bot est arrivé à la base
        if (atBase.result) {
          return {
            result: true,
            state: BOT_STATES.IDLE,
            reason: "arrived_at_base"
          };
        }
        
        // IMPORTANT: Pour l'état RETURNING, ne pas retourner de résultat positif
        // si le bot n'est pas à la base, pour éviter la boucle de vérification
        // La transition vers cet état a déjà ajouté l'action returnToBase
        return { result: false };
        break;
    }
    
    // Aucune transition à effectuer
    return { result: false };
  },

  /**
   * Évalue les conditions depuis l'état IDLE
   * @returns {Object} - Résultat de l'évaluation avec l'état cible et l'action à effectuer
   */
  evaluateFromIdle: () => {
    const playerState = usePlayerStore.getState();
    const botId = BotConditions.getCurrentBotId();
    const canProceed = () => {
      // Vérifier s'il y a des ressources à collecter
      const resourcesToCollect = playerState.players[botId]?.memory?.knownResources || [];
      const hasResources = resourcesToCollect.length > 0;
      
      // Vérifier si le drone a terminé son exploration et est revenu
      const droneReturned = playerState.players[botId]?.memory?.droneReturnedToShip === true;
      
      // On peut procéder si on a des ressources à collecter OU si le drone est revenu
      return hasResources || droneReturned;
    };
    
    // Si le drone est en mouvement, on attend
    const droneMoving = BotConditions.isDroneMoving();
    if (droneMoving.result) {
      return { result: false };
    }
    
    // Si le vaisseau est en mouvement, on attend
    const shipMoving = BotConditions.isShipMoving();
    if (shipMoving.result) {
      return { result: false };
    }
    
    // Si on est à la base et le carburant est plein, on peut commencer à explorer
    const atBase = BotConditions.isAtBase();
    const fullyRefueled = BotConditions.isFullyRefueled();
    
    if (atBase.result && fullyRefueled.result) {
      return {
        result: true,
        state: BOT_STATES.EXPLORING,
        action: { type: 'exploreDrone', priority: PRIORITY.MEDIUM },
        reason: "start_exploring"
      };
    }
    
    // Si on n'est pas à la base, vérifier si on doit retourner
    if (!atBase.result) {
      const returnToBase = BotConditions.shouldReturnToBase();
      if (returnToBase.result) {
        return {
          result: true,
          state: BOT_STATES.RETURNING,
          action: { type: 'returnToBase', priority: PRIORITY.HIGH },
          reason: "return_to_base"
        };
      }
    }
    
    // Aucune action nécessaire pour l'instant
    return { result: false };
  }
};