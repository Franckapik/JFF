import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createReturningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      const isCloseEnough = distance < 10;
      if (isCloseEnough) {
        fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`, {
          position,
          distance
        });
        send({ type: 'DRONE_RETURNED', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createReturningHandler;
