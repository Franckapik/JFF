// src/ai/fsm/conditions/botConditions.js
// Conditions qui déclenchent des transitions d'état dans la FSM

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';
import usePlayerStore from '../../../stores/usePlayerStore';

/**
 * Registre des conditions du bot
 * Chaque fonction prend l'état du bot et le store du joueur
 * Retourne un objet avec:
 * - result: booléen indiquant si la condition est remplie
 * - action: objet action à ajouter si la condition est remplie
 */
export const BotConditions = {
  // Vérifie si le carburant est bas
  isLowFuel: (botState, botVehicle) => {
    const isLow = (botState === BOT_STATES.EXPLORING || botState === BOT_STATES.COLLECTING) && botVehicle?.fuel < 50;
    return {
      result: isLow,
      state: isLow ? BOT_STATES.RETURNING : null,
      action: isLow ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  // Vérifie si le véhicule est à la base
  isAtBase: (botState, botVehicle) => {
    const isAtBase = botVehicle?.coord === botVehicle?.startCoord;
    return {
      result: isAtBase,
      action: isAtBase && botState === BOT_STATES.RETURNING ? 
        { type: 'refuel', priority: PRIORITY.MEDIUM } : null
    };
  },
  
  // Vérifie si le ravitaillement est complet
  isFullyRefueled: (botState, botVehicle) => {
    const isFull = botVehicle?.fuel >= 100 && botState === BOT_STATES.RETURNING;
    return {
      result: isFull,
      state: isFull ? BOT_STATES.EXPLORING : null,
      action: isFull ? { type: 'exploreDrone', priority: PRIORITY.HIGH } : null
    };
  },
  
  // CONDITION MODIFIÉE: Vérifie si des ressources ont été découvertes par le drone
  hasDiscoveredResources: (botState, botVehicle) => {
    // On ne vérifie cette condition que si on est en mode exploration
    if (botState !== BOT_STATES.EXPLORING) return { result: false };
    
    // Récupérer directement l'état du joueur
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Vérifier si le bot a identifié des ressources
    const hasResources = botMemory && 
                        botMemory.knownResources && 
                        botMemory.knownResources.length > 0;
    
    console.log(`[BotConditions] hasDiscoveredResources check: ${hasResources ? 'Resources found!' : 'No resources yet'}`);
    console.log(`[BotConditions] knownResources:`, botMemory?.knownResources);
                         
    // Si le drone a trouvé des ressources, passer en mode collecte
    return {
      result: hasResources,
      state: hasResources ? BOT_STATES.COLLECTING : null,
      action: hasResources ? { type: 'collect', priority: PRIORITY.HIGH } : null // Augmenté la priorité
    };
  },
  
  // NOUVELLE CONDITION: Vérifie si le vaisseau est à capacité maximale
  isAtMaxCapacity: (botState, botVehicle) => {
    // Cette condition s'applique uniquement en mode collecte
    if (botState !== BOT_STATES.COLLECTING) return { result: false };
    
    const isAtCapacity = botVehicle.isAtCapacity === true;
    
    return {
      result: isAtCapacity,
      state: isAtCapacity ? BOT_STATES.RETURNING : null,
      action: isAtCapacity ? { type: 'returnToBase', priority: PRIORITY.HIGH } : null
    };
  },
  
  // NOUVELLE CONDITION: Vérifie si toutes les ressources connues ont été collectées
  allKnownResourcesCollected: (botState, botVehicle) => {
    // Cette condition s'applique uniquement en mode collecte
    if (botState !== BOT_STATES.COLLECTING) return { result: false };
    
    const playerState = usePlayerStore.getState();
    const botMemory = playerState.players?.player2?.memory;
    
    // Si le bot n'a pas de mémoire ou pas de ressources connues, retourner en exploration
    const noResourcesToCollect = !botMemory || 
                             !botMemory.knownResources || 
                             botMemory.knownResources.length === 0;
    
    return {
      result: noResourcesToCollect,
      state: noResourcesToCollect ? BOT_STATES.EXPLORING : null,
      action: noResourcesToCollect ? { type: 'exploreDrone', priority: PRIORITY.HIGH } : null
    };
  },
  
  // Fonction principale qui vérifie toutes les conditions
  checkAllConditions: (botState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Ordre de priorité des conditions à vérifier
    const conditions = [
      BotConditions.isLowFuel,          // Priorité 1: Vérifier le carburant (sécurité)
      BotConditions.isAtBase,           // Priorité 2: Vérifier si à la base
      BotConditions.isFullyRefueled,    // Priorité 3: Vérifier si ravitaillé
      BotConditions.isAtMaxCapacity,    // Priorité 4: Vérifier si capacité max atteinte
      BotConditions.hasDiscoveredResources, // Priorité 5: Vérifier si ressources découvertes
      BotConditions.allKnownResourcesCollected // Priorité 6: Vérifier si ressources épuisées
    ];
    
    // Vérifie chaque condition dans l'ordre
    for (const condition of conditions) {
      const result = condition(botState, botVehicle);
      if (result.result) {
        return result;
      }
    }
    
    return { result: false };
  }
};