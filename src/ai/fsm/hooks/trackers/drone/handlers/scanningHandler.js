/**
 * ==========================================================================
 * SCANNING HANDLER - Handler pour l'état drone_scanning
 * ==========================================================================
 */

import fsmLogger from '../../../../../../logger/fsmLogger';
import { POSITION_TRACKER_CONFIG } from '../../../../machineX/config/constants';

/**
 * Création d'un handler pour l'état drone_scanning
 * @param {Object} params - Les paramètres nécessaires
 * @returns {Object} - L'objet handler avec les méthodes
 */
export const createScanningHandler = ({ botId, droneType, send, canSendEvent, markEventSent, gridToHexCoord, worldToGrid, useTileStore }) => {
  return {
    /**
     * Traite une position lors de l'état de scan
     * @param {number} distance - Distance à la cible
     * @param {Object} position - Position actuelle du drone
     * @returns {boolean} - True si un événement a été envoyé
     */
    process(distance, position) {
      const eventKey = `drone_scanning_complete_${botId}_${droneType}`;
      
      if (distance < POSITION_TRACKER_CONFIG.THRESHOLDS.TARGET_REACH && canSendEvent(eventKey)) {
        // Délai pour simuler le scan de la tuile
        setTimeout(() => {
          fsmLogger.mouvement(`🔍 [${botId}] ${droneType} completed tile scanning`);
          
          try {
            // Conversion de la position en coordonnées de tuile
            const gridCoord = worldToGrid(position);
            const tileCoord = gridToHexCoord(gridCoord);
            
            // Marquer la tuile comme explorée et récupérer ses ressources
            const { markTileAsExplored, getTile } = useTileStore.getState();
            markTileAsExplored(tileCoord);
            
            const tile = getTile(tileCoord);
            const resourcesFound = tile?.resources ? {
              food: tile.resources.food || 0,
              debris: tile.resources.debris || 0,
              special: tile.resources.special || 0
            } : { food: 0, debris: 0, special: 0 };
            
            fsmLogger.resources(`💎 [${botId}] ${droneType} discovered resources:`, resourcesFound);
            
            // Transition vers drone_returning
            send({
              type: 'DRONE_SCANS_TILE',
              position,
              coord: tileCoord,
              resources: resourcesFound,
              droneType,
              hasResources: Object.values(resourcesFound).some(val => val > 0),
              timestamp: Date.now()
            });
            
          } catch (error) {
            fsmLogger.error(`❌ [${botId}] Failed to scan tile: ${error.message}`);
          }
        }, 2000); // 2 secondes de scan
        
        markEventSent(eventKey, POSITION_TRACKER_CONFIG.TIMINGS.EXPLORATION_RESET);
        return true;
      }
      
      return false;
    }
  };
};

export default createScanningHandler;
