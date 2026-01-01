// config.ts

import type { LogType } from './types/logger.d.ts';

interface AppConfig {
  enabledLogTypes: LogType[];
  showHelpers: {
    drone: boolean;
    ship: boolean;
    tile: boolean;
    scene: boolean;
  };
  enableXStateInspection: boolean;
  testMode: boolean; // Active le tracker simulé pour tests
  enableVerboseTracking: boolean; // Logs détaillés du tracker
  // logLevel?: string;
}

declare global {
  interface Window {
    appConfig?: AppConfig;
  }
}

export const config: AppConfig = (typeof window !== 'undefined' ? window.appConfig : undefined) || {
  enabledLogTypes: [
    "ALL"
  ] as LogType[],
  showHelpers: {
    drone: true,
    ship: true,
    tile: true,
    scene: true,
  },
  enableXStateInspection: false,
  testMode: import.meta.env.DEV, // Active en mode dev uniquement
  enableVerboseTracking: false,
  // logLevel: "debug", // Si tu veux gérer un vrai niveau de log, décommente et utilise
};

// Pour changer en live dans la console navigateur :
// window.appConfig.showHelpers.tile = false
// window.appConfig.showHelpers.drone = false
// window.appConfig.showHelpers.ship = false
// window.appConfig.enableXStateInspection = false // Désactive l'inspection XState
