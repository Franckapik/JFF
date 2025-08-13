import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createScanningHandler = (_params: HandlerParams) => {
  return {
    process(_distance: number, _position: WorldPosition): boolean {
      // Utiliser le même seuil que dans l'ancienne implémentation (0.6)
  // Pour le scan, la logique de fin est gérée par la machine (timer), pas par la position
  return false;
    }
  };
};

export default createScanningHandler;
