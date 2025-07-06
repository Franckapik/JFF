/**
 * ==========================================================================
 * CONSOLE NINJA TEST - Test d'intégration avec fsmLogger
 * ==========================================================================
 * 
 * Ce fichier de test permet de vérifier que Console Ninja affiche bien
 * les logs de fsmLogger inline dans VSCode.
 * 
 * Pour tester :
 * 1. Ouvrir ce fichier dans VSCode
 * 2. S'assurer que Console Ninja est installé et activé
 * 3. Exécuter cette fonction depuis la console ou un composant
 * 4. Les logs devraient apparaître inline à côté des lignes de code
 */

import fsmLogger from './fsmLogger.js';

/**
 * Test Console Ninja avec différents types de logs
 */
export const testConsoleNinja = () => {
  console.log('🧪 Test Console Ninja avec fsmLogger démarré...');
  
  // Test 1: Log DEBUG simple
  fsmLogger.debug('Test Console Ninja - DEBUG simple'); // ← Devrait apparaître inline ici
  
  // Test 2: Log DEBUG avec données
  fsmLogger.debug('Test Console Ninja - DEBUG avec données', { // ← Devrait apparaître inline ici
    position: { x: 10, y: 5, z: 3 },
    botId: 'test-bot',
    timestamp: Date.now()
  });
  
  // Test 3: Log INFO
  fsmLogger.info('Test Console Ninja - INFO'); // ← Devrait apparaître inline ici
  
  // Test 4: Log ERROR
  fsmLogger.error('Test Console Ninja - ERROR', { // ← Devrait apparaître inline ici
    errorCode: 'TEST_ERROR',
    severity: 'high'
  });
  
  // Test 5: Log ACTION avec playerId
  fsmLogger.action('Test Console Ninja - ACTION avec bot', { // ← Devrait apparaître inline ici
    action: 'MOVE_TO_POSITION',
    target: '5,8'
  }, 'bot-explorer');
  
  console.log('🧪 Test Console Ninja terminé - vérifiez les logs inline!');
};

/**
 * Test spécifique pour l'exploration de drone (cas d'usage réel)
 */
export const testDroneExploration = () => {
  console.log('🛸 Test spécifique drone exploration...');
  
  // Simulation d'un log d'exploration de drone
  fsmLogger.debug('🎯 [getWalkableTilesInRadius] Source directe détectée:', '5,8'); // ← Inline ici
  
  fsmLogger.debug('🔍 [getWalkableTilesInRadius] Début de recherche:', { // ← Inline ici
    centerCoord: '5,8',
    exploringRadius: 2,
    onlyUnexplored: true,
    excludeDanger: true
  });
  
  fsmLogger.debug('📋 [getWalkableTilesInRadius] Tuiles walkables totales:', 45); // ← Inline ici
  
  fsmLogger.debug('✅ [getWalkableTilesInRadius] 3 tuiles trouvées dans le rayon drone 2'); // ← Inline ici
};

/**
 * Configuration pour activer/désactiver Console Ninja
 */
export const toggleConsoleNinja = (enabled = true) => {
  fsmLogger.enableConsoleNinja(enabled);
  console.log(`Console Ninja ${enabled ? 'activé' : 'désactivé'} pour fsmLogger`);
};

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  window.testConsoleNinja = testConsoleNinja;
  window.testDroneExploration = testDroneExploration;
  window.toggleConsoleNinja = toggleConsoleNinja;
}
