// src/ai/constants/botConstants.js
// Définition des constantes pour la machine à états finis du bot

// Les états possibles du bot
export const BOT_STATES = {
  IDLE: 'idle',         // En attente, ne fait rien
  EXPLORING: 'exploring', // Exploration de la carte
  COLLECTING: 'collecting', // Collecte des ressources
  RETURNING: 'returning'  // Retour à la base/tuile de départ
};

// Niveaux de priorité des actions
export const PRIORITY = {
  LOW: 1,     // Priorité basse
  MEDIUM: 2,  // Priorité moyenne
  HIGH: 3,    // Priorité haute
  URGENT: 4   // Priorité urgente/critique
};

// Nouvelles constantes pour l'état IDLE centralisé
export const IDLE_EVALUATION = {
  SAFETY: 4,      // Priorité la plus haute: sécurité (carburant, dangers)
  CAPACITY: 3,    // Priorité haute: capacité de stockage
  EFFICIENCY: 2,  // Priorité moyenne: efficacité (collecte de ressources)
  DISCOVERY: 1    // Priorité basse: découverte (exploration)
};

// Statuts d'action pour le suivi d'état
export const ACTION_STATUS = {
  PENDING: 'pending',     // Action en attente d'être exécutée
  IN_PROGRESS: 'in_progress',  // Action en cours d'exécution
  COMPLETED: 'completed',   // Action terminée avec succès
  FAILED: 'failed'        // Action qui a échoué
};

// Sous-types d'actions pour la collecte (séparation du mouvement et de la collecte)
export const COLLECT_ACTION_TYPES = {
  MOVE_TO_RESOURCE: 'moveToResource',  // Se déplacer vers une ressource
  COLLECT_RESOURCE: 'collectResource'   // Collecter une ressource une fois arrivé
};

// Structure pour faciliter la visualisation des transitions d'état
export const STATE_TRANSITIONS = {
  [BOT_STATES.IDLE]: {
    possibleNextStates: [BOT_STATES.EXPLORING, BOT_STATES.COLLECTING, BOT_STATES.RETURNING],
    description: "État central d'évaluation, décide du prochain état en fonction des conditions",
  },
  [BOT_STATES.EXPLORING]: {
    possibleNextStates: [BOT_STATES.IDLE],
    description: "Bot en exploration, retourne à IDLE après exploration ou si conditions critiques",
  },
  [BOT_STATES.COLLECTING]: {
    possibleNextStates: [BOT_STATES.IDLE],
    description: "Bot en collecte, retourne à IDLE après collecte ou si conditions critiques",
  },
  [BOT_STATES.RETURNING]: {
    possibleNextStates: [BOT_STATES.IDLE],
    description: "Bot en retour à la base, retourne à IDLE après arrivée à la base",
  }
};