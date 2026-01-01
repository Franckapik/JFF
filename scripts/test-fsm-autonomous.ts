#!/usr/bin/env node
/**
 * ==========================================================================
 * SCRIPT TEST FSM AUTONOMOUS - Pure Autonomous Machine Test
 * ==========================================================================
 * 
 * ✅ Tests the FSM in pure autonomy mode without sending any events.
 * The machine manages its own state transitions based on internal logic.
 * 
 * USAGE:
 *   npm run test:fsm-autonomous
 *   ts-node --esm scripts/test-fsm-autonomous.ts
 *   ts-node --esm scripts/test-fsm-autonomous.ts --verbose
 *   ts-node --esm scripts/test-fsm-autonomous.ts --duration=10000
 * 
 * OPTIONS:
 *   --verbose          : Detailed logging (default: false)
 *   --duration=<ms>    : Test duration in milliseconds (default: 30000)
 */

import { createActor, type Actor } from 'xstate';
import { machineXV5Pure } from '../src/ai/fsm/machineX/machine.pure.v5.ts';
import { makeInitialContext } from '../src/ai/fsm/machineX/test/mockData.ts';
import { 
  getScheduledEvents, 
  type ScheduledEvent,
  DURATIONS 
} from '../src/ai/fsm/machineX/shared/simulatedTrackerCore.ts';
import type { FSMContext } from '../src/types/fsm.d.ts';
import type { MachineEvents } from '../src/ai/fsm/machineX/events.pure.v5.ts';

// ========================================
// Configuration
// ========================================
const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const durationArg = args.find(arg => arg.startsWith('--duration='))?.split('=')[1];
const duration = durationArg ? parseInt(durationArg, 10) : 30000;

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║    TEST FSM AUTONOMOUS - No Events Required                  ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log(`\n⏱️  Duration: ${duration}ms`);
console.log(`🔍 Verbose: ${verbose ? 'ON' : 'OFF'}\n`);

// ========================================
// Node Tracker Adapter - Wraps shared core
// ========================================

class NodeTrackerAdapter {
  constructor(actor, options = {}) {
    this.actor = actor;
    this.verbose = options.verbose || false;
    this.timers = [];
    this.pendingEvents = new Map();
    this.lastState = null;
  }

  /**
   * Démarre le suivi de la machine et l'envoi automatique d'événements
   */
  start() {
    if (this.verbose) {
      console.log('\n🤖 NodeTrackerAdapter: Starting...\n');
    }

    const subscription = this.actor.subscribe((snapshot) => {
      const state = snapshot.value;
      const stateStr = JSON.stringify(state);
      
      // Éviter de traiter le même état plusieurs fois
      if (stateStr === this.lastState) return;
      this.lastState = stateStr;

      // Utiliser le core partagé pour obtenir les événements à planifier
      const scheduledEvents = getScheduledEvents(state, snapshot.context, this.verbose);
      
      // Planifier tous les événements retournés
      scheduledEvents.forEach(({ event, delay, reason }) => {
        this.scheduleEvent(event, delay, reason);
      });
    });

    return () => {
      if (this.verbose) {
        console.log('\n🤖 NodeTrackerAdapter: Stopping...\n');
      }
      this.clearAllTimers();
      subscription.unsubscribe?.();
    };
  }

  /**
   * Planifie l'envoi d'un événement après un délai
   */
  scheduleEvent(event, delay, reason) {
    const eventType = event.type;
    
    // Éviter les doublons
    if (this.pendingEvents.has(eventType)) {
      return;
    }

    this.pendingEvents.set(eventType, true);

    const timer = setTimeout(() => {
      if (this.verbose) {
        console.log(`\n🤖 [EVENT] Sending: ${eventType}${reason ? ` (${reason})` : ''}\n`);
      }
      
      this.actor.send(event);
      this.pendingEvents.delete(eventType);
    }, delay);

    this.timers.push(timer);
  }

  /**
   * Nettoie tous les timers en attente
   */
  clearAllTimers() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
    this.pendingEvents.clear();
  }
}

