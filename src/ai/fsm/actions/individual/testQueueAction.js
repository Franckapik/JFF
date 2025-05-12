// src/ai/fsm/actions/individual/testQueueAction.js
import { BOT_STATES } from '../../../constants/botConstants';
import fsmLogger from '../../../../utils/fsmLogger';

/**
 * Action de test pour vérifier le fonctionnement de la queue d'actions
 * Simule une action longue qui prend 5 secondes à s'exécuter
 * @param {Object} playerStore - Store des joueurs
 * @param {Object} tileStore - Store des tuiles
 * @param {Function} addAction - Fonction pour ajouter une action
 * @param {Function} changeState - Fonction pour changer l'état du bot
 * @returns {boolean} - True si une action a été effectuée
 */
export const testQueueAction = (playerStore, tileStore, addAction, changeState) => {
  const botVehicle = playerStore.players?.player2?.vehicles?.ship;
  if (!botVehicle) {
    fsmLogger.error('Bot vehicle not found');
    return false;
  }
  
  // Vérifier si l'action est déjà en cours d'exécution
  if (testQueueAction.isRunning) {
    fsmLogger.action('Test queue action is already running');
    return true; // L'action est considérée comme traitée même si on attend
  }

  // Marquer l'action comme en cours
  testQueueAction.isRunning = true;
  
  fsmLogger.action('Starting test queue action - Will complete in 5 seconds');
  
  // Simuler une tâche qui prend du temps (5 secondes)
  const timer = setTimeout(() => {
    fsmLogger.action('Test queue action completed after 5 seconds');
    
    // Réinitialiser le statut de l'action
    testQueueAction.isRunning = false;
    
    // On peut optionnellement ajouter une autre action ou changer d'état
    // après la fin de cette action
    // Par exemple: changeState(BOT_STATES.IDLE);
    
    // Ou planifier une autre action
    // addAction('moveToRandomTile', PRIORITY.LOW);
  }, 15000);
  
  return true;
};

// Propriété statique pour suivre l'état d'exécution
testQueueAction.isRunning = false;