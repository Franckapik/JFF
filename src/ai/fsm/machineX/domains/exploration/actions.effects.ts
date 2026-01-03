/**
 * ==========================================================================
 * EXPLORATION DOMAIN - Actions avec effets de bord (entry/exit)
 * ==========================================================================
 * 
 * ARCHITECTURE NOTES:
 * - Les actions d'effets ne gèrent QUE les logs et effets de bord
 * - Les events (DRONE_REACHES_TILE, DRONE_HAS_SCANNED, DRONE_REACHES_BASE)
 *   sont envoyés par les TRACKERS (voir src/ai/fsm/hooks/trackers/drone/handlers/)
 * - Cette séparation permet de tester les guards et le FSM indépendamment de R3F
 */

import fsmLogger from '../../../../../logger/fsmLogger.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';


/**
 * Action d'entrée de l'état exploring
 * 
 * LOG ONLY: Trace l'entrée dans l'état d'exploration global
 */
export const onExploringEntry = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action de sortie de l'état exploring
 * 
 * LOG ONLY: Trace la sortie de l'état d'exploration global
 */
export const onExploringExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état drone_deploying
 * 
 * LOG ONLY: Trace le déploiement du drone vers la tuile cible
 * EVENT: DRONE_REACHES_TILE envoyé par deployingHandler (tracker)
 */
export const onDroneDeployingEntry = ({ context }: { context: FSMContext }) => {
  const targetTile = context.droneFleet?.drones?.explorer?.targetDroneTile;
  fsmLogger.action(`🚁 [${context.entityId}] Entrée dans l'état DRONE_DEPLOYING`, {
    targetTile: targetTile?.position?.coord || 'unknown'
  });
};

/**
 * Action de sortie de l'état drone_deploying
 * 
 * LOG ONLY: Trace la fin du déploiement (drone a atteint la tuile)
 */
export const onDroneDeployingExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état drone_scanning
 * 
 * LOG ONLY: Trace le début du scan de la tuile
 * EVENT: DRONE_HAS_SCANNED envoyé par scanningHandler (tracker) après SCAN_DURATION
 * 
 * PATTERN: L'événement est géré par le tracker, pas par un setTimeout ici.
 * Cela permet de tester le FSM sans dépendre de timers asynchrones.
 */
export const onDroneScanningEntry = ({ context }: { context: FSMContext }) => {
  const scannedTile = context.memory?.knownTiles?.[context.memory.knownTiles.length - 1];
  fsmLogger.action(`📡 [${context.entityId}] Entrée dans l'état DRONE_SCANNING`, {
    scannedTile: scannedTile?.position?.coord || 'unknown',
    explorationCount: context.explorationCount || 0
  });
};

/**
 * Action de sortie de l'état drone_scanning
 * 
 * LOG ONLY: Trace la fin du scan (résultats enregistrés dans le contexte)
 */
export const onDroneScanningExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état drone_returning
 * 
 * LOG ONLY: Trace le retour du drone vers la base
 * EVENT: DRONE_REACHES_BASE envoyé par returningHandler (tracker)
 */
export const onDroneReturningEntry = ({ context }: { context: FSMContext }) => {
  const basePosition = context.vehicle?.basePosition;
  fsmLogger.action(`🔙 [${context.entityId}] Entrée dans l'état DRONE_RETURNING`, {
    basePosition: basePosition?.coord || 'unknown',
    tilesExploredInCycle: context.memory?.stats?.tilesExploredInCycle || 0
  });
};

/**
 * Action de sortie de l'état drone_returning
 * 
 * LOG ONLY: Trace la fin du retour (drone docked)
 */
export const onDroneReturningExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état drone_docked
 * 
 * LOG ONLY: Trace l'amarrage du drone à la base
 * EVENT: DRONE_READY_FOR_REDEPLOY envoyé par tracker après DOCK_DURATION
 * 
 * Ce nouvel état permet:
 * - Animation de stationnement du drone
 * - Traitement des données scannées
 * - Préparer le drone pour un nouveau cycle d'exploration
 */
export const onDroneDockedEntry = ({ context }: { context: FSMContext }) => {
  const dockedTile = context.memory?.knownTiles?.[context.memory.knownTiles.length - 1];
  fsmLogger.action(`⚓ [${context.entityId}] Entrée dans l'état DRONE_DOCKED`, {
    dockedTile: dockedTile?.position?.coord || 'unknown',
    totalExploredThisCycle: context.memory?.stats?.tilesExploredInCycle || 0
  });
};

/**
 * Action de sortie de l'état drone_docked
 * 
 * LOG ONLY: Trace le début de la redéploiement du drone
 */
export const onDroneDockedExit = ({ context: _context }: { context: FSMContext }) => {
};

/**
 * Action d'entrée de l'état drone_destroyed
 * 
 * LOG ONLY: Trace la destruction du drone et ses conséquences
 */
export const onDroneDestroyedEntry = ({ context }: { context: FSMContext }) => {
  const currentDrone = context.droneFleet?.drones?.explorer;
  const destroyedCount = context.droneFleet?.stats?.explorerDestroyed || 0;
  
  fsmLogger.action(`💥 [${context.entityId}] Drone DÉTRUIT`, {
    droneType: currentDrone?.type || 'explorer',
    targetTile: currentDrone?.targetDroneTile?.position?.coord || 'unknown',
    totalDestroyed: destroyedCount,
    visualState: currentDrone?.visualState || 'unknown'
  });
};

/**
 * Action de sortie de l'état drone_destroyed
 * 
 * LOG ONLY: Trace la sortie de l'état de destruction
 */
export const onDroneDestroyedExit = ({ context: _context }: { context: FSMContext }) => {
};
