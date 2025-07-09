/**
 * ==========================================================================
 * INDEX DES TRACKERS TYPESCRIPT
 * ==========================================================================
 * 
 * Point d'entrée pour tous les trackers XState/FSM convertis en TypeScript
 */

// Types communs - Référence aux types centralisés
export type {
    DroneProcessorFunction, DroneTrackerParams, DroneType, ShipProcessorFunction, ShipTrackerParams, ShipType, XStateSend
} from '../../../../types';

// Trackers principaux
export { useXFSMDroneTracker } from './drone/useXFSMDroneTracker';
export { useXFSMShipTracker } from './ship/useXFSMShipTracker';

// Engines de traitement
export { processDronePosition } from './drone/droneTrackerEngine';
export { processShipPosition } from './ship/shipTrackerEngine';

// Handlers drones
export {
    createDeployingHandler, createInitializationHandler, createReturningHandler, createScanningHandler
} from './drone/handlers';

// Handlers ships
export {
    createPositionUpdateHandler, createShipInitializationHandler
} from './ship/handlers';