// ========================================
// State Monitor
// ========================================
class StateMonitor {
  constructor(actor, options = {}) {
    this.actor = actor;
    this.verbose = options.verbose || false;
    this.stateHistory = [];
    this.stats = {
      totalStateChanges: 0,
      startTime: Date.now(),
      startedAt: new Date().toLocaleTimeString(),
    };
  }

  /**
   * Start monitoring state changes
   */
  startMonitoring() {
    // Capturer l'état initial AVANT de subscribe pour ne pas le rater
    const initialSnapshot = this.actor.getSnapshot();
    let lastState = JSON.stringify(initialSnapshot.value);
    
    // Log de l'état initial
    if (this.verbose) {
      console.log('\n📌 INITIAL STATE CAPTURED');
      console.log('─'.repeat(80));
      console.table({
        state: JSON.stringify(initialSnapshot.value),
        'initial-time': '0ms'
      });
    }
    
    // Observer les changements d'état via subscribe
    const subscription = this.actor.subscribe((snapshot) => {
      const currentStateStr = JSON.stringify(snapshot.value);
      
      // Détecter les changements d'état
      if (currentStateStr !== lastState) {
        this.stats.totalStateChanges++;
        const timestamp = Date.now() - this.stats.startTime;
        
        this.stateHistory.push({
          state: snapshot.value,
          timestamp,
          contextSnapshot: {
            vehicleFuel: snapshot.context?.vehicle?.fuel,
            vehicleDamage: snapshot.context?.vehicle?.damage,
            vehicleCapacity: snapshot.context?.vehicle?.currentCapacity,
            vehicleMaxCapacity: snapshot.context?.vehicle?.maxCapacity?.total,
            droneState: snapshot.context?.droneFleet?.drones?.explorer?.visualState,
            fsmState: snapshot.context?.fsmState,
            targetTile: snapshot.context?.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord,
          }
        });

        if (this.verbose) {
          this.logStateChange(snapshot, timestamp);
        } else {
          this.logStateChangeCompact(snapshot, timestamp);
        }
        
        lastState = currentStateStr;
      }
    });

    // Retourner une fonction pour unsubscribe
    return () => {
      if (subscription) subscription.unsubscribe?.();
    };
  }

  logStateChange(snapshot, timestamp) {
    console.log('\n' + '─'.repeat(80));
    console.log('🎯 STATE CHANGED');
    console.log('─'.repeat(80));
    console.table({
      state: JSON.stringify(snapshot.value),
      time: `${timestamp}ms`,
      totalChanges: this.stats.totalStateChanges
    });

    // Afficher un résumé du contexte avec les vraies valeurs
    if (snapshot.context) {
      const maxCap = snapshot.context?.vehicle?.maxCapacity?.total ?? 'unknown';
      const currentCap = snapshot.context?.vehicle?.currentCapacity ?? 0;
      
      console.log('\n📊 Context Snapshot:');
      console.table({
        fuel: `${snapshot.context?.vehicle?.fuel ?? 'N/A'}%`,
        damage: `${snapshot.context?.vehicle?.damage ?? 'N/A'}%`,
        'capacity': `${currentCap}/${maxCap}`,
        'drone-state': snapshot.context?.droneFleet?.drones?.explorer?.visualState ?? 'N/A',
        'target-tile': snapshot.context?.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord ?? 'none',
        'fsm-state': snapshot.context?.fsmState ?? 'N/A'
      });
    }
  }

  logStateChangeCompact(snapshot, timestamp) {
    console.log(`\n🎯 [${timestamp}ms] State: ${JSON.stringify(snapshot.value)}`);
  }

