/**
 * ==========================================================================
 * SIMULATED TRACKER CORE - Logique pure partagée (Test + Front)
 * ==========================================================================
 * 
 * Module partagé entre le test Node.js et le front React/R3F
 * Contient toute la logique de calcul des distances, durées, et événements
 * 
 * ✅ Logique pure (pas de side-effects)
 * ✅ Compatible Node + Browser
 * ✅ Source unique de vérité pour les timings
 */

import type { FSMContext } from '../../../../types/fsm.d.ts';
import type { MachineEvents } from '../events.pure.v5.ts';

// ========================================
// Configuration des durées (en ms)
// ========================================

export const DURATIONS = {
  // Vitesses de déplacement (unités par seconde)
  DRONE_SPEED: 2.0,
  SHIP_SPEED: 1.5,
  
  // Limites de temps de déplacement
  MIN_TRAVEL_TIME: 500,    // ms minimum
  MAX_TRAVEL_TIME: 3000,   // ms maximum
  
  // Durées d'actions
  SCAN_DURATION: 800,
  COLLECT_DURATION: 1200,
  DEPOSIT_DURATION: 1500,
  REFUEL_DURATION: 1000,
  REPAIR_DURATION: 1500,
} as const;

// ========================================
// Types
// ========================================

export type Position = {
  x: number;
  y?: number;
  z: number;
  coord?: string;
};

export type ScheduledEvent = {
  event: MachineEvents;
  delay: number;
  reason?: string;
};

export type StateInfo = {
  mainState: string;
  subState: string | null;
};

// ========================================
// Utilitaires de calcul
// ========================================

/**
 * Calcule la distance euclidienne entre deux positions
 */
export function calculateDistance(pos1: Position | null | undefined, pos2: Position | null | undefined): number {
  if (!pos1 || !pos2) return 0;
  
  const dx = (pos2.x ?? 0) - (pos1.x ?? 0);
  const dz = (pos2.z ?? 0) - (pos1.z ?? 0);
  
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Calcule le temps de déplacement basé sur la distance et la vitesse
 */
export function calculateTravelTime(distance: number, speed: number): number {
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
// Détection d'état FSM
// ========================================

/**
 * Parse le snapshot.value pour détecter l'état principal et le sous-état
 */
export function detectCurrentState(snapshotValue: string | object): StateInfo {
  if (typeof snapshotValue === 'string') {
    return { mainState: snapshotValue, subState: null };
  }
  
  // Format XState v5 : { exploring: 'drone_deploying' }
  const keys = Object.keys(snapshotValue);
  if (keys.length > 0) {
    const mainState = keys[0];
    const subState = (snapshotValue as Record<string, unknown>)[mainState];
    return { mainState, subState: typeof subState === 'string' ? subState : null };
  }
  
  return { mainState: 'unknown', subState: null };
}

// ========================================
// Extraction de positions/cibles
// ========================================

/**
 * Extrait les positions et cibles du contexte FSM
 */
export function extractPositionsAndTargets(context: FSMContext) {
  const dronePos = context.droneFleet?.drones?.explorer?.position;
  const shipPos = context.vehicle?.position;
  const basePos = context.vehicle?.basePosition;
  const targetDroneTile = context.droneFleet?.drones?.explorer?.targetDroneTile;
  const targetVehicleTile = context.vehicle?.targetVehicleTile;
  const tiles = context.gridInfo?.tiles || {};
  
  return {
    dronePos,
    shipPos,
    basePos,
    targetDroneTile,
    targetVehicleTile,
    tiles,
  };
}

// ========================================
// Logique de planification d'événements
// ========================================

/**
 * Détermine les événements à planifier pour un état d'exploration
 */
export function getExploringEvents(
  subState: string,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const { dronePos, basePos, targetDroneTile, tiles } = extractPositionsAndTargets(context);
  const events: ScheduledEvent[] = [];
  
  if (subState === 'drone_deploying') {
    if (verbose && targetDroneTile) {
      // eslint-disable-next-line no-console
      console.log(`\n🔍 [TRACKER-CORE] drone_deploying to ${targetDroneTile.position?.coord || 'unknown'}`);
      // eslint-disable-next-line no-console
      console.log(`   Tiles available: ${Object.keys(tiles).join(', ')}`);
    }
    
    if (targetDroneTile?.position?.coord && targetDroneTile.position.coord !== 'unknown') {
      const targetPos = targetDroneTile.position;
      const distance = calculateDistance(dronePos, targetPos);
      const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${travelTime}ms`);
      }
      
      events.push({
        event: { type: 'DRONE_REACHES_TILE' },
        delay: travelTime,
        reason: `Drone traveling to ${targetPos.coord}`
      });
    } else if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`   ⚠️  No valid target tile`);
    }
  } else if (subState === 'drone_scanning') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🔍 [TRACKER-CORE] drone_scanning (${DURATIONS.SCAN_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'DRONE_HAS_SCANNED' },
      delay: DURATIONS.SCAN_DURATION,
      reason: 'Scanning tile'
    });
  } else if (subState === 'drone_returning') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`\n🔍 [TRACKER-CORE] drone_returning to base`);
    }
    
    if (basePos && dronePos) {
      const distance = calculateDistance(dronePos, basePos);
      const travelTime = calculateTravelTime(distance, DURATIONS.DRONE_SPEED);
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${travelTime}ms`);
      }
      
      events.push({
        event: { type: 'DRONE_REACHES_BASE' },
        delay: travelTime,
        reason: 'Drone returning to base'
      });
    }
  }
  
  return events;
}

