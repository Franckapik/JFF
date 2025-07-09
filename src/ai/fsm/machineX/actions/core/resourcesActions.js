/**
 * ============================================================================
 * RESOURCE ACTIONS CORE - Actions de ressources pures et partagées
 * ============================================================================
 * 
 * Actions de ressources pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🔧 ACTIONS PRINCIPALES (resourceActions):
 * - collectResources(context, event) : Collecte des ressources avec validation
 * - depositResources(context) : Dépose toutes les ressources du véhicule
 * - addResources(context, event) : Ajoute des ressources (transfert direct)
 * - clearResources(context) : Vide complètement les ressources
 * - updateResources(context, event) : Met à jour avec valeurs spécifiques
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - validateResources(resources) : Validation et normalisation
 * - addResources(current, toAdd) : Addition de ressources
 * - getTotalResources(resources) : Calcul du total
 * - areResourcesEmpty(resources) : Vérifie si vide
 * 
 * ❌ FONCTIONNALITÉS COMMENTÉES (Éviter confusion/conflits):
 * - Guards (resourceGuards) - COMMENTÉS
 * - Selectors (resourceSelectors) - COMMENTÉS
 * - Events (resourceEvents) - COMMENTÉS
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { DEFAULT_CAPACITIES, EMPTY_RESOURCES, VEHICLE_TYPES } from '../../config/constants.ts';

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

/**
 * Validation et normalisation des ressources
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
 */
const addResourcesUtil = (current, toAdd) => {
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
 */
const getTotalResources = (resources) => {
  const validated = validateResources(resources);
  return validated.food + validated.debris + validated.special;
};

/**
 * Vérifie si des ressources sont vides
 */
const areResourcesEmpty = (resources) => {
  return getTotalResources(resources) === 0;
};

// ============================================================================
// ACTIONS PRINCIPALES - SEULES FONCTIONS PUBLIQUES
// ============================================================================

/**
 * Actions de ressources pures - Compatible Bot et Player
 */
export const resourceActions = {
  
  /**
   * Collecte des ressources avec un véhicule
   */
  collectResources: (context, event) => {
    try {
      const vehicle = context.vehicle;
      if (!vehicle || !event.resources) {
        return { ...context, error: 'Cannot collect resources: invalid parameters' };
      }

      const currentResources = validateResources(vehicle.resources);
      const toCollect = validateResources(event.resources);
      const capacity = vehicle.maxCapacity || DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP];

      // Vérifier la capacité
      if (currentResources.food + toCollect.food > capacity.food ||
          currentResources.debris + toCollect.debris > capacity.debris ||
          currentResources.special + toCollect.special > capacity.special) {
        return { ...context, error: 'Cannot collect resources: insufficient capacity' };
      }

      const actuallyCollected = {
        food: Math.min(toCollect.food, capacity.food - currentResources.food),
        debris: Math.min(toCollect.debris, capacity.debris - currentResources.debris),
        special: Math.min(toCollect.special, capacity.special - currentResources.special)
      };

      const newResources = addResourcesUtil(currentResources, actuallyCollected);

      return {
        ...context,
        vehicle: {
          ...vehicle,
          resources: newResources,
          lastResourceCollection: {
            collected: actuallyCollected,
            timestamp: Date.now()
          }
        }
      };
    } catch (error) {
      return { ...context, error: `Resource collection failed: ${error.message}` };
    }
  },

  /**
   * Dépose toutes les ressources du véhicule
   */
  depositResources: (context) => {
    const vehicle = context.vehicle;
    const player = context.player;

    if (!vehicle?.resources || areResourcesEmpty(vehicle.resources)) {
      return { ...context, error: 'Cannot deposit resources: no resources to deposit' };
    }

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
          resources: addResourcesUtil(currentScore, vehicleResources)
        }
      }
    };
  },

  /**
   * Ajoute des ressources à un véhicule (transfert direct)
   */
  addResources: (context, event) => {
    try {
      const vehicle = context.vehicle;
      if (!vehicle || !event.resources) {
        return { ...context, error: 'Cannot add resources: invalid parameters' };
      }

      const currentResources = validateResources(vehicle.resources);
      const toAdd = validateResources(event.resources);
      const newResources = addResourcesUtil(currentResources, toAdd);

      return {
        ...context,
        vehicle: {
          ...vehicle,
          resources: newResources
        }
      };
    } catch (error) {
      return { ...context, error: `Failed to add resources: ${error.message}` };
    }
  },

  /**
   * Vide complètement les ressources d'un véhicule
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
   */
  updateResources: (context, event) => {
    try {
      if (!event.newResources) {
        return { ...context, error: 'Cannot update resources: newResources not provided' };
      }

      const newResources = validateResources(event.newResources);

      return {
        ...context,
        vehicle: {
          ...context.vehicle,
          resources: newResources
        }
      };
    } catch (error) {
      return { ...context, error: `Failed to update resources: ${error.message}` };
    }
  }
};

// ============================================================================
// ❌ FONCTIONNALITÉS COMMENTÉES POUR ÉVITER CONFUSION/CONFLITS
// ============================================================================

// ============================================================================
// ✅ GUARDS & SELECTORS MOVED TO guards/core/resourcesGuard.js
// ============================================================================

/**
 * Les guards, selectors et events de ressources ont été déplacés vers guards/core/resourcesGuard.js
 * pour une meilleure architecture. Plus de code commenté nécessaire.
 */

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  actions: resourceActions,
  // selectors: resourceSelectors, // ❌ COMMENTÉ
  // events: resourceEvents, // ❌ COMMENTÉ
  constants: {
    EMPTY_RESOURCES,
    DEFAULT_CAPACITIES,
    VEHICLE_TYPES
  },
  utils: {
    validateResources,
    addResources: addResourcesUtil,
    getTotalResources,
    areResourcesEmpty
  }
};