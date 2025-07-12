import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';
import { TILE_DETECTION_THRESHOLD } from '../../../../machineX/config/constants';

export const createScanningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser le même seuil que dans l'ancienne implémentation (0.6)
      const isCloseEnough = distance < TILE_DETECTION_THRESHOLD;
      if (isCloseEnough) {
        fsmLogger.mouvement(`🔍 [${botId}] ${droneType} completed tile scanning`, { position, distance });
        send({ type: 'DRONE_SCANS_TILE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createScanningHandler;
