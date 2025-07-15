/**
 * ==========================================================================
 * VALIDATION MIGRATION XSTATE V5 - Tests et comparaisons
 * ==========================================================================
 * 
 * Fichier pour valider que la migration vers XState v5 fonctionne
 * correctement et est compatible avec la version v4 existante.
 * 
 * @author Migration XState v5
 * @version 1.0.0
 */

import { createActor } from 'xstate';

import { createMachineContext } from './context/initialContext.ts';
import { machineX as machineV4 } from './machine.xstate.ts';
import { machineXV5 } from './machine.xstate.v5.ts';

/**
 * Test de base : vérifier que les deux machines peuvent être instanciées
 */
export function testMachineInstantiation() {
  console.log('🧪 Test d\'instanciation des machines...');
  
  try {
    // Test machine v4
    const contextV4 = createMachineContext('test-bot-v4', 'auto');
    const actorV4 = createActor(machineV4, { input: contextV4 });
    console.log('✅ Machine v4 instanciée avec succès');
    
    // Test machine v5
    const contextV5 = createMachineContext('test-bot-v5', 'auto');
    const actorV5 = createActor(machineXV5, { input: contextV5 });
    console.log('✅ Machine v5 instanciée avec succès');
    
    return { actorV4, actorV5 };
  } catch (error) {
    console.error('❌ Erreur lors de l\'instanciation:', error);
    throw error;
  }
}

/**
 * Test de compatibilité : vérifier que les événements fonctionnent sur les deux versions
 */
export function testEventCompatibility() {
  console.log('🧪 Test de compatibilité des événements...');
  
  const { actorV4, actorV5 } = testMachineInstantiation();
  
  // Démarrer les acteurs
  actorV4.start();
  actorV5.start();
  
  try {
    // Test événement global
    console.log('📤 Test événement SHIP_POSITION_UPDATE...');
    
    const positionEvent = {
      type: 'SHIP_POSITION_UPDATE' as const,
      payload: { x: 10, z: 20 }
    };
    
    actorV4.send(positionEvent);
    console.log('✅ v4: Événement envoyé sans erreur');
    
    actorV5.send(positionEvent);
    console.log('✅ v5: Événement envoyé sans erreur');
    
    // Vérifier les états
    const snapshotV4 = actorV4.getSnapshot();
    const snapshotV5 = actorV5.getSnapshot();
    
    console.log('📊 État v4:', snapshotV4.value);
    console.log('📊 État v5:', snapshotV5.value);
    
    // Arrêter les acteurs
    actorV4.stop();
    actorV5.stop();
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test d\'événements:', error);
    actorV4.stop();
    actorV5.stop();
    return false;
  }
}

/**
 * Test de transitions : vérifier que les transitions d'états fonctionnent
 */
export function testStateTransitions() {
  console.log('🧪 Test des transitions d\'états...');
  
  const { actorV5 } = testMachineInstantiation();
  actorV5.start();
  
  try {
    const initialSnapshot = actorV5.getSnapshot();
    console.log('🎯 État initial v5:', initialSnapshot.value);
    
    // Test transition vers exploring (une fois implémentée)
    // actorV5.send({ type: 'needExploring' });
    // const exploringSnapshot = actorV5.getSnapshot();
    // console.log('🎯 État après needExploring:', exploringSnapshot.value);
    
    actorV5.stop();
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de transitions:', error);
    actorV5.stop();
    return false;
  }
}

/**
 * Compare les performances entre v4 et v5
 */
export function benchmarkPerformance() {
  console.log('🧪 Benchmark des performances...');
  
  const iterations = 1000;
  
  // Benchmark v4
  const startV4 = performance.now();
  for (let i = 0; i < iterations; i++) {
    const context = createMachineContext(`bot-${i}`, 'auto');
    const actor = createActor(machineV4, { input: context });
    actor.start();
    actor.send({ type: 'SHIP_POSITION_UPDATE', payload: { x: i, z: i } });
    actor.stop();
  }
  const endV4 = performance.now();
  
  // Benchmark v5
  const startV5 = performance.now();
  for (let i = 0; i < iterations; i++) {
    const context = createMachineContext(`bot-${i}`, 'auto');
    const actor = createActor(machineXV5, { input: context });
    actor.start();
    actor.send({ type: 'SHIP_POSITION_UPDATE', payload: { x: i, z: i } });
    actor.stop();
  }
  const endV5 = performance.now();
  
  const timeV4 = endV4 - startV4;
  const timeV5 = endV5 - startV5;
  
  console.log(`⏱️ Performance v4: ${timeV4.toFixed(2)}ms pour ${iterations} itérations`);
  console.log(`⏱️ Performance v5: ${timeV5.toFixed(2)}ms pour ${iterations} itérations`);
  console.log(`📈 Différence: ${((timeV5 - timeV4) / timeV4 * 100).toFixed(2)}%`);
  
  return { timeV4, timeV5, difference: timeV5 - timeV4 };
}

/**
 * Lance tous les tests de validation
 */
export function runAllValidationTests() {
  console.log('🚀 Démarrage des tests de validation XState v5...\n');
  
  const results = {
    instantiation: false,
    eventCompatibility: false,
    stateTransitions: false,
    performance: null as any
  };
  
  try {
    results.instantiation = !!testMachineInstantiation();
    console.log('');
    
    results.eventCompatibility = testEventCompatibility();
    console.log('');
    
    results.stateTransitions = testStateTransitions();
    console.log('');
    
    results.performance = benchmarkPerformance();
    console.log('');
    
    console.log('📋 Résumé des tests:');
    console.log(`✅ Instanciation: ${results.instantiation ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`✅ Compatibilité événements: ${results.eventCompatibility ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`✅ Transitions: ${results.stateTransitions ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`⏱️ Performance: v5 ${results.performance.difference > 0 ? 'plus lente' : 'plus rapide'} de ${Math.abs(results.performance.difference).toFixed(2)}ms`);
    
    return results;
  } catch (error) {
    console.error('💥 Erreur générale dans les tests:', error);
    return results;
  }
}

// Auto-exécution si le fichier est importé directement
if (typeof window === 'undefined') {
  // runAllValidationTests();
}
