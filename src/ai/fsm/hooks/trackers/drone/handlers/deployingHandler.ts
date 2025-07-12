import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';
import { TILE_DETECTION_THRESHOLD } from '../../../../machineX/config/constants';

export const createDeployingHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser un seuil fixe plus généreux que l'ancien (0.6 -> 1.0)
      // Car les distances réelles observées dans les logs sont autour de 2.4
      const isCloseEnough = distance < TILE_DETECTION_THRESHOLD;
      
      if (isCloseEnough) {
        fsmLogger.mouvement(`Drone reached target (threshold: ${TILE_DETECTION_THRESHOLD})`, { 
          position, 
          distance, 
          TILE_DETECTION_THRESHOLD 
        });
        send({ type: 'DRONE_REACHES_TILE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createDeployingHandler;
