/**
 * ============================================================================
 * EXPLORATION ACTIONS CORE - Actions d'exploration pures et partagées
 * ============================================================================
 * 
 * Actions d'exploration pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🔧 ACTIONS PRINCIPALES (explorationActions):
 * - startExploration(context, event) : Démarre mission d'exploration
 * - markTileExplored(context, event) : Marque tuile comme explorée
 * - recordDiscovery(context, event) : Enregistre découverte ressource
 * - updateExplorationStatus(context, event) : Met à jour statut exploration
 * - completeExploration(context, event) : Termine exploration actuelle
 * - cancelExploration(context, event) : Annule exploration en cours
 * - markDiscoveriesProcessed(context) : Marque découvertes comme traitées
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - validateExplorationZone(zone) : Validation zone exploration
 * - validateDiscovery(discovery) : Validation découverte
 * - EXPLORATION_STATES : États d'exploration constants
 * - DISCOVERY_TYPES : Types de découvertes constants
 * - EXPLORATION_CONFIG : Configuration exploration
 * 
 * ❌ FONCTIONNALITÉS COMMENTÉES (Éviter confusion/conflits):
 * - Guards (explorationGuards) - COMMENTÉS
 * - Selectors (explorationSelectors) - COMMENTÉS
 * - Events (explorationEvents) - COMMENTÉS
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { EXPLORATION_STATES, DISCOVERY_TYPES, EXPLORATION_CONFIG } from '../../constants/constants.js';

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

/**
 * Validation d'une zone d'exploration
 */
const validateExplorationZone = (zone) => {
  if (!zone || typeof zone !== 'object') {
    throw new Error('Exploration zone must be a valid object');
  }
  
  if (!zone.center || typeof zone.center !== 'string') {
    throw new Error('Exploration zone must have a valid center coordinate');
  }
  
  const radius = Number(zone.radius) || EXPLORATION_CONFIG.DEFAULT_RADIUS;
  if (radius < 1 || radius > 10) {
    throw new Error('Exploration radius must be between 1 and 10');
  }
  
  return {
    center: zone.center,
    radius,
    priority: zone.priority || 'normal',
    type: zone.type || 'general'
  };
};

/**
 * Validation d'une découverte
 */
