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
 * 📋 TRANSITIONS DISPONIBLES DANS CET ÉTAT:
 * ==========================================
 * 
 * 🔧 OPÉRATIONS DE MAINTENANCE:
 * - REFUEL_COMPLETE → EVALUATING (ravitaillement terminé)
 * - UNLOAD_COMPLETE → EVALUATING (déchargement terminé)
 * - REPAIR_COMPLETE → EVALUATING (réparations terminées)
 * - MAINTENANCE_COMPLETE → EVALUATING (maintenance complète)
 * 
 * 🔄 DÉCLENCHEMENT AUTOMATIQUE:
 * - AUTO_REFUEL_CHECK → IDLE_AT_BASE (reste à la base, démarre refuel)
 * - AUTO_UNLOAD_CHECK → IDLE_AT_BASE (reste à la base, démarre déchargement)
 * - REPAIR_STARTED → IDLE_AT_BASE (reste à la base, démarre réparations)
 * 
 * ⏰ TIMEOUTS:
 * - IDLE_TIMEOUT → EVALUATING (5s d'inactivité)
 * - REFUEL_TIMEOUT → EVALUATING (timeout ravitaillement)
 * 
 * 📡 ÉVÉNEMENTS EXTERNES:
 * - NEW_RESOURCES_DETECTED → EVALUATING (nouvelles ressources)
 * - EXPLORATION_REQUESTED → EVALUATING (demande d'exploration)
 * 
 * 🚨 TRANSITIONS D'URGENCE:
 * - MANUAL_OVERRIDE → EVALUATING (contrôle manuel)
 * - EMERGENCY_DETECTED → EXPLORING_RETURNING (urgence détectée)
 * 
 * @author FSM Migration
 * @version 1.0.0
 */

import { state, transition, reduce, guard } from 'robot3';
import { BOT_STATES } from '../constants/constants.js';
import { safetyGuards, efficiencyGuards, discoveryGuards, baseGuards } from '../guards/indexGuard.js';
import { contextReducers } from '../reducers/context.js';
import { SYSTEM_EVENT_TYPES } from '../events/systemEvents.js';
import { USER_EVENT_TYPES } from '../events/userEvents.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { EMERGENCY_EVENT_TYPES } from '../events/emergencyEvents.js';

/**
 * État IDLE_AT_BASE - Maintenance et attente à la base
 */
export const idleAtBaseState = state(
  // === OPÉRATIONS DE MAINTENANCE ===
  
  // Ravitaillement terminé
  transition(SYSTEM_EVENT_TYPES.REFUEL_COMPLETE,
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
  transition(SYSTEM_EVENT_TYPES.UNLOAD_COMPLETE,
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
  transition(SYSTEM_EVENT_TYPES.REPAIR_COMPLETE,
    BOT_STATES.EVALUATING,
    () => true,
    reduce((context, event) => {
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
  transition(SYSTEM_EVENT_TYPES.AUTO_REFUEL_CHECK,
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context, event) => baseGuards.needsRefueling(context, event),
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour commencer le ravitaillement
      return contextReducers.base.startRefueling(context, event);
    })
  ),

  // Auto-déclencher le déchargement si inventaire non vide
  transition(SYSTEM_EVENT_TYPES.AUTO_UNLOAD_CHECK,
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    (context, event) => baseGuards.canDepositAtCurrentLocation(context, event),
    reduce((context, event) => {
      // Utiliser le reducer centralisé pour démarrer le déchargement
      return contextReducers.base.startUnloading(context, event);
    })
  ),

  // === TIMEOUTS ===
  
  // Timeout d'inactivité (5s) - déclencher une réévaluation
  transition(SYSTEM_EVENT_TYPES.IDLE_TIMEOUT,
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
  transition(SYSTEM_EVENT_TYPES.REFUEL_TIMEOUT,
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
  transition(RESOURCE_EVENT_TYPES.NEW_RESOURCES_DETECTED,
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

  // Demande d'exploration
  transition(USER_EVENT_TYPES.EXPLORATION_REQUESTED,
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
  transition(USER_EVENT_TYPES.MANUAL_OVERRIDE,
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
  transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED,
    BOT_STATES.EXPLORING_RETURNING,
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
  transition(SYSTEM_EVENT_TYPES.REPAIR_STARTED,
    BOT_STATES.IDLE_AT_BASE, // Reste à la base
    () => true,
    reduce((context, event) => {
      // Utiliser le reducer de réparations
      return contextReducers.base.startRepairing(context, event);
    })
  ),

  // Maintenance complète terminée
  transition(SYSTEM_EVENT_TYPES.MAINTENANCE_COMPLETE,
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