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