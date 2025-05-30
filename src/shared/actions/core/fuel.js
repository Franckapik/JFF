/**
 * ============================================================================
 * FUEL ACTIONS CORE - Actions de carburant pures et partagées
 * ============================================================================
 * 
 * Actions de carburant pures, réutilisables par Bot et Player.
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
 * Constantes pour la gestion du carburant
 */
const FUEL_CONSTANTS = {
  MAX_FUEL: 100,
  MIN_FUEL: 0,
  DEFAULT_CONSUMPTION: 5,
  LOW_FUEL_THRESHOLD: 20,
  CRITICAL_FUEL_THRESHOLD: 10,
  CONSUMPTION_PER_DISTANCE: 2
};

/**
 * Validation et normalisation du niveau de carburant
 * @param {number} fuel - Niveau de carburant à valider
 * @returns {number} - Niveau de carburant validé (0-100)
 */
const validateFuelLevel = (fuel) => {
  const fuelNumber = Number(fuel);
  if (isNaN(fuelNumber)) return 0;
  return Math.max(FUEL_CONSTANTS.MIN_FUEL, Math.min(FUEL_CONSTANTS.MAX_FUEL, fuelNumber));
};

/**
 * Calcule la consommation de carburant pour une distance
 * @param {number} distance - Distance à parcourir
 * @param {number} rate - Taux de consommation (défaut: 2 par unité de distance)
 * @returns {number} - Carburant nécessaire
 */
const calculateFuelConsumption = (distance, rate = FUEL_CONSTANTS.CONSUMPTION_PER_DISTANCE) => {
  if (typeof distance !== 'number' || distance < 0) return 0;
  return Math.ceil(distance * rate);
};

/**
 * Utilitaire pour contraindre une valeur de carburant
 * @param {number} value - Valeur à contraindre
 * @returns {number} - Valeur contrainte entre 0 et 100
 */
const clampFuel = (value) => validateFuelLevel(value);

// ============================================================================
// VALIDATORS ET GUARDS
// ============================================================================

/**
 * Guards pour valider les conditions de carburant
 */
export const fuelGuards = {
  
  /**
   * Vérifie si un véhicule peut consommer du carburant
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec amount
   * @returns {boolean} - True si consommation possible
   */
  canConsumeFuel: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    const consumptionAmount = event?.amount || FUEL_CONSTANTS.DEFAULT_CONSUMPTION;

    return currentFuel >= consumptionAmount;
  },

  /**
   * Vérifie si un véhicule a suffisamment de carburant pour une distance
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec distance
   * @returns {boolean} - True si suffisamment de carburant
   */
  hasEnoughFuelForDistance: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle || !event?.distance) return false;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    const requiredFuel = calculateFuelConsumption(event.distance);

    return currentFuel >= requiredFuel;
  },

  /**
   * Vérifie si un véhicule a un niveau de carburant critique
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si carburant critique
   */
  isCriticalFuel: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return true;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    return currentFuel <= FUEL_CONSTANTS.CRITICAL_FUEL_THRESHOLD;
  },

  /**
   * Vérifie si un véhicule a un niveau de carburant bas
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si carburant bas
   */
  isLowFuel: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return true;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    return currentFuel <= FUEL_CONSTANTS.LOW_FUEL_THRESHOLD;
  },

  /**
   * Vérifie si un véhicule peut être ravitaillé
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si ravitaillement possible
   */
  canRefuel: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    return currentFuel < FUEL_CONSTANTS.MAX_FUEL;
  },

  /**
   * Vérifie si un véhicule est au maximum de carburant
   * @param {Object} context - Contexte actuel
   * @returns {boolean} - True si carburant plein
   */
  isFullTank: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return false;

    const currentFuel = validateFuelLevel(vehicle.fuel);
    return currentFuel >= FUEL_CONSTANTS.MAX_FUEL;
  }
};

// ============================================================================
// ACTIONS PRINCIPALES
// ============================================================================

/**
 * Actions de carburant pures - Compatible Bot et Player
 */
