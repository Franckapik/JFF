/**
 * ============================================================================
 * RESOURCE ACTIONS CORE - Actions de ressources pures et partagées
 * ============================================================================
 * 
 * Actions de ressources pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * Inspiré du pattern présenté dans actions-comparison.md
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

// ============================================================================
// CONSTANTS ET HELPERS
// ============================================================================

/**
 * Structure vide pour les ressources
 */
const EMPTY_RESOURCES = {
  food: 0,
  debris: 0,
  special: 0
};

/**
 * Capacités par défaut des véhicules
 */
const DEFAULT_CAPACITY = {
  food: 100,
  debris: 1000,
  special: 2
};

/**
 * Validation et normalisation des ressources
 * @param {Object} resources - Ressources à valider
 * @returns {Object} - Ressources validées
 * @throws {Error} - Si les ressources sont invalides
 */
const validateResources = (resources) => {
  if (!resources || typeof resources !== 'object') {
    throw new Error('Resources must be a valid object');
  }

  const validated = {
    food: Math.max(0, Number(resources.food) || 0),
    debris: Math.max(0, Number(resources.debris) || 0),
    special: Math.max(0, Number(resources.special) || 0)
  };

  return validated;
};

/**
 * Utilitaire pour additionner des ressources
 * @param {Object} current - Ressources actuelles
 * @param {Object} toAdd - Ressources à ajouter
 * @returns {Object} - Ressources additionnées
 */
const addResources = (current, toAdd) => {
  const validCurrent = validateResources(current);
  const validToAdd = validateResources(toAdd);

  return {
    food: validCurrent.food + validToAdd.food,
    debris: validCurrent.debris + validToAdd.debris,
    special: validCurrent.special + validToAdd.special
  };
};

/**
 * Calcule le total des ressources
 * @param {Object} resources - Ressources à totaliser
 * @returns {number} - Total des ressources
 */
const getTotalResources = (resources) => {
  const validated = validateResources(resources);
  return validated.food + validated.debris + validated.special;
};

/**
 * Vérifie si des ressources sont vides
 * @param {Object} resources - Ressources à vérifier
 * @returns {boolean} - True si toutes les ressources sont à 0
 */
const areResourcesEmpty = (resources) => {
  return getTotalResources(resources) === 0;
};

// ============================================================================
// VALIDATORS ET GUARDS
// ============================================================================

/**
 * Guards pour valider les conditions de ressources
 */
export const resourceGuards = {
  
  /**
   * Vérifie si un véhicule peut collecter des ressources
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec resources et vehicleCapacity
   * @returns {boolean} - True si collection possible
   */
  canCollectResource: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;

    if (!event.resources) return false;

    try {
      validateResources(event.resources);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Vérifie si un véhicule a suffisamment d'espace pour les ressources
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec resources
   * @returns {boolean} - True si suffisamment d'espace
   */
  hasCapacityFor: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle?.resources || !event?.resources) return false;

    const currentResources = validateResources(vehicle.resources);
    const toCollect = validateResources(event.resources);
    const capacity = vehicle.maxCapacity || DEFAULT_CAPACITY;

    return (
      currentResources.food + toCollect.food <= capacity.food &&
      currentResources.debris + toCollect.debris <= capacity.debris &&
      currentResources.special + toCollect.special <= capacity.special
    );
  },

  /**
   * Vérifie si un véhicule est à capacité maximale
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si à capacité maximale
   */
  isAtMaxCapacity: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle?.resources) return false;

    const currentResources = validateResources(vehicle.resources);
    const capacity = vehicle.maxCapacity || DEFAULT_CAPACITY;

    return (
      currentResources.food >= capacity.food &&
      currentResources.debris >= capacity.debris &&
      currentResources.special >= capacity.special
    );
  },

  /**
   * Vérifie si un véhicule peut déposer des ressources
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si dépôt possible
   */
  canDepositResources: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle?.resources) return false;

    // Vérifie si le véhicule a des ressources à déposer
    return !areResourcesEmpty(vehicle.resources);
  }
};

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions de ressources pures - Compatible Bot et Player
 */
