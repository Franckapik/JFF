import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createReturningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser le même seuil que dans l'ancienne implémentation (0.6)
      const isCloseEnough = distance < 0.6;
      if (isCloseEnough) {
        fsmLogger.mouvement(`🏠 [${botId}] ${droneType} reached base - docking complete`, {
          position,
          distance
        });
        send({ type: 'DRONE_REACHES_BASE', botId, droneType });
        return true;
      }
      return false;
    }
  };
};

export default createReturningHandler;