export const fuelActions = {
  
  /**
   * Consomme du carburant
   * @param {Object} context - Contexte contenant vehicle
   * @param {Object} event - Événement avec amount
   * @returns {Object} - Nouveau contexte avec carburant consommé
   */
  consumeFuel: (context, event) => {
    if (!fuelGuards.canConsumeFuel(context, event)) {
      return { 
        ...context, 
        error: 'Cannot consume fuel: insufficient fuel' 
      };
    }

    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle.fuel);
    const consumptionAmount = event?.amount || FUEL_CONSTANTS.DEFAULT_CONSUMPTION;
    const newFuel = clampFuel(currentFuel - consumptionAmount);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: newFuel,
        lastFuelConsumption: {
          amount: consumptionAmount,
          timestamp: Date.now(),
          previousLevel: currentFuel
        }
      }
    };
  },

  /**
   * Ravitaille complètement un véhicule
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec carburant plein
   */
  refuelVehicle: (context) => {
    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle.fuel);

    if (fuelGuards.isFullTank(context)) {
      return { 
        ...context, 
        error: 'Cannot refuel: tank already full' 
      };
    }

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: FUEL_CONSTANTS.MAX_FUEL,
        lastRefuel: {
          timestamp: Date.now(),
          previousLevel: currentFuel,
          amountAdded: FUEL_CONSTANTS.MAX_FUEL - currentFuel
        }
      }
    };
  },

  /**
   * Ajoute une quantité spécifique de carburant
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec amount
   * @returns {Object} - Nouveau contexte avec carburant ajouté
   */
  addFuel: (context, event) => {
    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle.fuel);
    const amountToAdd = Math.max(0, Number(event?.amount) || 0);
    const newFuel = clampFuel(currentFuel + amountToAdd);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: newFuel,
        lastFuelAddition: {
          amount: newFuel - currentFuel, // Quantité réellement ajoutée
          timestamp: Date.now(),
          previousLevel: currentFuel
        }
      }
    };
  },

  /**
   * Définit un niveau de carburant spécifique
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec newFuelLevel
   * @returns {Object} - Nouveau contexte avec nouveau niveau
   */
  setFuelLevel: (context, event) => {
    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle.fuel);
    const newFuel = validateFuelLevel(event?.newFuelLevel);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: newFuel,
        lastFuelUpdate: {
          timestamp: Date.now(),
          previousLevel: currentFuel,
          newLevel: newFuel
        }
      }
    };
  },

  /**
   * Vide complètement le réservoir
   * @param {Object} context - Contexte actuel
   * @returns {Object} - Nouveau contexte avec réservoir vide
   */
  emptyTank: (context) => {
    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle.fuel);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: FUEL_CONSTANTS.MIN_FUEL,
        lastFuelEmpty: {
          timestamp: Date.now(),
          previousLevel: currentFuel
        }
      }
    };
  },

  /**
   * Consomme du carburant pour une distance spécifique
   * @param {Object} context - Contexte actuel
   * @param {Object} event - Événement avec distance
   * @returns {Object} - Nouveau contexte avec carburant consommé
   */
  consumeFuelForDistance: (context, event) => {
    const distance = event?.distance;
    if (!distance) {
      return { 
        ...context, 
        error: 'Cannot consume fuel: distance not specified' 
      };
    }

    const fuelRequired = calculateFuelConsumption(distance);
    
    if (!fuelGuards.hasEnoughFuelForDistance(context, event)) {
      return { 
        ...context, 
        error: `Cannot consume fuel: need ${fuelRequired} fuel for distance ${distance}` 
      };
    }

    return fuelActions.consumeFuel(context, { amount: fuelRequired });
  }
};

// ============================================================================
// SELECTORS ET UTILITAIRES
// ============================================================================

/**
 * Sélecteurs pour extraire des informations de carburant
 */
