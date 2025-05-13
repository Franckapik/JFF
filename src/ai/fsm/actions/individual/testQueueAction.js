// src/ai/fsm/actions/individual/testQueueAction.js
/**
 * IMPORTANT: Cette action ne doit pas contenir de logique de décision d'état.
 * - Ne pas vérifier les conditions (niveau carburant, capacité max)
 * - Ne pas décider du prochain état basé sur des conditions
 * - Toujours retourner à IDLE pour la prise de décision
 * 
 * Le seul changement d'état autorisé est vers IDLE avec evaluateIdle.
 */
import { BOT_STATES } from '../../../constants/botConstants';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Action de test pour vérifier le fonctionnement de la queue d'actions
 * Simule une action longue qui prend 5 secondes à s'exécuter
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean|undefined} - True si l'action est terminée, false si elle a échoué, undefined si elle est en cours
 */
export const testQueueAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false; // Échec de l'action
  }
  
  // Vérifier si l'action est déjà en cours d'exécution
  if (!testQueueAction.startTime) {
    // Initialisation de l'action - premier appel
    testQueueAction.startTime = Date.now();
    fsmLogger.action('Starting test queue action - Will complete in 5 seconds');
    return undefined; // Action en cours, reste bloquante
  }
  
  // Vérifier si l'action est terminée (après 5 secondes)
  const elapsedTime = Date.now() - testQueueAction.startTime;
  const isComplete = elapsedTime >= 1000;
  
  if (isComplete) {
    fsmLogger.action(`Test queue action completed after ${(elapsedTime/1000).toFixed(1)} seconds`);
    
    // Réinitialiser le statut pour la prochaine exécution
    testQueueAction.startTime = null;
    
    // On peut optionnellement ajouter une autre action ou changer d'état
    // après la fin de cette action
    changeState(BOT_STATES.IDLE);
    
    return true; // Action terminée avec succès
  }
  
  // L'action est toujours en cours
  if (elapsedTime % 1000 < 100) { // Afficher un message toutes les secondes environ
    fsmLogger.action(`Test queue action in progress: ${(elapsedTime/1000).toFixed(1)}s / 5s`);
  }
  
  return undefined; // Action toujours en cours, reste bloquante
};

// Propriété statique pour suivre l'état d'exécution
testQueueAction.startTime = null;