export const resourceActions = {
  
  /**
   * Collecte des ressources avec un véhicule
   * @param {Object} context - Contexte contenant vehicle
   * @param {Object} event - Événement avec resources
   * @returns {Object} - Nouveau contexte avec ressources collectées
   */
  collectResources: (context, event) => {
    try {
      if (!resourceGuards.canCollectResource(context, event)) {
        return { 
          ...context, 
          error: 'Cannot collect resources: invalid parameters' 
        };
      }

      if (!resourceGuards.hasCapacityFor(context, event)) {
        return { 
          ...context, 
          error: 'Cannot collect resources: insufficient capacity' 
        };
      }

      const currentResources = validateResources(context.vehicle.resources);
      const toCollect = validateResources(event.resources);
      const capacity = context.vehicle.maxCapacity || DEFAULT_CAPACITY;

      // Calculer la quantité effectivement collectée (limitée par la capacité)
      const actuallyCollected = {
        food: Math.min(toCollect.food, capacity.food - currentResources.food),
        debris: Math.min(toCollect.debris, capacity.debris - currentResources.debris),
        special: Math.min(toCollect.special, capacity.special - currentResources.special)
      };

      const newResources = addResources(currentResources, actuallyCollected);

      return {
        ...context,
        vehicle: {
          ...context.vehicle,
          resources: newResources,
          lastResourceCollection: {
            collected: actuallyCollected,
            timestamp: Date.now()
          }
        }
      };
    } catch (error) {
      return { 
        ...context, 
        error: `Resource collection failed: ${error.message}` 
      };
    }
  },

  /**
   * Dépose toutes les ressources du véhicule
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec ressources transférées
   */
  depositResources: (context) => {
    if (!resourceGuards.canDepositResources(context)) {
      return { 
        ...context, 
        error: 'Cannot deposit resources: no resources to deposit' 
      };
    }

    const vehicle = context.vehicle;
    const player = context.player;
    const vehicleResources = validateResources(vehicle.resources);
    const currentScore = validateResources(player?.score?.resources);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        resources: { ...EMPTY_RESOURCES },
        lastResourceDeposit: {
          deposited: vehicleResources,
          timestamp: Date.now()
        }
      },
      player: {
        ...player,
        score: {
          ...player.score,
          resources: addResources(currentScore, vehicleResources)
        }
      }
    };
  },

  /**
   * Ajoute des ressources à un véhicule (transfert direct)
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec resources
   * @returns {Object} - Nouveau contexte avec ressources ajoutées
   */
  addResources: (context, event) => {
    try {
      const currentResources = validateResources(context.vehicle.resources);
      const toAdd = validateResources(event.resources);
      const newResources = addResources(currentResources, toAdd);

      return {
        ...context,
        vehicle: {
          ...context.vehicle,
          resources: newResources
        }
      };
    } catch (error) {
      return { 
        ...context, 
        error: `Failed to add resources: ${error.message}` 
      };
    }
  },

  /**
   * Vide complètement les ressources d'un véhicule
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec ressources vidées
   */
  clearResources: (context) => ({
    ...context,
    vehicle: {
      ...context.vehicle,
      resources: { ...EMPTY_RESOURCES },
      lastResourceClear: Date.now()
    }
  }),

  /**
   * Met à jour les ressources avec des valeurs spécifiques
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec newResources
   * @returns {Object} - Nouveau contexte avec ressources mises à jour
   */
  updateResources: (context, event) => {
    try {
      const newResources = validateResources(event.newResources);

      return {
        ...context,
        vehicle: {
          ...context.vehicle,
          resources: newResources
        }
      };
    } catch (error) {
      return { 
        ...context, 
        error: `Failed to update resources: ${error.message}` 
      };
    }
  }
};

// ============================================================================
// SELECTORS ET UTILITAIRES
// ============================================================================

/**
 * Sélecteurs pour extraire des informations de ressources
 */
