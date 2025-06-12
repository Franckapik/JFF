/**
 * ============================================================================
 * FUEL ACTIONS CORE - Actions de carburant pures et partagées
 * ============================================================================
 * 
 * Actions de carburant pures, réutilisables par Bot et Player.
 * Ces fonctions sont sans effets de bord et retournent des transformations
 * d'état plutôt que de muter directement les données.
 * 
 * 📋 FONCTIONS DISPONIBLES DANS CE FICHIER:
 * ==========================================
 * 
 * 🔧 ACTIONS PRINCIPALES (fuelActions):
 * - consumeFuel(context, event) : Consomme du carburant
 * - refuelVehicle(context) : Ravitaille complètement
 * - addFuel(context, event) : Ajoute quantité spécifique
 * - setFuelLevel(context, event) : Définit niveau spécifique
 * - emptyTank(context) : Vide complètement le réservoir
 * - consumeFuelForDistance(context, event) : Consomme pour distance
 * 
 * 🔧 UTILITAIRES INTERNES:
 * - validateFuelLevel(fuel) : Validation niveau (0-100)
 * - calculateFuelConsumption(distance, rate) : Calcul consommation
 * - clampFuel(value) : Contraindre valeur carburant
 * - FUEL_CONSTANTS : Constantes du système carburant
 * 
 * ❌ FONCTIONNALITÉS COMMENTÉES (Éviter confusion/conflits):
 * - Guards (fuelGuards) - COMMENTÉS
 * - Selectors (fuelSelectors) - COMMENTÉS
 * - Events (fuelEvents) - COMMENTÉS
 * 
 * @author Migration FSM
 * @version 1.0.0
 */

import { FUEL_CONSTANTS } from '../../constants/constants.js';

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

/**
 * Validation et normalisation du niveau de carburant
 */
const validateFuelLevel = (fuel) => {
  const fuelNumber = Number(fuel);
  if (isNaN(fuelNumber)) return 0;
  return Math.max(FUEL_CONSTANTS.MIN_FUEL, Math.min(FUEL_CONSTANTS.MAX_FUEL, fuelNumber));
};

/**
 * Calcule la consommation de carburant pour une distance
 */
const calculateFuelConsumption = (distance, rate = FUEL_CONSTANTS.CONSUMPTION_PER_DISTANCE) => {
  if (typeof distance !== 'number' || distance < 0) return 0;
  return Math.ceil(distance * rate);
};

/**
 * Utilitaire pour contraindre une valeur de carburant
 */
const clampFuel = (value) => validateFuelLevel(value);

// ============================================================================
// ACTIONS PRINCIPALES - SEULES FONCTIONS PUBLIQUES
// ============================================================================

/**
 * Actions de carburant pures - Compatible Bot et Player
 */
export const fuelActions = {
  
  /**
   * Consomme du carburant
   */
  consumeFuel: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return { ...context, error: 'No vehicle found' };

    const currentFuel = validateFuelLevel(vehicle.fuel);
    const consumptionAmount = event?.amount || FUEL_CONSTANTS.DEFAULT_CONSUMPTION;

    if (currentFuel < consumptionAmount) {
      return { ...context, error: 'Cannot consume fuel: insufficient fuel' };
    }

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
   */
  refuelVehicle: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return { ...context, error: 'No vehicle found' };

    const currentFuel = validateFuelLevel(vehicle.fuel);

    if (currentFuel >= FUEL_CONSTANTS.MAX_FUEL) {
      return { ...context, error: 'Cannot refuel: tank already full' };
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
   */
  addFuel: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return { ...context, error: 'No vehicle found' };

    const currentFuel = validateFuelLevel(vehicle.fuel);
    const amountToAdd = Math.max(0, Number(event?.amount) || 0);
    const newFuel = clampFuel(currentFuel + amountToAdd);

    return {
      ...context,
      vehicle: {
        ...vehicle,
        fuel: newFuel,
        lastFuelAddition: {
          amount: newFuel - currentFuel,
          timestamp: Date.now(),
          previousLevel: currentFuel
        }
      }
    };
  },

  /**
   * Définit un niveau de carburant spécifique
   */
  setFuelLevel: (context, event) => {
    const vehicle = context.vehicle;
    if (!vehicle) return { ...context, error: 'No vehicle found' };

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
   */
  emptyTank: (context) => {
    const vehicle = context.vehicle;
    if (!vehicle) return { ...context, error: 'No vehicle found' };

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
   */
  consumeFuelForDistance: (context, event) => {
    const distance = event?.distance;
    if (!distance) {
      return { ...context, error: 'Cannot consume fuel: distance not specified' };
    }

    const fuelRequired = calculateFuelConsumption(distance);
    const vehicle = context.vehicle;
    const currentFuel = validateFuelLevel(vehicle?.fuel);
    
    if (currentFuel < fuelRequired) {
      return { ...context, error: `Cannot consume fuel: need ${fuelRequired} fuel for distance ${distance}` };
    }

    return fuelActions.consumeFuel(context, { amount: fuelRequired });
  }
};

// ============================================================================
// ❌ EXPORT TEMPORAIRE POUR ÉVITER ERREUR D'IMPORT
// ============================================================================

/**
 * Export temporaire vide pour éviter l'erreur d'import dans safety.js
 * TODO: Supprimer cet export quand safety.js sera mis à jour
 */
export const fuelGuards = {
  // Guards temporaires vides - utilisez les guards centralisés à la place
  canConsumeFuel: () => false,
  hasEnoughFuelForDistance: () => false,
  isCriticalFuel: () => false,
  isLowFuel: () => false,
  canRefuel: () => false,
  isFullTank: () => false
};

export const fuelSelectors = {
  // Selectors temporaires vides - utilisez les selectors centralisés à la place
  getCurrentFuel: () => 0,
  getFuelPercentage: () => 0,
  getFuelNeeded: () => 0,
  getEstimatedRange: () => 0,
  getFuelStatus: () => 'empty',
  getFuelRequiredForDistance: () => 0,
  getFuelInfo: () => ({})
};

export const fuelEvents = {
  // Events temporaires vides - utilisez les events centralisés à la place
  consumeFuel: () => ({ type: 'DEPRECATED' }),
  refuelVehicle: () => ({ type: 'DEPRECATED' }),
  addFuel: () => ({ type: 'DEPRECATED' }),
  setFuelLevel: () => ({ type: 'DEPRECATED' }),
  emptyTank: () => ({ type: 'DEPRECATED' }),
  consumeFuelForDistance: () => ({ type: 'DEPRECATED' })
};

// ============================================================================
// EXPORT PAR DÉFAUT - SIMPLIFIÉ
// ============================================================================

export default {
  actions: fuelActions,
  // selectors: fuelSelectors, // ❌ COMMENTÉ
  // guards: fuelGuards, // ❌ COMMENTÉ
  // events: fuelEvents, // ❌ COMMENTÉ
  constants: {
    FUEL_CONSTANTS
  },
  utils: {
    validateFuelLevel,
    calculateFuelConsumption,
    clampFuel
  }
};