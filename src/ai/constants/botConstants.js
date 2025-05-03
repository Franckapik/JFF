// src/ai/constants/botConstants.js
// Définition des constantes pour la machine à états finis du bot

// Les états possibles du bot
export const BOT_STATES = {
  IDLE: 'idle',         // En attente, ne fait rien
  EXPLORING: 'exploring', // Exploration de la carte
  RETURNING: 'returning'  // Retour à la base/tuile de départ
};

// Niveaux de priorité des actions
export const PRIORITY = {
  LOW: 1,     // Priorité basse
  MEDIUM: 2,  // Priorité moyenne
  HIGH: 3,    // Priorité haute
  URGENT: 4   // Priorité urgente/critique
};

// Structure pour faciliter la visualisation des transitions d'état
export const STATE_TRANSITIONS = {
  [BOT_STATES.IDLE]: {
    possibleNextStates: [BOT_STATES.EXPLORING],
    description: "Bot en attente, peut commencer l'exploration",
  },
  [BOT_STATES.EXPLORING]: {
    possibleNextStates: [BOT_STATES.RETURNING, BOT_STATES.IDLE],
    description: "Bot en exploration, peut retourner à la base ou s'arrêter",
  },
  [BOT_STATES.RETURNING]: {
    possibleNextStates: [BOT_STATES.EXPLORING, BOT_STATES.IDLE],
    description: "Bot en retour à la base, peut reprendre l'exploration ou s'arrêter",
  }
};