export const resourceSelectors = {
  
  /**
   * Obtient les ressources actuelles d'un véhicule
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Ressources actuelles
   */
  getCurrentResources: (vehicle) => {
    return validateResources(vehicle?.resources || EMPTY_RESOURCES);
  },

  /**
   * Obtient la capacité maximale d'un véhicule
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Capacité maximale
   */
  getMaxCapacity: (vehicle) => {
    return vehicle?.maxCapacity || DEFAULT_CAPACITY;
  },

  /**
   * Calcule l'espace restant dans un véhicule
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Espace restant par type de ressource
   */
  getRemainingCapacity: (vehicle) => {
    const current = resourceSelectors.getCurrentResources(vehicle);
    const capacity = resourceSelectors.getMaxCapacity(vehicle);

    return {
      food: Math.max(0, capacity.food - current.food),
      debris: Math.max(0, capacity.debris - current.debris),
      special: Math.max(0, capacity.special - current.special)
    };
  },

  /**
   * Calcule le pourcentage d'utilisation de la capacité
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Pourcentages par type de ressource
   */
  getCapacityPercentage: (vehicle) => {
    const current = resourceSelectors.getCurrentResources(vehicle);
    const capacity = resourceSelectors.getMaxCapacity(vehicle);

    return {
      food: capacity.food > 0 ? (current.food / capacity.food) * 100 : 0,
      debris: capacity.debris > 0 ? (current.debris / capacity.debris) * 100 : 0,
      special: capacity.special > 0 ? (current.special / capacity.special) * 100 : 0
    };
  },

  /**
   * Obtient le total des ressources
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Total des ressources
   */
  getTotalResources: (vehicle) => {
    return getTotalResources(resourceSelectors.getCurrentResources(vehicle));
  },

  /**
   * Vérifie si le véhicule a des ressources
   * @param {Object} vehicle - Véhicule
   * @returns {boolean} - True si le véhicule a des ressources
   */
  hasResources: (vehicle) => {
    return !areResourcesEmpty(resourceSelectors.getCurrentResources(vehicle));
  },

  /**
   * Obtient des informations détaillées sur la capacité
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Informations complètes sur la capacité
   */
  getCapacityInfo: (vehicle) => {
    const current = resourceSelectors.getCurrentResources(vehicle);
    const capacity = resourceSelectors.getMaxCapacity(vehicle);
    const remaining = resourceSelectors.getRemainingCapacity(vehicle);
    const percentage = resourceSelectors.getCapacityPercentage(vehicle);

    return {
      current,
      capacity,
      remaining,
      percentage,
      total: getTotalResources(current),
      maxTotal: getTotalResources(capacity),
      isEmpty: areResourcesEmpty(current),
      isFull: resourceGuards.isAtMaxCapacity({ vehicle })
    };
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

/**
 * Générateurs d'événements pour le système de ressources
 */
export const resourceEvents = {
  
  /**
   * Crée un événement de collecte de ressources
   * @param {Object} resources - Ressources à collecter
   * @returns {Object} - Événement formaté
   */
  collectResources: (resources) => ({
    type: 'COLLECT_RESOURCES',
    resources
  }),

  /**
   * Crée un événement de dépôt de ressources
   * @returns {Object} - Événement formaté
   */
  depositResources: () => ({
    type: 'DEPOSIT_RESOURCES'
  }),

  /**
   * Crée un événement d'ajout de ressources
   * @param {Object} resources - Ressources à ajouter
   * @returns {Object} - Événement formaté
   */
  addResources: (resources) => ({
    type: 'ADD_RESOURCES',
    resources
  }),

  /**
   * Crée un événement de vidage des ressources
   * @returns {Object} - Événement formaté
   */
  clearResources: () => ({
    type: 'CLEAR_RESOURCES'
  }),

  /**
   * Crée un événement de mise à jour des ressources
   * @param {Object} newResources - Nouvelles ressources
   * @returns {Object} - Événement formaté
   */
  updateResources: (newResources) => ({
    type: 'UPDATE_RESOURCES',
    newResources
  })
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  actions: resourceActions,
  selectors: resourceSelectors,
  guards: resourceGuards,
  events: resourceEvents,
  utils: {
    validateResources,
    addResources,
    getTotalResources,
    areResourcesEmpty,
    EMPTY_RESOURCES,
    DEFAULT_CAPACITY
  }
};