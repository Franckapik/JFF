import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createScanningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      const isCloseEnough = distance < 10;
      if (isCloseEnough) {
        fsmLogger.mouvement(`🔍 [${botId}] ${droneType} completed tile scanning`, { position, distance });
        send({ type: 'DRONE_SCAN_COMPLETE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createScanningHandler;
