/**
 * ============================================================================
 * CONTEXTE FSM INITIAL - Store unifié pour Bots et futur Player
 * ============================================================================
 * 
 * Contexte FSM qui remplace PlayerStore/BotStore avec une structure unifiée.
 * Compatible avec les actions core existantes (movement.js).
 * 
 * @author Migration FSM Phase 2
 * @version 1.0.0
 */

import { VEHICLE_TYPES, DEFAULT_VEHICLE_STATE, DEFAULT_CAPACITIES } from '../../../../shared/actions/core/movement.js';
import { BOT_STATES } from '../constants.js';

// ============================================================================
// CONSTANTES DE CONFIGURATION
// ============================================================================

/**
 * Types d'entités supportés
 */
export const ENTITY_TYPES = {
  AUTO: 'auto',        // Bot autonome
  MANUAL: 'manual',    // Bot contrôlé manuellement (debug)
  HUMAN: 'human'       // Player humain (Phase 6)
};

/**
 * Configuration par défaut des véhicules selon PlayerStore
 */
const DEFAULT_VEHICLE_CONFIG = {
  [VEHICLE_TYPES.MAIN_SHIP]: {
    fuel: 100,
    damage: 0,
    totalDistance: 0,
    path: [],
    startCoord: null,
    isAtCapacity: false,
    maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP]
  },
  [VEHICLE_TYPES.DRONE]: {
    isActive: true,
    fuel: 50,
    damage: 0,
    maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.DRONE]
  }
};

// ============================================================================
// FACTORY DE VÉHICULE POUR FSM
// ============================================================================

/**
 * Crée un véhicule avec la structure compatible PlayerStore + FSM
 * @param {string} vehicleId - ID du véhicule
 * @param {string} vehicleType - Type de véhicule
 * @returns {Object} - Véhicule configuré pour FSM
 */
const createFSMVehicle = (vehicleId, vehicleType) => {
  const baseVehicle = {
    id: vehicleId,
    type: vehicleType,
    position: null,
    coord: null,
    isMoving: false,
    progress: 0,
    resources: { food: 0, debris: 0, special: 0 },
    targetTile: {
      position: null,
      coord: null
    },
    ...DEFAULT_VEHICLE_STATE
  };

  // Ajouter les propriétés spécifiques au type depuis PlayerStore
  const typeConfig = DEFAULT_VEHICLE_CONFIG[vehicleType] || {};
  
  return {
    ...baseVehicle,
    ...typeConfig
  };
};

// ============================================================================
// CONTEXTE INITIAL
// ============================================================================

/**
 * Crée le contexte FSM initial pour une entité (bot ou futur player)
 * Structure inspirée du PlayerStore pour compatibilité maximale
 * 
 * @param {string} entityId - ID unique de l'entité (ex: 'bot-0', 'player-1')
 * @param {string} entityType - Type d'entité (auto, manual, human)
 * @returns {Object} - Contexte FSM initial
 */
export const createEntityContext = (entityId, entityType = ENTITY_TYPES.AUTO) => {
  // ID du véhicule principal (compatible avec PlayerStore)
  const mainVehicleId = `${entityId}-ship`;
  
  return {
    // ========================================================================
    // IDENTITÉ ET TYPE D'ENTITÉ
    // ========================================================================
    entityId,
    entityType,
    
    // ========================================================================
    // MODE AUTONOME (différencie Bot autonome vs Player humain)
    // ========================================================================
    autonomousMode: entityType === ENTITY_TYPES.AUTO,
    
    // ========================================================================
    // VÉHICULE PRINCIPAL (structure identique à PlayerStore)
    // ========================================================================
    vehicle: createFSMVehicle(mainVehicleId, VEHICLE_TYPES.MAIN_SHIP),
    
    // ========================================================================
    // PROPRIÉTÉS FSM SPÉCIFIQUES
    // ========================================================================
    
    // État FSM actuel
    currentState: BOT_STATES.EVALUATING,
    
    // Cible actuelle (compatible avec BotStore)
    currentTarget: null,
    
    // File d'exploration (compatible avec BotStore)
    explorationQueue: [],
    
    // Dernière action exécutée (pour debugging)
    lastAction: null,
    
    // Erreur courante (pour gestion d'erreurs)
    error: null,
    
    // Timestamps pour le timing
    timestamps: {
      stateChange: Date.now(),
      lastMovement: null,
      lastCollection: null
    },
    
    // ========================================================================
    // SCORE ET RESSOURCES (structure PlayerStore)
    // ========================================================================
    score: {
      resources: { food: 0, debris: 0, special: 0 }
    },
    
    // ========================================================================
    // MÉMOIRE DE L'ENTITÉ (structure PlayerStore)
    // ========================================================================
    memory: {
      knownResources: [],
      knownDangers: [],
      explorationCount: 0,
      collectedResources: [],
      // Utiliser BOT_STATES
      stateHistory: [BOT_STATES.EVALUATING],
      transitionHistory: []
    },
    
    // ========================================================================
    // CONFIGURATION FSM
    // ========================================================================
    config: {
      // Radius d'exploration (compatible avec PlayerStore)
      exploringRadius: 3,
      
      // Seuils de comportement
      fuelThreshold: 20,        // Retour à la base si fuel < 20
      capacityThreshold: 80,    // Retour à la base si capacité > 80%
      
      // Vitesses et timings
      movementSpeed: entityType === ENTITY_TYPES.AUTO ? 2 : 1,
      explorationInterval: 3000, // ms entre les explorations auto
      
      // Debugging
      enableLogging: true,
      logLevel: 'info'
    }
  };
};

// ============================================================================
// HELPERS DE CONTEXTE
// ============================================================================

/**
 * Vérifie si une entité est en mode autonome
 * @param {Object} context - Contexte FSM
 * @returns {boolean} - True si autonome
 */
export const isAutonomous = (context) => {
  return context.autonomousMode === true;
};

/**
 * Vérifie si une entité peut être contrôlée manuellement
 * @param {Object} context - Contexte FSM
 * @returns {boolean} - True si contrôle manuel possible
 */
export const canManualControl = (context) => {
  return context.entityType === ENTITY_TYPES.MANUAL || 
         context.entityType === ENTITY_TYPES.HUMAN;
};

/**
 * Récupère le véhicule principal du contexte
 * @param {Object} context - Contexte FSM
 * @returns {Object} - Véhicule principal
 */
export const getMainVehicle = (context) => {
  return context.vehicle;
};

/**
 * Vérifie si l'entité est en mouvement
 * @param {Object} context - Contexte FSM
 * @returns {boolean} - True si en mouvement
 */
export const isMoving = (context) => {
  return context.vehicle?.isMoving || false;
};

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
  ENTITY_TYPES,
  isAutonomous,
  canManualControl,
  getMainVehicle,
  isMoving,
  updateStateHistory
};