export const fuelSelectors = {
  
  /**
   * Obtient le niveau de carburant actuel
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Niveau de carburant (0-100)
   */
  getCurrentFuel: (vehicle) => {
    return validateFuelLevel(vehicle?.fuel || 0);
  },

  /**
   * Calcule le pourcentage de carburant
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Pourcentage de carburant (0-100)
   */
  getFuelPercentage: (vehicle) => {
    const currentFuel = fuelSelectors.getCurrentFuel(vehicle);
    return (currentFuel / FUEL_CONSTANTS.MAX_FUEL) * 100;
  },

  /**
   * Calcule la quantité de carburant manquante pour faire le plein
   * @param {Object} vehicle - Véhicule
   * @returns {number} - Carburant manquant
   */
  getFuelNeeded: (vehicle) => {
    const currentFuel = fuelSelectors.getCurrentFuel(vehicle);
    return FUEL_CONSTANTS.MAX_FUEL - currentFuel;
  },

  /**
   * Estime la distance possible avec le carburant actuel
   * @param {Object} vehicle - Véhicule
   * @param {number} rate - Taux de consommation (défaut: 2)
   * @returns {number} - Distance estimée
   */
  getEstimatedRange: (vehicle, rate = FUEL_CONSTANTS.CONSUMPTION_PER_DISTANCE) => {
    const currentFuel = fuelSelectors.getCurrentFuel(vehicle);
    if (rate <= 0) return 0;
    return Math.floor(currentFuel / rate);
  },

  /**
   * Vérifie l'état du carburant
   * @param {Object} vehicle - Véhicule
   * @returns {string} - État: 'full', 'normal', 'low', 'critical', 'empty'
   */
  getFuelStatus: (vehicle) => {
    const currentFuel = fuelSelectors.getCurrentFuel(vehicle);
    
    if (currentFuel === 0) return 'empty';
    if (currentFuel <= FUEL_CONSTANTS.CRITICAL_FUEL_THRESHOLD) return 'critical';
    if (currentFuel <= FUEL_CONSTANTS.LOW_FUEL_THRESHOLD) return 'low';
    if (currentFuel >= FUEL_CONSTANTS.MAX_FUEL) return 'full';
    return 'normal';
  },

  /**
   * Calcule le carburant nécessaire pour une distance
   * @param {number} distance - Distance à parcourir
   * @param {number} rate - Taux de consommation (défaut: 2)
   * @returns {number} - Carburant nécessaire
   */
  getFuelRequiredForDistance: (distance, rate = FUEL_CONSTANTS.CONSUMPTION_PER_DISTANCE) => {
    return calculateFuelConsumption(distance, rate);
  },

  /**
   * Obtient des informations complètes sur le carburant
   * @param {Object} vehicle - Véhicule
   * @returns {Object} - Informations complètes
   */
  getFuelInfo: (vehicle) => {
    const current = fuelSelectors.getCurrentFuel(vehicle);
    const percentage = fuelSelectors.getFuelPercentage(vehicle);
    const needed = fuelSelectors.getFuelNeeded(vehicle);
    const status = fuelSelectors.getFuelStatus(vehicle);
    const range = fuelSelectors.getEstimatedRange(vehicle);

    return {
      current,
      max: FUEL_CONSTANTS.MAX_FUEL,
      percentage,
      needed,
      status,
      estimatedRange: range,
      isEmpty: current === 0,
      isFull: current >= FUEL_CONSTANTS.MAX_FUEL,
      isLow: current <= FUEL_CONSTANTS.LOW_FUEL_THRESHOLD,
      isCritical: current <= FUEL_CONSTANTS.CRITICAL_FUEL_THRESHOLD
    };
  }
};

// ============================================================================
// EVENTS ET TRANSFORMATIONS
// ============================================================================

/**
 * Générateurs d'événements pour le système de carburant
 */
export const fuelEvents = {
  
  /**
   * Crée un événement de consommation de carburant
   * @param {number} amount - Quantité à consommer
   * @returns {Object} - Événement formaté
   */
  consumeFuel: (amount) => ({
    type: 'CONSUME_FUEL',
    amount
  }),

  /**
   * Crée un événement de ravitaillement
   * @returns {Object} - Événement formaté
   */
  refuelVehicle: () => ({
    type: 'REFUEL_VEHICLE'
  }),

  /**
   * Crée un événement d'ajout de carburant
   * @param {number} amount - Quantité à ajouter
   * @returns {Object} - Événement formaté
   */
  addFuel: (amount) => ({
    type: 'ADD_FUEL',
    amount
  }),

  /**
   * Crée un événement de définition de niveau
   * @param {number} newFuelLevel - Nouveau niveau
   * @returns {Object} - Événement formaté
   */
  setFuelLevel: (newFuelLevel) => ({
    type: 'SET_FUEL_LEVEL',
    newFuelLevel
  }),

  /**
   * Crée un événement de vidage du réservoir
   * @returns {Object} - Événement formaté
   */
  emptyTank: () => ({
    type: 'EMPTY_TANK'
  }),

  /**
   * Crée un événement de consommation pour distance
   * @param {number} distance - Distance à parcourir
   * @returns {Object} - Événement formaté
   */
  consumeFuelForDistance: (distance) => ({
    type: 'CONSUME_FUEL_FOR_DISTANCE',
    distance
  })
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  actions: fuelActions,
  selectors: fuelSelectors,
  guards: fuelGuards,
  events: fuelEvents,
  utils: {
    validateFuelLevel,
    calculateFuelConsumption,
    clampFuel,
    FUEL_CONSTANTS
  }
};