const validateDiscovery = (discovery) => {
  if (!discovery || typeof discovery !== 'object') {
    throw new Error('Discovery must be a valid object');
  }
  
  if (!discovery.coord || !discovery.type) {
    throw new Error('Discovery must have coord and type');
  }
  
  if (!Object.values(DISCOVERY_TYPES).includes(discovery.type)) {
    throw new Error(`Invalid discovery type. Must be one of: ${Object.values(DISCOVERY_TYPES).join(', ')}`);
  }
  
  return {
    coord: discovery.coord,
    type: discovery.type,
    data: discovery.data || {},
    timestamp: discovery.timestamp || Date.now(),
    id: discovery.id || `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// ============================================================================
// ACTIONS PRINCIPALES - SEULES FONCTIONS PUBLIQUES
// ============================================================================

/**
 * Actions d'exploration pures - Compatible Bot et Player
 */
export const explorationActions = {
  
  /**
   * Démarre une mission d'exploration
   */
  startExploration: (context, event) => {
    try {
      const validatedZone = validateExplorationZone(event.explorationZone);
      
      // Validation simple interne
      if (context.explorationState?.status === EXPLORATION_STATES.EXPLORING) {
        return { ...context, error: 'Cannot start exploration: exploration already in progress' };
      }
      
      if (context.vehicle?.isMoving) {
        return { ...context, error: 'Cannot start exploration: vehicle is moving' };
      }
      
      return {
        ...context,
        explorationState: {
          status: EXPLORATION_STATES.SEARCHING_TARGET,
          zone: validatedZone,
          startTime: Date.now(),
          targetCoord: null,
          progress: 0
        },
        currentExplorationZone: validatedZone,
        lastAction: 'startExploration_success'
      };
    } catch (error) {
      return { ...context, error: error.message, lastAction: 'startExploration_failed' };
    }
  },

  /**
   * Marque une tuile comme explorée
   */
  markTileExplored: (context, event) => {
    if (!event.tileCoord) {
      return { ...context, error: 'Tile coordinate is required to mark as explored' };
    }
    
    const exploredTiles = new Set(context.exploredTiles || []);
    exploredTiles.add(event.tileCoord);
    
    return {
      ...context,
      exploredTiles: Array.from(exploredTiles),
      lastExploration: {
        coord: event.tileCoord,
        timestamp: Date.now()
      },
      explorationCount: (context.explorationCount || 0) + 1,
      lastAction: 'markTileExplored_success'
    };
  },

  /**
   * Enregistre une découverte de ressource ou autre
   */
  recordDiscovery: (context, event) => {
    try {
      const validatedDiscovery = validateDiscovery(event.discovery);
      
      const discoveries = [...(context.resourceDiscoveries || [])];
      discoveries.push(validatedDiscovery);
      
      return {
        ...context,
        resourceDiscoveries: discoveries,
        hasNewDiscovery: true,
        lastDiscovery: validatedDiscovery,
        discoveryCount: (context.discoveryCount || 0) + 1,
        lastAction: 'recordDiscovery_success'
      };
    } catch (error) {
      return { ...context, error: error.message, lastAction: 'recordDiscovery_failed' };
    }
  },

  /**
   * Met à jour le statut d'exploration
   */
  updateExplorationStatus: (context, event) => {
    if (!context.explorationState) {
      return { ...context, error: 'No active exploration to update' };
    }
    
    if (!Object.values(EXPLORATION_STATES).includes(event.newStatus)) {
      return { ...context, error: `Invalid exploration status: ${event.newStatus}` };
    }
    
    const updatedState = {
      ...context.explorationState,
      status: event.newStatus,
      lastUpdate: Date.now()
    };
    
    if (event.targetCoord) {
      updatedState.targetCoord = event.targetCoord;
    }
    
    if (event.newStatus === EXPLORATION_STATES.COMPLETED) {
      updatedState.endTime = Date.now();
      updatedState.duration = updatedState.endTime - updatedState.startTime;
    }
    
    return {
      ...context,
      explorationState: updatedState,
      lastAction: 'updateExplorationStatus_success'
    };
  },

  /**
   * Termine l'exploration actuelle
   */
  completeExploration: (context, event) => {
    if (!context.explorationState) {
      return context;
    }
    
    const endTime = Date.now();
    const duration = endTime - context.explorationState.startTime;
    
    return {
      ...context,
      explorationState: {
        ...context.explorationState,
        status: EXPLORATION_STATES.COMPLETED,
        endTime,
        duration,
        reason: event?.reason || 'completed'
      },
      lastCompletedExploration: {
        zone: context.explorationState.zone,
        duration,
        tilesExplored: context.explorationCount || 0,
        discoveries: context.discoveryCount || 0,
        timestamp: endTime
      },
      lastAction: 'completeExploration_success'
    };
  },

  /**
   * Annule l'exploration en cours
   */
  cancelExploration: (context, event) => {
    if (!context.explorationState) {
      return context;
    }
    
    return {
      ...context,
      explorationState: null,
      currentExplorationZone: null,
      hasNewDiscovery: false,
      error: event?.reason || 'Exploration cancelled',
      lastAction: 'cancelExploration_success'
    };
  },

  /**
   * Marque les découvertes comme traitées
   */
  markDiscoveriesProcessed: (context) => {
    return {
      ...context,
      hasNewDiscovery: false,
      lastAction: 'markDiscoveriesProcessed_success'
    };
  }
};

// ============================================================================
// ✅ GUARDS & SELECTORS MOVED TO guards/core/explorationGuard.js
// ============================================================================

/**
 * Les guards, selectors et events d'exploration ont été déplacés vers guards/core/explorationGuard.js
 * pour une meilleure architecture. Plus de code commenté nécessaire.
 */

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  actions: explorationActions,
  // selectors: explorationSelectors, // ❌ COMMENTÉ
  // events: explorationEvents, // ❌ COMMENTÉ
  constants: {
    EXPLORATION_STATES,
    DISCOVERY_TYPES,
    EXPLORATION_CONFIG
  },
  utils: {
    validateExplorationZone,
    validateDiscovery
  }
};
