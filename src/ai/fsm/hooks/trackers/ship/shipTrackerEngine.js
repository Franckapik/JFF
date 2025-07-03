/**
 * ==========================================================================
 * SHIP TRACKER ENGINE - Moteur de traitement des positions de vaisseaux
 * ==========================================================================
 */

import {
  createShipInitializationHandler,
  createPositionUpdateHandler
} from './handlers';

/**
 * Traitement principal des positions du vaisseau
 * Ce moteur coordonne les différents handlers selon l'état
 */
export const processShipPosition = (params) => {
  // 1. Récupérer tous les paramètres et créer les handlers
  const handlers = createAllShipHandlers(params);
  const { newPosition, lastPosition } = params;
  
  // 2. Essayer d'abord le handler d'initialisation
  const wasInitialized = handlers.init.handleInitialPosition(newPosition);
  if (wasInitialized) return;
  
  // 3. Si l'initialisation est déjà faite, traiter les mises à jour de position
  if (lastPosition) {
    handlers.positionUpdate.process(newPosition, lastPosition);
  }
};

/**
 * Crée tous les handlers nécessaires pour le vaisseau
 */
const createAllShipHandlers = (params) => {
  const {
    fsmSend,
    botId,
    shipType,
    initialPositionSent,
    canSendEvent,
    markEventSent
  } = params;
  
  return {
    init: createShipInitializationHandler({
      fsmSend, botId, shipType, initialPositionSent
    }),
    positionUpdate: createPositionUpdateHandler({
      fsmSend, botId, shipType, canSendEvent, markEventSent
    })
  };
};
