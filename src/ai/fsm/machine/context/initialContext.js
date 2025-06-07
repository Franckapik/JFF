/**
 * ============================================================================
 * CONTEXTE FSM INITIAL - Store unifié pour Bots et futur Player
 * ============================================================================
 * 
 * Contexte FSM qui remplace PlayerStore/BotStore avec une structure unifiée.
 * Compatible avec les actions core existantes (movement.js).
 * 
 * @author Migration FSM Phase 2
 * @version 1.5.0
 */

import { BOT_STATES, ENTITY_TYPES, DRONE_VISUAL_STATES } from '../constants/constants.js';


// ============================================================================
// CONTEXTE INITIAL DÉFACTORISÉ
// ============================================================================

/**
 * Crée le contexte FSM initial pour une entité (bot ou futur player)
 * Structure inspirée du PlayerStore pour compatibilité maximale
 * 
 * @param {string} entityId - ID unique de l'entité (ex: 'bot-0', 'bot-1')
 * @param {string} entityType - Type d'entité (auto, manual, human)
 * @returns {Object} - Contexte FSM initial
 */
export const createEntityContext = (entityId, entityType = ENTITY_TYPES.auto) => {
  // ID du véhicule principal (compatible avec PlayerStore)
  const mainVehicleId = `${entityId}-ship`;
  
  return {
    // ========================================================================
    // IDENTITÉ ET TYPE D'ENTITÉ
    // ========================================================================
    entityId,                                    // Ex: 'bot-0', 'bot-1', 'player'
    entityType,                                  // Ex: 'auto', 'manual', 'human'
    
    // ========================================================================
    // MODE AUTONOME (tous les bots sont autonomes)
    // ========================================================================
    autonomousMode: true,                        // Ex: true (toujours pour les bots)
    
    // ========================================================================
    // VÉHICULE PRINCIPAL (structure identique à PlayerStore)
    // ========================================================================
    vehicle: {
      // Identité du véhicule
      id: mainVehicleId,                         // Ex: 'bot-0-ship', 'bot-1-ship'
      type: 'main_ship',                         // Ex: 'main_ship'
      
      // Position et mouvement
      position: null,                            // Ex: Vector3(5.2, 0, 3.8) ou null
      coord: null,                               // Ex: {x: 5, z: 3} ou null
      isMoving: false,                           // Ex: true, false
      progress: 0,                               // Ex: 0.0 à 1.0 (progression du mouvement)
      
      // Ressources transportées
      resources: { food: 0, debris: 0, special: 0 }, // Ex: {food: 3, debris: 1, special: 0}
      
      // Cible de mouvement
      targetTile: {
        position: null,                          // Ex: Vector3(8.0, 0, 5.0) ou null
        coord: null                              // Ex: {x: 8, z: 5} ou null
      },
      
      // État du véhicule (ex DEFAULT_VEHICLE_STATE)
      fuel: 100,                                 // Ex: 100, 85, 23 (pourcentage)
      damage: 0,                                 // Ex: 0, 15, 45 (pourcentage)
      totalDistance: 0,                          // Ex: 0, 42.3, 158.7 (unités)
      path: [],                                  // Ex: [{x:5,z:3}, {x:6,z:3}, {x:7,z:4}]
      startCoord: null,                          // Ex: {x: 2, z: 1} ou null
      isAtCapacity: false,                       // Ex: true, false
      maxSpeed: 1,                               // Ex: 1, 2, 0.5 (unités/sec)
      currentSpeed: 0,                           // Ex: 0, 1.2, 0.8 (unités/sec)
      
      // Capacité maximale (ex DEFAULT_VEHICLE_CONFIG)
      maxCapacity: 10                            // Ex: 10, 15, 5 (nombre d'objets)
    },
    
    // ========================================================================
    // PROPRIÉTÉS FSM SPÉCIFIQUES
    // ========================================================================
    
    // État FSM actuel
    currentState: BOT_STATES.EVALUATING,        // Ex: 'evaluating', 'exploring', 'collecting'
    
    // Cible actuelle (compatible avec BotStore)
    currentTarget: null,                         // Ex: {x: 7, z: 4, type: 'food'} ou null
    
    // File d'exploration (compatible avec BotStore)
    explorationQueue: [],                        // Ex: [{x:5,z:3}, {x:8,z:2}, {x:3,z:7}]
    
    // Dernière action exécutée (pour debugging)
    lastAction: null,                            // Ex: 'move', 'collect', 'explore' ou null
    
    // Erreur courante (pour gestion d'erreurs)
    error: null,                                 // Ex: 'pathfinding_failed', 'fuel_low' ou null
    
    // Timestamps pour le timing
    timestamps: {
      stateChange: Date.now(),                   // Ex: 1703425234567 (timestamp)
      lastMovement: null,                        // Ex: 1703425230123 ou null
      lastCollection: null                       // Ex: 1703425228456 ou null
    },
    
    // ========================================================================
    // SCORE ET RESSOURCES (structure PlayerStore)
    // ========================================================================
    score: {
      resources: { food: 0, debris: 0, special: 0 } // Ex: {food: 15, debris: 8, special: 2}
    },
    
    // ========================================================================
    // MÉMOIRE DE L'ENTITÉ (structure PlayerStore)
    // ========================================================================
    memory: {
      knownResources: [],                        // Ex: [{x:5,z:3,type:'food'}, {x:8,z:2,type:'debris'}]
      knownDangers: [],                          // Ex: [{x:4,z:6,type:'enemy'}, {x:9,z:1,type:'trap'}]
      explorationCount: 0,                       // Ex: 0, 23, 156 (nombre d'explorations)
      collectedResources: [],                    // Ex: [{type:'food',coord:{x:5,z:3},time:1703425234567}]
      // Utiliser BOT_STATES
      stateHistory: [BOT_STATES.EVALUATING],     // Ex: ['evaluating', 'exploring', 'collecting']
      transitionHistory: []                      // Ex: [{from:'evaluating',to:'exploring',timestamp:1703425234567}]
    },
    
    // ========================================================================
    // CONFIGURATION FSM
    // ========================================================================
    config: {
      // Radius d'exploration (compatible avec PlayerStore)
      exploringRadius: 3,                        // Ex: 3, 5, 2 (rayon en tiles)
      
      // Seuils de comportement
      fuelThreshold: 20,                         // Ex: 20, 15, 30 (pourcentage)
      capacityThreshold: 80,                     // Ex: 80, 90, 70 (pourcentage)
      
      // Vitesses et timings
      movementSpeed: entityType === ENTITY_TYPES.auto ? 2 : 1, // Ex: 2, 1, 0.5 (multiplicateur)
      explorationInterval: 3000,                 // Ex: 3000, 5000, 1500 (ms)
      
      // Debugging
      enableLogging: true,                       // Ex: true, false
      logLevel: 'info'                           // Ex: 'info', 'debug', 'warn', 'error'
    },
    
    // ========================================================================
    // SYSTÈME DE DRONES INTÉGRÉ
    // ========================================================================
    
    // État de déploiement des drones (remplace droneDeployment)
    droneFleet: {
      // SUPPRIMÉ: status global - maintenant calculé automatiquement depuis les états individuels
      // status: 'docked',                       // ❌ Redondant avec les états individuels
      
      // Drones individuels avec leurs positions et états
      drones: {
        // Drone explorateur
        explorer: {
          id: `${entityId}-drone-explorer`,     // Ex: 'bot-0-drone-explorer'
          type: 'explorer',                      // Ex: 'explorer'
          state: DRONE_VISUAL_STATES.docked,       // Ex: 'docked', 'deploying', 'exploring'
          position: null,                        // Ex: Vector3(6.2, 1.5, 4.8) ou null
          targetPosition: null,                  // Ex: Vector3(9.0, 1.5, 7.0) ou null
          missionTarget: null,                   // Ex: {x: 9, z: 7, type: 'explore'} ou null
          isActive: false,                       // Ex: true, false
          lastUpdate: Date.now()                 // Ex: 1703425234567 (timestamp)
        },
        
        // Drone de combat
        combat: {
          id: `${entityId}-drone-combat`,       // Ex: 'bot-0-drone-combat'
          type: 'combat',                        // Ex: 'combat'
          state: DRONE_VISUAL_STATES.docked,       // Ex: 'docked', 'deploying', 'exploring'
          position: null,                        // Ex: Vector3(4.8, 1.5, 2.2) ou null
          targetPosition: null,                  // Ex: Vector3(7.0, 1.5, 5.0) ou null
          missionTarget: null,                   // Ex: {x: 7, z: 5, type: 'defend'} ou null
          isActive: false,                       // Ex: true, false
          lastUpdate: Date.now()                 // Ex: 1703425234567 (timestamp)
        },
        
        // Drone spécial
        special: {
          id: `${entityId}-drone-special`,      // Ex: 'bot-0-drone-special'
          type: 'special',                       // Ex: 'special'
          state: DRONE_VISUAL_STATES.docked,       // Ex: 'docked', 'deploying', 'exploring'
          position: null,                        // Ex: Vector3(5.0, 1.5, 3.0) ou null
          targetPosition: null,                  // Ex: Vector3(8.0, 1.5, 6.0) ou null
          missionTarget: null,                   // Ex: {x: 8, z: 6, type: 'special'} ou null
          isActive: false,                       // Ex: true, false
          lastUpdate: Date.now()                 // Ex: 1703425234567 (timestamp)
        }
      },
      
      // Configuration de formation (ex DRONE_FORMATION_OFFSETS)
      formationOffsets: {
        explorer: { x: 0.5, z: 0.5, y: 0.3 },   // Ex: position relative au vaisseau
        combat: { x: -0.5, z: 0.5, y: 0.3 },    // Ex: position relative au vaisseau
        special: { x: 0, z: -0.7, y: 0.3 }      // Ex: position relative au vaisseau
      },
      
      // Mission en cours
      currentMission: null,                      // Ex: {type:'explore', target:{x:8,z:5}, drones:['explorer']}
      missionStartTime: null                     // Ex: 1703425234567 ou null
    }
  };
};

// ============================================================================
// HELPER UTILITAIRE
// ============================================================================

/**
 * Met à jour l'historique des états
 * @param {Object} context - Contexte FSM actuel
 * @param {string} newState - Nouvel état
 * @returns {Object} - Contexte avec historique mis à jour
 */
export const updateStateHistory = (context, newState) => {
  const maxHistoryLength = 10;
  
  return {
    ...context,
    currentState: newState,
    timestamps: {
      ...context.timestamps,
      stateChange: Date.now()
    },
    memory: {
      ...context.memory,
      stateHistory: [
        newState,
        ...context.memory.stateHistory.slice(0, maxHistoryLength - 1)
      ],
      transitionHistory: [
        {
          from: context.currentState,
          to: newState,
          timestamp: Date.now()
        },
        ...context.memory.transitionHistory.slice(0, maxHistoryLength - 1)
      ]
    }
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  createEntityContext,
  updateStateHistory
};
