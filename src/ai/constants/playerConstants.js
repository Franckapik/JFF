// Fichier de constantes pour la gestion des joueurs

// L'ID du joueur contrôlé par l'IA (BOT)
export const BOT_PLAYER_ID = 'player2';

// L'ID du joueur humain 
export const HUMAN_PLAYER_ID = 'player1';

// Fonction utilitaire pour obtenir l'ID du joueur bot en fonction du nombre de joueurs
export const getBotPlayerId = (playerCount = 2) => {
  // Par défaut, player2 est le bot dans une configuration à 2 joueurs
  return `player2`;
};

// Fonction utilitaire pour obtenir l'ID du véhicule principal du bot
export const getBotMainVehicleId = () => 'ship';

// Type d'identifiants pour les véhicules
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  DRONE: 'drone'
};

// Obtenir l'ID du vaisseau principal
export const getMainShipId = () => VEHICLE_TYPES.SHIP;

// Vérifier si un ID est celui d'un vaisseau principal
export const isMainShipId = (vehicleId) => vehicleId === VEHICLE_TYPES.SHIP;

// Obtenir l'ID d'un drone spécifique pour un joueur donné
export const getDroneId = (playerId, index = 1) => {
  const playerNum = playerId.slice(-1);
  const droneStartIdx = (parseInt(playerNum) - 1) * 2 + 1;
  return `${VEHICLE_TYPES.DRONE}${droneStartIdx + index - 1}`;
};

// Obtenir tous les IDs de drones pour un joueur
export const getAllDroneIds = (playerId) => {
  const playerNum = playerId.slice(-1);
  const droneStartIdx = (parseInt(playerNum) - 1) * 2 + 1;
  return [
    `${VEHICLE_TYPES.DRONE}${droneStartIdx}`,
    `${VEHICLE_TYPES.DRONE}${droneStartIdx + 1}`
  ];
};

// Vérifier si un ID est celui d'un drone
export const isDroneId = (vehicleId) => vehicleId.startsWith(VEHICLE_TYPES.DRONE);