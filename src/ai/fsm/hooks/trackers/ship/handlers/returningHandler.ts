/**
 * ==========================================================================
 * RETURNING HANDLER - Handler pour le retour du vaisseau à la base
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';

interface ShipReturningHandlerParams {
  fsmSend: (event: Record<string, unknown>) => void;
  botId: string;
  shipType: 'ship' | 'main-ship';
}

/**
 * Création d'un handler pour le retour du vaisseau à la base
 * @param params - Les paramètres nécessaires
 * @returns L'objet handler avec les méthodes
 */
export const createShipReturningHandler = ({ fsmSend, botId, shipType }: ShipReturningHandlerParams) => {
  return {
    /**
     * Gère l'arrivée du vaisseau à la base
     * @param position - La position visuelle actuelle
     * @param basePosition - La position de la base
     * @returns True si le vaisseau est arrivé à la base
     */
    handleBaseReached(position: WorldPosition, basePosition: WorldPosition): boolean {
      const distance = Math.sqrt(
        Math.pow(position.x - basePosition.x, 2) +
        Math.pow(position.z - basePosition.z, 2)
      );
      
      // Tolérance pour considérer que le vaisseau est arrivé à la base
      const tolerance = 0.3;
      
      if (distance <= tolerance) {
        fsmLogger.info(`🏠 [${botId}] Ship reached base`, {
          currentPosition: position,
          basePosition,
          distance
        });
        
        fsmSend({
          type: 'SHIP_REACHES_BASE',
          botId,
          shipType,
          position
        });
        
        return true;
      }
      
      return false;
    },

    /**
     * Met à jour la position du vaisseau en retour vers la base
     * @param position - La position visuelle actuelle
     */
    updateReturningPosition(position: WorldPosition): void {
      fsmLogger.debug(`🔙 [${botId}] Ship returning to base position update`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'SHIP_POSITION_UPDATE',
        botId,
        shipType,
        position
      });
    },

    /**
     * Gère les situations d'urgence pendant le retour
     * @param position - La position visuelle actuelle
     */
    handleEmergencyStop(position: WorldPosition): void {
      fsmLogger.error(`🚨 [${botId}] Emergency stop during return`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'EMERGENCY_STOP',
        botId,
        shipType,
        position
      });
    },

    /**
     * Gère l'alerte de carburant faible pendant le retour
     * @param position - La position visuelle actuelle
     */
    handleLowFuelWarning(position: WorldPosition): void {
      fsmLogger.error(`⛽ [${botId}] Low fuel warning during return`, {
        position,
        shipType
      });
      
      fsmSend({
        type: 'LOW_FUEL_WARNING',
        botId,
        shipType,
        position
      });
    }
  };
};

export default createShipReturningHandler;
