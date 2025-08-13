import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

import { TILE_DETECTION_THRESHOLD } from '../../../../machineX/config/constants.ts';

export const createReturningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser un seuil plus large pour la détection de base (augmenté de 0.6 à 1.2)
      const isCloseEnough = distance < TILE_DETECTION_THRESHOLD;
      if (isCloseEnough) {
        fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`, {
          position,
          distance,
        });
        send({ type: 'DRONE_REACHES_BASE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createReturningHandler;
