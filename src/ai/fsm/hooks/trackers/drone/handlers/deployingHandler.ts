import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createDeployingHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser un seuil fixe plus généreux que l'ancien (0.6 -> 1.0)
      // Car les distances réelles observées dans les logs sont autour de 2.4
      const threshold = 0.1; // Seuil large pour capturer les approches
      const isCloseEnough = distance < threshold;
      
      if (isCloseEnough) {
        fsmLogger.mouvement(`Drone reached target (threshold: ${threshold})`, { 
          position, 
          distance, 
          threshold 
        });
        send({ type: 'DRONE_REACHES_TILE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createDeployingHandler;
