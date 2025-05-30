/**
 * ============================================================================
 * État IDLE_AT_BASE - Attente et maintenance à la base
 * ============================================================================
 * 
 * État d'attente à la base pour les opérations de maintenance :
 * - Ravitaillement en carburant
 * - Déchargement des ressources
 * - Réparations
 * - Attente de nouvelles instructions
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/index.js';
import { contextReducers } from '../reducers/context.js';

/**
 * État IDLE_AT_BASE - Maintenance et attente à la base
 */
export const idleAtBaseState = state(
  // === OPÉRATIONS DE MAINTENANCE ===
  
  // Ravitaillement terminé
  transition('REFUEL_COMPLETE',
    BOT_STATES.EVALUATING,
    (context, event) => efficiencyGuards.isFullTank(context, event),
    reduce((context, event) => {
      // Utiliser le reducer de carburant
      const refueledContext = contextReducers.fuel.refuel(context, {
        amount: event.fuel || 100
      });
      
      // Ajouter des informations supplémentaires
      const updatedContext = {
        ...refueledContext,
        fuelStatus: 'full',
        lastRefuelTime: Date.now()
      };
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'refueled'
      });
    })
  ),

  // Déchargement des ressources terminé
  transition('UNLOAD_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de dépôt de ressources
      const unloadedContext = contextReducers.resource.depositResources(context);
      
      // Ajouter les informations supplémentaires
      const updatedContext = {
        ...unloadedContext,
        unloadedResources: event.unloadedResources || [],
        lastUnloadTime: Date.now()
      };
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'unloaded'
      });
    })
  ),

  // Réparations terminées
  transition('REPAIR_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Nous n'avons pas encore de reducer spécifique pour les réparations
      // Alors nous gérons directement la mise à jour du véhicule
      const updatedContext = {
        ...context,
        vehicle: {
          ...context.vehicle,
          health: event.health || 100,
          shields: event.shields || 100
        },
        repairStatus: 'complete',
        lastRepairTime: Date.now()
      };
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'repaired'
      });
    })
  ),

  // === DÉCLENCHEMENT AUTOMATIQUE ===
  
  // Auto-déclencher le ravitaillement si nécessaire
  transition('AUTO_REFUEL_CHECK',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context, event) => baseGuards.needsRefueling(context, event),
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour commencer le ravitaillement
      return contextReducers.base.startRefueling(context, event);
    })
  ),

  // Auto-déclencher le déchargement si inventaire non vide
  transition('AUTO_UNLOAD_CHECK',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context, event) => baseGuards.canDepositAtCurrentLocation(context, event),
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour démarrer le déchargement
      return contextReducers.base.startUnloading(context, event);
    })
  ),

  // === TIMEOUTS ===
  
  // Timeout d'inactivité (5s) - déclencher une réévaluation
  transition('IDLE_TIMEOUT',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => {
      // Ajout d'un statut d'inactivité et préparation de l'évaluation
      const updatedContext = {
        ...context,
        idleStatus: 'timeout',
        currentAction: 'idle_timeout'
      };
      
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'idle_timeout'
      });
    })
  ),

  // Timeout de ravitaillement
  transition('REFUEL_TIMEOUT',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => {
      // Faire le plein en cas de timeout
      const refueledContext = contextReducers.fuel.refuel(context, {
        amount: 100
      });
      
      // Ajouter les informations de status
      const updatedContext = {
        ...refueledContext,
        fuelStatus: 'timeout',
        currentAction: 'refuel_timeout'
      };
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(updatedContext, {
        reason: 'refuel_timeout'
      });
    })
  ),

  // === ÉVÉNEMENTS EXTERNES ===
  
  // Nouvelles ressources détectées
  transition('NEW_RESOURCES_DETECTED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Mettre à jour les ressources connues
      const discoveryContext = {
        ...context,
        knownResources: [...(context.knownResources || []), ...event.resources],
        hasNewResourceDiscovery: true,
        discoveryTime: Date.now(),
        currentAction: 'new_resources_available'
      };
      
      // Préparer l'évaluation avec la raison de la transition
      return contextReducers.state.prepareEvaluating(discoveryContext, {
        reason: 'new_resources'
      });
    })
  ),

  // Demande d'exploration manuelle
  transition('EXPLORATION_REQUESTED',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => {
      // Reset le flag d'exploration et marquer comme demandé
      const explorationContext = {
        ...context,
        hasExplored: false,
        explorationRequested: true,
        currentAction: 'exploration_requested'
      };
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(explorationContext, {
        reason: 'manual_exploration'
      });
    })
  ),

  // === TRANSITIONS D'URGENCE ===
  
  // Override manuel
  transition('MANUAL_OVERRIDE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de commandes manuelles
      const manualContext = contextReducers.manual.recordManualCommand(context, event);
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(manualContext, {
        reason: 'manual_override'
      });
    })
  ),

  // Urgence détectée
  transition('EMERGENCY_DETECTED',
    BOT_STATES.RETURNING,
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer d'urgence
      const emergencyContext = contextReducers.emergency.triggerEmergency(context, event);
      
      // Préparer le retour
      return contextReducers.state.prepareReturning(emergencyContext, {
        reason: 'emergency'
      });
    })
  ),

  // === MAINTENANCE AVANCÉE ===
  
  // Début de réparations
  transition('REPAIR_STARTED',
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de réparations
      return contextReducers.base.startRepairing(context, event);
    })
  ),

  // Maintenance complète terminée
  transition('MAINTENANCE_COMPLETE',
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context) => {
      // Utiliser le reducer pour terminer la maintenance
      const maintenanceContext = contextReducers.base.completeAllMaintenance(context);
      
      // Préparer l'évaluation
      return contextReducers.state.prepareEvaluating(maintenanceContext, {
        reason: 'maintenance_complete'
      });
    })
  )
);
