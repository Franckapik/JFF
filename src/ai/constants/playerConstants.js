// Fichier de constantes pour la gestion des joueurs
export const HUMAN_PLAYER_ID = 'player1';

// Fonction utilitaire pour obtenir les IDs des bots
export const getBotPlayerId = (botIndex) => `player${botIndex + 2}`;

// Type d'identifiants pour les véhicules
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone',
  SPECIAL_DRONE: 'special_drone'
};

// Obtenir l'ID du vaisseau principal
export const getMainShipId = () => VEHICLE_TYPES.SHIP;

// Vérifier si un ID est celui d'un vaisseau principal
export const isMainShipId = (vehicleId) => vehicleId === VEHICLE_TYPES.SHIP;

// Vérifier si un ID est celui d'un bot
export const isBotPlayerId = (playerId) => playerId !== HUMAN_PLAYER_ID;

// Obtenir l'ID d'un drone spécifique pour un joueur donné avec son type
export const getDroneId = (playerId, droneType) => {
  const playerNum = playerId.slice(-1);
  return `${droneType}_${playerNum}`;
};

// Obtenir tous les IDs de drones pour un joueur
export const getAllDroneIds = (playerId) => {
  return [
    getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE),
    getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE),
    getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE)
  ];
};

// Vérifier si un ID est celui d'un drone
export const isDroneId = (vehicleId) => {
  return vehicleId.startsWith(VEHICLE_TYPES.EXPLORER_DRONE) ||
         vehicleId.startsWith(VEHICLE_TYPES.COMBAT_DRONE) ||
         vehicleId.startsWith(VEHICLE_TYPES.SPECIAL_DRONE);
};

// Vérifie si un drone est actif par défaut au démarrage
export const isDroneActiveByDefault = (droneType) => {
  return droneType === VEHICLE_TYPES.EXPLORER_DRONE;
};