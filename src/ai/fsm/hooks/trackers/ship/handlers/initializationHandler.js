/**
 * ==========================================================================
 * INITIALIZATION HANDLER - Handler pour l'initialisation du vaisseau
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';

/**
 * Création d'un handler pour l'initialisation du vaisseau
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createShipInitializationHandler = ({ fsmSend, botId, shipType, initialPositionSent }) => {
  return {
    /**
     * Gère l'initialisation de la position du vaisseau
     * @param {Object} position - La position visuelle actuelle
     * @returns {boolean} - True si l'initialisation a été effectuée
     */
    handleInitialPosition(position) {
      if (!initialPositionSent.current && position) {
        fsmLogger.debug('🚢 [SHIP TRACKER] About to send SHIP_POSITION_UPDATE event:', {
          position,
          shipType,
          botId
        });
        
        fsmLogger.context(`🚢 [${botId}] Setting initial ship position`, {
          position,
          shipType
        });
        
        // Événement de mise à jour de position pour initialiser le vaisseau
        fsmSend({ 
          type: 'SHIP_POSITION_UPDATE', 
          position, 
          botId, 
          shipType,
          timestamp: Date.now()
        });
        
        fsmLogger.debug('🚢 [SHIP TRACKER] SHIP_POSITION_UPDATE event sent successfully');
        
        initialPositionSent.current = true;
        return true;
      }
      return false;
    }
  };
};

export default createShipInitializationHandler;