  /**
   * Display final statistics
   */
  displayStats() {
    const elapsed = Date.now() - this.stats.startTime;
    console.log('\n' + '═'.repeat(80));
    console.log('📈 TEST SUMMARY');
    console.log('═'.repeat(80));
    console.table({
      'Total State Changes': this.stats.totalStateChanges,
      'Duration': `${elapsed}ms`,
      'Started At': this.stats.startedAt,
      'Initial State': JSON.stringify(this.stateHistory[0]?.state),
      'Final State': JSON.stringify(this.stateHistory[this.stateHistory.length - 1]?.state)
    });

    if (verbose && this.stateHistory.length > 0) {
      console.log('\n📋 State History:');
      console.table(
        this.stateHistory.map((entry, idx) => ({
          '#': idx + 1,
          'State': JSON.stringify(entry.state),
          'Time': `${entry.timestamp}ms`
        }))
      );
    }
  }
}

// ========================================
// Health Checker - Analyze and detect issues
// ========================================
class HealthChecker {
  constructor(monitor) {
    this.monitor = monitor;
    this.issues = [];
    this.warnings = [];
  }

  analyze() {
    const history = this.monitor.stateHistory;
    
    if (history.length === 0) {
      this.issues.push('❌ No state changes detected - FSM might not have started');
      return;
    }

    // Vérifier les patterns suspects
    this.checkStatePatterns(history);
    this.checkContextProgress(history);
    this.checkStuckStates(history);
  }

  checkStatePatterns(history) {
    const states = history.map(h => JSON.stringify(h.state));
    
    // Détecter les boucles infinies
    if (states.length > 5) {
      const lastFive = states.slice(-5);
      if (new Set(lastFive).size === 1) {
        this.issues.push(`⚠️  State stuck in: ${lastFive[0]} for 5+ transitions`);
      }
    }

    // Détecter les transitions invalides
    for (const state of states) {
      if (state.includes('exploring') && state.includes('maintaining')) {
        this.issues.push('❌ Invalid state: cannot be exploring AND maintaining simultaneously');
      }
      if (state.includes('collecting') && state.includes('exploring')) {
        this.issues.push('❌ Invalid state: cannot be collecting AND exploring simultaneously');
      }
    }
  }

  checkContextProgress(history) {
    if (history.length < 2) return;

    const first = history[0].contextSnapshot;
    const last = history[history.length - 1].contextSnapshot;

    // Vérifier que la machine progresse
    const fuelChanged = first.vehicleFuel !== last.vehicleFuel;
    const damageChanged = first.vehicleDamage !== last.vehicleDamage;
    const capacityChanged = first.vehicleCapacity !== last.vehicleCapacity;

    if (!fuelChanged && !damageChanged && !capacityChanged) {
      this.warnings.push('⚠️  Context unchanged - machine might not be executing actions');
    }

    // Vérifier les valeurs invalides
    if (last.vehicleFuel < 0 || last.vehicleFuel > 100) {
      this.issues.push(`❌ Invalid fuel value: ${last.vehicleFuel}% (must be 0-100)`);
    }
    if (last.vehicleDamage < 0 || last.vehicleDamage > 100) {
      this.issues.push(`❌ Invalid damage value: ${last.vehicleDamage}% (must be 0-100)`);
    }
    if (last.vehicleCapacity < 0) {
      this.issues.push(`❌ Negative capacity: ${last.vehicleCapacity}`);
    }

    // Vérifier que le drone se déploie
    if (last.droneState === 'uninitialized' && history.length > 5) {
      this.warnings.push('⚠️  Drone still uninitialized after multiple state changes - not deploying');
    }
  }

