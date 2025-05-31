/**
 * ============================================================================
 * EXPLORATION ACTIONS CORE - Actions d'exploration pures et partagées
 * ============================================================================
 * 
 * Actions d'exploration pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * Fonctionnalités spécifiques à l'exploration NON couvertes par movement.js
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTS ET HELPERS
// ============================================================================

/**
 * États d'exploration possibles
 */
export const EXPLORATION_STATES = {
  IDLE: 'idle',
  SEARCHING_TARGET: 'searching_target',
  EXPLORING: 'exploring',
  RETURNING: 'returning',
  COMPLETED: 'completed'
};

/**
 * Types de découvertes
 */
export const DISCOVERY_TYPES = {
  RESOURCE: 'resource',
  EMPTY_TILE: 'empty_tile',
  OBSTACLE: 'obstacle',
  SPECIAL: 'special'
};

/**
 * Configuration par défaut pour l'exploration
 */
export const EXPLORATION_CONFIG = {
  DEFAULT_RADIUS: 3,
  MAX_EXPLORATION_TIME: 30000, // 30 secondes
  MIN_EXPLORATION_DISTANCE: 1,
  MAX_EXPLORATION_DISTANCE: 10
};

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
// VALIDATORS ET GUARDS
// ============================================================================

/**
 * Guards pour valider les conditions d'exploration
 */
