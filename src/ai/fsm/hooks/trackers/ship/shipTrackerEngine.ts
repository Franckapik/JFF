/**
 * ==========================================================================
 * SHIP TRACKER ENGINE - Moteur de traitement des positions de vaisseaux
 * ==========================================================================
 */

import type { ShipTrackerParams } from '../../../../../types';

import {
  createPositionUpdateHandler,
  createShipInitializationHandler
} from './handlers';

/**
 * Traitement principal des positions du vaisseau
 * Ce moteur coordonne les différents handlers selon l'état
 */
export const processShipPosition = (params: ShipTrackerParams): void => {
  // 1. Récupérer tous les paramètres et créer les handlers
  const handlers = createAllShipHandlers(params);
  const { position, lastPosition } = params;
  
  // 2. Essayer d'abord le handler d'initialisation
  const wasInitialized = handlers.init.handleInitialPosition(position);
  if (wasInitialized) return;
  
  // 3. Si l'initialisation est déjà faite, traiter les mises à jour de position
  if (lastPosition) {
    handlers.positionUpdate.process(position, lastPosition);
  }
};

/**
 * Crée tous les handlers nécessaires pour le vaisseau
 */
const createAllShipHandlers = (params: ShipTrackerParams) => {
  const {
    send,
    botId,
    shipType,
    initialPositionSent,
    canSendEvent,
    markEventSent
  } = params;
  
  return {
    init: createShipInitializationHandler({
      fsmSend: send, 
      botId, 
      shipType, 
      initialPositionSent
    }),
    positionUpdate: createPositionUpdateHandler({
      fsmSend: send, 
      botId, 
      shipType, 
      canSendEvent, 
      markEventSent
    })
  };
};
