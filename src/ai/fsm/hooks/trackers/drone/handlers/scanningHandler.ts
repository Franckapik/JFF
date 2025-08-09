import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createScanningHandler = ({ botId, droneType, send }: HandlerParams) => {
  return {
    process(distance: number, position: WorldPosition): boolean {
      // Utiliser le même seuil que dans l'ancienne implémentation (0.6)
  // Pour le scan, la logique de fin est gérée par la machine (timer), pas par la position
  return false;
    }
  };
};

export default createScanningHandler;