export const explorationGuards = {
  
  /**
   * Vérifie si une exploration peut être démarrée
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec explorationZone
   * @returns {boolean} - True si exploration possible
   */
  canStartExploration: (context, event) => {
    // Vérifier qu'il n'y a pas d'exploration en cours
    if (context.explorationState?.status === EXPLORATION_STATES.EXPLORING) {
      return false;
    }
    
    // Vérifier que le véhicule est disponible
    if (context.vehicle?.isMoving) {
      return false;
    }
    
    // Vérifier la zone d'exploration
    try {
      validateExplorationZone(event.explorationZone);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Vérifie si une tuile a déjà été explorée
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec tileCoord
   * @returns {boolean} - True si la tuile a été explorée
   */
  isTileExplored: (context, event) => {
    const exploredTiles = context.exploredTiles || [];
    return exploredTiles.includes(event.tileCoord);
  },

  /**
   * Vérifie s'il y a des découvertes non traitées
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True s'il y a des découvertes non traitées
   */
  hasUnprocessedDiscoveries: (context) => {
    return Boolean(context.hasNewDiscovery);
  },

  /**
   * Vérifie si l'exploration a expiré (timeout)
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si l'exploration a expiré
   */
  isExplorationExpired: (context) => {
    if (!context.explorationState?.startTime) {
      return false;
    }
    
    const elapsed = Date.now() - context.explorationState.startTime;
    return elapsed > EXPLORATION_CONFIG.MAX_EXPLORATION_TIME;
  },

  /**
   * Vérifie si l'exploration est terminée
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si l'exploration est terminée
   */
  isExplorationComplete: (context) => {
    return context.explorationState?.status === EXPLORATION_STATES.COMPLETED;
  },

  /**
   * Vérifie si une exploration est nécessaire
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement optionnel
   * @returns {boolean} - True si exploration nécessaire
   */
  needsExploration: (context, event) => {
    // Toujours vrai pour le moment - le bot doit explorer au démarrage
    // TODO: Implémenter une logique plus sophistiquée basée sur :
    // - Nombre de tuiles explorées
    // - Découvertes récentes
    // - Zones non explorées
    console.log('🔍 needsExploration called - returning true for now');
    return true;
  }
};

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions d'exploration pures - Compatible Bot et Player
 */
export const explorationActions = {
  
  /**
   * Démarre une mission d'exploration
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec explorationZone
   * @returns {Object} - Nouveau contexte avec exploration démarrée
   */
  startExploration: (context, event) => {
    try {
      const validatedZone = validateExplorationZone(event.explorationZone);
      
      if (!explorationGuards.canStartExploration(context, event)) {
        return {
          ...context,
          error: 'Cannot start exploration: conditions not met',
          lastAction: 'startExploration_failed'
        };
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
      return {
        ...context,
        error: error.message,
        lastAction: 'startExploration_failed'
      };
    }
  },

  /**
   * Marque une tuile comme explorée
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec tileCoord
   * @returns {Object} - Nouveau contexte avec tuile explorée
   */
  markTileExplored: (context, event) => {
    if (!event.tileCoord) {
      return {
        ...context,
        error: 'Tile coordinate is required to mark as explored',
        lastAction: 'markTileExplored_failed'
      };
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec discovery
   * @returns {Object} - Nouveau contexte avec découverte enregistrée
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
      return {
        ...context,
        error: error.message,
        lastAction: 'recordDiscovery_failed'
      };
    }
  },

  /**
   * Met à jour le statut d'exploration
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec newStatus et optionellement targetCoord
   * @returns {Object} - Nouveau contexte avec statut mis à jour
   */
  updateExplorationStatus: (context, event) => {
    if (!context.explorationState) {
      return {
        ...context,
        error: 'No active exploration to update',
        lastAction: 'updateExplorationStatus_failed'
      };
    }
    
    if (!Object.values(EXPLORATION_STATES).includes(event.newStatus)) {
      return {
        ...context,
        error: `Invalid exploration status: ${event.newStatus}`,
        lastAction: 'updateExplorationStatus_failed'
      };
    }
    
    const updatedState = {
      ...context.explorationState,
      status: event.newStatus,
      lastUpdate: Date.now()
    };
    
    // Mettre à jour la cible si fournie
    if (event.targetCoord) {
      updatedState.targetCoord = event.targetCoord;
    }
    
    // Marquer comme terminé si statut COMPLETED
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec raison optionnelle
   * @returns {Object} - Nouveau contexte avec exploration terminée
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
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec raison
   * @returns {Object} - Nouveau contexte avec exploration annulée
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
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec découvertes traitées
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
// SELECTORS ET UTILITAIRES
// ============================================================================

/**
 * Sélecteurs pour extraire des informations d'exploration
 */
export const explorationSelectors = {
  
  /**
   * Récupère l'état d'exploration actuel
   * @param {Object} context - Contexte à analyser
   * @returns {Object|null} - État d'exploration ou null
   */
  getCurrentExplorationState: (context) => {
    return context.explorationState || null;
  },

  /**
   * Vérifie si une exploration est en cours
   * @param {Object} context - Contexte à analyser
   * @returns {boolean} - True si exploration en cours
   */
  isExploring: (context) => {
    return context.explorationState?.status === EXPLORATION_STATES.EXPLORING;
  },

  /**
   * Récupère le nombre de tuiles explorées
   * @param {Object} context - Contexte à analyser
   * @returns {number} - Nombre de tuiles explorées
   */
  getExploredTileCount: (context) => {
    return (context.exploredTiles || []).length;
  },

  /**
   * Récupère le nombre de découvertes
   * @param {Object} context - Contexte à analyser
   * @returns {number} - Nombre de découvertes
   */
  getDiscoveryCount: (context) => {
    return (context.resourceDiscoveries || []).length;
  },

  /**
   * Récupère les découvertes par type
   * @param {Object} context - Contexte à analyser
   * @param {string} type - Type de découverte
   * @returns {Array} - Liste des découvertes du type demandé
   */
  getDiscoveriesByType: (context, type) => {
    return (context.resourceDiscoveries || []).filter(discovery => discovery.type === type);
  },

  /**
   * Calcule la durée d'exploration actuelle
   * @param {Object} context - Contexte à analyser
   * @returns {number} - Durée en millisecondes
   */
  getExplorationDuration: (context) => {
    if (!context.explorationState?.startTime) {
      return 0;
    }
    
    const endTime = context.explorationState.endTime || Date.now();
    return endTime - context.explorationState.startTime;
  },

  /**
   * Récupère les statistiques d'exploration
   * @param {Object} context - Contexte à analyser
   * @returns {Object} - Statistiques d'exploration
   */
  getExplorationStats: (context) => {
    return {
      tilesExplored: explorationSelectors.getExploredTileCount(context),
      discoveries: explorationSelectors.getDiscoveryCount(context),
      resourceDiscoveries: explorationSelectors.getDiscoveriesByType(context, DISCOVERY_TYPES.RESOURCE).length,
      currentDuration: explorationSelectors.getExplorationDuration(context),
      isActive: explorationSelectors.isExploring(context),
      hasNewDiscoveries: Boolean(context.hasNewDiscovery)
    };
  },

  /**
   * Vérifie si une tuile a été explorée
   * @param {Object} context - Contexte à analyser
   * @param {string} tileCoord - Coordonnée à vérifier
   * @returns {boolean} - True si explorée
   */
  isTileExplored: (context, tileCoord) => {
    return (context.exploredTiles || []).includes(tileCoord);
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

/**
 * Générateurs d'événements pour le système d'exploration
 */
export const explorationEvents = {
  
  /**
   * Crée un événement de démarrage d'exploration
   * @param {Object} explorationZone - Zone à explorer
   * @returns {Object} - Événement formaté
   */
  startExploration: (explorationZone) => ({
    type: 'START_EXPLORATION',
    explorationZone
  }),

  /**
   * Crée un événement de marquage de tuile explorée
   * @param {string} tileCoord - Coordonnée de la tuile
   * @returns {Object} - Événement formaté
   */
  markTileExplored: (tileCoord) => ({
    type: 'MARK_TILE_EXPLORED',
    tileCoord
  }),

  /**
   * Crée un événement d'enregistrement de découverte
   * @param {Object} discovery - Découverte à enregistrer
   * @returns {Object} - Événement formaté
   */
  recordDiscovery: (discovery) => ({
    type: 'RECORD_DISCOVERY',
    discovery
  }),

  /**
   * Crée un événement de mise à jour de statut d'exploration
   * @param {string} newStatus - Nouveau statut
   * @param {string} targetCoord - Coordonnée cible optionnelle
   * @returns {Object} - Événement formaté
   */
  updateExplorationStatus: (newStatus, targetCoord = null) => ({
    type: 'UPDATE_EXPLORATION_STATUS',
    newStatus,
    targetCoord
  }),

  /**
   * Crée un événement de fin d'exploration
   * @param {string} reason - Raison de la fin
   * @returns {Object} - Événement formaté
   */
  completeExploration: (reason = 'completed') => ({
    type: 'COMPLETE_EXPLORATION',
    reason
  }),

  /**
   * Crée un événement d'annulation d'exploration
   * @param {string} reason - Raison de l'annulation
   * @returns {Object} - Événement formaté
   */
  cancelExploration: (reason) => ({
    type: 'CANCEL_EXPLORATION',
    reason
  }),

  /**
   * Crée un événement de traitement des découvertes
   * @returns {Object} - Événement formaté
   */
  markDiscoveriesProcessed: () => ({
    type: 'MARK_DISCOVERIES_PROCESSED'
  })
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  actions: explorationActions,
  selectors: explorationSelectors,
  guards: explorationGuards,
  events: explorationEvents,
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
