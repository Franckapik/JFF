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
  hasDiscoveredResources: (botVehicle) => {
    // Récupérer directement l'état du joueur
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Vérifier si le bot a identifié des ressources
    const hasResources = botMemory && 
                        botMemory.knownResources && 
                        botMemory.knownResources.length > 0;
    
    // Exige au moins 3 explorations avant de passer en collecte
    const hasEnoughExplorations = botMemory && 
                                (botMemory.explorationCount >= 3);
    
    // Les deux conditions doivent être remplies
    const shouldCollect = hasResources && hasEnoughExplorations;
    
    return {
      result: shouldCollect,
      priority: IDLE_EVALUATION.EFFICIENCY,
      state: shouldCollect ? BOT_STATES.COLLECTING : null,
      action: shouldCollect ? { type: 'collect', priority: PRIORITY.HIGH } : null
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
      // Si plein de carburant et des ressources sont disponibles, aller collecter
      // sinon, aller explorer
      state: isFull ? null : null, // L'état sera déterminé par evaluateNextState
      action: isFull ? null : null // L'action sera déterminée par evaluateNextState
    };
  },
  
  // === CONDITIONS DE DÉCOUVERTE ===
  
  // Vérifie si le bot a besoin d'explorer davantage
  shouldExplore: (botVehicle) => {
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Si pas de ressources connues ou pas assez d'explorations
    const needsExploration = !botMemory?.knownResources || 
                           botMemory.knownResources.length === 0 ||
                           botMemory.explorationCount < 3;
    
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
    
    // Si le bot n'a pas de ressources connues ou pas assez d'explorations
    const needsExploration = !botMemory?.knownResources || 
                           botMemory.knownResources.length === 0 ||
                           botMemory.explorationCount < 3;
    
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
    
    // Vérifier s'il y a des ressources connues et assez d'explorations
    const hasResources = botMemory?.knownResources && 
                        botMemory.knownResources.length > 0;
    const hasEnoughExplorations = botMemory && botMemory.explorationCount >= 3;
    
    const shouldCollect = hasResources && hasEnoughExplorations;
    
    return {
      result: shouldCollect,
      state: BOT_STATES.COLLECTING,
      action: { type: 'collect', priority: PRIORITY.MEDIUM }
    };
  },
  
  // Nouvelle fonction pour déterminer si le bot doit passer de IDLE à RETURNING
  shouldReturnToBase: (botVehicle) => {
    // Si carburant bas ou capacité maximale atteinte
    const lowFuel = botVehicle.fuel < 50;
    const atMaxCapacity = botVehicle.isAtCapacity === true;
    
    const shouldReturn = lowFuel || atMaxCapacity;
    
    return {
      result: shouldReturn,
      state: BOT_STATES.RETURNING,
      action: { type: 'returnToBase', priority: PRIORITY.HIGH }
    };
  },
  
  // Fonction principale pour évaluer l'état suivant depuis l'état IDLE
  evaluateNextState: (botVehicle, playerStore) => {
    if (!botVehicle) return null;
    
    // 1. SAFETY - Vérifier si retour à la base nécessaire (PRIORITÉ LA PLUS HAUTE)
    const returnCheck = BotConditions.shouldReturnToBase(botVehicle);
    if (returnCheck.result) {
      console.log("[BotConditions] Evaluation result: Should return to base");
      return returnCheck;
    }
    
    // 2. Si carburant OK, vérifier s'il y a des ressources à collecter
    const collectCheck = BotConditions.shouldStartCollecting(botVehicle, playerStore);
    if (collectCheck.result) {
      console.log("[BotConditions] Evaluation result: Should start collecting");
      return collectCheck;
    }
    
    // 3. Par défaut, explorer
    const exploreCheck = BotConditions.shouldStartExploring(botVehicle, playerStore);
    if (exploreCheck.result) {
      console.log("[BotConditions] Evaluation result: Should start exploring");
      return exploreCheck;
    }
    
    // Si aucune condition n'est remplie, rester en IDLE (ce qui ne devrait pas arriver souvent)
    console.log("[BotConditions] No condition met, remaining in IDLE");
    return {
      result: false,
      state: BOT_STATES.IDLE,
      action: null
    };
  },
  
  // Fonction principale qui vérifie toutes les conditions selon l'état courant
  checkAllConditions: (botState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    const playerStore = usePlayerStore.getState();
    
    // Si en état IDLE, utiliser la nouvelle logique d'évaluation centralisée
    if (botState === BOT_STATES.IDLE) {
      return BotConditions.evaluateNextState(botVehicle, playerStore);
    }
    
    // Pour les autres états, vérifier les conditions qui font revenir à IDLE
    switch (botState) {
      case BOT_STATES.EXPLORING:
        // Conditions qui font revenir à IDLE depuis EXPLORING
        
        // 1. Vérifier le carburant (priorité la plus haute)
        const lowFuel = BotConditions.isLowFuel(botVehicle);
        if (lowFuel.result) {
          console.log("[BotConditions] Low fuel detected in EXPLORING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        
        // 2. Vérifier si assez d'explorations et ressources découvertes
        const resourcesDiscovered = BotConditions.hasDiscoveredResources(botVehicle);
        if (resourcesDiscovered.result) {
          console.log("[BotConditions] Resources discovered in EXPLORING state, returning to IDLE");
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
          console.log("[BotConditions] All resources collected in COLLECTING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
        
      case BOT_STATES.RETURNING:
        // Conditions qui font revenir à IDLE depuis RETURNING
        
        // Vérifier si le bot est arrivé à la base
        const atBase = BotConditions.isAtBase(botVehicle);
        if (atBase.result) {
          console.log("[BotConditions] Arrived at base in RETURNING state, returning to IDLE");
          return { result: true, state: BOT_STATES.IDLE };
        }
        break;
    }
    
    // Si aucune condition n'est remplie, pas de changement d'état
    return { result: false };
  }
};