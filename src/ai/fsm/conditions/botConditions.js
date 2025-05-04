// src/ai/fsm/conditions/botConditions.js
// Conditions qui déclenchent des transitions d'état dans la FSM

import { BOT_STATES, PRIORITY } from '../../constants/botConstants';

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
      state: isFull ? BOT_STATES.EXPLORING : null, // Change to EXPLORING state instead of COLLECTING
      action: isFull ? { type: 'exploreDrone', priority: PRIORITY.MEDIUM } : null // Use exploreDrone action
    };
  },
  
  // Fonction principale qui vérifie toutes les conditions
  checkAllConditions: (botState, botVehicle) => {
    if (!botVehicle) return { result: false };
    
    // Ordre de priorité des conditions à vérifier
    const conditions = [
      BotConditions.isLowFuel,
      BotConditions.isAtBase,
      BotConditions.isFullyRefueled
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