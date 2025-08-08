/**
 * ============================================================================
 * XSTATE EVALUATING ACTIONS - Actions spécifiques à l'état evaluating
 * ============================================================================
 * 
 * Actions migrées depuis la machine.xstate.js (XState), version modulaire.
 * - action_evaluating_entry : logique de décision (maintenance, collecte, exploration, idle)
 * - action_evaluating_exit : simple log
 * 
 * @author Migration FSM Robot3 → XState
 * @version 1.0.0 - Architecture XState
 */


import { assign } from 'xstate';

import fsmLogger from '../../../../logger/fsmLogger.ts';

import type { FSMContext, FSMEvent } from '../../../../types/fsm';

import { droneDeployForExploration } from './core/exploring.core.ts';

import { DroneVisualState } from '@/types/drone.js';

// Types pour les actions XState v5
interface XStateActionWithSelf {
  context: FSMContext;
  self: {
    send: (event: { type: string; reason?: string }) => void;
  };
}

// Types pour les actions XState v5
interface XStateAction {
  context: FSMContext;
  event?: FSMEvent;
}

/**
 * Action d'entrée de l'état evaluating : logique de décision prioritaire
 * Envoie un événement selon la situation du contexte
 */
export const action_evaluating_entry = ({ context, self }: XStateActionWithSelf) => {
  fsmLogger.state('action_evaluating_entry');

  // Évaluation des conditions environnementales
  const vehicle = context?.vehicle;
  const fuel = vehicle?.fuel || 100;
  const damage = vehicle?.damage || 0;
  const resources = vehicle?.resources || { food: 0, debris: 0, special: 0 };
  const maxCapacity = vehicle?.maxCapacity || { food: 200, debris: 1800, special: 3 };

  // Vérifier si maintenance nécessaire (priorité 1)
  const needsMaintenance = fuel < 30 || damage > 50;
  

  // Vérifier si collecte possible (priorité 2)
  const knownTiles = context.memory?.knownTiles || new Map();
  const tilesWithResources = Array.from(knownTiles.values()).filter(tile => 
    tile.explored && tile.hasResources && tile.resources.total > 0
  );
  const hasCollectibleTiles = tilesWithResources.length > 0;

  // Vérifier capacité du vaisseau
  const totalResources = (resources.food || 0) + (resources.debris || 0) + (resources.special || 0);
  const totalCapacity = (maxCapacity.food || 0) + (maxCapacity.debris || 0) + (maxCapacity.special || 0);
  const isShipNotFull = totalResources < totalCapacity * 0.8;

  // Vérifier si exploration nécessaire (priorité 3)
  const exploredTilesCount = Array.from(knownTiles.values()).filter(tile => tile.explored).length;
  const needsExploration = exploredTilesCount < 3; // Explorer au moins 3 tuiles

  fsmLogger.info('[Evaluating] Conditions', {
    fuel, damage, needsMaintenance,
    hasCollectibleTiles, isShipNotFull,
    exploredTilesCount, needsExploration
  });

  // Décision basée sur les priorités
  setTimeout(() => {
    if (needsMaintenance) {
      fsmLogger.info('[Evaluating] → NEED_MAINTENANCE (fuel/damage critical)');
      self.send({ type: 'NEED_MAINTENANCE', reason: 'critical_condition' });
    } else if (hasCollectibleTiles && isShipNotFull) {
      fsmLogger.info('[Evaluating] → NEED_COLLECTING (resources available)');
      self.send({ type: 'NEED_COLLECTING', reason: 'resources_available' });
    } else if (needsExploration) {
      fsmLogger.info('[Evaluating] → NEED_EXPLORING (need more exploration)');
      self.send({ type: 'NEED_EXPLORING', reason: 'insufficient_exploration' });
    } else {
      fsmLogger.info('[Evaluating] → NEED_MAINTENANCE (nothing to do)');
      self.send({ type: 'NEED_MAINTENANCE', reason: 'idle_time' });
    }
  }, 1000); // Délai de 1s pour permettre à l'état de s'initialiser
};

export const updateContext = assign(({ context, event }: XStateAction) => {
  fsmLogger.info(`🔄 [${context?.entityId || 'unknown'}] updateContext called with:`, {
    hasContext: !!context,
    hasEvent: !!event,
    eventType: event?.type,
    event: event,
    contextKeys: Object.keys(context || {})
  });
  
  // Vérification de sécurité pour l'événement
  if (!event || !event.type) {
    fsmLogger.info(`⚠️ [${context?.entityId || 'unknown'}] updateContext called with invalid event`);
    return context || {}; // ✅ CORRECTION: Ne pas retourner un objet vide, préserver le contexte
  }
  
  fsmLogger.info(`🔄 [${context.entityId}] Updating context for transition: ${event.type}`);
  
  if (event.type === 'NEED_EXPLORING') {
    // Déployer le drone pour l'exploration
    fsmLogger.info(`🚁 [${context.entityId}] Deploying drone for exploration`);
    
    const deploymentResult = droneDeployForExploration(context, {
      type: 'droneDeployForExploration',
      range: 3,
      droneType: 'explorer'
    });
    
    fsmLogger.info(`✅ [${context.entityId}] Drone deployment result:`, {
      hasDroneFleet: !!deploymentResult.droneFleet,
      explorer: deploymentResult.droneFleet?.drones?.explorer,
      targetPosition: deploymentResult.droneFleet?.drones?.explorer?.targetPosition
    });
    
    const droneState: DroneVisualState = 'deploying';
    const newContext: FSMContext = {
      ...deploymentResult,
      droneFleet: {
        ...deploymentResult.droneFleet,
        drones: {
          ...deploymentResult.droneFleet.drones,
          explorer: {
            ...deploymentResult.droneFleet.drones.explorer,
            state: droneState,
            lastUpdate: Date.now(),
            isActive: true
          }
        }
      }
    };
    
    return newContext;
  }
  
  // Pour les autres événements, retourner le contexte tel quel
  return context;
});

/**
 * Action de sortie de l'état evaluating : simple log
 */
export const action_evaluating_exit = () => {
  fsmLogger.state('action_evaluating_exit');
};

export default {
  action_evaluating_entry,
  action_evaluating_exit,
  updateContext
};