  checkStuckStates(history) {
    const states = history.map(h => JSON.stringify(h.state));
    
    // Vérifier si on est bloqué dans une boucle
    const stateGroups = this.groupConsecutive(states);
    for (const [state, count] of Object.entries(stateGroups)) {
      if (count > 10) {
        this.issues.push(`⚠️  State stuck: ${state} appears ${count} times consecutively`);
      }
    }

    // Vérifier très peu de transitions
    if (states.length < 3) {
      this.warnings.push(`⚠️  Very few state transitions (${states.length}) - machine may be stuck or not progressing`);
    }

    // Vérifier si on est bloqué dans l'état d'exploration
    if (states.some(s => s.includes('drone_deploying')) && states.length < 5) {
      const lastHistory = history[history.length - 1];
      const targetTile = lastHistory?.contextSnapshot?.targetTile;
      
      if (!targetTile || targetTile === 'none') {
        this.issues.push('❌ CRITICAL: Stuck in drone_deploying with NO target tile - cannot progress without a destination');
        this.warnings.push('💡 Hint: Check that context.gridInfo.tiles is populated and findTilesInRadius returns valid tiles');
      } else {
        this.warnings.push(`⚠️  Stuck in drone_deploying (target: ${targetTile}) - drone is not progressing`);
        this.warnings.push('💡 Hint: In autonomous mode, FSM expects events (DRONE_REACHES_TILE) from R3F trackers which are not running');
        this.warnings.push('💡 Solution: Either run with R3F (npm run dev) or send manual events in test (see test-fsm-cycle.js)');
      }
    }
  }

  groupConsecutive(array) {
    const groups = {};
    let current = null;
    let count = 0;

    for (const item of array) {
      if (item === current) {
        count++;
      } else {
        if (current && count > 0) {
          groups[current] = (groups[current] || 0) + count;
        }
        current = item;
        count = 1;
      }
    }
    if (current && count > 0) {
      groups[current] = (groups[current] || 0) + count;
    }

    return groups;
  }

  report() {
    console.log('\n' + '═'.repeat(80));
    console.log('🔍 HEALTH CHECK REPORT');
    console.log('═'.repeat(80));

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ No issues detected - FSM functioning normally\n');
      return;
    }

    if (this.issues.length > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      this.issues.forEach(issue => console.log(`  ${issue}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warn => console.log(`  ${warn}`));
    }

    console.log();
  }
}

// ========================================
// Main Test
// ========================================
async function runAutonomousTest() {
  try {
    // Créer le contexte initial
    const initialContext = makeInitialContext('autonomous-bot');
    
    if (verbose) {
      console.log('📦 Initial Context Info:');
      console.table({
        'Grid tiles': Object.keys(initialContext.gridInfo?.tiles || {}).join(', '),
        'Tiles count': Object.keys(initialContext.gridInfo?.tiles || {}).length,
        'Available tiles': initialContext.injectedData?.availableTiles?.length || 0,
        'Vehicle position': initialContext.vehicle?.position?.coord || 'N/A',
        'Exploring radius': initialContext.config?.exploringRadius || 'N/A'
      });
      console.log();
    }
    
    // Créer l'acteur (machine autonome)
    const actor = createActor(machineXV5Pure, {
      input: initialContext
    });

    // Démarrer le moniteur
    const monitor = new StateMonitor(actor, { verbose });
    const unsubscribe = monitor.startMonitoring();

    // Démarrer le tracker simulé (utilise le core partagé)
    const tracker = new NodeTrackerAdapter(actor, { verbose });
    const unsubscribeTracker = tracker.start();

    // Démarrer la machine
    console.log('🚀 Starting autonomous FSM with NodeTrackerAdapter (shared core)...\n');
    actor.start();

    // Laisser tourner pendant la durée spécifiée
    await new Promise(resolve => setTimeout(resolve, duration));

    // Arrêter et afficher les stats
    actor.stop();
    unsubscribe();
    unsubscribeTracker();

    // Analyser la santé du FSM
    const healthChecker = new HealthChecker(monitor);
    healthChecker.analyze();
    healthChecker.report();

    monitor.displayStats();

    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    if (healthChecker.issues.length === 0) {
      console.log('║                     ✅ TEST COMPLETED ✅                      ║');
    } else {
      console.log('║                  ⚠️  TEST COMPLETED WITH ISSUES ⚠️             ║');
    }
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    process.exit(healthChecker.issues.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n╔═══════════════════════════════════════════════════════════════╗');
    console.error('║                     ❌ TEST FAILED ❌                        ║');
    console.error('╚═══════════════════════════════════════════════════════════════╝\n');
    console.error('Error:', error.message);
    if (verbose) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Exécuter le test
runAutonomousTest();
