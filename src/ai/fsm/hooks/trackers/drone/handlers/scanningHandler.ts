import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

/**
 * Handler pour l'état drone_scanning
 * 
 * LOGIC: Une fois que le drone est en mode scanning, on attend un délai
 * fixe (scan duration) avant d'envoyer DRONE_HAS_SCANNED.
 * 
 * Ce délai simule le temps nécessaire pour scanner la tuile et analyser
 * les ressources présentes.
 */
export const createScanningHandler = ({ botId, droneType, send }: HandlerParams) => {
  let scanStartTime: number | null = null;
  let hasScanned = false;
  
  // Durée du scan en millisecondes (2 secondes comme dans l'ancien code)
  const SCAN_DURATION = 2000;
  
  return {
    process(_distance: number, position: WorldPosition): boolean {
      // Initialiser le timer au premier appel
      if (scanStartTime === null) {
        scanStartTime = Date.now();
        hasScanned = false;
        fsmLogger.mouvement(`📡 [${botId}] ${droneType} started scanning`, {
          position,
          scanDuration: SCAN_DURATION
        });
      }
      
      // Vérifier si le scan est terminé
      const elapsed = Date.now() - scanStartTime;
      if (elapsed >= SCAN_DURATION && !hasScanned) {
        fsmLogger.mouvement(`📡 [${botId}] ${droneType} scan complete`, {
          position,
          elapsed
        });
        send({ type: 'DRONE_HAS_SCANNED', botId, droneType });
        hasScanned = true;
        // Réinitialiser pour la prochaine fois
        scanStartTime = null;
        return true;
      }
      
      return false;
    }
  };
};

export default createScanningHandler;
