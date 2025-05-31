/**
 * ============================================================================
 * BOT MACHINE FSM - Machine d'état simplifiée avec états modulaires
 * ============================================================================
 * 
 * Machine FSM utilisant les états modulaires définis séparément.
 * Architecture pédagogique simple et claire.
 * 
 * @author Migration FSM Phase 2
 * @version 2.0.0 - Version modulaire simplifiée
 */

import { createMachine } from 'robot3';
import { BOT_STATES } from './constants.js';
import { evaluatingState, exploringState, collectingState, returningState, idleAtBaseState } from './states/index.js';
import { createEntityContext } from './context/initialContext.js';

// ============================================================================
// MACHINE FSM SIMPLIFIÉE - Utilise les états modulaires
// ============================================================================

/**
 * Crée une machine FSM pour un bot autonome
 * 
 * @param {string} botId - Identifiant unique du bot
 * @param {object} initialData - Données initiales optionnelles
 * @returns {object} Machine FSM configurée
 */
export const createBotMachine = (botId, initialData = {}) => {
  return createMachine(
    // État initial : toujours commencer par l'évaluation
    BOT_STATES.EVALUATING,
    
    // Mapping des états : nom → définition
    {
      [BOT_STATES.EVALUATING]: evaluatingState,
      [BOT_STATES.EXPLORING]: exploringState,
      [BOT_STATES.COLLECTING]: collectingState,
      [BOT_STATES.RETURNING]: returningState,
      [BOT_STATES.IDLE_AT_BASE]: idleAtBaseState,
    },
    
    // Fonction de création du contexte initial
    () => createEntityContext(botId, initialData)
  );
};

/**
 * Export par défaut pour usage simple
 */
export default createBotMachine;

// ============================================================================
// AIDE-MÉMOIRE PÉDAGOGIQUE
// ============================================================================

/**
 * COMMENT FONCTIONNE CETTE MACHINE :
 * 
 * 1. État initial : EVALUATING
 *    - Point central de décision
 *    - Analyse la situation et choisit la prochaine action
 * 
 * 2. Transitions automatiques basées sur des événements :
 *    - ASSESSMENT_COMPLETE → détermine le prochain état
 *    - AREA_EXPLORED → retour à EVALUATING
 *    - RESOURCE_COLLECTED → retour à EVALUATING
 *    - BASE_REACHED → passage à IDLE_AT_BASE
 * 
 * 3. Transitions d'urgence (depuis n'importe quel état) :
 *    - EMERGENCY_DETECTED → RETURNING
 *    - MANUAL_OVERRIDE → EVALUATING
 * 
 * 4. Chaque état gère ses propres timeouts et conditions
 * 
 * AVANTAGES DE CETTE ARCHITECTURE :
 * - Code lisible et maintenable
 * - États découplés et réutilisables
 * - Logique centralisée dans chaque fichier d'état
 * - Facile à déboguer et tester
 */
