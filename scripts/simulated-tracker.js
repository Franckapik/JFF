/**
 * ==========================================================================
 * SIMULATED TRACKER - Simule les trackers R3F pour tests autonomes
 * ==========================================================================
 * 
 * ✅ Simule le comportement des trackers R3F qui envoient les événements FSM
 * ✅ Calcule les distances et temps de déplacement réalistes
 * ✅ Envoie automatiquement les événements (DRONE_REACHES_TILE, etc.)
 * 
 * USAGE:
 *   import { SimulatedTracker } from './simulated-tracker.js';
 *   const tracker = new SimulatedTracker(actor, { verbose: true });
 *   const unsubscribe = tracker.start();
 */

// ========================================
// Configuration des durées (en ms)
// ========================================
const DURATIONS = {
  // Durées de déplacement (basées sur la distance)
  DRONE_SPEED: 2.0,        // unités par seconde
  SHIP_SPEED: 1.5,         // unités par seconde
  MIN_TRAVEL_TIME: 500,    // ms minimum pour un déplacement
  MAX_TRAVEL_TIME: 3000,   // ms maximum pour un déplacement
  
  // Durées d'actions
  SCAN_DURATION: 800,      // ms pour scanner une tuile
  COLLECT_DURATION: 1200,  // ms pour collecter des ressources
  DEPOSIT_DURATION: 1500,  // ms pour déposer des ressources
  REFUEL_DURATION: 1000,   // ms pour ravitailler
  REPAIR_DURATION: 1500,   // ms pour réparer
};

// ========================================
// Utilitaires de calcul
// ========================================

/**
 * Calcule la distance euclidienne entre deux positions
 */
function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) return 0;
  const dx = (pos2.x ?? 0) - (pos1.x ?? 0);
  const dz = (pos2.z ?? 0) - (pos1.z ?? 0);
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Calcule le temps de déplacement basé sur la distance et la vitesse
 */
function calculateTravelTime(distance, speed) {
  if (distance === 0) return DURATIONS.MIN_TRAVEL_TIME;
  
  // Temps = distance / vitesse (converti en ms)
  const travelTime = (distance / speed) * 1000;
  
  // Limiter entre MIN et MAX
  return Math.max(
    DURATIONS.MIN_TRAVEL_TIME,
    Math.min(travelTime, DURATIONS.MAX_TRAVEL_TIME)
  );
}

// ========================================
// Simulated Tracker
// ========================================

export class SimulatedTracker {
  constructor(actor, options = {}) {
    this.actor = actor;
    this.verbose = options.verbose || false;
    this.timers = [];
    this.pendingEvents = new Map(); // Pour éviter les doublons
    this.lastState = null;
  }

  /**
   * Démarre le suivi de la machine et l'envoi automatique d'événements
   */
  start() {
    if (this.verbose) {
      console.log('\n🤖 SimulatedTracker: Starting...\n');
    }

    const subscription = this.actor.subscribe((snapshot) => {
      const state = snapshot.value;
      const stateStr = JSON.stringify(state);
      
      // Éviter de traiter le même état plusieurs fois
      if (stateStr === this.lastState) return;
      this.lastState = stateStr;

      // Gérer les différents états
      if (typeof state === 'object') {
        if (state.exploring) {
          this.handleExploringState(state.exploring, snapshot.context);
        } else if (state.collecting) {
          this.handleCollectingState(state.collecting, snapshot.context);
        } else if (state.maintaining) {
          this.handleMaintainingState(state.maintaining, snapshot.context);
        }
      }
    });

    return () => {
      if (this.verbose) {
        console.log('\n🤖 SimulatedTracker: Stopping...\n');
      }
      this.clearAllTimers();
      subscription.unsubscribe?.();
    };
  }

  /**
   * Gère les états d'exploration (drone)
   */
  handleExploringState(subState, context) {
    const dronePos = context.drone?.position || context.droneFleet?.drones?.explorer?.position;
    const targetTile = context.targetDroneTile || context.droneFleet?.drones?.explorer?.targetDroneTile;
    const tiles = context.gridInfo?.tiles || {};

    if (subState === 'drone_deploying') {
      if (this.verbose) {
        console.log(`\n🔍 [TRACKER DEBUG]:`);
        console.log(`   Tiles in gridInfo: ${Object.keys(tiles).join(', ')}`);
        console.log(`   Target tile (root): ${context.targetDroneTile?.position?.coord || 'N/A'}`);
        console.log(`   Target tile (droneFleet): ${context.droneFleet?.drones?.explorer?.targetDroneTile?.position?.coord || 'N/A'}`);
        console.log(`   Drone position: ${dronePos?.coord || 'N/A'}\n`);
      }
      
      // Calculer le temps de déplacement vers la tuile cible
      if (targetTile?.position?.coord && targetTile.position.coord !== 'unknown') {
        const targetPos = targetTile.position;
        
        const distance = calculateDistance(dronePos, targetPos);
        const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
        
        if (this.verbose) {
          console.log(`\n🤖 [DRONE] Deploying to ${targetTile.position.coord}`);
          console.log(`   Distance: ${distance.toFixed(2)} units`);
          console.log(`   Travel time: ${travelTime}ms\n`);
        }

        this.scheduleEvent('DRONE_REACHES_TILE', travelTime);
      } else {
        if (this.verbose) {
          console.log(`\n⚠️  [DRONE] No target tile defined, cannot proceed\n`);
        }
      }
    } else if (subState === 'drone_scanning') {
      if (this.verbose) {
        console.log(`\n🤖 [DRONE] Scanning tile (${DURATIONS.SCAN_DURATION}ms)\n`);
      }
      this.scheduleEvent('DRONE_HAS_SCANNED', DURATIONS.SCAN_DURATION);
    } else if (subState === 'drone_returning') {
      // Calculer le temps de retour à la base
      const dronePos = context.droneFleet?.drones?.explorer?.position;
      const basePos = context.vehicle?.position;
      
      if (this.verbose) {
        console.log(`\n🔍 [TRACKER] drone_returning detected`);
        console.log(`   Drone position: ${dronePos?.coord || 'N/A'}`);
        console.log(`   Base position: ${basePos?.coord || 'N/A'}\n`);
      }
      
      if (basePos && dronePos) {
        const distance = calculateDistance(dronePos, basePos);
        const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
        
        if (this.verbose) {
          console.log(`\n🤖 [DRONE] Returning to base`);
          console.log(`   Distance: ${distance.toFixed(2)} units`);
          console.log(`   Travel time: ${travelTime}ms\n`);
        }

        this.scheduleEvent('DRONE_REACHES_BASE', travelTime);
      }
    }
  }

