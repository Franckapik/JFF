/**
 * ============================================================================
 * FSM Constants - Constantes globales pour la FSM
 * ============================================================================
 * 
 * Définition des constantes communes pour la machine FSM
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

// États possibles du bot
export const BOT_STATES = {
  EVALUATING: 'evaluating',
  EXPLORING: 'exploring', 
  COLLECTING: 'collecting',
  RETURNING: 'returning',
  IDLE_AT_BASE: 'idleAtBase'
};

// Métadonnées des états
export const STATE_METADATA = {
  [BOT_STATES.EVALUATING]: {
    timeout: 1000,
    description: 'Évaluation de la situation et prise de décision',
    priority: 'high'
  },
  [BOT_STATES.EXPLORING]: {
    timeout: 30000,
    description: 'Exploration et découverte de ressources',
    priority: 'medium'
  },
  [BOT_STATES.COLLECTING]: {
    timeout: 30000,
    description: 'Collecte de ressources connues',
    priority: 'medium'
  },
  [BOT_STATES.RETURNING]: {
    timeout: 45000,
    description: 'Retour à la base en cas d\'urgence',
    priority: 'high'
  },
  [BOT_STATES.IDLE_AT_BASE]: {
    timeout: 5000,
    description: 'Ravitaillement et maintenance à la base',
    priority: 'low'
  }
};
