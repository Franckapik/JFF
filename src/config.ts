// config.ts

import type { LogType } from './types/logger.d.ts';

interface AppConfig {
  enabledLogTypes: LogType[];
  showHelpers: {
    drone: boolean;
    ship: boolean;
    tile: boolean;
  };
  // logLevel?: string;
}

declare global {
  interface Window {
    appConfig?: AppConfig;
  }
}

export const config: AppConfig = window.appConfig || {
  enabledLogTypes: [
    "INFO",
    "STATE",
    "ACTION",
    "CONDITION",
    "MOUVEMENT",
    "PLAYER",
    "GAME",
    "EVENT",
    "CONTEXT",
    "HISTORY",
    "RESOURCES",
    "DEBUG",
    "ERROR",
    "WARN"
  ] as LogType[],
  showHelpers: {
    drone: true,
    ship: true,
    tile: true,
  },
  // logLevel: "debug", // Si tu veux gérer un vrai niveau de log, décommente et utilise
};

// Pour changer en live dans la console navigateur :
// window.appConfig.showHelpers.tile = false
// window.appConfig.showHelpers.drone = false
// window.appConfig.showHelpers.ship = false
