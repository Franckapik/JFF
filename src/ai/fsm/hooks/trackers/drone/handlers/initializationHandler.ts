import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createInitializationHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    handleInitialPosition(position: WorldPosition): boolean {
      if (position) {
        fsmLogger.context(`🛸 [${botId}] Setting initial ${droneType} drone position`, {
          position,
          droneType
        });
        send({ type: 'DRONE_INITIALIZED', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createInitializationHandler;