/**
 * Détermine les événements à planifier pour un état de collecte
 */
export function getCollectingEvents(
  subState: string,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const { shipPos, basePos, targetVehicleTile } = extractPositionsAndTargets(context);
  const events: ScheduledEvent[] = [];
  
  if (subState === 'ship_moving_to_tile') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`\n🔍 [TRACKER-CORE] ship_moving_to_tile`);
    }
    
    if (targetVehicleTile?.position && shipPos) {
      const distance = calculateDistance(shipPos, targetVehicleTile.position);
      const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Target: ${targetVehicleTile.position.coord}`);
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${travelTime}ms`);
      }
      
      events.push({
        event: { type: 'SHIP_REACHES_TILE' },
        delay: travelTime,
        reason: `Ship traveling to ${targetVehicleTile.position.coord}`
      });
    }
  } else if (subState === 'ship_collecting') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🚢 [TRACKER-CORE] ship_collecting (${DURATIONS.COLLECT_DURATION}ms)`);
    }
    
    events.push({
      event: { 
        type: 'SHIP_LOAD_RESOURCES'
      },
      delay: DURATIONS.COLLECT_DURATION,
      reason: 'Collecting resources'
    });
  } else if (subState === 'ship_returning') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`\n🔍 [TRACKER-CORE] ship_returning to base`);
    }
    
    if (basePos && shipPos) {
      const distance = calculateDistance(shipPos, basePos);
      const travelTime = calculateTravelTime(distance, DURATIONS.SHIP_SPEED);
      
      if (verbose) {
      // eslint-disable-next-line no-console
        console.log(`   Distance: ${distance.toFixed(2)} units, Travel time: ${travelTime}ms`);
      }
      
      events.push({
        event: { type: 'SHIP_REACHES_BASE' },
        delay: travelTime,
        reason: 'Ship returning to base'
      });
    }
  }
  
  return events;
}

/**
 * Détermine les événements à planifier pour un état de maintenance
 */
export function getMaintainingEvents(
  subState: string,
  _context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  if (subState === 'depositing') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🔧 [TRACKER-CORE] depositing (${DURATIONS.DEPOSIT_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_DEPOSIT_COMPLETE' },
      delay: DURATIONS.DEPOSIT_DURATION,
      reason: 'Depositing resources'
    });
  } else if (subState === 'refueling') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🔧 [TRACKER-CORE] refueling (${DURATIONS.REFUEL_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_REFUEL_COMPLETE' },
      delay: DURATIONS.REFUEL_DURATION,
      reason: 'Refueling ship'
    });
  } else if (subState === 'repairing') {
    if (verbose) {
       
      // eslint-disable-next-line no-console
      console.log(`\n🔧 [TRACKER-CORE] repairing (${DURATIONS.REPAIR_DURATION}ms)`);
    }
    
    events.push({
      event: { type: 'SHIP_REPAIR_COMPLETE' },
      delay: DURATIONS.REPAIR_DURATION,
      reason: 'Repairing ship'
    });
  }
  
  return events;
}

/**
 * Détermine les événements d'initialisation à planifier
 */
export function getInitializingEvents(
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  // Position de base par défaut (0,0,0) - sera ajustée par les actions
  const defaultPosition = { x: 0, y: 0.5, z: 0, coord: '0,0' };
  
  // Vérifier si le vaisseau doit être initialisé
  const shipPosition = context.vehicle?.position;
  if (!shipPosition || (shipPosition.x === undefined && shipPosition.z === undefined)) {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('\n🔧 [TRACKER-CORE] Scheduling SHIP_INITIALIZE_REQUEST');
    }
    events.push({
      event: { 
        type: 'SHIP_INITIALIZE_REQUEST',
        initialPosition: defaultPosition,
        shipType: 'main-ship'
      },
      delay: 50,
      reason: 'Initialize ship'
    });
  }
  
  // Vérifier si le drone doit être initialisé
  const droneState = context.droneFleet?.drones?.explorer?.visualState;
  if (droneState === 'uninitialized') {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('\n🔧 [TRACKER-CORE] Scheduling DRONE_INITIALIZE_REQUEST');
    }
    events.push({
      event: { 
        type: 'DRONE_INITIALIZE_REQUEST',
        droneType: 'explorer'
      },
      delay: 100, // After ship initialization
      reason: 'Initialize drone'
    });
  }
  
  return events;
}

/**
 * Détermine les événements d'évaluation à planifier
 */
export function getEvaluatingEvents(
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  const events: ScheduledEvent[] = [];
  
  // Pour l'état evaluating, on envoie NEED_EXPLORING si le drone est disponible
  const isDroneAvailable = context.droneFleet?.drones?.explorer?.visualState !== 'uninitialized';
  const hasExplorationQueue = (context.explorationQueue?.length || 0) > 0;
  
  if (isDroneAvailable && !hasExplorationQueue) {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.log('\n🔧 [TRACKER-CORE] Scheduling NEED_EXPLORING');
    }
    events.push({
      event: { type: 'NEED_EXPLORING' },
      delay: 100,
      reason: 'Start exploration cycle'
    });
  }
  
  return events;
}

/**
 * Fonction principale : détermine tous les événements à planifier pour un snapshot donné
 */
export function getScheduledEvents(
  snapshotValue: string | object,
  context: FSMContext,
  verbose: boolean = false
): ScheduledEvent[] {
  if (verbose) {
    // eslint-disable-next-line no-console
    console.log('\n🔍 [TRACKER-CORE] getScheduledEvents called', {
      state: JSON.stringify(snapshotValue),
      verbose
    });
  }
  
  const { mainState, subState } = detectCurrentState(snapshotValue);
  
  // Gestion des états sans sous-état
  if (!subState) {
    switch (mainState) {
      case 'initializing':
        return getInitializingEvents(context, verbose);
      case 'evaluating':
        return getEvaluatingEvents(context, verbose);
      default:
        return [];
    }
  }
  
  // Gestion des états avec sous-états
  switch (mainState) {
    case 'exploring':
      return getExploringEvents(subState, context, verbose);
    case 'collecting':
      return getCollectingEvents(subState, context, verbose);
    case 'maintaining':
      return getMaintainingEvents(subState, context, verbose);
    default:
      return [];
  }
}
