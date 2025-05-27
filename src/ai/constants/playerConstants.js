// Fichier de constantes pour la gestion des joueurs

// Fonction utilitaire pour obtenir les IDs des joueurs humains
export const getHumanPlayerId = (playerIndex = 1) => `player-${playerIndex}`;

export const HUMAN_PLAYER_ID = getHumanPlayerId(1);

// Fonction utilitaire pour obtenir les IDs des bots
export const getBotId = (botIndex) => `bot-${botIndex}`;

// Type d'identifiants pour les véhicules
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone',
  SPECIAL_DRONE: 'special_drone'
};

// Obtenir l'ID du vaisseau principal
export const getMainShipId = (playerId) => {
  if (playerId === null) return 'null-ship';
  if (playerId === undefined) return 'undefined-ship';
  return `${playerId}-ship`;
};

// Vérifier si un ID est celui d'un vaisseau principal
export const isMainShipId = (vehicleId) => {
  if (!vehicleId) return false;
  return vehicleId.endsWith('-ship');
};

// Vérifier si un ID est celui d'un bot
export const isBotPlayerId = (playerId) => {
  if (!playerId) return false;
  return playerId.startsWith('bot-') && playerId.length > 4;
};

// Obtenir l'ID d'un drone spécifique pour un joueur donné avec son type
export const getDroneId = (playerId, droneType) => {
  // Gestion des cas null/undefined
  const safePlayerId = playerId === null ? 'null' : 
                       playerId === undefined ? 'undefined' : String(playerId);
  const safeDroneType = droneType === null ? 'null' : 
                        droneType === undefined ? 'undefined' : String(droneType);
  
  return `${safePlayerId}-drone-${safeDroneType}`;
};

// Obtenir tous les IDs de drones pour un joueur
export const getAllDroneIds = (playerId) => {
  if (playerId === null || playerId === undefined) {
    return [];
  }
  
  return [
    getDroneId(playerId, 'explorer'),
    getDroneId(playerId, 'collector'),
    getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE),
    getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE),
    getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)
  ];
};

// Vérifier si un ID est celui d'un drone
export const isDroneId = (vehicleId) => {
  if (!vehicleId) return false;
  
  // Doit contenir '-drone-' et avoir un format complet player-id-drone-type
  const parts = vehicleId.split('-');
  return vehicleId.includes('-drone-') && 
         parts.length >= 4 &&   // Au minimum 4 parties : [player, id, drone, type]
         parts[parts.length - 1].length > 0;  // Le type ne doit pas être vide
};

// Vérifie si un drone est actif par défaut au démarrage
export const isDroneActiveByDefault = (droneType) => {
  if (!droneType) return false;
  return droneType === 'explorer' || droneType === VEHICLE_TYPES.EXPLORER_DRONE;
};