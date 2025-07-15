#!/usr/bin/env node
/**
 * ==========================================================================
 * SCRIPT DE VALIDATION MIGRATION V5 - Test rapide de la migration
 * ==========================================================================
 * 
 * Script pour valider que la migration XState v5 fonctionne correctement.
 * Exécute les tests de base et affiche un rapport de validation.
 * 
 * Usage: npm run test:migration-v5
 */

import { runMigrationTests } from '../src/ai/fsm/machineX/validation/migrationTests.ts';

async function main() {
  console.log('🚀 Validation de la Migration XState v5');
  console.log('========================================\n');
  
  try {
    const results = await runMigrationTests();
    
    const allPassed = results.every(result => result.success);
    
    if (allPassed) {
      console.log('\n🎉 MIGRATION V5 VALIDÉE AVEC SUCCÈS !');
      console.log('✅ Tous les tests sont passés');
      console.log('✅ La machine v5 est opérationnelle');
      console.log('✅ Le store utilise maintenant la machine v5');
      console.log('\n📋 Prochaines étapes recommandées :');
      console.log('   1. Tester en conditions réelles avec le jeu');
      console.log('   2. Surveiller les performances');
      console.log('   3. Valider tous les événements et transitions');
      process.exit(0);
    } else {
      console.log('\n⚠️  ATTENTION: Certains tests ont échoué');
      console.log('   Veuillez corriger les problèmes avant la mise en production');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERREUR lors de la validation:', error);
    process.exit(1);
  }
}

main();