  /**
   * Gère les états de collecte (ship)
   */
  handleCollectingState(subState, context) {
    const shipPos = context.vehicle?.position;
    const targetTile = context.vehicle?.targetVehicleTile;
    const basePos = context.vehicle?.basePosition;

    if (subState === 'ship_moving_to_tile') {
      if (this.verbose) {
        console.log(`\n🔍 [TRACKER] ship_moving_to_tile detected`);
        console.log(`   Ship position: ${shipPos?.coord || 'N/A'}`);
        console.log(`   Target tile: ${targetTile?.position?.coord || 'N/A'}\n`);
      }
      
      // Calculer le temps de déplacement vers la tuile
      if (targetTile?.position && shipPos) {
        const distance = calculateDistance(shipPos, targetTile.position);
        const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
        
        if (this.verbose) {
          console.log(`\n🤖 [SHIP] Moving to tile ${targetTile.position.coord}`);
          console.log(`   Distance: ${distance.toFixed(2)} units`);
          console.log(`   Travel time: ${travelTime}ms\n`);
        }

        this.scheduleEvent('SHIP_REACHES_TILE', travelTime);
      }
    } else if (subState === 'ship_collecting') {
      if (this.verbose) {
        console.log(`\n🤖 [SHIP] Collecting resources (${DURATIONS.COLLECT_DURATION}ms)\n`);
      }
      
      // Simuler le chargement de ressources
      this.scheduleEvent(
        { 
          type: 'SHIP_LOAD_RESOURCES',
          amount: { food: 200, debris: 150, special: 0 }
        },
        DURATIONS.COLLECT_DURATION
      );
    } else if (subState === 'ship_returning') {
      // Calculer le temps de retour à la base
      if (basePos && shipPos) {
        const distance = calculateDistance(shipPos, basePos);
        const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
        
        if (this.verbose) {
          console.log(`\n🤖 [SHIP] Returning to base`);
          console.log(`   Distance: ${distance.toFixed(2)} units`);
          console.log(`   Travel time: ${travelTime}ms\n`);
        }

        this.scheduleEvent('SHIP_REACHES_BASE', travelTime);
      }
    }
  }

  /**
   * Gère les états de maintenance
   */
  handleMaintainingState(subState, context) {
    if (subState === 'depositing') {
      if (this.verbose) {
        console.log(`\n🤖 [SHIP] Depositing resources (${DURATIONS.DEPOSIT_DURATION}ms)\n`);
      }
      this.scheduleEvent('SHIP_DEPOSIT_COMPLETE', DURATIONS.DEPOSIT_DURATION);
    } else if (subState === 'refueling') {
      if (this.verbose) {
        console.log(`\n🤖 [SHIP] Refueling (${DURATIONS.REFUEL_DURATION}ms)\n`);
      }
      this.scheduleEvent('SHIP_REFUEL_COMPLETE', DURATIONS.REFUEL_DURATION);
    } else if (subState === 'repairing') {
      if (this.verbose) {
        console.log(`\n🤖 [SHIP] Repairing (${DURATIONS.REPAIR_DURATION}ms)\n`);
      }
      this.scheduleEvent('SHIP_REPAIR_COMPLETE', DURATIONS.REPAIR_DURATION);
    }
  }

  /**
   * Planifie l'envoi d'un événement après un délai
   */
  scheduleEvent(event, delay) {
    const eventType = typeof event === 'string' ? event : event.type;
    
    // Éviter les doublons
    if (this.pendingEvents.has(eventType)) {
      return;
    }

    this.pendingEvents.set(eventType, true);

    const timer = setTimeout(() => {
      if (this.verbose) {
        console.log(`\n🤖 [EVENT] Sending: ${eventType}\n`);
      }
      
      const eventToSend = typeof event === 'string' ? { type: event } : event;
      this.actor.send(eventToSend);
      
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

/**
 * Configuration personnalisée des durées
 */
export function configureDurations(customDurations) {
  Object.assign(DURATIONS, customDurations);
}

/**
 * Obtenir les durées actuelles
 */
export function getDurations() {
  return { ...DURATIONS };
}
