import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createDeployingHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      const isCloseEnough = distance < 10;
      if (isCloseEnough) {
        fsmLogger.mouvement(`Drone reached target`, { position, distance });
        send({ type: 'DRONE_SCANNING', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createDeployingHandler;
