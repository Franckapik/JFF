/**
 * ============================================================================
 * EXEMPLE D'UTILISATION - Architecture FSM Modulaire
 * ============================================================================
 * 
 * Exemple simple d'utilisation de la nouvelle architecture FSM
 * avec des bots autonomes.
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { createBotMachine } from './machine/machineFactory.js';
import { BOT_STATES } from './machine/states/index.js';

// ============================================================================
// EXEMPLE 1 : Créer et utiliser un bot simple
// ============================================================================

/**
 * Exemple de création et d'utilisation d'un bot
 */
export function exempleBot() {
  // 1. Créer la machine pour un bot
  const botMachine = createBotMachine('bot-example', {
    vehicle: {
      fuel: 85,
      coord: 'B2',
      startCoord: 'A1',
      inventory: {
        capacity: 0,
        maxCapacity: 100
      }
    },
    knownResources: [],
    hasExplored: false
  });

  // 2. Écouter les changements d'état
  botMachine.onChange((newMachine) => {
    console.log('🤖 Bot State Change:', {
      state: newMachine.current,
      action: newMachine.context.currentAction,
      decision: newMachine.context.lastDecision
    });
  });

  // 3. Démarrer le processus d'évaluation
  console.log('🚀 Starting bot evaluation...');
  botMachine.send('EVALUATION_COMPLETE');

  return botMachine;
}

// ============================================================================
// EXEMPLE 2 : Simulation d'une séquence complète
// ============================================================================

/**
 * Simule une séquence complète d'actions pour un bot
 */
export async function simulerSequenceBot() {
  const bot = createBotMachine('bot-simulation', {
    vehicle: { fuel: 100, coord: 'A1', startCoord: 'A1' },
    hasExplored: false,
    knownResources: []
  });

  console.log('📋 Séquence de simulation:');
  
  // Étape 1: Évaluation initiale → Exploration
  console.log('1. Évaluation initiale...');
  bot.send('EVALUATION_COMPLETE');
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  // Étape 2: Exploration → Découverte
  console.log('2. Simulation exploration...');
  await delay(1000);
  bot.send('RESOURCES_DISCOVERED', {
    resources: [
      { id: 'res-1', type: 'food', coord: 'C3' },
      { id: 'res-2', type: 'debris', coord: 'D4' }
    ]
  });
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  // Étape 3: Retour à l'évaluation → Collecte
  console.log('3. Évaluation après découverte...');
  bot.send('EVALUATION_COMPLETE');
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  // Étape 4: Collecte → Inventaire plein
  console.log('4. Simulation collecte...');
  await delay(1000);
  bot.send('INVENTORY_FULL');
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  // Étape 5: Retour à la base
  console.log('5. Arrivée à la base...');
  await delay(1000);
  bot.send('BASE_REACHED', { coord: 'A1', timestamp: Date.now() });
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  // Étape 6: Maintenance terminée
  console.log('6. Maintenance terminée...');
  await delay(500);
  bot.send('REFUEL_COMPLETE', { fuel: 100 });
  console.log(`   État: ${bot.current} (${bot.context.currentAction})`);
  
  console.log('✅ Séquence terminée!');
  return bot;
}

// ============================================================================
// EXEMPLE 3 : Gestion d'urgence
// ============================================================================

/**
 * Exemple de gestion d'urgence
 */
export function exempleUrgence() {
  const bot = createBotMachine('bot-urgence', {
    vehicle: { fuel: 15, coord: 'F6', startCoord: 'A1' }, // Fuel faible !
  });

  console.log('🚨 Test de gestion d\'urgence:');
  
  // Le bot est en exploration
  bot.send('EVALUATION_COMPLETE'); // → EXPLORING (car hasExplored: false)
  console.log(`1. État initial: ${bot.current}`);
  
  // Urgence carburant détectée
  bot.send('LOW_FUEL_DETECTED');
  console.log(`2. Après urgence: ${bot.current} (${bot.context.emergencyReason})`);
  
  // Override manuel
  bot.send('MANUAL_OVERRIDE', { command: 'debug_stop' });
  console.log(`3. Après override: ${bot.current} (${bot.context.manualCommand})`);
  
  return bot;
}

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Utilitaire pour délai
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debug helper pour inspecter l'état du bot
 */
export function debugBot(bot) {
  const context = bot.context;
  
  return {
    state: bot.current,
    botId: context.botId,
    fuel: context.vehicle?.fuel,
    position: context.vehicle?.coord,
    base: context.vehicle?.startCoord,
    lastAction: context.currentAction,
    lastDecision: context.lastDecision,
    knownResources: context.knownResources?.length || 0,
    hasExplored: context.hasExplored,
    emergency: context.emergencyFlag ? context.emergencyReason : null
  };
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
// Pour utiliser ces exemples :

import { exempleBot, simulerSequenceBot, exempleUrgence, debugBot } from './exemple.js';

// Bot simple
const bot1 = exempleBot();
console.log(debugBot(bot1));

// Séquence complète
simulerSequenceBot().then(bot => {
  console.log('Final state:', debugBot(bot));
});

// Test d'urgence
const bot3 = exempleUrgence();
console.log(debugBot(bot3));
*/
